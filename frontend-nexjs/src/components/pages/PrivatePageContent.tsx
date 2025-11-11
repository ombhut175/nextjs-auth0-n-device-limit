"use client";

import LogoutButton from '@/components/auth/LogoutButton';
import Profile from '@/components/auth/Profile';
import { Shield, Lock, Star, Activity, CheckCircle2 } from 'lucide-react';

interface PrivatePageContentProps {
  user: {
    name?: string;
    email?: string;
    picture?: string;
  };
}

export default function PrivatePageContent({ user }: PrivatePageContentProps) {
  const stats = [
    { icon: Shield, label: "Security", value: "Active", color: "from-green-500 to-emerald-500" },
    { icon: Activity, label: "Sessions", value: "1 Active", color: "from-blue-500 to-cyan-500" },
    { icon: Star, label: "Status", value: "Premium", color: "from-purple-500 to-pink-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <div className="relative w-full max-w-[1600px] 2xl:max-w-[1800px] space-y-6 sm:space-y-8">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 border border-slate-700/50 shadow-2xl animate-[fadeInScale_0.8s_ease-out_forwards]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 text-sm sm:text-base font-medium rounded-full border border-green-500/20 backdrop-blur-sm mb-2">
                <Lock className="w-4 h-4" />
                <span>Protected Area</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Welcome back, {user.name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-400">
                You're in a secure, authenticated space
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-xl border border-green-500/20">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Authenticated</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 sm:p-6 lg:p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1"
              style={{ animationDelay: `${0.1 * (idx + 1)}s` }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-400">{stat.label}</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-200">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-700/50 shadow-xl">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-purple-400" />
                Your Profile
              </h2>
              <Profile user={user} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-700/50 shadow-xl space-y-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100 flex items-center gap-2">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-400" />
                Quick Actions
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 hover:shadow-lg">
                  <h3 className="font-semibold text-slate-200 mb-2">Exclusive Content</h3>
                  <p className="text-sm text-slate-400">
                    This dashboard and content are only visible to authenticated users. Your session is secure and protected.
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
                  <h3 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Premium Features
                  </h3>
                  <p className="text-sm text-slate-400">
                    Access advanced security settings, detailed analytics, and personalized recommendations.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
