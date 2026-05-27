"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ru from "@/locales/ru/translation.json";
import en from "@/locales/en/translation.json";
import kk from "@/locales/kk/translation.json";

export const SUPPORTED_LANGUAGES = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "kk", label: "Қазақша" },
] as const;

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        ru: { translation: ru },
        en: { translation: en },
        kk: { translation: kk },
      },
      fallbackLng: "ru",
      supportedLngs: ["ru", "en", "kk"],
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "i18nextLng",
      },
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
}

export default i18n;
