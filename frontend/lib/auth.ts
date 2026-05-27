// Единое хранилище auth-токена.
// Токен лежит в localStorage (его читают axios и страницы) и дублируется
// в cookie с тем же именем, чтобы серверный middleware мог его видеть.
const TOKEN_KEY = "auth_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 дней

export function setAuthToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

export function getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}
