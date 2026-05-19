"use client";

import { useAuth } from "@/context/AuthContext";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  Building2,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname();
  const { user, organization, logout } = useAuth();

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Logo / Org */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg">StockSense</span>
        </div>
        <div className="flex items-center gap-1.5 mt-3 text-slate-400 text-sm">
          <Building2 className="w-3.5 h-3.5" />
          <span className="truncate">{organization?.name}</span>
        </div>
      </div>

      <Separator className="bg-slate-700" />

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNav}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === href || pathname.startsWith(href + "/")
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800",
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      <button
        onClick={logout}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>

      <Separator className="bg-slate-700" />

      {/* User */}
      <div className="p-4">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.name || user?.email}
            </p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
