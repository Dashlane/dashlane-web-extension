import { Fragment } from 'react';
import { DeviceTransferContracts } from '@dashlane/authentication-contracts';
import { Button, Heading, jsx, Paragraph } from '@dashlane/design-system';
import { useModuleCommands } from '@dashlane/framework-react';
import { FlexContainer } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
const instructionLineStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bg: 'ds.container.expressive.brand.quiet.idle',
    width: '30px',
    height: '30px',
    borderRadius: '3000px',
    padding: '3px',
    marginRight: '12px',
};
export const I18N_KEYS = {
    TITLE: 'webapp_device_transfer_page_no_request_instructions_title',
    FIRST_INSTRUCTION: 'webapp_device_transfer_page_no_request_instructions_first_paragraph',
    SECOND_INSTRUCTION: 'webapp_device_transfer_page_no_request_instructions_second_paragraph',
    THIRD_INSTRUCTION: 'webapp_device_transfer_page_no_request_instructions_third_paragraph',
    REFRESH_BUTTON: 'webapp_device_transfer_page_no_request_refresh_button',
};
export const DeviceTransferInstructions = () => {
    const { translate } = useTranslate();
    const { refreshRequest } = useModuleCommands(DeviceTransferContracts.deviceTransferApi);
    const onRefreshRequestClick = async () => {
        await refreshRequest();
    };
    return (<>
      <Heading as="h2" textStyle="ds.title.section.medium" sx={{ marginBottom: '32px' }}>
        {translate(I18N_KEYS.TITLE)}
      </Heading>
      <FlexContainer alignItems="center">
        <div sx={instructionLineStyle}>
          <Paragraph color="ds.text.brand.standard" textStyle="ds.body.standard.strong">
            1
          </Paragraph>
        </div>
        <Paragraph>{translate(I18N_KEYS.FIRST_INSTRUCTION)}</Paragraph>
      </FlexContainer>
      <FlexContainer alignItems="center" sx={{ margin: '24px 0' }}>
        <div sx={instructionLineStyle}>
          <Paragraph color="ds.text.brand.standard" textStyle="ds.body.standard.strong">
            2
          </Paragraph>
        </div>
        <Paragraph>{translate(I18N_KEYS.SECOND_INSTRUCTION)}</Paragraph>
      </FlexContainer>
      <FlexContainer alignItems="center">
        <div sx={instructionLineStyle}>
          <Paragraph color="ds.text.brand.standard" textStyle="ds.body.standard.strong">
            3
          </Paragraph>
        </div>
        <Paragraph>{translate(I18N_KEYS.THIRD_INSTRUCTION)}</Paragraph>
      </FlexContainer>
      <Button mood="neutral" intensity="quiet" sx={{ alignSelf: 'flex-end', marginTop: '32px' }} onClick={onRefreshRequestClick}>
        {translate(I18N_KEYS.REFRESH_BUTTON)}
      </Button>
    </>);
};
