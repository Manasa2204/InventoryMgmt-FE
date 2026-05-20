"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Settings } from "lucide-react";
import { toast } from "sonner";
import { getSettings, updateSettings } from "@/services/settingsService";

export default function SettingsPage() {
  const [threshold, setThreshold] = useState("5");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrgSettings();
  }, []);

  async function getOrgSettings() {
    try {
      const res = await getSettings();
      if (res.success)
        setThreshold(String(res.result.defaultLowStockThreshold));
      else setError("Fetching organization settings failed");
    } catch (error) {
      toast.error(error?.message || "Fetching organization settings failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();
      setSaving(true);
      setError("");

      const res = await updateSettings({
        defaultLowStockThreshold: parseInt(threshold),
      });

      if (res.success) {
        toast.success("Settings saved!");
      } else {
        setError(res.message);
      }
    } catch (error) {
      toast.error(error.message || "Error updating settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-slate-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Configure your inventory preferences
          </p>
        </div>
      </div>

      <Card className="py-6">
        <CardHeader>
          <CardTitle>Inventory Defaults</CardTitle>
          <CardDescription>
            <p className="text-xs text-black/65">
              These values apply organization-wide when products don&apos;t have
              individual overrides.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="threshold" className="text-xs">
                Default Low Stock Threshold
              </Label>
              <Input
                id="threshold"
                type="number"
                min="0"
                className="max-w-xs"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                required
              />
              <p className="text-xs text-black/55">
                Products with quantity ≤ this value are flagged as &quot;Low
                Stock&quot; on the dashboard. Individual products can override
                this value.
              </p>
            </div>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
