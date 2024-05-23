import * as React from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { useAnalyticsInstallationId } from 'libs/carbon/hooks/useAnalyticsInstallationId';
import { Button, DialogFooter, FlexContainer, Paragraph, ThemeUIStyleObject, } from '@dashlane/ui-components';
import { SimpleDialog } from '../../libs/dashlane-style/dialogs/simple/simple-dialog';
interface DebugDataDialogProps {
    layout?: 'absolute' | 'none';
}
export const DebugDataDialog = ({ layout }: DebugDataDialogProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const installationIdQuery = useAnalyticsInstallationId();
    if (installationIdQuery.status !== DataStatus.Success) {
        return null;
    }
    if (!installationIdQuery.data) {
        return null;
    }
    const containerLayoutStyles: ThemeUIStyleObject = layout === 'absolute' ? { position: 'absolute', bottom: 0 } : {};
    return (<FlexContainer justifyContent="space-around" sx={containerLayoutStyles}>
      <Button type="button" nature="ghost" onClick={() => {
            setIsOpen(true);
        }}>
        Show Debug Data
      </Button>
      <SimpleDialog isOpen={isOpen} disableBackgroundPanelClose onRequestClose={() => setIsOpen(false)} aria-labelledby="dialogTitle" aria-describedby="dialogBody" title="Debug data" footer={<DialogFooter primaryButtonTitle="Close" primaryButtonOnClick={() => setIsOpen(false)} intent="secondary"/>}>
        <Paragraph>
          <strong>Installation ID: </strong> {installationIdQuery.data}
        </Paragraph>
      </SimpleDialog>
    </FlexContainer>);
};
