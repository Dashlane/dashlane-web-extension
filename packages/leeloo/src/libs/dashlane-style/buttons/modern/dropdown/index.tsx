import styles from './styles.css';
import makeButton from 'libs/dashlane-style/buttons/modern/makeButton';
export default makeButton(styles.dropdown, {
    spinnerClassName: styles.loading,
    labelClassName: styles.labelContainer,
});
