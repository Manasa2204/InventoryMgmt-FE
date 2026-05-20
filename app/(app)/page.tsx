"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, TrendingDown, AlertTriangle, Boxes } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDashboard } from "@/services/dashboardService";
import { toast } from "sonner";

interface DashboardData {
  totalProducts: number;
  totalQuantity: number;
  lowStockCount: number;
  lowStockItems: {
    id: string;
    name: string;
    sku: string;
    quantityOnHand: number;
    lowStockThreshold: number;
  }[];
}

export default function DashboardPage() {
  const { organization } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardDetails();
  }, []);

  async function getDashboardDetails() {
    try {
      const res = await getDashboard();
      if (res.success) setData(res.result);
      else toast.error(res.message || "Fetching details failed");
    } catch (error) {
      toast.error(error.message || "Fetching details failed");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          {organization?.name} — Inventory Overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Products</p>
              <p className="text-3xl font-bold text-slate-900">
                {data?.totalProducts ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Boxes className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Units</p>
              <p className="text-3xl font-bold text-slate-900">
                {data?.totalQuantity ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={data?.lowStockCount ? "border-red-200 bg-red-50" : ""}>
          <CardContent className="flex items-center gap-4 p-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${data?.lowStockCount ? "bg-red-100" : "bg-slate-100"}`}
            >
              <AlertTriangle
                className={`w-6 h-6 ${data?.lowStockCount ? "text-red-600" : "text-slate-400"}`}
              />
            </div>
            <div>
              <p className="text-sm text-slate-500">Low Stock Items</p>
              <p
                className={`text-3xl font-bold ${data?.lowStockCount ? "text-red-600" : "text-slate-900"}`}
              >
                {data?.lowStockCount ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <CardTitle className="text-base">Low Stock Items</CardTitle>
          </div>
          <Link href="/products">
            <Button variant="outline" size="sm">
              View All Products
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {!data?.lowStockItems?.length ? (
            <div className="text-center py-8 text-slate-400">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">
                No low stock items — you&apos;re well stocked!
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Qty on Hand</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.lowStockItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/products/${item.id}/edit`}
                        className="hover:text-indigo-600"
                      >
                        {item.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-slate-500 font-mono text-xs">
                      {item.sku}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          item.quantityOnHand === 0
                            ? "text-red-600 font-bold"
                            : "text-amber-600 font-semibold"
                        }
                      >
                        {item.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {item.lowStockThreshold}
                    </TableCell>
                    <TableCell>
                      {item.quantityOnHand === 0 ? (
                        <Badge variant="destructive">Out of Stock</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                          Low Stock
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
