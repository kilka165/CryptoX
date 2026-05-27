export function intlLocale(lng?: string): string {
  switch ((lng || "ru").split("-")[0]) {
    case "en":
      return "en-US";
    case "kk":
      return "kk-KZ";
    default:
      return "ru-RU";
  }
}
