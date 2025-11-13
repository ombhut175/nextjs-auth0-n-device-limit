"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWRMutation from 'swr/mutation';
import { Monitor, Smartphone, Tablet, MapPin, CheckCircle2, XCircle, AlertTriangle, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { PageRoutes, ApiRoutes, ErrorCodes, ErrorMessages } from '@/helpers/string_const';
import { apiRequest } from '@/helpers/request';
import type { UserSession } from '@/db/schema/userSessions';

const revokeSessionMutator = async (url: string, { arg }: { arg: { sessionId: string; reason: string } }) => {
  return apiRequest.post(url, arg, {
    showSuccess: true,
    successMessage: 'Session revoked successfully',
    successDescription: 'The device session has been terminated.',
    showError: true,
    errorMessage: 'Failed to revoke session',
  });
};

interface Session {
  id: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  location: string;
  ip: string;
  lastActive: string;
  status: 'active' | 'revoked';
  isCurrent: boolean;
}

type TabType = 'active' | 'revoked';

interface SessionsContentProps {
  sessions: UserSession[];
  currentDeviceId?: string;
  error?: string;
  maxDevices?: number;
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
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
}

function mapSessionData(dbSessions: UserSession[], currentDeviceId?: string): Session[] {
  return dbSessions.map(session => ({
    id: session.id,
    deviceName: `${session.browserName || 'Unknown'} on ${session.osName || 'Unknown'}`,
    deviceType: (session.deviceType as 'desktop' | 'mobile' | 'tablet') || 'desktop',
    browser: `${session.browserName || 'Unknown'} ${session.browserVersion || ''}`.trim(),
    os: `${session.osName || 'Unknown'} ${session.osVersion || ''}`.trim(),
    location: 'Unknown', // We don't have geolocation data yet
    ip: session.ipAddress || 'Unknown',
    lastActive: formatTimeAgo(new Date(session.lastSeen)),
    status: session.status as 'active' | 'revoked',
    isCurrent: session.deviceId === currentDeviceId,
  }));
}

export default function SessionsContent({ sessions: dbSessions, currentDeviceId, error, maxDevices }: SessionsContentProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [initialActiveCount, setInitialActiveCount] = useState(0);

  const { trigger: revokeSession, isMutating } = useSWRMutation(
    ApiRoutes.REVOKE_SESSION,
    revokeSessionMutator
  );

  const getDeviceIcon = (type: Session['deviceType']) => {
    switch (type) {
      case 'desktop': return Monitor;
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSession({ 
        sessionId, 
        reason: 'User revoked from sessions page' 
      });
      
      router.refresh();
    } catch (error) {
      // Error already logged by apiRequest helper
    }
  };

  // Derive sessions from props (server-side data)
  const sessions = mapSessionData(dbSessions, currentDeviceId);
  const activeSessions = sessions.filter(s => s.status === 'active');
  const revokedSessions = sessions.filter(s => s.status === 'revoked');

  useEffect(() => {
    setMounted(true);
    if (initialActiveCount === 0) {
      setInitialActiveCount(activeSessions.length);
    }
  }, [activeSessions.length, initialActiveCount]);

  // Check if user can navigate to private (has revoked at least one session)
  const isLimitExceeded = error === ErrorCodes.LIMIT_EXCEEDED;
  const canNavigateToPrivate = isLimitExceeded ? activeSessions.length < initialActiveCount : true;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FDFCFA] dark:bg-[#1C1917] flex items-center justify-center relative overflow-hidden">
        {/* Background grid */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#D4CEC4_1px,transparent_1px),linear-gradient(to_bottom,#D4CEC4_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4A4540_1px,transparent_1px),linear-gradient(to_bottom,#4A4540_1px,transparent_1px)] bg-[size:24px_24px]"
          style={{ opacity: 0.03 }}
        />
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#7A5D42] dark:border-[#D4BFA8] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#5C5248] dark:text-[#CFC7BD] font-medium">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA] dark:bg-[#1C1917] py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-8 relative overflow-hidden">
      {/* Background grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#D4CEC4_1px,transparent_1px),linear-gradient(to_bottom,#D4CEC4_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4A4540_1px,transparent_1px),linear-gradient(to_bottom,#4A4540_1px,transparent_1px)] bg-[size:24px_24px]"
        style={{ opacity: 0.03 }}
      />
      
      <div className="relative w-full max-w-[1200px] mx-auto space-y-4 sm:space-y-6">
        {/* Back Link - Only show if not in error state */}
        {!isLimitExceeded && (
          <Link
            href={PageRoutes.PRIVATE}
            className="inline-flex items-center gap-2 text-[#7A5D42] dark:text-[#D4BFA8] hover:text-[#2D1F10] dark:hover:text-[#EDE5DB] transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
        )}

        {/* Device Limit Exceeded Error Banner */}
        {isLimitExceeded && (
          <div className="relative group">
            {/* Animated glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#BA3B2E] via-[#D4524A] to-[#BA3B2E] dark:from-[#F2B8B5] dark:via-[#F5CCC9] dark:to-[#F2B8B5] rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
            
            <div className="relative bg-gradient-to-br from-[#FDECEA] via-[#FBD5D1] to-[#FDECEA] dark:from-[#8C1D18] dark:via-[#5C1310] dark:to-[#8C1D18] backdrop-blur-xl rounded-3xl border-2 border-[#BA3B2E] dark:border-[#F2B8B5] shadow-[0_8px_32px_rgba(186,59,46,0.3),0_2px_8px_rgba(186,59,46,0.2)] dark:shadow-[0_8px_32px_rgba(242,184,181,0.3),0_2px_8px_rgba(242,184,181,0.2)] overflow-hidden">
              {/* Decorative top bar */}
              <div className="h-2 bg-gradient-to-r from-[#BA3B2E] via-[#D4524A] to-[#BA3B2E] dark:from-[#F2B8B5] dark:via-[#F5CCC9] dark:to-[#F2B8B5]"></div>
              
              <div className="p-4 sm:p-6 lg:p-10">
                <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                  {/* Icon with pulse animation */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#BA3B2E] dark:bg-[#F2B8B5] rounded-2xl animate-ping opacity-20"></div>
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#BA3B2E] to-[#8C1D18] dark:from-[#F2B8B5] dark:to-[#F5CCC9] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl">
                      <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white dark:text-[#BA3B2E]" />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3 sm:space-y-5">
                    {/* Title with gradient */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#BA3B2E]/10 dark:bg-[#F2B8B5]/10 rounded-full border border-[#BA3B2E]/20 dark:border-[#F2B8B5]/20">
                        <div className="w-2 h-2 bg-[#BA3B2E] dark:bg-[#F2B8B5] rounded-full animate-pulse"></div>
                        <span className="text-[10px] sm:text-xs font-bold text-[#BA3B2E] dark:text-[#F2B8B5] uppercase tracking-wider">Action Required</span>
                      </div>
                      
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-[#BA3B2E] dark:text-[#F2B8B5] leading-tight">
                        {ErrorMessages.DEVICE_LIMIT_TITLE}
                      </h2>
                      
                      <p className="text-sm sm:text-base lg:text-lg text-[#8C1D18] dark:text-[#FBD5D1] leading-relaxed max-w-2xl">
                        {ErrorMessages.DEVICE_LIMIT_DESCRIPTION(maxDevices || 3)}
                      </p>
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-[#8C1D18] dark:text-[#FBD5D1]">Active Devices</span>
                        <span className="font-bold text-[#BA3B2E] dark:text-[#F2B8B5]">{activeSessions.length} / {maxDevices || 3}</span>
                      </div>
                      <div className="h-3 bg-[#BA3B2E]/20 dark:bg-[#F2B8B5]/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#BA3B2E] to-[#D4524A] dark:from-[#F2B8B5] dark:to-[#F5CCC9] rounded-full transition-all duration-500"
                          style={{ width: `${(activeSessions.length / (maxDevices || 3)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                      <Link
                        href={PageRoutes.PRIVATE}
                        className={`group/btn inline-flex items-center justify-center gap-2 sm:gap-2.5 px-5 sm:px-7 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
                          canNavigateToPrivate
                            ? 'bg-gradient-to-r from-[#6B7F5C] to-[#5C6B4F] dark:from-[#B4CCA5] dark:to-[#A3B394] text-white dark:text-[#1F2B18] hover:from-[#5C6B4F] hover:to-[#4D5C40] dark:hover:from-[#A3B394] dark:hover:to-[#92A283] shadow-lg hover:shadow-2xl hover:scale-105 focus:ring-[#6B7F5C] dark:focus:ring-[#B4CCA5]'
                            : 'bg-[#E8E3DA] dark:bg-[#4A4540] text-[#9C8B7A] dark:text-[#8F8A80] cursor-not-allowed opacity-60'
                        }`}
                        onClick={(e) => {
                          if (!canNavigateToPrivate) {
                            e.preventDefault();
                          }
                        }}
                      >
                        {canNavigateToPrivate ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            <span>{ErrorMessages.CONTINUE_TO_PRIVATE}</span>
                            <ArrowLeft className="w-4 h-4 rotate-180 group-hover/btn:translate-x-1 transition-transform" />
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5" />
                            <span>{ErrorMessages.REVOKE_SESSION_FIRST}</span>
                          </>
                        )}
                      </Link>
                      
                      {canNavigateToPrivate && (
                        <button
                          onClick={() => router.refresh()}
                          className="group/btn inline-flex items-center justify-center gap-2 sm:gap-2.5 px-5 sm:px-7 py-3 sm:py-4 bg-white/80 dark:bg-[#2B2724]/80 backdrop-blur-sm text-[#BA3B2E] dark:text-[#F2B8B5] hover:bg-white dark:hover:bg-[#2B2724] border-2 border-[#BA3B2E]/30 dark:border-[#F2B8B5]/30 hover:border-[#BA3B2E] dark:hover:border-[#F2B8B5] rounded-xl font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#BA3B2E]/30 dark:focus:ring-[#F2B8B5]/30 focus:ring-offset-2 shadow-md hover:shadow-lg"
                        >
                          <Monitor className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:scale-110 transition-transform" />
                          <span className="hidden sm:inline">Stay on Sessions</span>
                          <span className="sm:hidden">Stay Here</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Helper text */}
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-[#BA3B2E]/5 dark:bg-[#F2B8B5]/5 rounded-xl border border-[#BA3B2E]/10 dark:border-[#F2B8B5]/10">
                  <div className="w-5 h-5 rounded-full bg-[#BA3B2E]/20 dark:bg-[#F2B8B5]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#BA3B2E] dark:text-[#F2B8B5]">!</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#8C1D18] dark:text-[#FBD5D1] leading-relaxed">
                    <span className="font-semibold">Quick tip:</span> Select any session below and click "Revoke" to free up a device slot. Your current device will then be able to access the private area.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-br from-white/95 to-[#F7F5F2]/95 dark:from-[#2B2724]/95 dark:to-[#1C1917]/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-[#E8E3DA] dark:border-[#4A4540] shadow-[0_8px_16px_rgba(31,27,23,0.1),0_2px_4px_rgba(31,27,23,0.06)] dark:shadow-[0_8px_16px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.2)] overflow-hidden">
          {/* Top Section with Title and Badge */}
          <div className="p-4 sm:p-5 lg:p-8 pb-3 sm:pb-4 lg:pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
                {/* Icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-[#7A5D42] to-[#5C4A38] dark:from-[#D4BFA8] dark:to-[#C9B299] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Monitor className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white dark:text-[#2D1F10]" />
                </div>
                
                {/* Title and Description */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#1F1B17] dark:text-[#EDE5DB] mb-0.5 sm:mb-1 leading-tight">
                    Device Sessions
                  </h1>
                  <p className="text-xs sm:text-sm lg:text-base text-[#5C5248] dark:text-[#CFC7BD]">
                    Manage your sessions across all devices
                  </p>
                </div>
              </div>
              
              {/* Active Badge */}
              <div className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-br from-[#EDF2E9] to-[#D0E5C0] dark:from-[#3F5233] dark:to-[#1F2B18] rounded-lg sm:rounded-xl border-2 border-[#6B7F5C] dark:border-[#B4CCA5] shadow-md self-start sm:self-auto">
                <div className="relative">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B7F5C] dark:text-[#B4CCA5]" />
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#6B7F5C] dark:bg-[#B4CCA5] rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-xs font-medium text-[#1F2B18] dark:text-[#D0E5C0] leading-none">Active Sessions</span>
                  <span className="text-base sm:text-lg font-bold text-[#1F2B18] dark:text-[#D0E5C0] leading-tight">{activeSessions.length} / 3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="relative">
            {/* Gradient Divider */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8E3DA] dark:via-[#4A4540] to-transparent"></div>
            
            <div className="flex gap-0.5 sm:gap-1 px-3 sm:px-5 lg:px-8 bg-[#F7F5F2]/50 dark:bg-[#1C1917]/50">
              <button
                onClick={() => setActiveTab('active')}
                className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 lg:px-7 py-2.5 sm:py-3.5 lg:py-4 font-bold text-xs sm:text-sm lg:text-base transition-all duration-300 ${
                  activeTab === 'active'
                    ? 'text-[#7A5D42] dark:text-[#D4BFA8]'
                    : 'text-[#9C8B7A] dark:text-[#8F8A80] hover:text-[#7A5D42] dark:hover:text-[#D4BFA8]'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 transition-transform duration-300 ${activeTab === 'active' ? 'scale-110' : ''}`} />
                <span>Active</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-300 ${
                  activeTab === 'active'
                    ? 'bg-[#7A5D42] dark:bg-[#D4BFA8] text-white dark:text-[#2D1F10] shadow-md scale-105'
                    : 'bg-[#E8E3DA] dark:bg-[#4A4540] text-[#5C5248] dark:text-[#CFC7BD]'
                }`}>
                  {activeSessions.length}
                </span>
                
                {/* Active Tab Indicator */}
                {activeTab === 'active' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7A5D42] via-[#9C8B7A] to-[#7A5D42] dark:from-[#D4BFA8] dark:via-[#B8A896] dark:to-[#D4BFA8] rounded-t-full shadow-lg"></div>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('revoked')}
                className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 lg:px-7 py-2.5 sm:py-3.5 lg:py-4 font-bold text-xs sm:text-sm lg:text-base transition-all duration-300 ${
                  activeTab === 'revoked'
                    ? 'text-[#7A5D42] dark:text-[#D4BFA8]'
                    : 'text-[#9C8B7A] dark:text-[#8F8A80] hover:text-[#7A5D42] dark:hover:text-[#D4BFA8]'
                }`}
              >
                <XCircle className={`w-4 h-4 transition-transform duration-300 ${activeTab === 'revoked' ? 'scale-110' : ''}`} />
                <span>Revoked</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-300 ${
                  activeTab === 'revoked'
                    ? 'bg-[#7A5D42] dark:bg-[#D4BFA8] text-white dark:text-[#2D1F10] shadow-md scale-105'
                    : 'bg-[#E8E3DA] dark:bg-[#4A4540] text-[#5C5248] dark:text-[#CFC7BD]'
                }`}>
                  {revokedSessions.length}
                </span>
                
                {/* Active Tab Indicator */}
                {activeTab === 'revoked' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7A5D42] via-[#9C8B7A] to-[#7A5D42] dark:from-[#D4BFA8] dark:via-[#B8A896] dark:to-[#D4BFA8] rounded-t-full shadow-lg"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === 'active' && (
            <div className="grid gap-3 sm:gap-4">
              {activeSessions.map((session) => {
              const DeviceIcon = getDeviceIcon(session.deviceType);
              
              return (
                <div
                  key={session.id}
                  className="group bg-white/90 dark:bg-[#2B2724]/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-[#E8E3DA] dark:border-[#4A4540] hover:border-[#7A5D42] dark:hover:border-[#D4BFA8] transition-all duration-200 hover:shadow-xl hover:shadow-[rgba(31,27,23,0.12)] dark:hover:shadow-[rgba(0,0,0,0.4)] hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-3 sm:gap-4 lg:gap-5">
                    {/* Device Icon */}
                    <div className="relative">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-[#7A5D42] to-[#5C4A38] dark:from-[#D4BFA8] dark:to-[#C9B299] rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-200">
                        <DeviceIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white dark:text-[#2D1F10]" />
                      </div>
                      {session.isCurrent && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#6B7F5C] dark:bg-[#B4CCA5] rounded-full border-2 border-white dark:border-[#2B2724] flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white dark:text-[#1F2B18]" />
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#1F1B17] dark:text-[#EDE5DB] truncate">
                              {session.deviceName}
                            </h3>
                            {session.isCurrent && (
                              <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#EDF2E9] dark:bg-[#3F5233] text-[#1F2B18] dark:text-[#D0E5C0] text-[10px] sm:text-xs font-bold rounded-md sm:rounded-lg border border-[#6B7F5C] dark:border-[#B4CCA5] whitespace-nowrap self-start">
                                This Device
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-[#9C8B7A] dark:text-[#8F8A80] mb-2 sm:mb-3">
                            Last active: {session.lastActive}
                          </p>
                        </div>
                        
                        {/* Revoke Button - Desktop */}
                        {!session.isCurrent && (
                          <button
                            onClick={() => handleRevokeSession(session.id)}
                            disabled={isMutating}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#3D3935] text-[#BA3B2E] dark:text-[#F2B8B5] hover:bg-[#BA3B2E] hover:text-white dark:hover:bg-[#BA3B2E] border border-[#E8E3DA] dark:border-[#4A4540] hover:border-[#BA3B2E] rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#BA3B2E] dark:focus:ring-[#F2B8B5] focus:ring-offset-2 whitespace-nowrap"
                          >
                            {isMutating ? (
                              <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Revoking...
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                Revoke
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      
                      {/* Session Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 p-2.5 sm:p-3 bg-[#F7F5F2] dark:bg-[#3D3935] rounded-lg sm:rounded-xl border border-[#E8E3DA] dark:border-[#4A4540]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white dark:bg-[#2B2724] rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                            <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7A5D42] dark:text-[#D4BFA8]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] sm:text-xs text-[#9C8B7A] dark:text-[#8F8A80] font-medium">Browser</p>
                            <p className="text-xs sm:text-sm font-semibold text-[#1F1B17] dark:text-[#EDE5DB] truncate">{session.browser}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white dark:bg-[#2B2724] rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                            <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7A5D42] dark:text-[#D4BFA8]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] sm:text-xs text-[#9C8B7A] dark:text-[#8F8A80] font-medium">OS</p>
                            <p className="text-xs sm:text-sm font-semibold text-[#1F1B17] dark:text-[#EDE5DB] truncate">{session.os}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white dark:bg-[#2B2724] rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7A5D42] dark:text-[#D4BFA8]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] sm:text-xs text-[#9C8B7A] dark:text-[#8F8A80] font-medium">Location</p>
                            <p className="text-xs sm:text-sm font-semibold text-[#1F1B17] dark:text-[#EDE5DB] truncate">{session.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white dark:bg-[#2B2724] rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0 font-mono">
                            <span className="text-[10px] sm:text-xs font-bold text-[#7A5D42] dark:text-[#D4BFA8]">IP</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] sm:text-xs text-[#9C8B7A] dark:text-[#8F8A80] font-medium">Address</p>
                            <p className="text-xs sm:text-sm font-semibold text-[#1F1B17] dark:text-[#EDE5DB] font-mono truncate">{session.ip}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Revoke Button - Mobile */}
                      {!session.isCurrent && (
                        <button
                          onClick={() => handleRevokeSession(session.id)}
                          disabled={isMutating}
                          className="sm:hidden w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-[#3D3935] text-[#BA3B2E] dark:text-[#F2B8B5] hover:bg-[#BA3B2E] hover:text-white dark:hover:bg-[#BA3B2E] border border-[#E8E3DA] dark:border-[#4A4540] hover:border-[#BA3B2E] rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#BA3B2E] dark:focus:ring-[#F2B8B5] focus:ring-offset-2"
                        >
                          {isMutating ? (
                            <>
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Revoking...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4" />
                              Revoke Session
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          )}

          {activeTab === 'revoked' && (
            <div className="grid gap-3 sm:gap-4">
              {revokedSessions.length === 0 ? (
                <div className="bg-white/90 dark:bg-[#2B2724]/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-8 sm:p-12 border border-[#E8E3DA] dark:border-[#4A4540] text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E8E3DA] dark:bg-[#4A4540] rounded-2xl mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#9C8B7A] dark:text-[#8F8A80]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1F1B17] dark:text-[#EDE5DB] mb-2">
                    No Revoked Sessions
                  </h3>
                  <p className="text-sm sm:text-base text-[#5C5248] dark:text-[#CFC7BD]">
                    All your sessions are currently active
                  </p>
                </div>
              ) : (
                revokedSessions.map((session) => {
                const DeviceIcon = getDeviceIcon(session.deviceType);
                
                return (
                  <div
                    key={session.id}
                    className="bg-white/40 dark:bg-[#2B2724]/40 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-[#E8E3DA] dark:border-[#4A4540] opacity-70"
                  >
                    <div className="flex items-start gap-3 sm:gap-4 lg:gap-5">
                      {/* Device Icon - Grayed out */}
                      <div className="relative">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-[#E8E3DA] dark:bg-[#4A4540] rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                          <DeviceIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#9C8B7A] dark:text-[#8F8A80]" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#BA3B2E] dark:bg-[#F2B8B5] rounded-full border-2 border-white dark:border-[#2B2724] flex items-center justify-center">
                          <XCircle className="w-3 h-3 text-white dark:text-[#BA3B2E]" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#5C5248] dark:text-[#CFC7BD] truncate">
                            {session.deviceName}
                          </h3>
                          <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#FDECEA] dark:bg-[#8C1D18] text-[#BA3B2E] dark:text-[#F2B8B5] text-[10px] sm:text-xs font-bold rounded-md sm:rounded-lg border border-[#BA3B2E] dark:border-[#F2B8B5] whitespace-nowrap self-start">
                            Revoked
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#9C8B7A] dark:text-[#8F8A80] mb-2 sm:mb-3">
                          Last active: {session.lastActive}
                        </p>
                        
                        {/* Session Details - Simplified for revoked */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 p-2.5 sm:p-3 bg-[#F7F5F2]/50 dark:bg-[#3D3935]/50 rounded-lg sm:rounded-xl border border-[#E8E3DA] dark:border-[#4A4540]">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9C8B7A] dark:text-[#8F8A80] flex-shrink-0" />
                            <p className="text-xs sm:text-sm text-[#9C8B7A] dark:text-[#8F8A80] truncate">{session.browser} • {session.os}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9C8B7A] dark:text-[#8F8A80] flex-shrink-0" />
                            <p className="text-xs sm:text-sm text-[#9C8B7A] dark:text-[#8F8A80] truncate">{session.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
              )}
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-[#F5EFE7] dark:bg-[#5C4A38] rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#D4CEC4] dark:border-[#8F8A80]">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-[#7A5D42] dark:text-[#D4BFA8] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-[#2D1F10] dark:text-[#EDE5DB] mb-1">
                Security Tip
              </h3>
              <p className="text-xs sm:text-sm text-[#5C5248] dark:text-[#CFC7BD]">
                If you notice any unfamiliar devices or locations, revoke those sessions immediately and change your password. Sessions automatically expire after 7 days of inactivity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
