import { Fragment, PropsWithChildren } from 'react';
import { Badge, FlexContainer, GridChild, GridContainer, } from '@dashlane/ui-components';
import { Heading, jsx } from '@dashlane/design-system';
interface Props {
    sectionTitle?: React.ReactNode;
    action?: React.ReactNode;
    isBeta?: boolean;
}
export const SettingsSection = ({ sectionTitle, action, children, isBeta, }: PropsWithChildren<Props>) => {
    return (<>
      <hr sx={{
            border: 'none',
            borderTop: '1px solid transparent',
            margin: 0,
            width: '100%',
            borderColor: 'ds.border.neutral.quiet.idle',
        }}/>
      <GridContainer gap="8px" sx={{ padding: '16px' }} gridTemplateColumns="auto">
        {sectionTitle ? (<FlexContainer as="header" alignItems="center" flexDirection="row" flexWrap="nowrap" fullWidth gap="8px" justifyContent="space-between">
            <Heading as="h2" textStyle="ds.title.block.medium" color="ds.text.neutral.catchy">
              {sectionTitle}
            </Heading>
            {action}
          </FlexContainer>) : null}
        {isBeta ? (<GridChild justifySelf="flex-start">
            <Badge intent="info">BETA</Badge>
          </GridChild>) : null}
        {children}
      </GridContainer>
    </>);
};
