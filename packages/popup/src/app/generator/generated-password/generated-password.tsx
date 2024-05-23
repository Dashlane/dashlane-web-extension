import * as React from 'react';
import classNames from 'classnames';
import { colors, jsx, PasswordStrength } from '@dashlane/ui-components';
import { useToast } from '@dashlane/design-system';
import { GeneratedPasswordItemView } from '@dashlane/communication';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { useHasFeatureEnabled } from 'src/libs/hooks/useHasFeature';
import useTranslate from 'src/libs/i18n/useTranslate';
import { getStrengthI18nKey, getZxcvbnScoreFrom100BaseStrength, } from 'src/app/generator/strength';
import { GeneratedPasswordField } from 'src/app/generator/generated-password/generated-password-field';
import { GeneratedPasswordActions } from 'src/app/generator/generated-password/actions/generated-password-actions';
import { usePasswordShuffler } from 'src/app/generator/generated-password/passwordShuffler/usePasswordShuffler';
import { getGeneratedPasswordsList, saveGeneratedPassword, } from 'src/libs/api/passwordGeneration/passwordGeneration';
import styles from 'app/generator/generated-password/generated-password.css';
const BUTTON_DISABLING_DELAY = 1500;
const I18N_KEYS = {
    PASSWORD_COPIED_TO_CLIPBOARD: 'tab/generate/password_copied_to_clipboard',
};
interface Props {
    isLoading: boolean;
    generatedPassword: string;
    passwordLength: number;
    strength: number;
    onRefreshPassword: () => void;
}
const GeneratedPasswordComponent = ({ isLoading, generatedPassword, passwordLength, onRefreshPassword, strength, }: Props) => {
    const { translate } = useTranslate();
    const { showToast } = useToast();
    const [isPasswordCopied, setIsPasswordCopied] = React.useState(false);
    const [generatedPasswordsList, updateGeneratedPasswordsLists] = React.useState<GeneratedPasswordItemView[]>([]);
    const prideColorsEnabled = useHasFeatureEnabled(FEATURE_FLIPS_WITHOUT_MODULE.WebplatformWebPrideColors);
    const strengthKey = React.useMemo(() => getStrengthI18nKey(strength), [strength]);
    const zxcvbnScore = React.useMemo(() => getZxcvbnScoreFrom100BaseStrength(strength), [strength]);
    const { shuffledPassword, isPasswordShuffling } = usePasswordShuffler({
        shouldShuffle: isLoading,
        passwordLength,
    });
    const password = isPasswordShuffling ? shuffledPassword : generatedPassword;
    React.useEffect(() => {
        void getGeneratedPasswordsList().then((list) => {
            updateGeneratedPasswordsLists(list.items);
        });
    }, []);
    React.useEffect(() => {
        if (isLoading && isPasswordCopied) {
            setIsPasswordCopied(false);
        }
    }, [isLoading, isPasswordCopied]);
    const onCopyPassword = React.useCallback(async () => {
        await navigator.clipboard.writeText(generatedPassword);
        setIsPasswordCopied(true);
        await saveGeneratedPassword(generatedPassword);
        const list = await getGeneratedPasswordsList();
        updateGeneratedPasswordsLists(list.items);
        showToast({
            description: translate(I18N_KEYS.PASSWORD_COPIED_TO_CLIPBOARD),
        });
        setTimeout(() => {
            setIsPasswordCopied(false);
        }, BUTTON_DISABLING_DELAY);
    }, [generatedPassword, showToast, translate]);
    return (<div className={classNames(styles.generatedPasswordContainer)} sx={{
            backgroundColor: 'ds.container.agnostic.neutral.standard',
        }}>
      <div className={styles.passwordAndIndicator}>
        <GeneratedPasswordField onRefreshPassword={onRefreshPassword} password={password}/>
        <div className={styles.indicator}>
          <PasswordStrength score={zxcvbnScore} showAdditionalText={true} additionalText={translate(strengthKey)} backgroundColor={colors.midGreen03} showQueerColors={prideColorsEnabled}/>
        </div>
      </div>
      <div className={styles.buttons}>
        <GeneratedPasswordActions isPasswordCopied={isPasswordCopied} generatedPasswords={generatedPasswordsList} onCopyPassword={() => {
            void onCopyPassword();
        }} onRefreshPassword={onRefreshPassword}/>
      </div>
    </div>);
};
export const GeneratedPassword = React.memo(GeneratedPasswordComponent);
