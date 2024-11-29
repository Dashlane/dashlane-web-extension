import styles from "./styles.css";
import makeButton from "../makeButton";
export default makeButton(styles.secondary, {
  spinnerClassName: styles.loading,
  darkClassName: styles.dark,
});
export { styles };
