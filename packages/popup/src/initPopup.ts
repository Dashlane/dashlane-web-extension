import { getLanguage } from "@dashlane/framework-infra/spi";
import { loadLocale, translationService } from "./libs/i18n";
import { buildKernel, Kernel } from "./kernel";
const { i18n } = require("../meta/config");
async function fetchLocale() {
  let language = getLanguage();
  if (!i18n.locales.includes(language)) {
    language = i18n.defaultLocale;
  }
  await loadLocale(language);
  translationService.setLocale(language);
  return language;
}
interface PopupParams {
  kernel: Kernel;
}
export async function initPopup(): Promise<PopupParams> {
  const kernel: Kernel = await buildKernel();
  const language = await fetchLocale();
  document.querySelector("html")?.setAttribute("lang", language);
  return {
    kernel,
  };
}
