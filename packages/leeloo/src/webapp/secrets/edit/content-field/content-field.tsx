import { jsx } from '@dashlane/design-system';
import styles from './styles.css';
export type FieldElement = HTMLTextAreaElement;
interface Props {
    name?: string;
    placeholder?: string;
    value: string;
    disabled?: boolean;
    fieldRef: React.RefObject<HTMLTextAreaElement>;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
export const SecretContentField = ({ fieldRef, value, name, placeholder, disabled, onChange, }: Props) => {
    return (<div className={styles.content}>
      <textarea ref={fieldRef} name={name} className={styles.textarea} sx={{
            color: 'ds.text.neutral.catchy',
        }} placeholder={placeholder} value={value || ''} disabled={disabled} onChange={(event) => {
            if (onChange) {
                onChange(event);
            }
        }}/>
    </div>);
};
