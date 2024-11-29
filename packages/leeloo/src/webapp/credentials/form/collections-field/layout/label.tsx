import { HTMLProps } from "react";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { useSpaceName } from "../../../../collections/use-space-name";
import { useCollectionsFieldContext } from "../collections-field-context";
interface Props extends HTMLProps<HTMLLabelElement> {
  hasMultipleCollections: boolean;
}
export const Label = ({ hasMultipleCollections, ...rest }: Props) => {
  const { vaultItem } = useCollectionsFieldContext();
  const spaceName = useSpaceName(vaultItem.spaceId);
  const { translate } = useTranslate();
  return (
    <label
      sx={{
        display: "flex",
        width: "149px",
        justifyContent: "flex-end",
        fontWeight: "600",
        textAlign: "right",
      }}
      {...rest}
    >
      <span
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {spaceName && (
          <>
            {`${spaceName}`}
            <br />
          </>
        )}
        {translate(
          hasMultipleCollections
            ? "webapp_credentials_header_row_category"
            : "webapp_credential_edition_field_category"
        )}
      </span>
    </label>
  );
};
