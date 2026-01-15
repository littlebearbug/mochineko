'use client';

import { useState, useMemo } from 'react';
import BlogCard from '@/components/blog/BlogCard';
import Section from '@/components/common/Section';
import Button from '@/components/common/Button';
import { PostMeta } from '@/utils/lib/posts';

const BlogCards = ({ posts }: { posts: PostMeta[] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    const lowerQuery = searchQuery.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.description?.toLowerCase().includes(lowerQuery)
    );
  }, [posts, searchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPosts, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <Section className="flex flex-col items-center gap-8 max-lg:gap-6">
      <div className="w-full max-w-[980px] max-lg:max-w-[700px] flex justify-end">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full max-w-[400px] max-lg:max-w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition-colors bg-white/50 backdrop-blur-sm"
        />
      </div>

      <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4 w-full max-w-[980px] max-lg:max-w-[700px]">
        {currentPosts.length > 0 ? (
          currentPosts.map((post) => {
            return <BlogCard key={post.slug} post={post} />;
          })
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            No posts found matching your search.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-4 mt-4">
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-gray-600 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </Section>
  );
};

export default BlogCards;
