"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Package, DollarSign, Search, ShoppingCart } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useCart } from "@/app/contexts/CartContext";
import Basketball from "@/app/components/landing/Basketball";
import CourtBackdrop from "@/app/components/landing/CourtBackdrop";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const categories = ["Basketball", "Apparel", "Footwear", "Accessories", "Equipment"];

function getStockStatus(stock: number): Product["status"] {
  if (stock === 0) return "Out of Stock";
  if (stock <= 5) return "Low Stock";
  return "In Stock";
}

function stockBadgeVariant(status: Product["status"]) {
  switch (status) {
    case "In Stock":
      return "default" as const;
    case "Low Stock":
      return "secondary" as const;
    case "Out of Stock":
      return "destructive" as const;
  }
}

export default function ProductsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [formData, setFormData] = useState<ProductFormData>({ name: "", description: "", price: 0, category: "", stock: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      const productsWithStatus = (data.products || []).map((p: Omit<Product, "status">) => ({
        ...p,
        status: getStockStatus(p.stock),
      }));
      setProducts(productsWithStatus);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", price: 0, category: "", stock: 0 });
    setErrors({});
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = productSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ProductFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ProductFormData;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setProducts((prev) => [{ ...data.product, status: getStockStatus(data.product.stock) }, ...prev]);
      setAddOpen(false);
      resetForm();
      toast.success("Product added", { description: `"${result.data.name}" has been added to your products.` });
    } catch {
      toast.error("Failed to add product");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    const result = productSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ProductFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ProductFormData;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    try {
      const response = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editProduct.id, ...result.data }),
      });
      if (!response.ok) throw new Error();
      setProducts((prev) => prev.map((p) => (p.id === editProduct.id ? { ...p, ...result.data, status: getStockStatus(result.data.stock) } : p)));
      setEditProduct(null);
      resetForm();
      toast.success("Product updated", { description: `"${result.data.name}" has been updated.` });
    } catch {
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    try {
      const response = await fetch(`/api/products?id=${deleteProduct.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      const name = deleteProduct.name;
      setProducts((prev) => prev.filter((p) => p.id === deleteProduct.id));
      setDeleteProduct(null);
      toast.success("Product deleted", { description: `"${name}" has been removed from your products.` });
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const openEdit = (product: Product) => {
    setFormData({ name: product.name, description: product.description, price: product.price, category: product.category, stock: product.stock });
    setEditProduct(product);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="relative mb-6 overflow-hidden rounded-3xl bg-black p-6 text-white sm:p-10">
          <CourtBackdrop />
          <div className="pointer-events-none absolute -top-24 -right-16 h-80 w-80 rounded-full bg-court/25 blur-[100px]" aria-hidden="true" />
          <div className="relative">
            <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-court">
              <span className="h-px w-10 bg-court" />
              Merch
            </p>
            <h1 className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-[0.95] uppercase">Products</h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading products...</p>
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
              Merch
            </p>
            <h1 className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-[0.95] uppercase">Products</h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
              Manage products and merchandise for your users.
            </p>
          </div>
          <Basketball className="hidden h-auto w-24 shrink-0 animate-float sm:block lg:w-32" />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-[0.2em]">Total Products</CardDescription>
            <CardTitle className="font-display text-4xl">{products.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-2xl border-green-500/30 bg-green-500/5">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-[0.2em]">In Stock</CardDescription>
            <CardTitle className="font-display text-4xl text-green-600">{products.filter((p) => p.status === "In Stock").length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-[0.2em]">Total Value</CardDescription>
            <CardTitle className="font-display text-4xl">₱{products.reduce((sum, p) => sum + p.price * p.stock, 0).toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {filteredProducts.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm text-muted-foreground">{search ? "Try a different search term" : "Add your first product to get started"}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-court/40 transition-all duration-300">
              <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-court/90 via-[#c14f00] to-[#5a2200]">
                <span className="font-display text-6xl uppercase text-black/70 transition-transform duration-500 hover:scale-110">
                  {product.name.charAt(0)}
                </span>
                <div className="pointer-events-none absolute -bottom-2 -right-2">
                  <Basketball className="h-16 w-16 opacity-20" />
                </div>
              </div>
              <CardHeader className="pt-4">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base sm:text-lg">{product.name}</CardTitle>
                  <Badge variant={stockBadgeVariant(product.status)}>{product.status}</Badge>
                </div>
                <CardDescription className="line-clamp-2">{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-muted-foreground"><DollarSign className="h-3.5 w-3.5" />Price</div>
                    <span className="font-medium">₱{product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Stock</span>
                    <span className="font-medium">{product.stock} units</span>
                  </div>
                </div>
              </CardContent>
              {isAdmin ? (
                <CardFooter className="gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(product)}>
                    <Pencil className="mr-1 h-3.5 w-3.5" />Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive" onClick={() => setDeleteProduct(product)}>
                    <Trash2 className="mr-1 h-3.5 w-3.5" />Delete
                  </Button>
                </CardFooter>
              ) : (
                <CardFooter>
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={product.stock === 0}
                    onClick={() => {
                      addItem(product);
                      toast.success("Added to cart", { description: `"${product.name}" has been added to your cart.` });
                    }}
                  >
                    <ShoppingCart className="mr-1 h-3.5 w-3.5" />
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>Add a new product to sell to your users.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="add-name">Product Name</Label>
              <Input id="add-name" placeholder="e.g. Pro Basketball" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} className={errors.name ? "border-destructive" : ""} />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-description">Description</Label>
              <Textarea id="add-description" placeholder="Describe your product..." value={formData.description} onChange={(e) => handleChange("description", e.target.value)} className={errors.description ? "border-destructive" : ""} />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="add-price">Price (₱)</Label>
                <Input id="add-price" type="number" step="0.01" min="0.01" value={formData.price || ""} onChange={(e) => handleChange("price", e.target.value)} className={errors.price ? "border-destructive" : ""} />
                {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-stock">Stock</Label>
                <Input id="add-stock" type="number" min="0" value={formData.stock || ""} onChange={(e) => handleChange("stock", e.target.value)} className={errors.stock ? "border-destructive" : ""} />
                {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-category">Category</Label>
              <select id="add-category" value={formData.category} onChange={(e) => handleChange("category", e.target.value)} className={`flex h-8 w-full rounded-md border bg-background px-2.5 py-1 text-base md:text-sm ${errors.category ? "border-destructive" : "border-input"} focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none`}>
                <option value="">Select a category</option>
                {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose>
              <Button type="submit">Add Product</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editProduct !== null} onOpenChange={() => setEditProduct(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the details of your product.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Product Name</Label>
              <Input id="edit-name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} className={errors.name ? "border-destructive" : ""} />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea id="edit-description" value={formData.description} onChange={(e) => handleChange("description", e.target.value)} className={errors.description ? "border-destructive" : ""} />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price (₱)</Label>
                <Input id="edit-price" type="number" step="0.01" min="0.01" value={formData.price || ""} onChange={(e) => handleChange("price", e.target.value)} className={errors.price ? "border-destructive" : ""} />
                {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input id="edit-stock" type="number" min="0" value={formData.stock || ""} onChange={(e) => handleChange("stock", e.target.value)} className={errors.stock ? "border-destructive" : ""} />
                {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <select id="edit-category" value={formData.category} onChange={(e) => handleChange("category", e.target.value)} className={`flex h-8 w-full rounded-md border bg-background px-2.5 py-1 text-base md:text-sm ${errors.category ? "border-destructive" : "border-input"} focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none`}>
                <option value="">Select a category</option>
                {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteProduct !== null} onOpenChange={() => setDeleteProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>Are you sure you want to delete &quot;{deleteProduct?.name}&quot;? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
