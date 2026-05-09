// src/i18n/languageSync.ts
import i18n from "./i18n";

export type AppLanguage = "en-US" | "ar";

export function syncLanguage(lang: AppLanguage) {
  i18n.changeLanguage(lang);
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
}
