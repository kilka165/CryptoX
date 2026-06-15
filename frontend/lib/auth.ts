// Единое хранилище auth-токена.
// Токен лежит в localStorage (его читают axios и страницы) и дублируется
// в cookie с тем же именем, чтобы серверный middleware мог его видеть.
const TOKEN_KEY = "auth_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 дней

// Событие, которое рассылается по всему приложению при входе/выходе.
// На него подписана шапка (и любой другой компонент), чтобы мгновенно
// реагировать на смену авторизации без перезагрузки страницы.
export const AUTH_EVENT = "auth-change";

function notifyAuthChange() {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event(AUTH_EVENT));
}

export function setAuthToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
    notifyAuthChange();
}

export function getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
    return !!getAuthToken();
}

export function clearAuthToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
    notifyAuthChange();
}
