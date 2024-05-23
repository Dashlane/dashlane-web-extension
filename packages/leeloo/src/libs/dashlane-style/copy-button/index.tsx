import { Key, useState } from 'react';
import { jsx, PropsOf, Tooltip } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { Button, Icon } from '@dashlane/design-system';
const I18N_KEYS = {
    COPY: 'input_copy_button',
    COPIED: 'input_copied_button_feedback',
};
interface CopyButtonProps extends Omit<PropsOf<typeof Button>, 'type'>, Partial<Pick<PropsOf<typeof Button>, 'type'>> {
    copyValue: string;
    buttonText?: string;
    key?: Key | undefined;
    iconProps?: Omit<PropsOf<typeof Icon>, 'name'>;
}
export const CopyButton = ({ copyValue, buttonText, disabled, iconProps, ...rest }: CopyButtonProps) => {
    const { translate } = useTranslate();
    const [copied, setCopied] = useState(false);
    const handleCopyClick = async () => {
        await navigator.clipboard.writeText(copyValue);
        setCopied(true);
    };
    const buttonDisabled = disabled || !copyValue;
    const hideTooltip = buttonDisabled || Boolean(buttonText && !copied);
    return (<Tooltip content={translate(copied ? I18N_KEYS.COPIED : I18N_KEYS.COPY)} placement="bottom" passThrough={hideTooltip}>
      <Button icon={<Icon name="ActionCopyOutlined" size="small" {...iconProps}/>} layout="iconLeading" mood="brand" size="medium" onClick={handleCopyClick} disabled={buttonDisabled} {...rest} onMouseLeave={() => setCopied(false)}>
        {buttonText}
      </Button>
    </Tooltip>);
};
