"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { adjustProduct } from "@/services/productService";

interface Props {
  product: Product;
  open: boolean;
  onClose: () => void;
  onAdjusted: () => void;
}

export function StockAdjustDialog({
  product,
  open,
  onClose,
  onAdjusted,
}: Props) {
  const [adjustment, setAdjustment] = useState("");
  const [loading, setLoading] = useState(false);

  const adj = parseInt(adjustment) || 0;
  const newQty = product.quantity + adj;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!adjustment || adj == 0) return;

    try {
      setLoading(true);
      const res = await adjustProduct(product.id, {
        adjustment: adj,
      });

      if (res.success) {
        toast.success(`Stock adjusted to ${res.result.quantity} units`);
        onAdjusted();
        onClose();
      } else {
        toast.error(res?.message || "Product updation failed");
      }
    } catch (error) {
      toast.error(error?.message || "Product updation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg py-8 px-4">
        <DialogHeader>
          <DialogTitle>Adjust Stock — {product.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="">
          <div className="flex items-center gap-2 pb-3 rounded-lg text-sm">
            <span className="text-sm">Current Qty:</span>
            <span className="font-bold">{product.quantity}</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="adj" className="text-sm">
              Adjustment (e.g. +10 or -5)
            </Label>
            <Input
              id="adj"
              type="number"
              placeholder="+10 or -5"
              value={adjustment}
              onChange={(e) => setAdjustment(e.target.value)}
              required
            />
            {adjustment && (
              <p
                className={`text-sm ${newQty < 0 ? "text-red-500" : "text-slate-500"}`}
              >
                New quantity: <strong>{newQty}</strong>
                {newQty < 0 && " (cannot be negative)"}
              </p>
            )}
          </div>

          <DialogFooter className="flex flex-row  justify-end">
            <Button
              className="min-w-[130] py-5 text-base"
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 min-w-[130] py-5 text-base"
              disabled={loading || newQty < 0 || adj === 0}
            >
              {loading ? "Saving..." : "Apply"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
