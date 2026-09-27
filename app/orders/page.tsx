"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  Search,
  Eye,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Basketball from "@/app/components/landing/Basketball";
import CourtBackdrop from "@/app/components/landing/CourtBackdrop";

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  address: string;
  phone: string;
  createdAt: string;
  items: OrderItem[];
  user?: { id: number; name: string | null; email: string } | null;
}

function statusBadgeVariant(status: string) {
  switch (status) {
    case "Completed":
      return "default" as const;
    case "Processing":
      return "secondary" as const;
    case "Cancelled":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

function statusIcon(status: string) {
  switch (status) {
    case "Completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "Processing":
      return <Truck className="h-4 w-4 text-blue-600" />;
    case "Cancelled":
      return <XCircle className="h-4 w-4 text-destructive" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
}

export default function OrdersPage() {
  const { user, token } = useAuth();
  const isAdmin = user?.role === "admin";
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, status: string) => {
    setUpdatingStatus(orderId);
    try {
      const response = await fetch("/api/orders/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, status }),
      });

      if (!response.ok) throw new Error();

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      toast.success(`Order #${orderId} updated to ${status}`);
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toString().includes(search) ||
      o.status.toLowerCase().includes(search.toLowerCase()) ||
      (o.user?.email && o.user.email.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="relative mb-6 overflow-hidden rounded-3xl bg-black p-6 text-white sm:p-10">
          <CourtBackdrop />
          <div className="pointer-events-none absolute -top-24 -right-16 h-80 w-80 rounded-full bg-court/25 blur-[100px]" aria-hidden="true" />
          <div className="relative">
            <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-court">
              <span className="h-px w-10 bg-court" />
              Orders
            </p>
            <h1 className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-[0.95] uppercase">Orders</h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="relative overflow-hidden rounded-3xl bg-black p-6 text-white sm:p-10">
        <CourtBackdrop />
        <div className="pointer-events-none absolute -top-24 -right-16 h-80 w-80 rounded-full bg-court/25 blur-[100px]" aria-hidden="true" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-court">
              <span className="h-px w-10 bg-court" />
              Orders
            </p>
            <h1 className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-[0.95] uppercase">
              {isAdmin ? "All Orders" : "My Orders"}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
              {isAdmin ? "Manage customer orders" : "View your order history"}
            </p>
          </div>
          <Basketball className="hidden h-auto w-24 shrink-0 animate-float sm:block lg:w-32" />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Total Orders</p>
            <p className="font-display text-4xl">{orders.length}</p>
          </CardHeader>
        </Card>
        <Card className="rounded-2xl border-yellow-500/30 bg-yellow-500/5">
          <CardHeader className="pb-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Pending</p>
            <p className="font-display text-4xl text-yellow-600">
              {orders.filter((o) => o.status === "Pending").length}
            </p>
          </CardHeader>
        </Card>
        <Card className="rounded-2xl border-blue-500/30 bg-blue-500/5">
          <CardHeader className="pb-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Processing</p>
            <p className="font-display text-4xl text-blue-600">
              {orders.filter((o) => o.status === "Processing").length}
            </p>
          </CardHeader>
        </Card>
        <Card className="rounded-2xl border-green-500/30 bg-green-500/5">
          <CardHeader className="pb-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Completed</p>
            <p className="font-display text-4xl text-green-600">
              {orders.filter((o) => o.status === "Completed").length}
            </p>
          </CardHeader>
        </Card>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm text-muted-foreground">
              {search ? "Try a different search term" : "No orders have been placed yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                {isAdmin && <TableHead>Customer</TableHead>}
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div>
                        <p className="text-sm">{order.user?.name || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>{order.items.length} item(s)</TableCell>
                  <TableCell className="font-semibold">₱{order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(order.status)} className="gap-1">
                      {statusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {isAdmin && order.status === "Pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={updatingStatus === order.id}
                            onClick={() => handleStatusUpdate(order.id, "Processing")}
                          >
                            Process
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={updatingStatus === order.id}
                            onClick={() => handleStatusUpdate(order.id, "Completed")}
                          >
                            Complete
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive"
                            disabled={updatingStatus === order.id}
                            onClick={() => handleStatusUpdate(order.id, "Cancelled")}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {isAdmin && order.status === "Processing" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={updatingStatus === order.id}
                          onClick={() => handleStatusUpdate(order.id, "Completed")}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={selectedOrder !== null} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Placed on {selectedOrder && new Date(selectedOrder.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Status</p>
                <Badge variant={statusBadgeVariant(selectedOrder.status)} className="gap-1">
                  {statusIcon(selectedOrder.status)}
                  {selectedOrder.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Shipping Address</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Phone</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>Product #{item.productId} x {item.quantity}</span>
                      <span className="font-medium">₱{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₱{selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
