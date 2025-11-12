"use client";

import { PageRoutes } from "@/helpers/string_const";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <a
      href={PageRoutes.LOGOUT}
      className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white dark:text-[#601410] bg-[#BA3B2E] dark:bg-[#F2B8B5] rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-[rgba(186,59,46,0.3)] dark:hover:shadow-[rgba(242,184,181,0.3)] hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#BA3B2E]/50 dark:focus:ring-[#F2B8B5]/50"
      aria-label="Log out from your account"
    >
      <span className="absolute inset-0 w-full h-full bg-[#FDECEA] dark:bg-[#8C1D18] text-[#410E0B] dark:text-[#FFDAD6] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <LogOut className="relative w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
      <span className="relative font-bold tracking-wide">Log Out</span>
    </a>
  );
}
