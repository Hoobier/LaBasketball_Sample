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
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {isAdmin ? "All Orders" : "My Orders"}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {isAdmin ? "Manage customer orders" : "View your order history"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter((o) => o.status === "Pending").length}
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Processing</p>
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter((o) => o.status === "Processing").length}
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-green-600">
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
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm text-muted-foreground">
              {search ? "Try a different search term" : "No orders have been placed yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
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

      {/* Order Detail Dialog */}
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
