import * as React from 'react';
import IntelligentTooltipOnOverflow from 'libs/dashlane-style/intelligent-tooltip-on-overflow';
import styles from '../styles.css';
import { SharingCenterIcon } from '@dashlane/ui-components';
import { Icon } from '@dashlane/design-system';
import { Secret } from '@dashlane/vault-contracts';
import { useModuleQuery } from '@dashlane/framework-react';
import { sharingItemsApi } from '@dashlane/sharing-contracts';
interface Props {
    secret: Secret;
    showTitleIcons?: boolean;
    tag?: React.ReactNode;
}
export const SecretTitle = ({ secret, showTitleIcons = true, tag }: Props) => {
    const { data: sharingData } = useModuleQuery(sharingItemsApi, 'getSharingStatusForItem', {
        itemId: secret.id,
    });
    return (<div className={styles.titleOuterWrapper}>
      <Icon name="RecoveryKeyOutlined" color="ds.text.neutral.standard"/>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>
          <IntelligentTooltipOnOverflow tooltipText={secret.title} className={styles.container}>
            {secret.title}
          </IntelligentTooltipOnOverflow>
          {tag ? <div className={styles.tagPlacement}>{tag}</div> : null}
          {sharingData?.isShared && showTitleIcons && (<div className={styles.titleIcon}>
              <SharingCenterIcon size={12}/>
            </div>)}
        </div>
      </div>
    </div>);
};
