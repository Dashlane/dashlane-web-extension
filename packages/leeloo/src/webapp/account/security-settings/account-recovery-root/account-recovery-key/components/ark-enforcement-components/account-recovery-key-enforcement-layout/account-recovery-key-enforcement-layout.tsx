import { PropsWithChildren } from "react";
import { Logo } from "@dashlane/design-system";
import styles from "./account-recovery-key-enforcement-layout.css";
type Props = {
  illustrationSource: string;
};
export const ArkEnforcementLayout = ({
  children,
  illustrationSource,
}: PropsWithChildren<Props>) => {
  return (
    <div className={styles.flex}>
      <div className={styles.leftContainer}>
        <div
          role="banner"
          sx={{
            backgroundColor: "ds.background.alternate",
          }}
          className={styles.leftContent}
        >
          <div className={styles.dashlaneIcon}>
            <Logo height={40} name="DashlaneLockup" />
          </div>
          <div className={styles.illustrationContainer}>
            <img
              src={illustrationSource}
              className={styles.illustration}
              alt="secure passkeys illustration"
            />
          </div>
        </div>
      </div>
      <div
        className={styles.rightContainer}
        sx={{ backgroundColor: "ds.container.agnostic.neutral.supershy" }}
      >
        <div className={styles.rightContent}>{children}</div>
      </div>
    </div>
  );
};
