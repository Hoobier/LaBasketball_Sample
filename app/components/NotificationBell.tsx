"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bell, Calendar, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/contexts/AuthContext";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    if (!token) return;
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Silent fail
    }
  };

  const markAllAsRead = async () => {
    if (!token) return;
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // Silent fail
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reservation":
        return <Calendar className="h-4 w-4" />;
      case "approval":
        return <Calendar className="h-4 w-4" />;
      case "rejection":
        return <Calendar className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "reservation":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "approval":
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      case "rejection":
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            {unreadCount}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Notifications</DialogTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" className="text-sm text-muted-foreground" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No notifications</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors hover:bg-accent",
                    !notif.read && "bg-accent/50"
                  )}
                >
                  <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", getNotificationColor(notif.type))}>
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{notif.title}</p>
                      {!notif.read && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{notif.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
