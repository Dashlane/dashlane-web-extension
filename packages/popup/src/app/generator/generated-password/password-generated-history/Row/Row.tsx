import * as React from 'react';
import { CopyPasswordIcon, HideIcon, RevealIcon, } from '@dashlane/ui-components';
import { GeneratedPasswordItemView } from '@dashlane/communication';
import { IconButtonWithTooltip } from 'src/components/icon-button-with-tooltip/icon-button-with-tooltip';
import useTranslate from 'libs/i18n/useTranslate';
import { formatDate } from 'src/app/generator/generated-password/password-generated-history/helpers';
import styles from '../styles.css';
import { Field, ItemType, UserRevealVaultItemFieldEvent, } from '@dashlane/hermes';
import useProtectedItemsUnlocker from 'src/app/protected-items-unlocker/useProtectedItemsUnlocker';
import { ConfirmLabelMode } from 'src/app/protected-items-unlocker/master-password-dialog';
import { logEvent } from 'src/libs/logs/logEvent';
const FAKE_PASSWORD = '••••••••••••';
const I18N_KEYS = {
    SUBTITLE: 'passwordGeneratedHistory/subtitle',
    HIDE: 'passwordGeneratedHistory/hide',
    SHOW: 'passwordGeneratedHistory/show',
    COPY_PASSWORD: 'passwordGeneratedHistory/copyPassword',
    FOR: 'passwordGeneratedHistory/for',
};
const DOMAIN_IS_GENERATOR_TAB = 'Generated password';
interface GeneratedPasswordRowProps {
    generatedPassword: GeneratedPasswordItemView;
    onCopy: (password: string, id: string, domain?: string) => void;
    index: number;
}
export const parseSubtitleTranslation = (translation: string, domain: string): JSX.Element => {
    const [beforeDomain, forTranslation, afterDomain] = translation.split('_');
    return (<>
      {beforeDomain}
      {domain && domain !== DOMAIN_IS_GENERATOR_TAB ? (<>
          {forTranslation} <span className={styles.domain}>{domain} </span>
        </>) : null}
      {afterDomain}
    </>);
};
export const GeneratedPasswordRow: React.FC<GeneratedPasswordRowProps> = React.memo(function GeneratedPasswordRow({ generatedPassword, onCopy }) {
    const { domain, generatedDate, password, id } = generatedPassword;
    const { translate } = useTranslate();
    const [displayPassword, setDisplayPassword] = React.useState(false);
    const { openProtectedItemsUnlocker, areProtectedItemsUnlocked } = useProtectedItemsUnlocker();
    const logsForRevealPassword = () => {
        return logEvent(new UserRevealVaultItemFieldEvent({
            field: Field.Password,
            itemType: ItemType.GeneratedPassword,
            itemId: id,
            isProtected: false,
        }));
    };
    const togglePassword = () => {
        if (!areProtectedItemsUnlocked) {
            openProtectedItemsUnlocker({
                confirmLabelMode: ConfirmLabelMode.ShowPassword,
                onSuccess: () => {
                    logsForRevealPassword();
                    setDisplayPassword(true);
                },
                showNeverAskOption: true,
                credentialId: id,
            });
        }
        else {
            if (!displayPassword) {
                logsForRevealPassword();
            }
            setDisplayPassword(!displayPassword);
        }
    };
    const onCopyHandler = () => {
        if (!areProtectedItemsUnlocked) {
            openProtectedItemsUnlocker({
                confirmLabelMode: ConfirmLabelMode.CopyPassword,
                onSuccess: () => onCopy(password, id, domain === DOMAIN_IS_GENERATOR_TAB ? undefined : domain),
                showNeverAskOption: true,
                credentialId: id,
            });
        }
        else {
            onCopy(password, id, domain === DOMAIN_IS_GENERATOR_TAB ? undefined : domain);
        }
    };
    const date = formatDate(generatedDate);
    return (<div className={styles.generatedPassword}>
        <div className={styles.content}>
          <div className={styles.title}>
            {displayPassword ? password : FAKE_PASSWORD}
          </div>
          <div className={styles.subtitle}>
            {parseSubtitleTranslation(translate(I18N_KEYS.SUBTITLE, {
            date,
            domain: '',
        }), domain)}
          </div>
        </div>

        <div className={styles.actions}>
          <IconButtonWithTooltip aria-label={displayPassword ? 'hide' : 'show'} tooltipContent={translate(displayPassword ? I18N_KEYS.HIDE : I18N_KEYS.SHOW)} icon={displayPassword ? <HideIcon /> : <RevealIcon />} onClick={togglePassword}/>

          <IconButtonWithTooltip aria-label={'copyPassword'} tooltipContent={translate(I18N_KEYS.COPY_PASSWORD)} onClick={onCopyHandler} icon={<CopyPasswordIcon />}/>
        </div>
      </div>);
});
