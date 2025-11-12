'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher, apiRequest } from '@/helpers/request';
import { ApiRoutes, SessionStatus } from '@/helpers/string_const';

interface Session {
  id: string;
  deviceId: string;
  auth0Sid: string | null;
  status: string;
  browserName: string | null;
  osName: string | null;
  deviceType: string | null;
  ipAddress: string | null;
  lastSeen: string;
  createdAt: string;
}

interface CurrentUserResponse {
  userId: string;
}

interface SessionsResponse {
  sessions: Session[];
}

interface RevokeResponse {
  ok: boolean;
  message?: string;
}

interface RevokeAllResponse {
  ok: boolean;
  revokedCount: number;
  message?: string;
}

export default function TestRevokePage() {
  const [userId, setUserId] = useState('');
  const [shouldFetchSessions, setShouldFetchSessions] = useState(false);

  // Fetch current user ID using SWR
  const { data: currentUser } = useSWR<CurrentUserResponse>(
    ApiRoutes.ADMIN_CURRENT_USER,
    swrFetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  // Fetch sessions for the specified user ID
  const {
    data: sessionsData,
    error: sessionsError,
    isLoading: sessionsLoading,
    mutate: mutateSessions,
  } = useSWR<SessionsResponse>(
    shouldFetchSessions && userId.trim()
      ? ApiRoutes.ADMIN_USER_SESSIONS(userId.trim())
      : null,
    swrFetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const sessions = sessionsData?.sessions || [];

  const handleFetchSessions = () => {
    if (!userId.trim()) {
      return;
    }
    setShouldFetchSessions(true);
  };

  const revokeSingleSession = async (sessionId: string, auth0Sid: string | null) => {
    if (!auth0Sid) {
      return;
    }

    try {
      const result = await apiRequest.post<RevokeResponse>(
        ApiRoutes.ADMIN_REVOKE_SESSION,
        { auth0Sid, userSessionId: sessionId },
        {
          showSuccess: true,
          successMessage: 'Session revoked',
          showError: true,
          errorMessage: 'Failed to revoke session',
        }
      );

      if (result.ok) {
        mutateSessions();
      }
    } catch (err) {
      // Error already shown via toast
    }
  };

  const revokeAllSessions = async () => {
    if (!userId.trim()) {
      return;
    }

    if (!confirm('Are you sure you want to revoke ALL sessions for this user?')) {
      return;
    }

    try {
      const result = await apiRequest.post<RevokeAllResponse>(
        ApiRoutes.ADMIN_REVOKE_ALL_SESSIONS(userId.trim()),
        undefined,
        {
          showSuccess: true,
          successMessage: 'All sessions revoked',
          showError: true,
          errorMessage: 'Failed to revoke sessions',
        }
      );

      if (result.ok) {
        mutateSessions();
      }
    } catch (err) {
      // Error already shown via toast
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Session Revocation Testing</h1>

        {/* Current User Info */}
        {currentUser?.userId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Your User ID:</span>{' '}
              <code className="bg-blue-100 px-2 py-1 rounded">{currentUser.userId}</code>
              <button
                onClick={() => setUserId(currentUser.userId)}
                className="ml-4 text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Use My ID
              </button>
            </p>
          </div>
        )}

        {/* User ID Input */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User ID (UUID)
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user UUID"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleFetchSessions}
              disabled={sessionsLoading || !userId.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {sessionsLoading ? 'Loading...' : 'Fetch Sessions'}
            </button>
            <button
              onClick={revokeAllSessions}
              disabled={sessionsLoading || !userId.trim()}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Revoke All
            </button>
          </div>
        </div>

        {/* Error Message */}
        {sessionsError && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
            Failed to fetch sessions
          </div>
        )}

        {/* Sessions List */}
        {sessions.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                Sessions ({sessions.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Browser
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      OS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Seen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Auth0 SID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sessions.map((session) => (
                    <tr key={session.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.deviceType || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.browserName || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.osName || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.ipAddress || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            session.status === SessionStatus.ACTIVE
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {session.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(session.lastSeen).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                        {session.auth0Sid ? (
                          <span className="truncate block max-w-xs" title={session.auth0Sid}>
                            {session.auth0Sid.substring(0, 20)}...
                          </span>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => revokeSingleSession(session.id, session.auth0Sid)}
                          disabled={
                            sessionsLoading ||
                            session.status !== SessionStatus.ACTIVE ||
                            !session.auth0Sid
                          }
                          className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {sessions.length === 0 && shouldFetchSessions && !sessionsLoading && !sessionsError && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No sessions found for this user
          </div>
        )}
      </div>
    </div>
  );
}
