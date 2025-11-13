"use client";

import LogoutButton from '@/components/auth/LogoutButton';
import Profile from '@/components/auth/Profile';
import { Shield, Lock, Star, Activity, CheckCircle2, Monitor } from 'lucide-react';
import Link from 'next/link';
import { PageRoutes } from '@/helpers/string_const';

interface PrivatePageContentProps {
  user: {
    name?: string;
    email?: string;
    picture?: string;
  };
}

export default function PrivatePageContent({ user }: PrivatePageContentProps) {
  const stats = [
    { icon: Shield, label: "Security", value: "Active", color: "bg-[#6B7F5C] dark:bg-[#B4CCA5]" },
    { icon: Activity, label: "Sessions", value: "1 Active", color: "bg-[#7A5D42] dark:bg-[#D4BFA8]" },
    { icon: Star, label: "Status", value: "Premium", color: "bg-[#9C8B7A] dark:bg-[#B8A896]" }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFA] dark:bg-[#1C1917] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background grid - subtle pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#D4CEC4_1px,transparent_1px),linear-gradient(to_bottom,#D4CEC4_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4A4540_1px,transparent_1px),linear-gradient(to_bottom,#4A4540_1px,transparent_1px)] bg-[size:24px_24px]"
        style={{ opacity: 0.03 }}
      />
      
      <div className="relative w-full max-w-[1600px] 2xl:max-w-[1800px] space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div className="bg-white/90 dark:bg-[#2B2724]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 border border-[#E8E3DA] dark:border-[#4A4540] shadow-[0_4px_8px_rgba(31,27,23,0.08),0_2px_4px_rgba(31,27,23,0.06)] dark:shadow-[0_4px_8px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#EDF2E9] dark:bg-[#3F5233] text-[#1F2B18] dark:text-[#D0E5C0] text-sm sm:text-base font-medium rounded-full border border-[#6B7F5C] dark:border-[#B4CCA5] backdrop-blur-sm mb-2">
                <Lock className="w-4 h-4" />
                <span>Protected Area</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#1F1B17] dark:text-[#EDE5DB]">
                Welcome back, {user.name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#5C5248] dark:text-[#CFC7BD]">
                You're in a secure, authenticated space
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#EDF2E9] dark:bg-[#3F5233] text-[#1F2B18] dark:text-[#D0E5C0] rounded-xl border border-[#6B7F5C] dark:border-[#B4CCA5]">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Authenticated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group bg-white/80 dark:bg-[#2B2724]/80 backdrop-blur-xl rounded-2xl p-5 sm:p-6 lg:p-8 border border-[#E8E3DA] dark:border-[#4A4540] hover:border-[#7A5D42] dark:hover:border-[#D4BFA8] transition-all duration-200 hover:shadow-lg hover:shadow-[rgba(31,27,23,0.1)] dark:hover:shadow-[rgba(0,0,0,0.3)] hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white dark:text-[#2D1F10]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm lg:text-base text-[#5C5248] dark:text-[#CFC7BD]">{stat.label}</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1F1B17] dark:text-[#EDE5DB]">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Profile and Actions Grid */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Profile Section */}
          <div className="space-y-6">
            <div className="bg-white/90 dark:bg-[#2B2724]/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#E8E3DA] dark:border-[#4A4540] shadow-[0_4px_8px_rgba(31,27,23,0.08),0_2px_4px_rgba(31,27,23,0.06)] dark:shadow-[0_4px_8px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.2)]">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1F1B17] dark:text-[#EDE5DB] mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7A5D42] dark:text-[#D4BFA8]" />
                Your Profile
              </h2>
              <Profile user={user} />
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="space-y-6">
            <div className="bg-white/90 dark:bg-[#2B2724]/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#E8E3DA] dark:border-[#4A4540] shadow-[0_4px_8px_rgba(31,27,23,0.08),0_2px_4px_rgba(31,27,23,0.06)] dark:shadow-[0_4px_8px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.2)] space-y-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1F1B17] dark:text-[#EDE5DB] flex items-center gap-2">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#7A5D42] dark:text-[#D4BFA8]" />
                Quick Actions
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-[#F7F5F2] dark:bg-[#3D3935] rounded-xl border border-[#E8E3DA] dark:border-[#4A4540] hover:border-[#D4CEC4] dark:hover:border-[#8F8A80] transition-all duration-200 hover:shadow-md">
                  <h3 className="font-semibold text-[#1F1B17] dark:text-[#EDE5DB] mb-2">Exclusive Content</h3>
                  <p className="text-sm text-[#5C5248] dark:text-[#CFC7BD]">
                    This dashboard and content are only visible to authenticated users. Your session is secure and protected.
                  </p>
                </div>

                <div className="p-4 bg-[#F5EFE7] dark:bg-[#5C4A38] rounded-xl border border-[#D4CEC4] dark:border-[#8F8A80]">
                  <h3 className="font-semibold text-[#2D1F10] dark:text-[#EDE5DB] mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Premium Features
                  </h3>
                  <p className="text-sm text-[#5C5248] dark:text-[#CFC7BD]">
                    Access advanced security settings, detailed analytics, and personalized recommendations.
                  </p>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Link
                  href={PageRoutes.SESSIONS}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-br from-[#7A5D42] to-[#5C4A38] dark:from-[#D4BFA8] dark:to-[#C9B299] text-white dark:text-[#2D1F10] hover:from-[#5C4A38] hover:to-[#7A5D42] dark:hover:from-[#C9B299] dark:hover:to-[#D4BFA8] rounded-xl font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#7A5D42] dark:focus:ring-[#D4BFA8] focus:ring-offset-2"
                >
                  <Monitor className="w-5 h-5" />
                  Manage Sessions
                </Link>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
