import { getLanguage } from '@dashlane/framework-infra/src/spi/business/config/get-language';
import config from 'meta/config';
import { loadLocale, translationService } from 'libs/i18n';
import { buildKernel, Kernel } from 'kernel';
async function fetchLocale() {
    let language = getLanguage();
    if (!config.i18n.locales.includes(language)) {
        language = config.i18n.defaultLocale;
    }
    await loadLocale(language);
    translationService.setLocale(language);
}
interface PopupParams {
    kernel: Kernel;
}
export async function initPopup(): Promise<PopupParams> {
    const kernel: Kernel = buildKernel();
    await fetchLocale();
    return {
        kernel,
    };
}
