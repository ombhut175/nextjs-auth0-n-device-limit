"use client";

import Link from 'next/link';
import LoginButton from '@/components/auth/LoginButton';
import { PageRoutes } from '@/helpers/string_const';
import { Lock, Shield, Zap, ArrowRight } from 'lucide-react';

export default function PublicPageContent() {
  return (
    <>
      {/* Hero Section */}
      <section 
        aria-label="NGuard hero" 
        className="min-h-screen bg-[#FDFCFA] dark:bg-[#1C1917] flex items-center justify-center py-24 px-6 relative overflow-hidden"
      >
        {/* Background grid - 0% opacity under text column (left 55%), 3% elsewhere */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#D4CEC4_1px,transparent_1px),linear-gradient(to_bottom,#D4CEC4_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4A4540_1px,transparent_1px),linear-gradient(to_bottom,#4A4540_1px,transparent_1px)] bg-[size:24px_24px]"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, transparent 55%, rgba(0,0,0,0.03) 55%, rgba(0,0,0,0.03) 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 55%, rgba(0,0,0,0.03) 55%, rgba(0,0,0,0.03) 100%)'
          }}
        />
        
        <div className="relative w-full max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 items-center">
            {/* Text Column - 55% */}
            <div className="text-center lg:text-left space-y-4">
              <h1 className="text-[2.75rem] leading-[1.15] font-bold tracking-[-0.02em] text-[#1F1B17] dark:text-[#EDE5DB] max-w-[560px] mx-auto lg:mx-0">
                Auth0 integration in under 10 minutes
              </h1>
              
              <p className="text-[1.25rem] leading-[1.6] font-normal text-[#5C5248] dark:text-[#CFC7BD] max-w-[520px] mx-auto lg:mx-0">
                Secure authentication and authorization platform with modern security features
              </p>
              
              {/* CTA Row - 24px below subhead */}
              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 sm:gap-8 pt-6">
                <LoginButton />
                
                <Link
                  href={PageRoutes.PRIVATE}
                  className="group relative inline-flex items-center justify-center gap-2 min-h-[44px] px-2 text-base font-medium text-[#7A5D42] dark:text-[#D4BFA8] hover:text-[#2D1F10] dark:hover:text-[#EDE5DB] hover:underline transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4CEC4] dark:focus-visible:ring-[#8F8A80] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFCFA] dark:focus-visible:ring-offset-[#1C1917] rounded-[6px]"
                  aria-label="Explore private area"
                >
                  <span>Explore Private Area</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
              
              {/* Trust Row */}
              <div className="pt-10 text-center lg:text-left">
                <p className="text-[0.875rem] leading-[1.5] font-medium tracking-[0.01em] text-[#5C5248] dark:text-[#CFC7BD]">
                  Trusted by 500+ teams
                </p>
              </div>
            </div>
            
            {/* Visual Column - 45% */}
            <div className="flex items-center justify-center lg:justify-end mt-12 lg:mt-0">
              <div className="w-full max-w-[640px] aspect-[4/3] bg-white/80 dark:bg-[#3D3935]/80 backdrop-blur-xl rounded-2xl border border-[#E8E3DA] dark:border-[#4A4540] shadow-[0_1px_3px_rgba(31,27,23,0.08),0_1px_2px_rgba(31,27,23,0.06)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2)] p-8 flex flex-col items-center justify-center space-y-6">
                <div className="w-full max-w-[400px] space-y-4">
                  {/* Mock Dashboard Header */}
                  <div className="flex items-center gap-3 pb-4 border-b border-[#E8E3DA] dark:border-[#4A4540]">
                    <div className="w-12 h-12 rounded-full bg-[#7A5D42] dark:bg-[#D4BFA8] flex items-center justify-center">
                      <svg className="w-6 h-6 text-white dark:text-[#2D1F10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-[#E8E3DA] dark:bg-[#4A4540] rounded mb-2"></div>
                      <div className="h-3 w-48 bg-[#F2F0ED] dark:bg-[#3D3935] rounded"></div>
                    </div>
                  </div>
                  
                  {/* Mock Badges */}
                  <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F5EFE7] dark:bg-[#5C4A38] text-[#2D1F10] dark:text-[#EDE5DB] text-sm font-medium rounded-full border border-[#D4CEC4] dark:border-[#8F8A80]">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#EDF2E9] dark:bg-[#3F5233] text-[#1F2B18] dark:text-[#D0E5C0] text-sm font-medium rounded-full border border-[#6B7F5C] dark:border-[#B4CCA5]">
                      Active
                    </span>
                  </div>
                  
                  {/* Mock Protected Routes */}
                  <div className="space-y-2 pt-4">
                    <div className="flex items-center gap-2 p-3 bg-[#F7F5F2] dark:bg-[#2B2724] rounded-[10px]">
                      <svg className="w-4 h-4 text-[#7A5D42] dark:text-[#D4BFA8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <div className="h-3 w-40 bg-[#E8E3DA] dark:bg-[#4A4540] rounded"></div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-[#F7F5F2] dark:bg-[#2B2724] rounded-[10px]">
                      <svg className="w-4 h-4 text-[#7A5D42] dark:text-[#D4BFA8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div className="h-3 w-36 bg-[#E8E3DA] dark:bg-[#4A4540] rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Below the fold */}
      <section 
        aria-label="Features" 
        className="bg-[#F7F5F2] dark:bg-[#141210] py-24 px-6"
      >
        <div className="w-full max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Secure", desc: "Enterprise-grade security" },
              { icon: Zap, title: "Fast", desc: "Lightning-fast authentication" },
              { icon: Lock, title: "Private", desc: "Your data stays protected" }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-white/80 dark:bg-[#2B2724]/80 backdrop-blur-xl rounded-2xl p-8 border border-[#E8E3DA] dark:border-[#4A4540] hover:border-[#7A5D42] dark:hover:border-[#D4BFA8] transition-all duration-200 hover:shadow-lg hover:shadow-[rgba(31,27,23,0.1)] dark:hover:shadow-[rgba(0,0,0,0.3)] hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#F5EFE7]/30 to-[#F7F3EE]/30 dark:from-[#5C4A38]/20 dark:to-[#3D3935]/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="relative space-y-3">
                  <div className="w-14 h-14 bg-[#7A5D42] dark:bg-[#D4BFA8] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <feature.icon className="w-7 h-7 text-white dark:text-[#2D1F10]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1F1B17] dark:text-[#EDE5DB]">{feature.title}</h3>
                  <p className="text-base text-[#5C5248] dark:text-[#CFC7BD]">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
