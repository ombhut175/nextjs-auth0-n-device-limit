export enum PageRoutes {
    PUBLIC = "/",
    PRIVATE = "/private",
    LOGIN = "/auth/login",
    LOGOUT = "/auth/logout",
    LOGOUT_WITH_CLEANUP = "/api/auth/logout-with-cleanup",
    PHONE_NUMBER = "/phone-number",
    SESSIONS = "/sessions",
}

export const ApiRoutes = {
    REVOKE_SESSION: "/sessions/revoke",
    USER_PHONE: "/user/phone",
    ADMIN_CURRENT_USER: "/admin/current-user",
    ADMIN_REVOKE_SESSION: "/admin/sessions/revoke",
    ADMIN_USER_SESSIONS: (userId: string) => `/admin/users/${userId}/sessions`,
    ADMIN_REVOKE_ALL_SESSIONS: (userId: string) => `/admin/users/${userId}/revoke-all`,
} as const;

export enum SessionStatus {
    ACTIVE = "active",
    REVOKED = "revoked",
}

export enum ErrorCodes {
    LIMIT_EXCEEDED = "limit_exceeded",
}

export const ErrorMessages = {
    DEVICE_LIMIT_TITLE: "Device Limit Reached",
    DEVICE_LIMIT_DESCRIPTION: (maxDevices: number) => 
        `You have reached the maximum limit of ${maxDevices} active devices. Please log out from one of your existing sessions below to continue using this device.`,
    REVOKE_SESSION_FIRST: "Revoke a Session First",
    CONTINUE_TO_PRIVATE: "Continue to Private Area",
} as const;