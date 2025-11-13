"use client";

import { Monitor, Smartphone, Tablet, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PageRoutes } from '@/helpers/string_const';
import type { UserSession } from '@/db/schema/userSessions';
import { useEffect, useState } from 'react';

interface DeviceLimitExceededProps {
  sessions: UserSession[];
  maxDevices: number;
  currentDeviceId: string;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
}

export default function DeviceLimitExceeded({ sessions, maxDevices, currentDeviceId }: DeviceLimitExceededProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getDeviceIcon = (deviceType: string | null) => {
    switch (deviceType) {
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FDFCFA] dark:bg-[#1C1917] flex items-center justify-center">
        <div className="text-[#5C5248] dark:text-[#CFC7BD]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA] dark:bg-[#1C1917] py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#D4CEC4_1px,transparent_1px),linear-gradient(to_bottom,#D4CEC4_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4A4540_1px,transparent_1px),linear-gradient(to_bottom,#4A4540_1px,transparent_1px)] bg-[size:24px_24px]"
        style={{ opacity: 0.03 }}
      />
      
      <div className="relative w-full max-w-[800px] mx-auto space-y-6">
        {/* Warning Card */}
        <div className="bg-gradient-to-br from-[#FDECEA] to-[#FBD5D1] dark:from-[#8C1D18] dark:to-[#5C1310] backdrop-blur-xl rounded-3xl border-2 border-[#BA3B2E] dark:border-[#F2B8B5] shadow-[0_8px_16px_rgba(186,59,46,0.2),0_2px_4px_rgba(186,59,46,0.1)] overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#BA3B2E] dark:bg-[#F2B8B5] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-white dark:text-[#BA3B2E]" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#BA3B2E] dark:text-[#F2B8B5] mb-2">
                  Device Limit Reached
                </h1>
                <p className="text-base sm:text-lg text-[#8C1D18] dark:text-[#FBD5D1] leading-relaxed">
                  You have reached the maximum limit of <span className="font-bold">{maxDevices} active devices</span>. 
                  To continue using this device, please log out from one of your existing sessions.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <Link
              href={PageRoutes.SESSIONS}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 bg-[#BA3B2E] dark:bg-[#F2B8B5] text-white dark:text-[#BA3B2E] hover:bg-[#9C2F24] dark:hover:bg-[#F5CCC9] rounded-xl font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#BA3B2E] dark:focus:ring-[#F2B8B5] focus:ring-offset-2"
            >
              Manage Your Sessions
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Active Sessions List */}
        <div className="bg-white/95 dark:bg-[#2B2724]/95 backdrop-blur-xl rounded-3xl border border-[#E8E3DA] dark:border-[#4A4540] shadow-[0_8px_16px_rgba(31,27,23,0.1),0_2px_4px_rgba(31,27,23,0.06)] dark:shadow-[0_8px_16px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.2)] overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F1B17] dark:text-[#EDE5DB] mb-4">
              Your Active Sessions ({sessions.length} / {maxDevices})
            </h2>
            <p className="text-sm sm:text-base text-[#5C5248] dark:text-[#CFC7BD] mb-6">
              These are your currently active devices. You need to revoke at least one session to continue.
            </p>

            <div className="space-y-3">
              {sessions.map((session) => {
                const DeviceIcon = getDeviceIcon(session.deviceType);
                const isCurrent = session.deviceId === currentDeviceId;

                return (
                  <div
                    key={session.id}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      isCurrent
                        ? 'bg-[#EDF2E9] dark:bg-[#3F5233] border-[#6B7F5C] dark:border-[#B4CCA5]'
                        : 'bg-[#F7F5F2] dark:bg-[#3D3935] border-[#E8E3DA] dark:border-[#4A4540]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isCurrent
                          ? 'bg-[#6B7F5C] dark:bg-[#B4CCA5]'
                          : 'bg-[#7A5D42] dark:bg-[#D4BFA8]'
                      }`}>
                        <DeviceIcon className={`w-6 h-6 ${
                          isCurrent
                            ? 'text-white dark:text-[#1F2B18]'
                            : 'text-white dark:text-[#2D1F10]'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-[#1F1B17] dark:text-[#EDE5DB] truncate">
                            {session.browserName || 'Unknown'} on {session.osName || 'Unknown'}
                          </h3>
                          {isCurrent && (
                            <span className="px-2 py-0.5 bg-[#6B7F5C] dark:bg-[#B4CCA5] text-white dark:text-[#1F2B18] text-xs font-bold rounded whitespace-nowrap">
                              This Device
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#9C8B7A] dark:text-[#8F8A80]">
                          Last active: {formatTimeAgo(new Date(session.lastSeen))}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-[#F5EFE7] dark:bg-[#5C4A38] rounded-2xl p-6 border border-[#D4CEC4] dark:border-[#8F8A80]">
          <div className="flex items-start gap-3">
            <Monitor className="w-5 h-5 text-[#7A5D42] dark:text-[#D4BFA8] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-[#2D1F10] dark:text-[#EDE5DB] mb-1">
                What happens next?
              </h3>
              <p className="text-sm text-[#5C5248] dark:text-[#CFC7BD]">
                Click "Manage Your Sessions" to view all your active devices. Select one to log out from, 
                and you'll be able to continue using this device. Sessions automatically expire after 7 days of inactivity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
