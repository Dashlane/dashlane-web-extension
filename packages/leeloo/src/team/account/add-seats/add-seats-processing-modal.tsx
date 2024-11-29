import { Flex, IndeterminateLoader, Paragraph } from "@dashlane/design-system";
import { Modal } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  ADD_SEATS_PROCESSING_LINE_1: "team_account_addseats_processing_copy_line_1",
  ADD_SEATS_PROCESSING_LINE_2: "team_account_addseats_processing_copy_line_2",
};
export const AddSeatsProcessingModal = () => {
  const { translate } = useTranslate();
  return (
    <Modal isOpen={true} onClose={() => {}}>
      <Flex
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        sx={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "ds.background.default",
        }}
      >
        <IndeterminateLoader size="xlarge" />
        <Flex
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          gap="6px"
          sx={{ paddingTop: "22px" }}
        >
          <Paragraph
            textStyle="ds.body.reduced.regular"
            color="ds.text.neutral.quiet"
          >
            {translate(I18N_KEYS.ADD_SEATS_PROCESSING_LINE_1)}
          </Paragraph>
          <Paragraph
            textStyle="ds.body.reduced.regular"
            color="ds.text.neutral.quiet"
          >
            {translate(I18N_KEYS.ADD_SEATS_PROCESSING_LINE_2)}
          </Paragraph>
        </Flex>
      </Flex>
    </Modal>
  );
};
