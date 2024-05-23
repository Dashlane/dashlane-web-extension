import * as React from 'react';
import classNames from 'classnames';
import { FlexContainer } from '@dashlane/ui-components';
import { jsx } from '@dashlane/design-system';
import styles from 'components/inputs/common/input/styles.css';
import { useSpacesContext } from 'src/app/vault/spaces-context';
import { SpaceIndicator } from 'src/components/space-indicator/space-indicator';
interface Props {
    id: string;
    label: string;
    spaceId: string;
    actions?: React.ReactNode;
}
const SpaceName: React.FunctionComponent<Props> = ({ id, label, spaceId, actions, }) => {
    const { getSpace } = useSpacesContext();
    const spaceData = getSpace(spaceId);
    if (!spaceData) {
        return null;
    }
    return (<div className={styles.container}>
      <label className={styles.inputContainer} htmlFor={id}>
        <span className={styles.label}>{label}</span>
        <FlexContainer>
          <SpaceIndicator spaceId={spaceId} sx={{ width: '20px', height: '20px' }}/>
          <input id={id} sx={{ color: 'ds.text.neutral.standard' }} className={classNames([styles.input, styles['text']])} value={spaceData.displayName} readOnly aria-readonly/>
        </FlexContainer>
      </label>
      {actions && <div className={styles.actionList}>{actions}</div>}
    </div>);
};
export default React.memo(SpaceName);
