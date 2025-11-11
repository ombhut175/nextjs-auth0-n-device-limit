"use client";

import { PageRoutes } from "@/app/helpers/string_const";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <a
      href={PageRoutes.LOGOUT}
      className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-500/50"
      aria-label="Log out from your account"
    >
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <LogOut className="relative w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
      <span className="relative font-bold tracking-wide">Log Out</span>
    </a>
  );
}
