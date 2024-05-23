import * as React from 'react';
import { GeneratedPasswordItemView } from '@dashlane/communication';
import { PageView } from '@dashlane/hermes';
import useTranslate from 'libs/i18n/useTranslate';
import { logPageView } from 'libs/logs/logEvent';
import { FixedWidthButton } from 'src/app/generator/generated-password/actions/fixed-width-button';
import { GeneratedPasswordHistory } from 'src/app/generator/generated-password/actions/generated-password-history';
import styles from 'app/generator/generated-password/actions/generated-password-actions.css';
const I18N_KEYS = {
    COPY_PASSWORD: 'tab/generate/copy_password/do_copy',
    PASSWORD_COPIED: 'tab/generate/copy_password/copied',
};
interface Props {
    isPasswordCopied: boolean;
    generatedPasswords: GeneratedPasswordItemView[];
    onRefreshPassword: () => void;
    onCopyPassword: () => void;
}
const GeneratedPasswordActionsComponent = ({ onCopyPassword, isPasswordCopied, generatedPasswords, }: Props) => {
    const { translate } = useTranslate();
    const logPasswordGeneratorPageView = () => {
        logPageView(PageView.ToolsPasswordGenerator);
    };
    return (<div className={styles.buttons}>
      <GeneratedPasswordHistory generatedPasswords={generatedPasswords} onCloseModal={logPasswordGeneratorPageView}/>

      <FixedWidthButton id="copyButton" onClick={onCopyPassword} disabled={isPasswordCopied} textList={[
            translate(I18N_KEYS.PASSWORD_COPIED),
            translate(I18N_KEYS.COPY_PASSWORD),
        ]} textIndex={isPasswordCopied ? 0 : 1}/>
    </div>);
};
export const GeneratedPasswordActions = React.memo(GeneratedPasswordActionsComponent);
