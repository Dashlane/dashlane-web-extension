import { jsx } from '@dashlane/design-system';
import IntelligentTooltipOnOverflow from 'libs/dashlane-style/intelligent-tooltip-on-overflow';
import useTranslate from 'libs/i18n/useTranslate';
export type FieldElement = HTMLInputElement;
interface Props {
    title: string;
    disabled?: boolean;
    onChange: (event: React.ChangeEvent<FieldElement>) => void;
}
const I18N = {
    NO_TITLE: 'webapp_secure_notes_addition_field_placeholder_no_title',
};
export const TitleField = ({ title, disabled = false, onChange }: Props) => {
    const { translate } = useTranslate();
    const placeholder = translate(I18N.NO_TITLE);
    return (<IntelligentTooltipOnOverflow sx={{ display: 'block', width: '100%' }} tooltipText={title || placeholder}>
      <input sx={{
            color: 'ds.text.neutral.catchy',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '24px',
            lineHeight: '30px',
            fontWeight: '600',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            width: '100%',
            fontFamily: "'GT Walsheim Pro', 'Helvetica', 'Arial', 'sans-serif'",
            '&:focus': {
                outline: 'none',
                border: 'none',
            },
        }} placeholder={placeholder} value={title || ''} disabled={disabled} onChange={onChange}/>
    </IntelligentTooltipOnOverflow>);
};
