'use client';

import { useState } from 'react';
import Link from 'next/link';
import { navLinks } from './data';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleMouseEnter = (label: string) => {
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const activeItems = navLinks.find(
    (link) => link.label === activeDropdown
  )?.items;

  return (
    <nav
      className="w-full py-4 px-8 max-lg:px-6 bg-white shadow-sm relative"
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex mx-auto max-w-[1280px] w-full justify-between items-center gap-30">
        <Link className="text-2xl font-bold" href="/">
          MochiNeko
        </Link>

        <div className="flex gap-6 flex-1 justify-between items-center max-lg:hidden">
          <ul className="flex gap-10 px-5">
            {navLinks.map((link) => (
              <li
                key={link.label}
                className="list-none font-light text-[18px] hover:text-blue-500 transition-all duration-300 ease-in-out"
              >
                {link.items ? (
                  <div
                    className="relative cursor-pointer flex items-center gap-1"
                    onMouseEnter={() => handleMouseEnter(link.label)}
                  >
                    {link.icon && <link.icon className="w-6 h-6 mr-1" />}
                    {link.label}
                  </div>
                ) : (
                  <Link
                    href={link.path!}
                    onMouseEnter={() => setActiveDropdown(null)}
                    className="flex items-center"
                  >
                    {link.icon && <link.icon className="w-6 h-6 mr-1" />}
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="flex gap-10">{/* 后续用于放置按钮 */}</div>
        </div>

        <div className="lg:hidden">
          <div
            className={`burger ${isMenuOpen ? 'active' : ''}`}
            onClick={handleMenuClick}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <div
        className={`
          absolute top-full left-0 w-full bg-white shadow-lg
          ${activeDropdown && activeItems ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        onMouseEnter={() => handleMouseEnter(activeDropdown!)}
      >
        <div className="max-w-[1280px] mx-auto px-8 max-lg:px-6 py-6">
          <div className="grid grid-cols-4 gap-8">
            {activeItems?.map((item) => (
              <Link
                href={item.path}
                key={item.path}
                className="flex items-center p-2 text-gray-700 hover:text-blue-500"
                onClick={() => setActiveDropdown(null)}
              >
                {item.icon && <item.icon className="w-6 h-6 mr-1" />}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
