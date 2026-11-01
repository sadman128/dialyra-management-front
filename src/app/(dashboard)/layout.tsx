"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBusiness } from "@/context/BusinessContext";
import { useTheme } from "@/context/ThemeContext";
import { Icon } from "@/components/ui/Icon";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { name: "Businesses", href: "/businesses", icon: "storefront" },
  { name: "Flows", href: "/flows", icon: "account_tree" },
  { name: "Call History", href: "/call-history", icon: "history" },
  { name: "Audio Library", href: "/audio", icon: "audio_file" },
  { name: "Test Tools", href: "/test-tools", icon: "build" },
  { name: "Settings", href: "/settings", icon: "settings" },
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
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Trunk Node BD-02 Active",
      desc: "3 channels in active dispatch. Latency 18ms.",
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
      title: "WooCommerce Webhook 200 OK",
      desc: "Order confirmation received and logged.",
      time: "1h ago",
      type: "info",
      read: true,
    },
  ]);
  const [notifModalOpen, setNotifModalOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSyncTrunk = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      showToast("Trunk #20 telemetry synchronized (3/5 channels active, 18ms latency)", "info");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased flex flex-col">
      {/* 1. Desktop Fixed Sidebar (100% Stitch UI Specification) */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-primary-container z-50 hidden lg:flex flex-col justify-between shadow-stitch">
        <div className="flex flex-col">
          {/* Brand & SIP Status */}
          <div className="px-space-lg pt-space-lg pb-space-md">
            <div className="flex items-center justify-between">
              <span className="text-[22px] font-bold text-on-primary tracking-tight">
                Dialyra
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-container text-tertiary-fixed-dim text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim animate-pulse" />
                SIP
              </span>
            </div>
            <div className="mt-space-xs">
              <span className="text-[11px] text-primary-fixed-dim tracking-[0.2em] uppercase font-bold">
                MANAGEMENT
              </span>
            </div>
          </div>

          <div className="px-space-md py-space-xs">
            <div className="h-px bg-on-primary/10 w-full" />
          </div>

          {/* Nav List */}
          <nav className="flex flex-col gap-1 px-space-md py-space-xs">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-space-md px-space-md py-2.5 rounded-lg transition-all text-sm ${
                    isActive
                      ? "bg-surface-container-lowest text-primary dark:text-primary-fixed font-bold shadow-sm"
                      : "text-primary-fixed-dim hover:bg-on-primary/10 hover:text-on-primary font-medium"
                  }`}
                >
                  <Icon name={item.icon} size={20} className="shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-space-md">
          <div className="flex items-center justify-between p-space-sm rounded-xl bg-on-primary/5">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <Icon name="person" size={18} className="text-on-primary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm text-on-primary truncate font-semibold">
                  Store Admin
                </span>
                <span className="text-xs text-primary-fixed-dim truncate">
                  Telephony Supervisor
                </span>
              </div>
            </div>
            <button
              onClick={() => showToast("Admin session active", "info")}
              className="p-space-xs rounded-lg text-primary-fixed-dim hover:bg-on-primary/10 hover:text-on-primary transition-colors flex items-center justify-center"
              type="button"
              title="Logout"
            >
              <Icon name="logout" size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Slide-Over Drawer (< lg) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          />
          <div className="relative w-64 max-w-xs bg-primary-container z-10 flex flex-col justify-between shadow-2xl h-full">
            <div className="flex flex-col">
              <div className="p-space-lg flex items-center justify-between border-b border-on-primary/10">
                <div className="flex flex-col">
                  <span className="text-[22px] font-bold text-on-primary">Dialyra</span>
                  <span className="text-[11px] text-primary-fixed-dim tracking-widest uppercase font-bold">
                    MANAGEMENT
                  </span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-primary-fixed-dim hover:text-on-primary"
                >
                  <Icon name="close" size={22} />
                </button>
              </div>

              <nav className="flex flex-col gap-1 p-space-md">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center gap-space-md px-space-md py-2.5 rounded-lg transition-all text-sm ${
                        isActive
                          ? "bg-surface-container-lowest text-primary dark:text-primary-fixed font-bold shadow-sm"
                          : "text-primary-fixed-dim hover:bg-on-primary/10 hover:text-on-primary font-medium"
                      }`}
                    >
                      <Icon name={item.icon} size={20} className="shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="p-space-md border-t border-on-primary/10">
              <div className="flex items-center gap-2 text-on-primary text-sm font-semibold">
                <Icon name="person" size={20} />
                <span>Store Admin</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Workspace with Fixed Header */}
      <div className="w-full pl-0 lg:pl-64 flex flex-col min-h-screen">
        {/* Stitch UI Header Bar */}
        <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 sm:h-20 bg-surface-container-lowest/90 backdrop-blur-xl z-40 flex items-center justify-between px-3 sm:px-margin-desktop shadow-stitch border-b border-outline-variant/20">
          <div className="flex items-center gap-2 sm:gap-space-md min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container transition-colors shrink-0"
              aria-label="Open navigation menu"
            >
              <Icon name="menu" size={24} />
            </button>

            {/* Active Store Dropdown Switcher */}
            <div className="relative min-w-0">
              <button
                onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-space-xs px-2.5 sm:px-space-md py-1.5 sm:py-space-sm rounded-lg bg-surface-container-low text-on-surface text-xs sm:text-sm font-medium hover:bg-surface-container transition-all border border-outline-variant/30 max-w-[160px] sm:max-w-none shadow-xs hover:shadow-sm active:scale-95"
                type="button"
              >
                <Icon name="storefront" size={18} className="text-secondary shrink-0" />
                <span className="text-on-surface-variant font-normal hidden md:inline">
                  Active Store:
                </span>
                <span className="font-semibold truncate">{activeBusiness.name}</span>
                <Icon name="expand_more" size={16} className="text-on-surface-variant shrink-0" />
              </button>

              {storeDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 p-2 z-50">
                  <div className="text-xs font-semibold text-on-surface-variant px-3 py-1.5 uppercase tracking-wider">
                    Connected Storefronts
                  </div>
                  {businesses.map((biz) => (
                    <button
                      key={biz.id}
                      onClick={() => {
                        setActiveBusinessId(biz.id);
                        setStoreDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between transition ${
                        biz.id === activeBusiness.id
                          ? "bg-primary-container text-on-primary"
                          : "text-on-surface hover:bg-surface-container-low"
                      }`}
                    >
                      <span>{biz.name}</span>
                      {biz.id === activeBusiness.id && (
                        <Icon name="check" size={16} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Header Controls: Sync, Theme Toggle, Notifications, User */}
          <div className="flex items-center gap-2 sm:gap-space-md shrink-0">
            {/* Sync Trunk Status */}
            <button
              onClick={handleSyncTrunk}
              disabled={syncing}
              className="flex items-center gap-1.5 sm:gap-space-xs px-2.5 sm:px-space-md py-1.5 sm:py-space-sm rounded-lg bg-surface-container-lowest text-on-surface text-xs sm:text-sm font-medium hover:bg-surface-container-low transition-all shadow-xs hover:shadow border border-outline-variant/20 active:scale-95"
              type="button"
            >
              <Icon
                name="bolt"
                size={18}
                className={`text-secondary shrink-0 ${syncing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Sync Trunk</span>
            </button>

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container transition-all flex items-center justify-center border border-outline-variant/30 shadow-xs hover:shadow-sm active:scale-95"
              type="button"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <Icon
                name={theme === "dark" ? "light_mode" : "dark_mode"}
                size={18}
                className="text-secondary"
              />
            </button>

            {/* Notifications Bell with Modal Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifModalOpen(!notifModalOpen)}
                className="relative p-2 sm:p-2.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container transition-all flex items-center justify-center border border-outline-variant/30 shadow-xs hover:shadow-sm active:scale-95"
                type="button"
                title="Notifications"
              >
                <Icon name="notifications" size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest animate-pulse" />
                )}
              </button>

              {/* Notification Popover Modal */}
              {notifModalOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <Icon name="notifications" size={18} className="text-primary-container dark:text-primary-fixed" />
                      <h4 className="font-bold text-sm text-on-surface">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-on-primary">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {notifications.length > 0 && unreadCount > 0 && (
                        <button
                          onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}
                          className="text-on-surface-variant hover:text-primary transition font-semibold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
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
                          className={`py-2.5 px-2 flex items-start gap-2.5 transition rounded-lg ${
                            !n.read ? "bg-primary-fixed/15 dark:bg-primary-container/20" : ""
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
                            <span className="text-[10px] text-outline mt-0.5 block font-mono">
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
                        className="text-outline hover:text-error transition font-semibold text-[11px]"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={() => setNotifModalOpen(false)}
                        className="text-primary font-bold hover:underline text-[11px]"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-xs">
              <Icon name="person" size={16} className="text-on-primary" />
            </div>
          </div>
        </header>

        {/* Page Main Content Area */}
        <main className="w-full pt-20 px-4 sm:px-margin-desktop bg-surface min-h-screen">
          <div className="w-full py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
