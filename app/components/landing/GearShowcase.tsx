"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

const artStyles = [
  "from-court/90 to-[#5a2200]",
  "from-[#2a2a2a] to-black",
  "from-[#d9d9d9] to-[#a8a8a8]",
  "from-[#1b2a3a] to-black",
];

export default function GearShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        if (!cancelled) setProducts(Array.isArray(data.products) ? data.products : []);
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = products.slice(0, 4);

  return (
    <section id="gear" className="scroll-mt-16 bg-muted/40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-court">
              The Gear
            </p>
            <h2 className="font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.95] uppercase">
              Fresh drops
            </h2>
          </div>
          <Button
            variant="outline"
            render={<Link href="/products" />}
            className="rounded-full"
          >
            Shop all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border bg-card"
              >
                <div className="aspect-square bg-muted" />
                <div className="space-y-2 p-4">
                  <div className="h-3 w-16 rounded bg-muted" />
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-20 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : failed || featured.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
            <ShoppingBag className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="font-display text-2xl uppercase">
              The drop is loading up
            </p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {failed
                ? "We couldn't reach the store right now — check back in a minute."
                : "New gear lands soon. Be the first on the court with it."}
            </p>
            <Button render={<Link href="/products" />} className="mt-6 rounded-full">
              Visit the store
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product, index) => (
              <Link
                key={product.id}
                href="/products"
                className="group overflow-hidden rounded-2xl border bg-card transition-transform duration-300 hover:-translate-y-1"
              >
                <div
                  className={`flex aspect-square items-center justify-center bg-gradient-to-br ${artStyles[index % artStyles.length]}`}
                >
                  <span
                    className={`font-display text-7xl uppercase ${
                      index === 2 ? "text-black/70" : "text-white/80"
                    } transition-transform duration-500 group-hover:scale-110`}
                  >
                    {product.name.charAt(0)}
                  </span>
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="truncate">
                      {product.category}
                    </Badge>
                    {product.stock > 0 ? (
                      <span className="text-xs text-muted-foreground">In stock</span>
                    ) : (
                      <span className="text-xs text-destructive">Sold out</span>
                    )}
                  </div>
                  <h3 className="truncate font-semibold">{product.name}</h3>
                  <p className="mt-1 text-lg font-bold text-court">
                    ₱{product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && !failed && products.length > 4 && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {products.length} products in the store — showing the first 4.
          </p>
        )}
      </div>
    </section>
  );
}
