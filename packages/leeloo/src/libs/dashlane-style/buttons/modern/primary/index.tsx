import styles from "./styles.css";
import makeButton from "../makeButton";
export default makeButton(styles.primary, {
  spinnerClassName: styles.loading,
  darkClassName: styles.dark,
});
