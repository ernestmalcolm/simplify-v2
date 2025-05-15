"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Burger, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tax-tips", label: "Tax Tips" },
  { href: "/tax-info", label: "Tax Info" },
  { href: "/tax-ai", label: "Tax AI" },
  { href: "/calendar", label: "Tax Calendar" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [
    drawerOpened,
    { open: openDrawer, close: closeDrawer, toggle: toggleDrawer },
  ] = useDisclosure(false);

  return (
    <nav className="bg-white/70 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center group transition-transform"
            >
              <Image
                src="/logos/word-logo.svg"
                alt="Simplify Logo"
                width={120}
                height={36}
                className="h-8 w-auto group-hover:scale-105 transition-transform duration-200"
                priority
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {navLinks.map((link) => {
              const isTaxInfo = link.href === "/tax-info";
              const isActive = isTaxInfo
                ? pathname.startsWith("/tax-info")
                : pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 group/navlink
                    ${
                      isActive
                        ? "text-primary"
                        : "text-secondary hover:text-primary"
                    }
                  `}
                >
                  <span className="transition-transform duration-200 group-hover/navlink:-translate-y-1">
                    {link.label}
                  </span>
                  <span
                    className={`absolute left-0 -bottom-0.5 h-0.5 w-full rounded bg-gradient-to-r from-primary to-accent transition-all duration-300
                      ${
                        isActive
                          ? "opacity-100 scale-x-100"
                          : "opacity-0 scale-x-0 group-hover:scale-x-100 group-hover:opacity-60"
                      }
                    `}
                    style={{ transformOrigin: "left" }}
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop Sign In */}
          <div className="hidden sm:flex items-center">
            <Link
              href="/login"
              className="ml-4 text-sm font-semibold text-white px-5 py-2 rounded-md bg-gradient-to-r from-primary to-accent shadow transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Burger */}
          <div className="flex sm:hidden items-center">
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              aria-label="Toggle navigation"
              size="md"
              color="#2563EB"
            />
          </div>
        </div>
      </div>
      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        padding="md"
        size="100vw"
        withCloseButton={true}
        title={null}
        classNames={{ body: "p-0" }}
        overlayProps={{ opacity: 0.2, blur: 2 }}
        transitionProps={{ transition: "slide-right", duration: 250 }}
      >
        <div className="flex flex-col gap-2 px-6 py-8">
          {navLinks.map((link) => {
            const isTaxInfo = link.href === "/tax-info";
            const isActive = isTaxInfo
              ? pathname.startsWith("/tax-info")
              : pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeDrawer}
                className={`block py-3 text-lg font-medium rounded transition-colors duration-200
                  ${
                    isActive
                      ? "text-primary"
                      : "text-secondary hover:text-primary"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            onClick={closeDrawer}
            className="mt-4 text-center text-base font-semibold text-white px-5 py-3 rounded-md bg-gradient-to-r from-primary to-accent shadow transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            Sign In
          </Link>
        </div>
      </Drawer>
    </nav>
  );
}
