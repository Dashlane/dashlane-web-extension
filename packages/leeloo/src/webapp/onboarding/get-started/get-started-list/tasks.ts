import { WebOnboardingLeelooStep } from '@dashlane/communication';
import { DOWNLOAD_DASHLANE } from 'team/urls';
import { openUrl } from 'libs/external-urls';
import { redirect } from 'libs/router';
import { TEAM_CONSOLE_URL_SEGMENT } from 'app/routes/constants';
import { setOnboardingMode } from 'webapp/onboarding/services';
import { Task, TaskDefinition } from '../types';
import { logTaskAddPasswordClick, logTaskOpenAdminConsoleClick, logTaskTryAutofillClick, } from '../logs';
const I18N_KEYS = {
    TASK_DISABLED_MESSAGE: 'onb_vault_get_started_task_disabled',
    INSTALL_EXTENSION_TASK: 'onb_vault_get_started_task_install_extension',
    BUTTON_INSTALL_EXTENSION: 'onb_vault_get_started_btn_install',
    ADD_A_PASSWORD_TASK: 'onb_vault_get_started_task_add_passwd',
    BUTTON_ADD_PASSWORD: 'onb_vault_get_started_btn_add_now',
    TRY_AUTOFILL_TASK: 'onb_vault_get_started_task_try_autofill',
    BUTTON_TRY_AUTOFILL: 'onb_vault_get_started_btn_try_now',
    OPEN_ADMIN_CONSOLE_TASK: 'onb_vault_get_started_task_open_tac',
    BUTTON_OPEN_CONSOLE: 'onb_vault_get_started_btn_open_tac',
};
const handleInstallExtension = () => {
    openUrl(DOWNLOAD_DASHLANE);
};
const handleTryAutoFill = () => {
    logTaskTryAutofillClick();
    setOnboardingMode({ activeOnboardingType: 'tryAutofill' });
    redirect('onboarding/try-autofill');
};
const handleAddPassword = () => {
    logTaskAddPasswordClick();
    setOnboardingMode({
        activeOnboardingType: 'saveWeb',
        leelooStep: WebOnboardingLeelooStep.SHOW_SAVE_SITES_DIALOG,
    });
    redirect('onboarding/add-password');
};
const handleOpenAdminConsole = () => {
    logTaskOpenAdminConsoleClick();
    redirect(TEAM_CONSOLE_URL_SEGMENT);
};
export const tasks: Record<Task, TaskDefinition> = {
    [Task.INSTALL_EXTENSION]: {
        title: I18N_KEYS.INSTALL_EXTENSION_TASK,
        icon: 'ActionOpenExternalLinkOutlined',
        action: {
            icon: 'ActionOpenExternalLinkOutlined',
            label: I18N_KEYS.BUTTON_INSTALL_EXTENSION,
            handler: handleInstallExtension,
        },
    },
    [Task.ADD_PASSWORD]: {
        title: I18N_KEYS.ADD_A_PASSWORD_TASK,
        icon: 'LockOutlined',
        action: {
            icon: 'LockOutlined',
            label: I18N_KEYS.BUTTON_ADD_PASSWORD,
            handler: handleAddPassword,
        },
    },
    [Task.TRY_AUTOFILL]: {
        title: I18N_KEYS.TRY_AUTOFILL_TASK,
        icon: 'FeatureAutofillOutlined',
        action: {
            icon: 'FeatureAutofillOutlined',
            label: I18N_KEYS.BUTTON_TRY_AUTOFILL,
            handler: handleTryAutoFill,
        },
    },
    [Task.OPEN_ADMIN_CONSOLE]: {
        title: I18N_KEYS.OPEN_ADMIN_CONSOLE_TASK,
        icon: 'ActionOpenExternalLinkOutlined',
        action: {
            icon: 'ActionOpenExternalLinkOutlined',
            label: I18N_KEYS.BUTTON_OPEN_CONSOLE,
            handler: handleOpenAdminConsole,
        },
    },
};
