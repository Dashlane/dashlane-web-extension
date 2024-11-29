import styles from "./styles.css";
import makeButton from "../makeButton";
export default makeButton(styles.dropdown, {
  spinnerClassName: styles.loading,
  labelClassName: styles.labelContainer,
});
