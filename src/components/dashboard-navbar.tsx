"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bell, Sun, Moon, Search, Menu } from "lucide-react";
import { useTheme } from "@/components/providers";
import { prisma } from "@/lib/prisma"; // Note: this is a client file, we should fetch notifications via API route!

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function DashboardNavbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications on load
  useEffect(() => {
    if (session?.user) {
      fetch("/api/notifications")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setNotifications(data);
            setUnreadCount(data.filter((n) => !n.isRead).length);
          }
        })
        .catch((err) => console.error("Error fetching notifications:", err));
    }
  }, [session]);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read", { method: "POST" });
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card/60 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Search Bar / Left Block */}
      <div className="flex items-center gap-4">
        <button className="md:hidden text-muted-foreground hover:text-foreground">
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden sm:block w-64">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses, jobs, reports..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-border bg-background/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 rounded-xl border border-border bg-background hover:bg-muted transition-all duration-200"
          title="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4.5 h-4.5 text-yellow-500 animate-spin-slow" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-indigo-600" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2.5 rounded-xl border border-border bg-background hover:bg-muted transition-all duration-200 relative"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center border-2 border-card">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card shadow-xl overflow-hidden z-50 animate-in fade-in-50 slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
                <span className="font-semibold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 transition-colors duration-150 hover:bg-muted/10 ${!notif.isRead ? "bg-primary/5" : ""}`}
                    >
                      <span className="block text-xs font-semibold text-foreground mb-0.5">
                        {notif.title}
                      </span>
                      <span className="block text-[11px] text-muted-foreground leading-relaxed">
                        {notif.message}
                      </span>
                      <span className="block text-[9px] text-muted-foreground/60 mt-1">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Info Avatar */}
        <div className="flex items-center gap-3 border-l border-border pl-4">
          <div className="text-right hidden md:block">
            <span className="block text-xs font-bold text-foreground">
              {session?.user?.name || "Guest"}
            </span>
            <span className="block text-[10px] text-muted-foreground capitalize">
              {session?.user && (session.user as any).role ? (session.user as any).role.toLowerCase().replace('_', ' ') : "visitor"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
