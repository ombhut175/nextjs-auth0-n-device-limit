"use client";

import Link from 'next/link';
import LoginButton from '@/components/auth/LoginButton';
import { PageRoutes } from '@/app/helpers/string_const';
import { Lock, Shield, Zap, ArrowRight, Globe } from 'lucide-react';

export default function PublicPageContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 flex items-center justify-center py-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <div className="relative w-full max-w-full">
        <div className="text-center space-y-6 sm:space-y-8 mb-8 sm:mb-12 animate-[fadeInScale_0.8s_ease-out_forwards]">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500/10 text-blue-400 text-xs sm:text-sm font-medium rounded-full border border-blue-500/20 backdrop-blur-sm">
            <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Public Access Available</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent leading-tight px-4">
            Welcome to NGuard
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-slate-400 max-w-5xl mx-auto px-4">
            Secure authentication and authorization platform with modern security features
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-8 sm:mb-12 max-w-7xl mx-auto">
          {[
            { icon: Shield, title: "Secure", desc: "Enterprise-grade security" },
            { icon: Zap, title: "Fast", desc: "Lightning-fast authentication" },
            { icon: Lock, title: "Private", desc: "Your data stays protected" }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-slate-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 lg:p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1"
              style={{ animationDelay: `${0.2 * (idx + 1)}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative space-y-2 sm:space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-200">{feature.title}</h3>
                <p className="text-sm sm:text-base md:text-lg text-slate-400">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 2xl:p-16 border border-slate-700/50 shadow-2xl space-y-6 sm:space-y-8 max-w-6xl mx-auto">
          <div className="text-center space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-100">
              Ready to get started?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-slate-400 max-w-3xl mx-auto px-4">
              Sign in to access your protected dashboard and exclusive content
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <LoginButton />
            
            <Link
              href={PageRoutes.PRIVATE}
              className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-slate-300 bg-slate-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:bg-slate-600/50 hover:text-white hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-slate-500/50 border border-slate-600/50 w-full sm:w-auto"
              aria-label="Go to private page"
            >
              <span className="relative font-bold tracking-wide">Explore Private Area</span>
              <ArrowRight className="relative w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="text-center pt-2 sm:pt-4">
            <p className="text-xs sm:text-sm text-slate-500 px-4">
              This page is accessible to everyone. Sign in to unlock protected features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
