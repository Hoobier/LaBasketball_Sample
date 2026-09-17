"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bell, Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const notifications: Array<{
  id: number;
  type: "schedule" | "venue";
  title: string;
  description: string;
  time: string;
  read: boolean;
}> = [];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifList, setNotifList] = useState(notifications);
  const unreadCount = notifList.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifList((prev) => prev.map((n) => ({ ...n, read: true })));
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-muted-foreground"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {notifList.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No notifications</p>
            ) : (
              <>
                {notifList.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors hover:bg-accent",
                      !notif.read && "bg-accent/50"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        notif.type === "schedule"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                      )}
                    >
                      {notif.type === "schedule" ? (
                        <Calendar className="h-4 w-4" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{notif.title}</p>
                        {!notif.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notif.description}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
