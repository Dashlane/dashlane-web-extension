import { useHistory } from 'react-router-dom';
import { Badge, Button, Heading, jsx, Paragraph, } from '@dashlane/design-system';
import { FlexContainer } from '@dashlane/ui-components';
import { useFeatureFlip } from '@dashlane/framework-react';
type Props = React.PropsWithChildren<{
    title: string;
    paragraph?: string;
    badgeLabel?: string;
    showBackButton?: boolean;
    onBackClicked?: () => void;
}>;
export const BackPageLayout = ({ title, paragraph, badgeLabel, children, onBackClicked, showBackButton = true, }: Props) => {
    const history = useHistory();
    const isNewScimUIActivated = useFeatureFlip('setup_rollout_confidential_scim_prod');
    const navigateBack = onBackClicked ??
        (() => {
            history.push('.');
        });
    if (isNewScimUIActivated === null) {
        return null;
    }
    return (<div sx={{ padding: '24px 0' }}>
      {isNewScimUIActivated ? (<div sx={{ padding: '0 32px' }}>
          <FlexContainer flexDirection="row" gap="8px" sx={{ marginBottom: '16px' }} alignItems="center">
            {showBackButton}
            <Button layout="iconOnly" icon="CaretLeftOutlined" intensity="supershy" mood="neutral" onClick={navigateBack}/>
            <Heading as="h1" textStyle="ds.title.section.large">
              {title}
            </Heading>
            {badgeLabel ? <Badge label={badgeLabel} mood="brand"/> : null}
          </FlexContainer>
          {paragraph ? (<Paragraph sx={{ marginBottom: '32px' }}>{paragraph}</Paragraph>) : null}
        </div>) : null}
      {children}
    </div>);
};
