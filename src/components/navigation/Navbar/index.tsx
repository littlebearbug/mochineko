'use client';

import { useState } from 'react';
import Link from 'next/link';
import { navLinks } from './data';
import { BurgerIcon, CloseIcon } from './icons';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderNavLinks = (isMobile: boolean) =>
    navLinks.map((link) => {
      const Icon = link.icon;
      return (
        <li key={link.path} className={isMobile ? 'w-full' : ''}>
          <Link
            href={link.path}
            onClick={isMobile ? () => setIsMenuOpen(false) : undefined}
            className={`
              flex items-center transition-colors duration-300
              ${
                isMobile
                  ? 'justify-center py-4 text-2xl hover:bg-gray-100 dark:hover:bg-gray-800 w-full'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
              }
            `}
          >
            {Icon && (
              <Icon className={`h-6 w-6 ${isMobile ? 'mr-4' : 'mr-2'}`} />
            )}
            {link.label}
          </Link>
        </li>
      );
    });

  return (
    <header>
      <nav className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 lg:px-8 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <Link
          href="/"
          className="text-xl font-bold text-gray-900 dark:text-white"
        >
          MochiNecho
        </Link>

        <ul className="hidden lg:flex items-center space-x-8">
          {renderNavLinks(false)}
        </ul>

        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            {isMenuOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <BurgerIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      <div
        className={`
          fixed inset-0 z-40 bg-white dark:bg-gray-900 
          transform transition-transform duration-300 ease-in-out
          lg:hidden
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col items-center justify-center h-full pt-20">
          <ul className="flex flex-col items-center w-full space-y-4">
            {renderNavLinks(true)}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
