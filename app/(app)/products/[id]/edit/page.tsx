"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import ProductForm from "@/components/layout/ProductForm";
import { getProduct } from "@/services/productService";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getProductDetails();
    }
  }, []);

  async function getProductDetails() {
    try {
      setLoading(true);

      const res = await getProduct(id);

      if (res.success) {
        setProduct(res.result);
      } else {
        toast.error(res.message || "Product fetching failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Product fetching failed");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product)
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-sm">No products found.</p>
        <Link href="/products/create">
          <Button variant="link" className="text-indigo-600 mt-2">
            Add new product →
          </Button>
        </Link>
      </div>
    );

  return <ProductForm id={id} initialData={product} mode="edit" />;
}
