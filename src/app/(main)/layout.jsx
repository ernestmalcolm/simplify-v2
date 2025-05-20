"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import {
  Button,
  Collapse,
  Avatar,
  Tooltip,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Drawer,
} from "@mantine/core";
import {
  IconHome,
  IconCash,
  IconFileText,
  IconChartBar,
  IconChevronDown,
  IconChevronUp,
  IconBulb,
  IconBook,
  IconRobot,
  IconCalendar,
  IconCalculator,
  IconFolder,
  IconChevronLeft,
  IconChevronRight,
  IconUser,
  IconLogout,
  IconBadge,
  IconMenu2,
  IconBuilding,
  IconId,
  IconCreditCard,
  IconLock,
} from "@tabler/icons-react";
import Image from "next/image";
import React from "react";
import PlanBadge from "@/components/ui/PlanBadge";

const navLinks = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: IconHome,
  },
  {
    href: "/sales",
    label: "Sales",
    icon: IconCash,
  },
  {
    href: "/expenses",
    label: "Expenses",
    icon: IconFileText,
  },
  {
    href: "/reports",
    label: "Reports",
    icon: IconChartBar,
  },
];

const taxLinks = [
  {
    href: "/tax-corner/tax-info",
    label: "Tax Info",
    icon: IconBook,
  },
  {
    href: "/tax-corner/tax-ai",
    label: "Tax AI",
    icon: IconRobot,
  },
  {
    href: "/tax-corner/tax-calendar",
    label: "Tax Calendar",
    icon: IconCalendar,
  },
  {
    href: "/tax-corner/tax-calculator",
    label: "Tax Calculator",
    icon: IconCalculator,
  },
];

const companyLinks = [
  {
    href: "/company-profile/company-info",
    label: "Company Info",
    icon: IconId,
  },
  {
    href: "/company-profile/company-metrics",
    label: "Company Metrics",
    icon: IconChartBar,
  },
];

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [taxOpen, setTaxOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  useEffect(() => {
    async function getUserAndCompany() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
      } else {
        setUser(user);
        // Fetch company name and plan for top bar
        const { data } = await supabase
          .from("companies")
          .select("name, plan")
          .eq("user_id", user.id)
          .single();
        if (data) setCompany(data);
      }
    }
    getUserAndCompany();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  // Helper for user initials
  function getInitials(email) {
    if (!email) return "?";
    const [name] = email.split("@");
    return name
      .split(/[._-]/)
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-white via-blue-50 to-accent/10">
      {/* Sidebar (desktop) */}
      <aside
        className={`hidden md:flex fixed left-0 top-0 h-screen bg-gradient-to-b from-white via-blue-50 to-accent/10 shadow-lg flex-col py-4 px-1 transition-all duration-200 border-r border-blue-100 z-40
          ${sidebarOpen ? "w-56" : "w-16"}`}
        style={{
          // Ensure sidebar is above content
          height: "100vh",
        }}
      >
        {/* Logo & Collapse Toggle */}
        <div className="mb-6 flex items-center justify-between px-1 h-12">
          <div className="flex items-center h-12 w-full justify-center">
            {sidebarOpen ? (
              <Image
                src="/logos/word-logo.svg"
                alt="Simplify Logo"
                width={110}
                height={36}
                className="transition-all duration-300 object-contain"
                priority
              />
            ) : (
              <div className="flex items-center justify-center w-full h-12">
                <Image
                  src="/logos/letter-logo.svg"
                  alt="S"
                  width={44}
                  height={44}
                  className="transition-all duration-300 object-contain"
                  priority
                />
              </div>
            )}
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            const isLocked =
              company?.plan === "free" &&
              ["/sales", "/expenses", "/reports"].includes(link.href);
            return (
              <Tooltip
                label={
                  isLocked
                    ? "This feature is available in Pro and above. Upgrade to unlock issuing receipts, tracking expenses, and viewing reports."
                    : link.label
                }
                position="right"
                disabled={sidebarOpen}
                key={link.href}
                withArrow
                openDelay={300}
                color={isLocked ? "yellow" : undefined}
              >
                <Link
                  href={link.href}
                  className={`group flex items-center gap-3 px-2 py-2.5 rounded-lg font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : isLocked
                        ? "text-gray-400 cursor-pointer"
                        : "text-secondary"
                    }
                    hover:bg-primary/10 hover:text-primary
                    ${!sidebarOpen ? "justify-center px-0" : ""}`}
                  style={isLocked ? { pointerEvents: "auto" } : {}}
                >
                  <span className="flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                    {isLocked && (
                      <IconLock className="w-4 h-4 ml-1 text-gray-400" />
                    )}
                  </span>
                  {sidebarOpen && (
                    <span className="truncate">{link.label}</span>
                  )}
                </Link>
              </Tooltip>
            );
          })}
          {/* Company Profile Collapsible */}
          <Tooltip
            label="Company Profile"
            disabled={sidebarOpen}
            withArrow
            openDelay={300}
          >
            <div>
              <button
                type="button"
                onClick={() => setCompanyOpen((o) => !o)}
                className={`flex items-center w-full px-2 py-2.5 rounded-lg font-medium transition-colors duration-200 text-left
                  ${
                    companyOpen
                      ? "bg-primary/10 text-primary"
                      : "text-secondary"
                  }
                  hover:bg-primary/10 hover:text-primary
                  ${!sidebarOpen ? "justify-center px-0" : "justify-between"}`}
                style={{ background: "none" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <IconBuilding className="w-5 h-5 text-primary" />
                  {sidebarOpen && (
                    <span className="truncate">Company Profile</span>
                  )}
                </div>
                {sidebarOpen && (
                  <span className="flex-1 flex justify-end">
                    {companyOpen ? (
                      <IconChevronUp className="w-4 h-4" />
                    ) : (
                      <IconChevronDown className="w-4 h-4" />
                    )}
                  </span>
                )}
              </button>
              <Collapse
                in={companyOpen && sidebarOpen}
                transitionDuration={150}
              >
                <div className="flex flex-col gap-1 pl-4 mt-1">
                  {companyLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-2 px-2 py-2.5 rounded-md font-medium transition-all duration-200
                          ${
                            isActive
                              ? "bg-primary/10 text-primary shadow-sm"
                              : "text-secondary"
                          }
                          hover:bg-primary/10 hover:text-primary`}
                      >
                        <span className="flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </span>
                        <span className="truncate">{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </Collapse>
            </div>
          </Tooltip>
          {/* Tax Corner Collapsible */}
          <Tooltip
            label="Tax Corner"
            position="right"
            disabled={sidebarOpen}
            withArrow
            openDelay={300}
          >
            <div>
              <button
                type="button"
                onClick={() => setTaxOpen((o) => !o)}
                className={`flex items-center w-full px-2 py-2.5 rounded-lg font-medium transition-colors duration-200 text-left
                  ${taxOpen ? "bg-primary/10 text-primary" : "text-secondary"}
                  hover:bg-primary/10 hover:text-primary
                  ${!sidebarOpen ? "justify-center px-0" : "justify-between"}`}
                style={{ background: "none" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <IconFolder className="w-5 h-5 text-primary" />
                  {sidebarOpen && <span className="truncate">Tax Corner</span>}
                </div>
                {sidebarOpen && (
                  <span className="flex-1 flex justify-end">
                    {taxOpen ? (
                      <IconChevronUp className="w-4 h-4" />
                    ) : (
                      <IconChevronDown className="w-4 h-4" />
                    )}
                  </span>
                )}
              </button>
              <Collapse in={taxOpen && sidebarOpen} transitionDuration={150}>
                <div className="flex flex-col gap-1 pl-4 mt-1">
                  {taxLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-2 px-2 py-2.5 rounded-md font-medium transition-all duration-200
                          ${
                            isActive
                              ? "bg-primary/10 text-primary shadow-sm"
                              : "text-secondary"
                          }
                          hover:bg-primary/10 hover:text-primary`}
                      >
                        <span className="flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </span>
                        <span className="truncate">{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </Collapse>
            </div>
          </Tooltip>
        </nav>
      </aside>
      {/* Sidebar (mobile) */}
      <Drawer
        opened={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        size="xs"
        padding="md"
        withCloseButton={true}
        classNames={{ body: "p-0" }}
        overlayProps={{ opacity: 0.2, blur: 2 }}
        transitionProps={{ transition: "slide-right", duration: 250 }}
        className="md:hidden"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 mb-4">
            <Image
              src="/logos/word-logo.svg"
              alt="Simplify Logo"
              width={110}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              const isLocked =
                company?.plan === "free" &&
                ["/sales", "/expenses", "/reports"].includes(link.href);
              return (
                <Tooltip
                  label={
                    isLocked
                      ? "This feature is available in Pro and above. Upgrade to unlock issuing receipts, tracking expenses, and viewing reports."
                      : link.label
                  }
                  position="right"
                  disabled={sidebarOpen}
                  key={link.href}
                  withArrow
                  openDelay={300}
                  color={isLocked ? "yellow" : undefined}
                >
                  <Link
                    href={link.href}
                    className={`group flex items-center gap-3 px-2 py-2.5 rounded-lg font-medium transition-all duration-200
                      ${
                        isActive
                          ? "bg-primary/10 text-primary shadow-sm"
                          : isLocked
                          ? "text-gray-400 cursor-pointer"
                          : "text-secondary"
                      }
                      hover:bg-primary/10 hover:text-primary
                      ${!sidebarOpen ? "justify-center px-0" : ""}`}
                    style={isLocked ? { pointerEvents: "auto" } : {}}
                  >
                    <span className="flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                      {isLocked && (
                        <IconLock className="w-4 h-4 ml-1 text-gray-400" />
                      )}
                    </span>
                    {sidebarOpen && (
                      <span className="truncate">{link.label}</span>
                    )}
                  </Link>
                </Tooltip>
              );
            })}
            {/* Company Profile Collapsible (Mobile) */}
            <Tooltip
              label="Company Profile"
              disabled={sidebarOpen}
              withArrow
              openDelay={300}
            >
              <div>
                <button
                  type="button"
                  onClick={() => setCompanyOpen((o) => !o)}
                  className={`flex items-center w-full px-2 py-2.5 rounded-lg font-medium transition-colors duration-200 text-left
                    ${
                      companyOpen
                        ? "bg-primary/10 text-primary"
                        : "text-secondary"
                    }
                    hover:bg-primary/10 hover:text-primary
                    ${
                      !sidebarOpen ? "justify-center px-0" : "justify-between"
                    }`}
                  style={{ background: "none" }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <IconBuilding className="w-5 h-5 text-primary" />
                    {sidebarOpen && (
                      <span className="truncate">Company Profile</span>
                    )}
                  </div>
                  {sidebarOpen && (
                    <span className="flex-1 flex justify-end">
                      {companyOpen ? (
                        <IconChevronUp className="w-4 h-4" />
                      ) : (
                        <IconChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </button>
                <Collapse
                  in={companyOpen && sidebarOpen}
                  transitionDuration={150}
                >
                  <div className="flex flex-col gap-1 pl-4 mt-1">
                    {companyLinks.map((link) => {
                      const isActive = pathname === link.href;
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`flex items-center gap-2 px-2 py-2.5 rounded-md font-medium transition-all duration-200
                            ${
                              isActive
                                ? "bg-primary/10 text-primary shadow-sm"
                                : "text-secondary"
                            }
                            hover:bg-primary/10 hover:text-primary`}
                        >
                          <span className="flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </span>
                          <span className="truncate">{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </Collapse>
              </div>
            </Tooltip>
            {/* Tax Corner Collapsible (Mobile) */}
            <Tooltip
              label="Tax Corner"
              position="right"
              disabled={sidebarOpen}
              withArrow
              openDelay={300}
            >
              <div>
                <button
                  type="button"
                  onClick={() => setTaxOpen((o) => !o)}
                  className={`flex items-center w-full px-2 py-2.5 rounded-lg font-medium transition-colors duration-200 text-left
                    ${taxOpen ? "bg-primary/10 text-primary" : "text-secondary"}
                    hover:bg-primary/10 hover:text-primary
                    ${
                      !sidebarOpen ? "justify-center px-0" : "justify-between"
                    }`}
                  style={{ background: "none" }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <IconFolder className="w-5 h-5 text-primary" />
                    {sidebarOpen && (
                      <span className="truncate">Tax Corner</span>
                    )}
                  </div>
                  {sidebarOpen && (
                    <span className="flex-1 flex justify-end">
                      {taxOpen ? (
                        <IconChevronUp className="w-4 h-4" />
                      ) : (
                        <IconChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </button>
                <Collapse in={taxOpen && sidebarOpen} transitionDuration={150}>
                  <div className="flex flex-col gap-1 pl-4 mt-1">
                    {taxLinks.map((link) => {
                      const isActive = pathname === link.href;
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`flex items-center gap-2 px-2 py-2.5 rounded-md font-medium transition-all duration-200
                            ${
                              isActive
                                ? "bg-primary/10 text-primary shadow-sm"
                                : "text-secondary"
                            }
                            hover:bg-primary/10 hover:text-primary`}
                        >
                          <span className="flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </span>
                          <span className="truncate">{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </Collapse>
              </div>
            </Tooltip>
          </nav>
        </div>
      </Drawer>
      {/* Main content area */}
      <div
        className="flex-1 flex flex-col min-h-screen ml-0 md:ml-[224px] transition-all duration-200"
        style={{ minHeight: "100vh" }}
      >
        {/* Top bar */}
        <header
          className="h-16 bg-white/80 flex items-center px-3 sm:px-6 shadow-sm border-b border-blue-100 fixed top-0 left-0 md:left-[224px] z-30 transition-all duration-200 w-full md:w-[calc(100vw-224px)]"
          style={{ right: "auto" }}
        >
          <div className="flex-1 flex items-center gap-4">
            {/* Sidebar toggle for desktop */}
            <button
              className="mr-2 p-1 rounded hover:bg-primary/10 transition-colors hidden md:inline-flex"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              type="button"
            >
              <span className="flex items-center gap-1">
                <IconMenu2 className="w-5 h-5 text-primary" />
                {sidebarOpen ? (
                  <IconChevronRight className="w-4 h-4 text-primary" />
                ) : (
                  <IconChevronLeft className="w-4 h-4 text-primary" />
                )}
              </span>
            </button>
            {/* Sidebar toggle for mobile */}
            <button
              className="mr-2 p-1 rounded hover:bg-primary/10 transition-colors md:hidden"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open sidebar"
              type="button"
            >
              <IconMenu2 className="w-6 h-6 text-primary" />
            </button>
          </div>
          {/* Company name and plan right side */}
          <div className="flex items-center gap-2 ml-auto">
            <Menu position="bottom-end" width={280}>
              <MenuTarget>
                <button className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-primary/10 transition-colors group min-w-0">
                  {company?.name ? (
                    <span className="text-lg font-semibold text-primary">
                      {company.name}
                    </span>
                  ) : (
                    <span className="h-6 w-32 bg-gray-200 animate-pulse rounded"></span>
                  )}
                  <span className="flex items-center gap-1 text-[12px] font-semibold px-2 py-0.5 rounded-full">
                    <PlanBadge plan={company?.plan} />
                  </span>
                </button>
              </MenuTarget>
              <MenuDropdown>
                <div className="flex flex-col items-center gap-2 px-4 pt-3 pb-2 mb-2">
                  <Button
                    size="xs"
                    color="yellow"
                    variant="light"
                    onClick={() => router.push("/billing")}
                    className="w-full"
                  >
                    Upgrade Plan
                  </Button>
                </div>
                {(user?.user_metadata?.full_name || user?.email) && (
                  <div className="px-4 pt-3 pb-2 mb-2">
                    {user?.user_metadata?.full_name && (
                      <div className="text-base font-bold text-primary truncate max-w-[220px]">
                        {user.user_metadata.full_name}
                      </div>
                    )}
                    {user?.email && (
                      <div className="text-xs text-secondary font-medium truncate max-w-[220px] opacity-80 cursor-default select-text mt-0.5">
                        {user.email}
                      </div>
                    )}
                  </div>
                )}
                <div className="border-t border-gray-100 mb-1" />
                <MenuItem
                  leftSection={<IconCreditCard className="w-5 h-5" />}
                  onClick={() => router.push("/billing")}
                  className="text-[15px] font-medium hover:bg-blue-50/60 transition-colors"
                >
                  Billing & Plans
                </MenuItem>
                <div className="border-t border-gray-100 my-1" />
                <MenuItem
                  color="red"
                  leftSection={<IconLogout className="w-5 h-5" />}
                  onClick={handleLogout}
                  className="text-[15px] font-semibold hover:bg-red-50/60 transition-colors"
                >
                  Logout
                </MenuItem>
              </MenuDropdown>
            </Menu>
          </div>
        </header>
        <main
          className="flex-1 p-8 mt-16 overflow-y-auto"
          style={{ minHeight: "calc(100vh - 4rem)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
