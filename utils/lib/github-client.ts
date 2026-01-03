import { Octokit } from 'octokit';
import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Polyfill Buffer for browser if needed, though Next.js might handle it.
// Better to use a safe implementation or reliance on the buffer package if installed.
// Since we are in a hurry, let's use the 'buffer' package which is standard for this.
// But wait, `gray-matter` uses Buffer internally?
// Let's rely on `gray-matter` working. If not, we'll fix.

export const REPO_OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER || '';
export const REPO_NAME = process.env.NEXT_PUBLIC_GITHUB_REPO || '';
export const BRANCH_MAIN = 'main';

// Initialize Octokit with a token
export function getOctokit(token: string) {
  return new Octokit({ auth: token });
}

export async function checkToken(token: string) {
  const octokit = getOctokit(token);
  try {
    await octokit.rest.users.getAuthenticated();
    return true;
  } catch (e) {
    return false;
  }
}

export async function getFiles(
  token: string,
  owner: string,
  repo: string,
  path: string = 'posts_data'
) {
  const octokit = getOctokit(token);
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: BRANCH_MAIN,
    });

    if (Array.isArray(data)) {
      return data.map((file) => ({
        name: file.name,
        path: file.path,
        sha: file.sha,
        download_url: file.download_url,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
}

export async function getBranches(token: string, owner: string, repo: string) {
  const octokit = getOctokit(token);
  try {
    const { data } = await octokit.rest.repos.listBranches({
      owner,
      repo,
      per_page: 100, // Handle pagination if needed, but 100 is decent start
    });
    return data;
  } catch (error) {
    console.error('Error fetching branches:', error);
    return [];
  }
}

export async function getFileContent(
  token: string,
  owner: string,
  repo: string,
  path: string,
  ref: string = BRANCH_MAIN
) {
  const octokit = getOctokit(token);
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref,
    });

    if ('content' in data) {
      // Decode base64 content
      // In browser, atob works for basic chars, but for potential unicode, we need cleaner handling.
      // decodeURIComponent(escape(window.atob(data.content))) is a classic hack.
      // Or just use Buffer if available.
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return {
        content: content,
        sha: data.sha,
      };
    }
    return null;
  } catch (error) {
    // console.error('Error fetching file content:', error);
    return null;
  }
}

export async function savePost(
  token: string,
  owner: string,
  repo: string,
  slug: string,
  frontmatter: any,
  markdownBody: string,
  action: 'save' | 'publish',
  sha?: string
) {
  const octokit = getOctokit(token);
  const filePath = `posts_data/${slug}.md`;
  const branchName = `content/${slug}`;

  // Helper: Get Ref
  const getRef = async (ref: string) => {
    try {
      const { data } = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${ref}`,
      });
      return data;
    } catch (e) {
      return null;
    }
  };

  // Helper: Create Branch
  const createBranch = async (refName: string, sha: string) => {
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${refName}`,
      sha,
    });
  };

  // Construct file content
  const fileContent = matter.stringify(markdownBody, frontmatter, {
    flowLevel: 1,
  } as any);
  const encodedContent = Buffer.from(fileContent).toString('base64');

  if (action === 'save') {
    // 1. Check/Create Branch
    let branchRef = await getRef(branchName);
    if (!branchRef) {
      const mainRef = await getRef(BRANCH_MAIN);
      if (!mainRef) throw new Error('Main branch not found');
      await createBranch(branchName, mainRef.object.sha);
    }

    // 2. Get current SHA in branch (if exists)
    let currentSha = sha;
    try {
      // Try to get file from the branch to get its latest SHA in that branch
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: filePath,
        ref: branchName,
      });
      if ('sha' in data) currentSha = data.sha;
    } catch (e) {
      // File might not exist in branch yet
    }

    // 3. Commit
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `Save draft: ${slug}`,
      content: encodedContent,
      branch: branchName,
      sha: currentSha,
    });

    return { success: true, message: 'Saved to branch' };
  } else {
    // Publish
    const branchRef = await getRef(branchName);

    if (branchRef) {
      // Merge
      await octokit.rest.repos.merge({
        owner,
        repo,
        base: BRANCH_MAIN,
        head: branchName,
        commit_message: `Publish: ${slug}`,
      });
      // Optionally delete branch
      // await octokit.rest.git.deleteRef({ owner, repo, ref: `heads/${branchName}` });
      return { success: true, message: 'Merged to main' };
    } else {
      // Direct Push
      let currentSha = sha;
      if (!currentSha) {
        try {
          // Get sha from main
          const { data } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: filePath,
            ref: BRANCH_MAIN,
          });
          if ('sha' in data) currentSha = data.sha;
        } catch (e) {}
      }

      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: filePath,
        message: `Publish: ${slug}`,
        content: encodedContent,
        branch: BRANCH_MAIN,
        sha: currentSha,
      });

      return { success: true, message: 'Pushed to main' };
    }
  }
}
