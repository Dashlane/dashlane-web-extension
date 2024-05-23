import styles from './styles.css';
import makeButton from 'libs/dashlane-style/buttons/modern/makeButton';
export default makeButton(styles.secondary, {
    spinnerClassName: styles.loading,
    darkClassName: styles.dark,
});
export { styles };
