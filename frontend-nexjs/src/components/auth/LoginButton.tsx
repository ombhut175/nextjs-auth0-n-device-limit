"use client";

import { PageRoutes } from "@/app/helpers/string_const";
import { LogIn } from "lucide-react";

export default function LoginButton() {
  return (
    <a
      href={`${PageRoutes.LOGIN}?returnTo=${PageRoutes.PRIVATE}`}
      className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
      aria-label="Log in to your account"
    >
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <LogIn className="relative w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
      <span className="relative font-bold tracking-wide">Log In</span>
    </a>
  );
}
