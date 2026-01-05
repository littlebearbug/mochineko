import { Octokit } from 'octokit';
import matter from 'gray-matter';
import { Buffer } from 'buffer';

export const REPO_OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER || '';
export const REPO_NAME = process.env.NEXT_PUBLIC_GITHUB_REPO || '';
export const BRANCH_MAIN = 'main';

export function formatPostContent(frontmatter: any, content: string) {
  return matter.stringify(content, frontmatter, { flowLevel: 1 } as any);
}

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
      per_page: 100,
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
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return {
        content: content,
        sha: data.sha,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Atomic Operations

export async function getRef(
  token: string,
  owner: string,
  repo: string,
  ref: string
) {
  const octokit = getOctokit(token);
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
}

export async function createBranch(
  token: string,
  owner: string,
  repo: string,
  newBranchName: string,
  baseSha: string
) {
  const octokit = getOctokit(token);
  await octokit.rest.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${newBranchName}`,
    sha: baseSha,
  });
}

export async function commitFile(
  token: string,
  owner: string,
  repo: string,
  path: string,
  content: string, // already encoded or plain? Let's take plain string and handle encoding here
  message: string,
  branch: string,
  sha?: string
) {
  const octokit = getOctokit(token);
  const encodedContent = Buffer.from(content).toString('base64');

  // If no sha provided, try to get it from the branch to strictly update
  let currentSha = sha;
  if (!currentSha) {
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
      });
      if ('sha' in data) {
        currentSha = data.sha;
      }
    } catch (e) {
      // File doesn't exist yet, that's fine
    }
  }

  const { data } = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: encodedContent,
    branch,
    sha: currentSha,
  });
  return data;
}

export async function mergeBranch(
  token: string,
  owner: string,
  repo: string,
  base: string,
  head: string,
  message: string
) {
  const octokit = getOctokit(token);
  const { data } = await octokit.rest.repos.merge({
    owner,
    repo,
    base,
    head,
    commit_message: message,
  });
  return data;
}

export async function deleteBranch(
  token: string,
  owner: string,
  repo: string,
  branchName: string
) {
  const octokit = getOctokit(token);
  await octokit.rest.git.deleteRef({
    owner,
    repo,
    ref: `heads/${branchName}`,
  });
}
