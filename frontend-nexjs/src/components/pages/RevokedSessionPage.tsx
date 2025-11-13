'use client';

import { AlertTriangle, Monitor, Smartphone, Tablet, XCircle, Clock, Info } from 'lucide-react';
import { PageRoutes } from '@/helpers/string_const';

interface RevokedSessionPageProps {
  revocationInfo: {
    revokedAt: string;
    revokedReason: string;
    revokedByDevice: {
      deviceId: string;
      browserName: string | null;
      osName: string | null;
      deviceType: string | null;
    };
  };
}

export default function RevokedSessionPage({ revocationInfo }: RevokedSessionPageProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getDeviceIcon = (deviceType: string | null) => {
    const iconClass = "w-7 h-7 sm:w-8 sm:h-8";
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <Smartphone className={iconClass} />;
      case 'tablet':
        return <Tablet className={iconClass} />;
      default:
        return <Monitor className={iconClass} />;
    }
  };

  const getDeviceDescription = () => {
    const { browserName, osName, deviceType } = revocationInfo.revokedByDevice;
    const parts = [];
    
    if (browserName) parts.push(browserName);
    if (osName) parts.push(`on ${osName}`);
    if (deviceType) parts.push(`(${deviceType.charAt(0).toUpperCase() + deviceType.slice(1)})`);
    
    return parts.length > 0 ? parts.join(' ') : 'Unknown Device';
  };

  return (
    <div className="min-h-screen bg-[#FDFCFA] dark:bg-[#1C1917] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#D4CEC4_1px,transparent_1px),linear-gradient(to_bottom,#D4CEC4_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4A4540_1px,transparent_1px),linear-gradient(to_bottom,#4A4540_1px,transparent_1px)] bg-[size:24px_24px]"
        style={{ opacity: 0.03 }}
      />
      
      <div className="relative w-full max-w-[700px] space-y-6">
        {/* Main Card with Animated Glow */}
        <div className="relative group">
          {/* Animated glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#BA3B2E] via-[#D4524A] to-[#BA3B2E] dark:from-[#F2B8B5] dark:via-[#F5CCC9] dark:to-[#F2B8B5] rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
          
          <div className="relative bg-gradient-to-br from-white/95 to-[#F7F5F2]/95 dark:from-[#2B2724]/95 dark:to-[#1C1917]/95 backdrop-blur-xl rounded-3xl border-2 border-[#BA3B2E] dark:border-[#F2B8B5] shadow-[0_8px_32px_rgba(186,59,46,0.3),0_2px_8px_rgba(186,59,46,0.2)] dark:shadow-[0_8px_32px_rgba(242,184,181,0.3),0_2px_8px_rgba(242,184,181,0.2)] overflow-hidden">
            {/* Decorative top bar */}
            <div className="h-2 bg-gradient-to-r from-[#BA3B2E] via-[#D4524A] to-[#BA3B2E] dark:from-[#F2B8B5] dark:via-[#F5CCC9] dark:to-[#F2B8B5]"></div>
            
            <div className="p-6 sm:p-8 lg:p-10">
              {/* Header Section */}
              <div className="text-center mb-8">
                {/* Icon with pulse animation */}
                <div className="relative inline-flex mb-6">
                  <div className="absolute inset-0 bg-[#BA3B2E] dark:bg-[#F2B8B5] rounded-2xl animate-ping opacity-20"></div>
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#BA3B2E] to-[#8C1D18] dark:from-[#F2B8B5] dark:to-[#F5CCC9] rounded-2xl flex items-center justify-center shadow-2xl">
                    <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white dark:text-[#BA3B2E]" />
                  </div>
                </div>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#BA3B2E]/10 dark:bg-[#F2B8B5]/10 rounded-full border border-[#BA3B2E]/20 dark:border-[#F2B8B5]/20 mb-4">
                  <div className="w-2 h-2 bg-[#BA3B2E] dark:bg-[#F2B8B5] rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-[#BA3B2E] dark:text-[#F2B8B5] uppercase tracking-wider">Session Revoked</span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#BA3B2E] dark:text-[#F2B8B5] mb-3 leading-tight">
                  Your Session Was Revoked
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base lg:text-lg text-[#8C1D18] dark:text-[#FBD5D1] leading-relaxed">
                  Your access was revoked by another device
                </p>
              </div>

              {/* Device Info Card */}
              <div className="bg-[#F7F5F2] dark:bg-[#3D3935] rounded-2xl p-5 sm:p-6 border border-[#E8E3DA] dark:border-[#4A4540] mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#7A5D42] to-[#5C4A38] dark:from-[#D4BFA8] dark:to-[#C9B299] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    {getDeviceIcon(revocationInfo.revokedByDevice.deviceType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-[#9C8B7A] dark:text-[#8F8A80] font-medium mb-1">Revoked by</p>
                    <p className="text-base sm:text-lg font-bold text-[#1F1B17] dark:text-[#EDE5DB] mb-4 break-words">
                      {getDeviceDescription()}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-[#7A5D42] dark:text-[#D4BFA8] flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#9C8B7A] dark:text-[#8F8A80]">When</p>
                          <p className="text-sm font-semibold text-[#1F1B17] dark:text-[#EDE5DB] break-words">{formatDate(revocationInfo.revokedAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-[#7A5D42] dark:text-[#D4BFA8] flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#9C8B7A] dark:text-[#8F8A80]">Reason</p>
                          <p className="text-sm font-semibold text-[#1F1B17] dark:text-[#EDE5DB] break-words">{revocationInfo.revokedReason}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Message */}
              <div className="flex items-start gap-3 p-4 bg-[#F5EFE7] dark:bg-[#5C4A38] rounded-xl border border-[#D4CEC4] dark:border-[#8F8A80] mb-6">
                <AlertTriangle className="w-5 h-5 text-[#7A5D42] dark:text-[#D4BFA8] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm text-[#2D1F10] dark:text-[#EDE5DB] mb-1">
                    Access Denied
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5248] dark:text-[#CFC7BD] leading-relaxed">
                    Your session has been revoked and you no longer have access to this device. Please logout and login again from another device to manage your sessions.
                  </p>
                </div>
              </div>

              {/* Action Button - Only Logout */}
              <div className="space-y-3">
                <a
                  href={PageRoutes.LOGOUT_WITH_CLEANUP}
                  className="block w-full text-center px-6 py-4 bg-gradient-to-r from-[#BA3B2E] to-[#8C1D18] dark:from-[#F2B8B5] dark:to-[#F5CCC9] text-white dark:text-[#BA3B2E] hover:from-[#8C1D18] hover:to-[#6B1612] dark:hover:from-[#F5CCC9] dark:hover:to-[#F8DDD9] rounded-xl font-bold text-sm sm:text-base transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-[#BA3B2E] dark:focus:ring-[#F2B8B5] focus:ring-offset-2 focus:ring-offset-[#FDFCFA] dark:focus:ring-offset-[#1C1917]"
                >
                  Logout
                </a>
                
                <p className="text-xs text-center text-[#9C8B7A] dark:text-[#8F8A80]">
                  Login from another device to manage your sessions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-white/80 dark:bg-[#2B2724]/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-[#E8E3DA] dark:border-[#4A4540]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#EDF2E9] dark:bg-[#3F5233] rounded-lg flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 text-[#6B7F5C] dark:text-[#B4CCA5]" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#1F1B17] dark:text-[#EDE5DB] mb-1">
                Security Tip
              </h3>
              <p className="text-xs sm:text-sm text-[#5C5248] dark:text-[#CFC7BD] leading-relaxed">
                If you didn't expect this revocation, review your active sessions immediately and change your password for security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
