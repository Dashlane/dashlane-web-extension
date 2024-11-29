import { PropsWithChildren } from "react";
import { Logo } from "@dashlane/design-system";
import styles from "./../styles.css";
type Props = {
  illustrationSource: string;
};
export const PinEnforcementLayout = ({
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
              alt="secure your account illustration"
            />
          </div>
        </div>
      </div>
      <div className={styles.rightContainer}>{children}</div>
    </div>
  );
};
