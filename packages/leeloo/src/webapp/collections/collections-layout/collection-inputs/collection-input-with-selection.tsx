import { ForwardedRef, Fragment, HTMLProps } from "react";
import { Tag } from "@dashlane/design-system";
import { DataStatus } from "@dashlane/framework-react";
import { ShareableCollection } from "@dashlane/sharing-contracts";
import { useIsPersonalSpaceDisabled } from "../../../../libs/hooks/use-is-personal-space-disabled";
import { CollectionInput } from "../../collections-layout";
import { Dropdown, UlColumn } from "./layout";
import { CreateCollectionButton } from "./create-collection-button";
interface Props extends Omit<HTMLProps<HTMLDivElement>, "onSubmit"> {
  collections: ShareableCollection[];
  id: string;
  input: string;
  spaceId: string;
  onSubmit: (collectionName?: string) => void;
  setInput: (newInput: string) => void;
  inputRef?: ForwardedRef<HTMLInputElement>;
  selectionAsDropdown?: boolean;
}
export const CollectionInputWithSelection = ({
  collections,
  id,
  input,
  spaceId,
  setInput,
  onSubmit,
  inputRef,
  selectionAsDropdown = false,
  ...rest
}: Props) => {
  const isPersonalSpaceDisabledResult = useIsPersonalSpaceDisabled();
  const DropdownOrFragment = selectionAsDropdown ? Dropdown : Fragment;
  const filteredCollections = collections.filter((collection) =>
    isPersonalSpaceDisabledResult.status === DataStatus.Success &&
    isPersonalSpaceDisabledResult.isDisabled
      ? collection.name.toLowerCase().includes(input.toLowerCase())
      : collection.spaceId === spaceId &&
        collection.name.toLowerCase().includes(input.toLowerCase())
  );
  return (
    <div sx={{ position: "relative", width: "240px" }} {...rest}>
      <CollectionInput
        ref={inputRef}
        id={id}
        input={input}
        onSubmit={() => onSubmit(input)}
        setInput={setInput}
      />
      {(filteredCollections.length || Boolean(input.trim())) && (
        <DropdownOrFragment>
          <UlColumn>
            <CreateCollectionButton
              collections={filteredCollections}
              input={input}
              onClick={onSubmit}
            />
            {filteredCollections.map((collection) => (
              <li
                key={`${id}_collection_input_${collection.id}`}
                sx={{ width: "fit-content", maxWidth: "100%" }}
              >
                <Tag
                  label={collection.name}
                  isClickable
                  highlightedText={input}
                  trailingIcon={
                    collection.isShared ? "SharedOutlined" : undefined
                  }
                  onClick={() => onSubmit(collection.name)}
                />
              </li>
            ))}
          </UlColumn>
        </DropdownOrFragment>
      )}
    </div>
  );
};
