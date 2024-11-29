import * as React from "react";
import { PersonalInfoIcon } from "@dashlane/ui-components";
import colors from "../../../../libs/dashlane-style/globals/color-variables.css";
import styles from "./styles.css";
interface Props {
  active?: boolean;
}
export const IconStatus = ({ active = false }: Props) => {
  return (
    <div className={active ? styles.iconActive : styles.iconInactive}>
      <PersonalInfoIcon
        color={active ? colors["--white"] : colors["--dash-green-00"]}
        size={20}
      />
    </div>
  );
};
