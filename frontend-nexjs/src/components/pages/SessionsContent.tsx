"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWRMutation from 'swr/mutation';
import { Monitor, Smartphone, Tablet, MapPin, CheckCircle2, XCircle, AlertTriangle, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { PageRoutes, ApiRoutes } from '@/helpers/string_const';
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

export default function SessionsContent({ sessions: dbSessions, currentDeviceId }: SessionsContentProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('active');

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
  }, []);

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
      
      <div className="relative w-full max-w-[1200px] mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href={PageRoutes.PRIVATE}
          className="inline-flex items-center gap-2 text-[#7A5D42] dark:text-[#D4BFA8] hover:text-[#2D1F10] dark:hover:text-[#EDE5DB] transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-br from-white/95 to-[#F7F5F2]/95 dark:from-[#2B2724]/95 dark:to-[#1C1917]/95 backdrop-blur-xl rounded-3xl border border-[#E8E3DA] dark:border-[#4A4540] shadow-[0_8px_16px_rgba(31,27,23,0.1),0_2px_4px_rgba(31,27,23,0.06)] dark:shadow-[0_8px_16px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.2)] overflow-hidden">
          {/* Top Section with Title and Badge */}
          <div className="p-5 sm:p-6 lg:p-8 pb-4 sm:pb-5 lg:pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#7A5D42] to-[#5C4A38] dark:from-[#D4BFA8] dark:to-[#C9B299] rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Monitor className="w-6 h-6 sm:w-7 sm:h-7 text-white dark:text-[#2D1F10]" />
                </div>
                
                {/* Title and Description */}
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F1B17] dark:text-[#EDE5DB] mb-1 leading-tight">
                    Device Sessions
                  </h1>
                  <p className="text-sm sm:text-base text-[#5C5248] dark:text-[#CFC7BD]">
                    Manage your sessions across all devices
                  </p>
                </div>
              </div>
              
              {/* Active Badge */}
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-br from-[#EDF2E9] to-[#D0E5C0] dark:from-[#3F5233] dark:to-[#1F2B18] rounded-xl border-2 border-[#6B7F5C] dark:border-[#B4CCA5] shadow-md">
                <div className="relative">
                  <CheckCircle2 className="w-5 h-5 text-[#6B7F5C] dark:text-[#B4CCA5]" />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#6B7F5C] dark:bg-[#B4CCA5] rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-[#1F2B18] dark:text-[#D0E5C0] leading-none">Active Sessions</span>
                  <span className="text-lg font-bold text-[#1F2B18] dark:text-[#D0E5C0] leading-tight">{activeSessions.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="relative">
            {/* Gradient Divider */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8E3DA] dark:via-[#4A4540] to-transparent"></div>
            
            <div className="flex gap-1 px-5 sm:px-6 lg:px-8 bg-[#F7F5F2]/50 dark:bg-[#1C1917]/50">
              <button
                onClick={() => setActiveTab('active')}
                className={`relative flex items-center gap-2 px-5 sm:px-7 py-3.5 sm:py-4 font-bold text-sm sm:text-base transition-all duration-300 ${
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
                className={`relative flex items-center gap-2 px-5 sm:px-7 py-3.5 sm:py-4 font-bold text-sm sm:text-base transition-all duration-300 ${
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
                  className="group bg-white/90 dark:bg-[#2B2724]/90 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-[#E8E3DA] dark:border-[#4A4540] hover:border-[#7A5D42] dark:hover:border-[#D4BFA8] transition-all duration-200 hover:shadow-xl hover:shadow-[rgba(31,27,23,0.12)] dark:hover:shadow-[rgba(0,0,0,0.4)] hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    {/* Device Icon */}
                    <div className="relative">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#7A5D42] to-[#5C4A38] dark:from-[#D4BFA8] dark:to-[#C9B299] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-200">
                        <DeviceIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white dark:text-[#2D1F10]" />
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
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg sm:text-xl font-bold text-[#1F1B17] dark:text-[#EDE5DB] truncate">
                              {session.deviceName}
                            </h3>
                            {session.isCurrent && (
                              <span className="px-2.5 py-1 bg-[#EDF2E9] dark:bg-[#3F5233] text-[#1F2B18] dark:text-[#D0E5C0] text-xs font-bold rounded-lg border border-[#6B7F5C] dark:border-[#B4CCA5] whitespace-nowrap">
                                This Device
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#9C8B7A] dark:text-[#8F8A80] mb-3">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 bg-[#F7F5F2] dark:bg-[#3D3935] rounded-xl border border-[#E8E3DA] dark:border-[#4A4540]">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white dark:bg-[#2B2724] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Monitor className="w-4 h-4 text-[#7A5D42] dark:text-[#D4BFA8]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-[#9C8B7A] dark:text-[#8F8A80] font-medium">Browser</p>
                            <p className="text-sm font-semibold text-[#1F1B17] dark:text-[#EDE5DB] truncate">{session.browser}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white dark:bg-[#2B2724] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Monitor className="w-4 h-4 text-[#7A5D42] dark:text-[#D4BFA8]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-[#9C8B7A] dark:text-[#8F8A80] font-medium">OS</p>
                            <p className="text-sm font-semibold text-[#1F1B17] dark:text-[#EDE5DB] truncate">{session.os}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white dark:bg-[#2B2724] rounded-lg flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 text-[#7A5D42] dark:text-[#D4BFA8]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-[#9C8B7A] dark:text-[#8F8A80] font-medium">Location</p>
                            <p className="text-sm font-semibold text-[#1F1B17] dark:text-[#EDE5DB] truncate">{session.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white dark:bg-[#2B2724] rounded-lg flex items-center justify-center flex-shrink-0 font-mono">
                            <span className="text-xs font-bold text-[#7A5D42] dark:text-[#D4BFA8]">IP</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-[#9C8B7A] dark:text-[#8F8A80] font-medium">Address</p>
                            <p className="text-sm font-semibold text-[#1F1B17] dark:text-[#EDE5DB] font-mono">{session.ip}</p>
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
                    className="bg-white/40 dark:bg-[#2B2724]/40 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-[#E8E3DA] dark:border-[#4A4540] opacity-70"
                  >
                    <div className="flex items-start gap-4 sm:gap-5">
                      {/* Device Icon - Grayed out */}
                      <div className="relative">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#E8E3DA] dark:bg-[#4A4540] rounded-2xl flex items-center justify-center flex-shrink-0">
                          <DeviceIcon className="w-7 h-7 sm:w-8 sm:h-8 text-[#9C8B7A] dark:text-[#8F8A80]" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#BA3B2E] dark:bg-[#F2B8B5] rounded-full border-2 border-white dark:border-[#2B2724] flex items-center justify-center">
                          <XCircle className="w-3 h-3 text-white dark:text-[#BA3B2E]" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg sm:text-xl font-bold text-[#5C5248] dark:text-[#CFC7BD] truncate">
                            {session.deviceName}
                          </h3>
                          <span className="px-2.5 py-1 bg-[#FDECEA] dark:bg-[#8C1D18] text-[#BA3B2E] dark:text-[#F2B8B5] text-xs font-bold rounded-lg border border-[#BA3B2E] dark:border-[#F2B8B5] whitespace-nowrap">
                            Revoked
                          </span>
                        </div>
                        <p className="text-sm text-[#9C8B7A] dark:text-[#8F8A80] mb-3">
                          Last active: {session.lastActive}
                        </p>
                        
                        {/* Session Details - Simplified for revoked */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 bg-[#F7F5F2]/50 dark:bg-[#3D3935]/50 rounded-xl border border-[#E8E3DA] dark:border-[#4A4540]">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-[#9C8B7A] dark:text-[#8F8A80] flex-shrink-0" />
                            <p className="text-sm text-[#9C8B7A] dark:text-[#8F8A80] truncate">{session.browser} • {session.os}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#9C8B7A] dark:text-[#8F8A80] flex-shrink-0" />
                            <p className="text-sm text-[#9C8B7A] dark:text-[#8F8A80] truncate">{session.location}</p>
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
        <div className="bg-[#F5EFE7] dark:bg-[#5C4A38] rounded-2xl p-6 border border-[#D4CEC4] dark:border-[#8F8A80]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#7A5D42] dark:text-[#D4BFA8] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-[#2D1F10] dark:text-[#EDE5DB] mb-1">
                Security Tip
              </h3>
              <p className="text-sm text-[#5C5248] dark:text-[#CFC7BD]">
                If you notice any unfamiliar devices or locations, revoke those sessions immediately and change your password. Sessions automatically expire after 7 days of inactivity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
