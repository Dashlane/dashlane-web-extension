import { Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { MAX_AUTHORIZED_CHARACTERS } from "./secure-note-content-form";
const I18N_KEYS = {
  CONTENT_SIZE: "webapp_secure_notes_edition_field_text_content_size",
  CONTENT_OVER_LIMIT:
    "webapp_secure_notes_edition_field_text_content_over_limit",
};
interface Props {
  isMaxSizeReached: boolean;
  maxSize?: number;
  currentSize: number;
}
export const TextMaxSizeReached = ({
  isMaxSizeReached,
  currentSize,
  maxSize = MAX_AUTHORIZED_CHARACTERS,
}: Props) => {
  const { translate } = useTranslate();
  const text = isMaxSizeReached
    ? translate(I18N_KEYS.CONTENT_OVER_LIMIT, {
        overLimit: currentSize.toLocaleString(),
        maxSize: maxSize.toLocaleString(),
      })
    : `${currentSize.toLocaleString()} /${maxSize.toLocaleString()} ${translate(
        I18N_KEYS.CONTENT_SIZE
      )}`;
  return (
    <Paragraph
      textStyle="ds.body.helper.regular"
      color={
        isMaxSizeReached ? "ds.text.danger.quiet" : "ds.text.neutral.quiet"
      }
      sx={{
        fontSize: "11px",
        textAlign: "left",
      }}
    >
      {text}
    </Paragraph>
  );
};
