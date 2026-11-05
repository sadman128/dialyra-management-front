"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBusiness } from "@/context/BusinessContext";
import { useTheme } from "@/context/ThemeContext";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  LayoutDashboard,
  Building2,
  GitBranch,
  History,
  Network,
  Users,
  PhoneCall,
  Volume2,
  Settings,
  Menu,
  X,
  ChevronDown,
  Check,
  Zap,
  Sun,
  Moon,
  Bell,
  User,
  LogOut,
  Package,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Businesses", href: "/businesses", icon: Building2 },
  { name: "Flows", href: "/flows", icon: GitBranch },
  { name: "Products", href: "/products", icon: Package },
  { name: "Call History", href: "/call-history", icon: History },
  { name: "Departments", href: "/departments", icon: Network },
  { name: "Agents", href: "/agents", icon: Users },
  { name: "Extensions", href: "/extensions", icon: PhoneCall },
  { name: "Audio", href: "/audio", icon: Volume2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { businesses, activeBusiness, setActiveBusinessId, showToast } = useBusiness();
  const { theme, toggleTheme } = useTheme();
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Node BD-02 Active",
      desc: "System running smoothly. Latency 18ms.",
      time: "10m ago",
      type: "success",
      read: false,
    },
    {
      id: "2",
      title: "Order #1046 Auto-Retried",
      desc: "No-answer redial scheduled in 15 mins.",
      time: "25m ago",
      type: "warning",
      read: false,
    },
    {
      id: "3",
      title: "Store Webhook 200 OK",
      desc: "Order confirmation received and logged.",
      time: "1h ago",
      type: "info",
      read: true,
    },
  ]);
  const [notifModalOpen, setNotifModalOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close all popovers and drawers on focus loss, click outside, or Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-popover]")) {
        setStoreDropdownOpen(false);
        setNotifModalOpen(false);
        setProfileModalOpen(false);
      }
    };
    const handleBlur = () => {
      setStoreDropdownOpen(false);
      setNotifModalOpen(false);
      setProfileModalOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setStoreDropdownOpen(false);
        setNotifModalOpen(false);
        setProfileModalOpen(false);
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Spotlight hover effect for all bento-card elements
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest(".bento-card") as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", handlePointerMove);
    return () => document.removeEventListener("pointermove", handlePointerMove);
  }, []);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      showToast("System synchronized", "info");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-[#09090b] font-body-md text-on-surface antialiased flex flex-col relative overflow-x-clip">
      {/* Branded Fixed TriZync Background Image - Subtle dark geometry on dark grey / black canvas */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-60 dark:opacity-[0.035]"
        style={{ backgroundImage: `url('/images/trizync-bg.png')`, backgroundAttachment: "fixed" }}
      />

      {/* 1. Desktop Fixed Sidebar - White / Clean Surface (10% wider: 280px) */}
      <aside className="fixed left-0 top-0 h-full w-[280px] bg-white dark:bg-[#121215] text-on-surface z-50 hidden lg:flex flex-col justify-between border-r border-outline-variant/30 dark:border-zinc-800/80 shadow-sm">
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="px-6 pt-6 pb-6 border-b border-outline-variant/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#da8cff] to-[#9a55ff] flex items-center justify-center text-white font-black text-xl shadow-md shadow-purple-500/30">
                D
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-on-surface leading-none">
                  Dialyra
                </span>
                <span className="text-[10px] text-[#9a55ff] tracking-[0.24em] uppercase font-extrabold mt-1">
                  MANAGEMENT
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5 px-3 py-4">
            {NAV_ITEMS.map((item) => {
              const IconComp = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-semibold ${
                    isActive
                      ? "bg-gradient-to-r from-[#b66dff] to-[#9a55ff] text-white shadow-md shadow-purple-500/25 font-bold"
                      : "text-on-surface-variant hover:text-[#9a55ff] hover:bg-surface-container-low"
                  }`}
                >
                  <IconComp
                    size={19}
                    className={`shrink-0 ${isActive ? "text-white" : "text-on-surface-variant/80"}`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Logout Footer */}
        <div className="p-4 pb-6 border-t border-outline-variant/20">
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/25 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-2xs"
            type="button"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Mobile Slide-Over Drawer (< lg) - Matching White / Clean Surface */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
          />
          <div className="relative w-72 max-w-xs bg-white dark:bg-[#121215] text-on-surface z-10 flex flex-col justify-between shadow-2xl h-full border-r border-outline-variant/30 dark:border-zinc-800/80">
            <div className="flex flex-col">
              <div className="p-5 flex items-center justify-between border-b border-outline-variant/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#da8cff] to-[#9a55ff] flex items-center justify-center text-white font-black text-lg shadow-md shadow-purple-500/30">
                    D
                  </div>
                  <div>
                    <span className="text-xl font-bold text-on-surface block leading-tight">
                      Dialyra
                    </span>
                    <span className="text-[10px] text-[#9a55ff] tracking-[0.22em] uppercase font-bold block">
                      MANAGEMENT
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col gap-1 p-3">
                {NAV_ITEMS.map((item) => {
                  const IconComp = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-semibold ${
                        isActive
                          ? "bg-gradient-to-r from-[#b66dff] to-[#9a55ff] text-white shadow-md font-bold"
                          : "text-on-surface-variant hover:text-[#9a55ff] hover:bg-surface-container-low"
                      }`}
                    >
                      <IconComp size={19} className="shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t border-outline-variant/20">
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setLogoutModalOpen(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-500/20 transition"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Workspace with Fixed Header */}
      <div className="w-full pl-0 lg:pl-[280px] flex flex-col min-h-screen relative z-10 min-w-0 max-w-full">
        {/* Top Navbar Header */}
        <header className="fixed top-0 left-0 lg:left-[280px] right-0 h-16 sm:h-20 bg-surface-container-lowest/90 backdrop-blur-xl z-40 flex items-center justify-between px-4 sm:px-8 shadow-xs border-b border-outline-variant/30">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-on-surface hover:bg-surface-container transition-colors shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>

            {/* Active Business Dropdown Switcher */}
            <div className="relative min-w-0" data-popover>
              <button
                onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm font-semibold hover:bg-surface-container transition-all border border-outline-variant/30 max-w-[135px] xs:max-w-[180px] sm:max-w-none shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                type="button"
              >
                <Building2 size={15} className="text-[#9a55ff] shrink-0" />
                <span className="text-on-surface-variant font-normal hidden md:inline">
                  Active Business:
                </span>
                <span className="font-bold truncate">{activeBusiness.name}</span>
                <ChevronDown size={14} className="text-on-surface-variant shrink-0" />
              </button>

              {storeDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 p-2 z-50">
                  <div className="text-xs font-bold text-on-surface-variant px-3 py-1.5 uppercase tracking-wider">
                    Connected Businesses
                  </div>
                  {businesses.map((biz) => (
                    <button
                      key={biz.id}
                      onClick={() => {
                        setActiveBusinessId(biz.id);
                        setStoreDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold flex items-center justify-between transition cursor-pointer ${
                        biz.id === activeBusiness.id
                          ? "btn-gradient-primary text-white"
                          : "text-on-surface hover:bg-surface-container-low"
                      }`}
                    >
                      <span>{biz.name}</span>
                      {biz.id === activeBusiness.id && <Check size={16} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Header Controls: Sync, Theme Toggle, Notifications, User */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Sync Button */}
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-surface-container-lowest text-on-surface text-xs sm:text-sm font-semibold hover:bg-surface-container-low transition-all shadow-xs hover:shadow border border-outline-variant/30 active:scale-95 cursor-pointer"
              type="button"
            >
              <Zap
                size={16}
                className={`text-[#9a55ff] shrink-0 ${syncing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Sync</span>
            </button>

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container transition-all flex items-center justify-center border border-outline-variant/30 shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
              type="button"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun size={17} className="text-amber-400" />
              ) : (
                <Moon size={17} className="text-purple-600" />
              )}
            </button>

            {/* Notifications Bell with Modal Dropdown */}
            <div className="relative" data-popover>
              <button
                onClick={() => setNotifModalOpen(!notifModalOpen)}
                className="relative p-2 sm:p-2.5 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container transition-all flex items-center justify-center border border-outline-variant/30 shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                type="button"
                title="Notifications"
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-surface-container-lowest animate-pulse" />
                )}
              </button>

              {/* Notification Popover Modal */}
              {notifModalOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <Bell size={17} className="text-[#9a55ff]" />
                      <h4 className="font-bold text-sm text-on-surface">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#9a55ff] text-white">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && unreadCount > 0 && (
                      <button
                        onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}
                        className="text-xs text-on-surface-variant hover:text-[#9a55ff] transition font-semibold cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="py-2 divide-y divide-outline-variant/10 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-on-surface-variant font-medium">
                        No notifications right now.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`py-2.5 px-2 flex items-start gap-2.5 transition rounded-xl ${
                            !n.read ? "bg-purple-500/10 dark:bg-purple-500/20" : ""
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              n.type === "success"
                                ? "bg-emerald-500"
                                : n.type === "warning"
                                ? "bg-amber-500"
                                : "bg-sky-500"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-on-surface">{n.title}</p>
                            <p className="text-[11px] text-on-surface-variant font-medium truncate">
                              {n.desc}
                            </p>
                            <span className="text-[10px] text-on-surface-variant/70 mt-0.5 block font-mono">
                              {n.time}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="pt-2.5 border-t border-outline-variant/20 flex justify-between items-center text-xs">
                      <button
                        onClick={() => setNotifications([])}
                        className="text-on-surface-variant hover:text-rose-500 transition font-semibold text-[11px] cursor-pointer"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={() => setNotifModalOpen(false)}
                        className="text-[#9a55ff] font-bold hover:underline text-[11px] cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile Button with Modal */}
            <div className="relative" data-popover>
              <button
                onClick={() => setProfileModalOpen(!profileModalOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/30 shadow-2xs hover:shadow transition-all cursor-pointer"
                type="button"
                title="Account Menu"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#da8cff] to-[#9a55ff] flex items-center justify-center text-white font-bold shadow-xs">
                  <User size={15} />
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-on-surface leading-tight">Sadman Kabir</span>
                  <span className="text-[11px] text-on-surface-variant font-medium leading-tight">Owner</span>
                </div>
                <ChevronDown size={14} className="text-on-surface-variant hidden md:block" />
              </button>

              {profileModalOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/20">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#da8cff] to-[#9a55ff] flex items-center justify-center text-white font-bold shadow-xs shrink-0">
                      <User size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-on-surface truncate">Sadman Kabir</div>
                      <div className="text-xs text-on-surface-variant truncate">Owner</div>
                      <div className="text-[11px] text-on-surface-variant/70 truncate font-mono">admin@dialyra.com</div>
                    </div>
                  </div>

                  <div className="py-2.5 space-y-1 text-xs font-semibold">
                    <div className="px-2 py-1 text-on-surface-variant font-medium">
                      Active: <strong className="text-on-surface">{activeBusiness.name}</strong>
                    </div>
                    <Link
                      href="/settings"
                      onClick={() => setProfileModalOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container-low transition"
                    >
                      <Settings size={15} className="text-[#9a55ff]" />
                      <span>Settings</span>
                    </Link>
                    <Link
                      href="/businesses"
                      onClick={() => setProfileModalOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container-low transition"
                    >
                      <Building2 size={15} className="text-[#9a55ff]" />
                      <span>Switch Business</span>
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setProfileModalOpen(false);
                        setLogoutModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                      type="button"
                    >
                      <LogOut size={14} />
                      <span>Log Out</span>
                    </button>
                    <button
                      onClick={() => setProfileModalOpen(false)}
                      className="text-xs text-on-surface-variant hover:text-on-surface font-semibold px-2 py-1 cursor-pointer"
                      type="button"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Main Content Area */}
        <main className="w-full min-w-0 max-w-full pt-20 px-4 sm:px-8 bg-transparent min-h-screen overflow-x-clip">
          <div className="w-full max-w-full py-6 min-w-0">{children}</div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={() => {
          setLogoutModalOpen(false);
          showToast("Signed out of administrative console", "info");
        }}
        title="Log Out"
        description="Are you sure you want to log out of Dialyra Management? You will need to sign in again to access call controls."
        confirmText="Log Out"
        variant="danger"
        icon="logout"
      />
    </div>
  );
}
