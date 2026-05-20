interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string | null;
  quantity: number;
  costPrice?: string | null;
  sellingPrice?: string | null;
  lowStockThreshold?: number | null;
  effectiveThreshold?: number;
  isLowStock?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductFormData {
  name: string;
  sku: string;
  description: string;
  quantity: string;
  costPrice: string;
  sellingPrice: string;
  lowStockThreshold: string;
}
