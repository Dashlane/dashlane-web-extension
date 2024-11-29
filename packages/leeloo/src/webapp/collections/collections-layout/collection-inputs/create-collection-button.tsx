import { Button } from "@dashlane/design-system";
import { Collection } from "@dashlane/vault-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { CollectionText } from "../collection-text";
interface Props {
  collections: Collection[];
  input: string;
  onClick: (collectionName: string) => void;
}
export const CreateCollectionButton = ({
  collections,
  input,
  onClick,
}: Props) => {
  const { translate } = useTranslate();
  const isInputEqualToExistingCollection = collections.some(
    (collection) => collection.name === input
  );
  if (!input.trim() || isInputEqualToExistingCollection) {
    return null;
  }
  return (
    <li sx={{ display: "flex", alignItems: "center" }}>
      <CollectionText
        style={{
          color: "ds.text.brand.standard",
          margin: "0 12px",
          overflow: "unset",
          width: "fit-content",
        }}
      >
        {translate("webapp_collections_input_create")}
      </CollectionText>
      <Button
        onClick={() => onClick(input)}
        intensity="quiet"
        mood="neutral"
        sx={{ overflow: "hidden" }}
      >
        <CollectionText>{input}</CollectionText>
      </Button>
    </li>
  );
};
