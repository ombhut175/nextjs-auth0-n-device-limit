export enum PageRoutes {
    PUBLIC = "/public",
    PRIVATE = "/private",
    LOGIN = "/auth/login",
    LOGOUT = "/auth/logout",
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