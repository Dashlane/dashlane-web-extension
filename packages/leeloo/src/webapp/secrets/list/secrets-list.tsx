import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { useFeatureFlip } from "@dashlane/framework-react";
import { Secret } from "@dashlane/vault-contracts";
import { SecretsEmptyState } from "../empty-state/secrets-empty-state";
import { PaywallManager, PaywallName } from "../../paywall";
import { SecretEmptyView } from "./secret-empty-view";
import { SecretRow } from "./secret-row";
import { SX_STYLES } from "./styles";
export interface Props {
  className?: string;
  header: JSX.Element;
  secrets: Secret[];
}
export const SecretsList = ({ className, header, secrets }: Props) => {
  const emptyStateBatch2FeatureFlip = useFeatureFlip(
    FEATURE_FLIPS_WITHOUT_MODULE.EmptyStateBatch2
  );
  if (!secrets.length) {
    return (
      <PaywallManager mode="fullscreen" paywall={PaywallName.SecureNote}>
        {emptyStateBatch2FeatureFlip ? (
          <SecretsEmptyState />
        ) : (
          <SecretEmptyView />
        )}
      </PaywallManager>
    );
  }
  return (
    <div
      sx={{
        fontSize: "15px",
        color: "hsl(0, 0%, 11%)",
        whiteSpace: "nowrap",
        position: "relative",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {header}
      <div className={className} sx={SX_STYLES.LIST}>
        <ul
          sx={{
            height: "100%",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          {secrets.map((secret: Secret) => (
            <SecretRow
              key={`secrets_list_secretId_${secret.id}`}
              secret={secret}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
