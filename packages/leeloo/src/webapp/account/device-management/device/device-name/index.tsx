import * as React from 'react';
import classnames from 'classnames';
import { Heading } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './styles.css';
const I18N_KEYS = {
    SET_NAME_PLACEHOLDER: 'webapp_account_devices_device_set_name_placeholder',
    NAME_UNNAMED: 'webapp_account_devices_device_name_unnamed',
};
enum SaveFeedbackState {
    'Off',
    'InProgress',
    'Saved'
}
const SAVE_FEEDBACK_DURATION_MS = 700;
export interface Props {
    name: string;
    onSave: (deviceName: string, feedbackDurationMs: number) => void;
    onCancel: () => void;
    onChange?: () => void;
    canToggle: boolean;
}
export const DeviceName = ({ name, onSave, onCancel, onChange, canToggle, }: Props) => {
    const { translate } = useTranslate();
    const inputRef = React.createRef<HTMLInputElement>();
    const timer = React.useRef<NodeJS.Timeout | null>(null);
    const [editMode, setEditMode] = React.useState(false);
    const [pendingName, setPendingName] = React.useState<string | null>(null);
    const [saveFeedbackState, setSaveFeedbackState] = React.useState<SaveFeedbackState>(SaveFeedbackState.Off);
    React.useEffect(() => {
        if (editMode) {
            inputRef.current?.focus();
        }
    }, [editMode]);
    React.useEffect(() => {
        return () => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, []);
    const onSubmit = () => {
        const newName = inputRef.current?.value ?? '';
        const shouldSaveName = newName && newName !== name;
        setEditMode(false);
        setSaveFeedbackState(shouldSaveName ? SaveFeedbackState.InProgress : SaveFeedbackState.Off);
        if (shouldSaveName) {
            setPendingName(newName);
            onSave(newName, SAVE_FEEDBACK_DURATION_MS);
            timer.current = setTimeout(() => {
                setPendingName(null);
                setSaveFeedbackState(SaveFeedbackState.Saved);
            }, SAVE_FEEDBACK_DURATION_MS);
        }
        else if (onCancel) {
            onCancel();
        }
    };
    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSubmit();
        }
    };
    const onClick = () => {
        if (!canToggle) {
            return;
        }
        setEditMode(true);
        setSaveFeedbackState(SaveFeedbackState.Off);
        setPendingName(null);
        if (onChange) {
            onChange();
        }
    };
    const getReadOnlyField = () => {
        const _name = (pendingName ?? name) || translate(I18N_KEYS.NAME_UNNAMED);
        return (<Heading as="h2" title={_name} className={classnames({
                [styles.name]: true,
                [styles.hintEditField]: saveFeedbackState !== SaveFeedbackState.InProgress && canToggle,
            })}>
        <button onClick={onClick}>{_name}</button>
      </Heading>);
    };
    return (<div className={styles.wrap}>
      {editMode ? (<input role="heading" aria-level={2} type="text" ref={inputRef} onBlur={() => onSubmit()} onKeyDown={(event) => onKeyDown(event)} className={styles.input} placeholder={translate(I18N_KEYS.SET_NAME_PLACEHOLDER)} defaultValue={name}/>) : (getReadOnlyField())}
      <div className={classnames({
            [styles.wrapIcon]: true,
            [styles.visible]: saveFeedbackState === SaveFeedbackState.InProgress,
            [styles.hidden]: saveFeedbackState === SaveFeedbackState.Saved,
        })}>
        <div className={classnames({
            [styles.icon]: true,
            [styles.saved]: saveFeedbackState !== SaveFeedbackState.Off,
        })}/>
      </div>
    </div>);
};
