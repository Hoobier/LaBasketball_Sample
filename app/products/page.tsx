"use client";

import { useState } from "react";
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
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  DollarSign,
  Search,
} from "lucide-react";

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

const categories = [
  "Basketball",
  "Apparel",
  "Footwear",
  "Accessories",
  "Equipment",
];

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Pro Basketball",
    description: "Official size and weight basketball for competitive play.",
    price: 29.99,
    category: "Basketball",
    stock: 45,
    status: "In Stock",
  },
  {
    id: 2,
    name: "Team Jersey",
    description: "Moisture-wicking jersey with custom team logo.",
    price: 49.99,
    category: "Apparel",
    stock: 120,
    status: "In Stock",
  },
  {
    id: 3,
    name: "Court Shoes",
    description: "High-performance basketball shoes with ankle support.",
    price: 89.99,
    category: "Footwear",
    stock: 3,
    status: "Low Stock",
  },
  {
    id: 4,
    name: "Sports Bag",
    description: "Durable bag for carrying basketball gear.",
    price: 34.99,
    category: "Accessories",
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: 5,
    name: "Training Cones",
    description: "Set of 12 agility cones for drills and training.",
    price: 14.99,
    category: "Equipment",
    stock: 67,
    status: "In Stock",
  },
  {
    id: 6,
    name: "Headband",
    description: "Absorbent headband to keep sweat out of your eyes.",
    price: 9.99,
    category: "Accessories",
    stock: 2,
    status: "Low Stock",
  },
];

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
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormData, string>>
  >({});
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
  });

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
    });
    setErrors({});
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = productSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ProductFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ProductFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    const newProduct: Product = {
      id: Date.now(),
      ...result.data,
      status: getStockStatus(result.data.stock),
    };
    setProducts((prev) => [newProduct, ...prev]);
    setAddOpen(false);
    resetForm();
    toast.success("Product added", {
      description: `"${result.data.name}" has been added to your products.`,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    const result = productSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ProductFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ProductFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setProducts((prev) =>
      prev.map((p) =>
        p.id === editProduct.id
          ? { ...p, ...result.data, status: getStockStatus(result.data.stock) }
          : p
      )
    );
    setEditProduct(null);
    resetForm();
    toast.success("Product updated", {
      description: `"${result.data.name}" has been updated.`,
    });
  };

  const handleDelete = () => {
    if (!deleteProduct) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
    const name = deleteProduct.name;
    setDeleteProduct(null);
    toast.success("Product deleted", {
      description: `"${name}" has been removed from your products.`,
    });
  };

  const openEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
    setEditProduct(product);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Products
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage products and merchandise for your users
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() => {
            resetForm();
            setAddOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Products</CardDescription>
            <CardTitle className="text-2xl">{products.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Stock</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {products.filter((p) => p.status === "In Stock").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Value</CardDescription>
            <CardTitle className="text-2xl">
              ₱{products.reduce((sum, p) => sum + p.price * p.stock, 0).toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm text-muted-foreground">
              {search
                ? "Try a different search term"
                : "Add your first product to get started"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base sm:text-lg">
                    {product.name}
                  </CardTitle>
                  <Badge variant={stockBadgeVariant(product.status)}>
                    {product.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-3.5 w-3.5" />
                      Price
                    </div>
                    <span className="font-medium">
                      ₱{product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Stock</span>
                    <span className="font-medium">{product.stock} units</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEdit(product)}
                >
                  <Pencil className="mr-1 h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-destructive hover:text-destructive"
                  onClick={() => setDeleteProduct(product)}
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add Product Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Add a new product to sell to your users.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="add-name">Product Name</Label>
              <Input
                id="add-name"
                placeholder="e.g. Pro Basketball"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-description">Description</Label>
              <Textarea
                id="add-description"
                placeholder="Describe your product..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="add-price">Price (₱)</Label>
                <Input
                  id="add-price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.price || ""}
                  onChange={(e) => handleChange("price", e.target.value)}
                  className={errors.price ? "border-destructive" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-stock">Stock</Label>
                <Input
                  id="add-stock"
                  type="number"
                  min="0"
                  value={formData.stock || ""}
                  onChange={(e) => handleChange("stock", e.target.value)}
                  className={errors.stock ? "border-destructive" : ""}
                />
                {errors.stock && (
                  <p className="text-sm text-destructive">{errors.stock}</p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-category">Category</Label>
              <select
                id="add-category"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className={`flex h-8 w-full rounded-md border bg-transparent px-2.5 py-1 text-base md:text-sm ${
                  errors.category ? "border-destructive" : "border-input"
                } focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" type="button" />}>
                Cancel
              </DialogClose>
              <Button type="submit">Add Product</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={editProduct !== null} onOpenChange={() => setEditProduct(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details of your product.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g. Pro Basketball"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Describe your product..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price (₱)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.price || ""}
                  onChange={(e) => handleChange("price", e.target.value)}
                  className={errors.price ? "border-destructive" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  min="0"
                  value={formData.stock || ""}
                  onChange={(e) => handleChange("stock", e.target.value)}
                  className={errors.stock ? "border-destructive" : ""}
                />
                {errors.stock && (
                  <p className="text-sm text-destructive">{errors.stock}</p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <select
                id="edit-category"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className={`flex h-8 w-full rounded-md border bg-transparent px-2.5 py-1 text-base md:text-sm ${
                  errors.category ? "border-destructive" : "border-input"
                } focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" type="button" />}>
                Cancel
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteProduct !== null}
        onOpenChange={() => setDeleteProduct(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteProduct?.name}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
