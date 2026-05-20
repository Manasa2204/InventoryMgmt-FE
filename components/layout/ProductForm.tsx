"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { createProduct } from "@/services/productService";
import { toast } from "sonner";

interface Props {
  initialData?: Product;
  id?: string;
  mode: "edit" | "view" | "create";
}

export default function ProductForm({ initialData, id, mode }: Props) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<ProductFormData>({
    name: "",
    sku: "",
    description: "",
    quantity: "0",
    costPrice: "",
    sellingPrice: "",
    lowStockThreshold: "",
  });

  useEffect(() => {
    setForm({
      name: initialData?.name ?? "",
      sku: initialData?.sku ?? "",
      description: initialData?.description ?? "",
      quantity: String(initialData?.quantity ?? "0"),
      costPrice: initialData?.costPrice ? String(initialData.costPrice) : "",
      sellingPrice: initialData?.sellingPrice
        ? String(initialData.sellingPrice)
        : "",
      lowStockThreshold: initialData?.lowStockThreshold
        ? String(initialData.lowStockThreshold)
        : "",
    });
  }, [id]);

  function handleChange(field: keyof ProductFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        name: form.name,
        sku: form.sku,
        description: form.description || null,
        quantity: parseInt(form.quantity) || 0,
        costPrice: form.costPrice ? parseFloat(form.costPrice) : null,
        sellingPrice: form.sellingPrice ? parseFloat(form.sellingPrice) : null,
        lowStockThreshold: form.lowStockThreshold
          ? parseInt(form.lowStockThreshold)
          : null,
      };

      const res = await createProduct({
        ...payload,
        id: initialData?.id,
      });

      if (res.success) {
        toast(!id ? "Product created!" : "Product updated!");
        router.push("/products");
      } else {
        setError(res?.message || "Product creation failed");
      }
    } catch (error) {
      setError(error?.message || "Product creation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/products")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        {mode != "view" ? (
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {!id ? "Add Product" : "Edit Product"}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {!id
                ? "Add a new product to your inventory"
                : `Editing: ${initialData?.name}`}
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Product Details
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">{initialData?.name}</p>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label htmlFor="name" className="text-sm">
                  Product Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Widget Pro"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  disabled={mode == "view"}
                />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label className="text-sm" htmlFor="sku">
                  SKU *
                </Label>
                <Input
                  id="sku"
                  placeholder="WGT-001"
                  value={form.sku}
                  onChange={(e) =>
                    handleChange("sku", e.target.value.toUpperCase())
                  }
                  required
                  disabled={mode == "view"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm" htmlFor="description">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Optional product description..."
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                disabled={mode == "view"}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm" htmlFor="qty">
                  Quantity on Hand *
                </Label>
                <Input
                  id="qty"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                  required
                  disabled={mode == "view"}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm" htmlFor="cost">
                  Cost Price (₹)
                </Label>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.costPrice}
                  onChange={(e) => handleChange("costPrice", e.target.value)}
                  disabled={mode == "view"}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm" htmlFor="sell">
                  Selling Price (₹)
                </Label>
                <Input
                  id="sell"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.sellingPrice}
                  onChange={(e) => handleChange("sellingPrice", e.target.value)}
                  disabled={mode == "view"}
                />
              </div>
            </div>

            <div className="space-y-2 max-w-xs">
              <Label className="text-sm" htmlFor="threshold">
                Low Stock Threshold
                <span className="text-slate-400 font-normal text-xs ml-1">
                  (leave empty to use org default)
                </span>
              </Label>
              <Input
                id="threshold"
                type="number"
                min="0"
                placeholder="e.g. 5"
                value={form.lowStockThreshold}
                onChange={(e) =>
                  handleChange("lowStockThreshold", e.target.value)
                }
                disabled={mode == "view"}
              />
            </div>

            {mode != "view" && (
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : !id
                      ? "Create Product"
                      : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/products")}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
