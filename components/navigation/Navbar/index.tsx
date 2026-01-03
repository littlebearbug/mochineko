'use client';

import { useState, useCallback, useMemo, FC, memo } from 'react';
import Link from 'next/link';
import ThemeToggle from '../../ThemeToggle';
import { navLinks } from './data';
import Button from '@/components/common/Button';

const DesktopNavLinks: FC<{ onLinkHover: (label: string | null) => void }> =
  memo(({ onLinkHover }) => {
    return (
      <div className="flex gap-6 flex-1 justify-between items-center max-lg:hidden">
        <ul className="flex gap-10 px-5">
          {navLinks.map((link) => (
            <li
              key={link.label}
              className="list-none font-light text-[18px] hover:text-blue-500 transition-all duration-300 ease-in-out"
              onMouseEnter={() => onLinkHover(link.items ? link.label : null)}
            >
              {link.items ? (
                <Button
                  variant="ghost"
                  padding="none"
                  type="button"
                  className="gap-1 text-[inherit] hover:text-[inherit]"
                >
                  {link.icon && <link.icon className="w-6 h-6 mr-1" />}
                  {link.label}
                </Button>
              ) : (
                <Link href={link.path!} className="flex items-center">
                  {link.icon && <link.icon className="w-6 h-6 mr-1" />}
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="flex gap-10">
          <ThemeToggle />
        </div>
      </div>
    );
  });
DesktopNavLinks.displayName = 'DesktopNavLinks';

const MobileNav: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null
  );

  const handleMenuClick = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleMobileDropdownToggle = useCallback((label: string) => {
    setOpenMobileDropdown((prev) => (prev === label ? null : label));
  }, []);

  return (
    <>
      <div className="lg:hidden flex items-center gap-2">
        <ThemeToggle />

        <Button
          variant="ghost"
          padding="none"
          mode="text"
          type="button"
          aria-label="Toggle menu"
          className={`burger ${isMenuOpen ? 'active' : ''}`}
          onClick={handleMenuClick}
        >
          <span></span>
          <span></span>
          <span></span>
        </Button>
      </div>
      <div
        className={`
          lg:hidden fixed top-[64px] left-0 w-full bg-white z-40
          overflow-y-auto transition-all duration-500 ease-in-out dark:bg-gray-900
          ${isMenuOpen ? 'h-[calc(100vh-64px)]' : 'h-0'}
        `}
        style={{
          visibility: isMenuOpen ? 'visible' : 'hidden',
        }}
      >
        <div className="p-6">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li
                key={link.label}
                className="list-none border-b border-gray-200 pb-4 last:border-b-0 dark:border-gray-800"
              >
                {link.items ? (
                  <div>
                    <Button
                      onClick={() => handleMobileDropdownToggle(link.label)}
                      variant="ghost"
                      padding="none"
                      mode="text"
                      className="w-full justify-between text-left font-medium text-lg text-gray-800 dark:text-gray-200"
                    >
                      <span className="flex items-center">
                        {link.icon && <link.icon className="w-6 h-6 mr-2" />}
                        {link.label}
                      </span>
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${
                          openMobileDropdown === link.label ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </Button>
                    <div
                      className={`
                        overflow-hidden transition-all duration-300 ease-in-out
                        ${openMobileDropdown === link.label ? 'max-h-96 mt-4' : 'max-h-0'}
                      `}
                    >
                      <ul className="flex flex-col gap-2 pl-4">
                        {link.items.map((item) => (
                          <li key={item.path}>
                            <Link
                              href={item.path}
                              className="flex items-center p-2 text-gray-700 hover:text-blue-500 rounded-md dark:text-gray-200 dark:hover:text-blue-400"
                              onClick={closeMenu}
                            >
                              {item.icon && (
                                <item.icon className="w-5 h-5 mr-2" />
                              )}
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.path!}
                    className="flex items-center font-medium text-lg text-gray-800 dark:text-gray-200"
                    onClick={closeMenu}
                  >
                    {link.icon && <link.icon className="w-6 h-6 mr-2" />}
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleLinkHover = useCallback((label: string | null) => {
    setActiveDropdown(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  const activeItems = useMemo(
    () => navLinks.find((link) => link.label === activeDropdown)?.items,
    [activeDropdown]
  );

  return (
    <nav
      className="w-full bg-white sticky top-0 z-50 dark:bg-gray-900"
      onMouseLeave={handleMouseLeave}
    >
      <div className="py-4 px-8 max-lg:px-6 w-full shadow-sm">
        <div className="flex mx-auto max-w-[1280px] w-full justify-between items-center gap-30">
          <Link className="text-2xl font-bold" href="/">
            MochiNeko
          </Link>

          <DesktopNavLinks onLinkHover={handleLinkHover} />
          <MobileNav />
        </div>
      </div>

      <div
        onMouseEnter={() => handleLinkHover(activeDropdown)}
        className={`
          max-lg:hidden absolute top-full left-0 w-full bg-white shadow-lg
          ${activeDropdown && activeItems ? 'visible' : 'invisible'}
        `}
      >
        <div className="max-w-[1280px] mx-auto px-8 py-6">
          <div className="grid grid-cols-4 gap-8">
            {activeItems?.map((item) => (
              <Link
                href={item.path}
                key={item.path}
                className="flex items-center p-2 text-gray-700 hover:text-blue-500 rounded-md"
                onClick={() => setActiveDropdown(null)}
              >
                {item.icon && <item.icon className="w-6 h-6 mr-2" />}
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
