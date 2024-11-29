import { useCallback, useMemo, useState } from "react";
import { NameInput } from "./name-input/name-input";
import { SpaceInput } from "./space-input";
import { ShareableCollection } from "@dashlane/sharing-contracts";
export const useCollectionForm = ({
  initialName = "",
  initialSpaceId = "",
  lockedSpaceId,
  collections,
}: {
  initialName?: string;
  initialSpaceId?: string;
  lockedSpaceId?: string;
  collections: ShareableCollection[];
}) => {
  const [name, setName] = useState(initialName);
  const [spaceId, setSpaceId] = useState(lockedSpaceId ?? initialSpaceId ?? "");
  const [isDuplicate, setDuplicate] = useState(false);
  const trimmedName = useMemo(() => name.trim(), [name]);
  const isNameValid = useMemo(() => Boolean(trimmedName), [trimmedName]);
  const isLocked = useMemo(() => lockedSpaceId !== undefined, [lockedSpaceId]);
  const isDisabled = useMemo(
    () => !isNameValid || isDuplicate,
    [isDuplicate, isNameValid]
  );
  const checkDuplicate = useCallback(() => {
    const hasDuplicate = collections.some(
      (collection) =>
        collection.name === trimmedName && collection.spaceId === spaceId
    );
    setDuplicate(hasDuplicate);
    return hasDuplicate;
  }, [collections, spaceId, trimmedName]);
  const onNameChange = useCallback((newName: string) => {
    setName(newName);
    setDuplicate(false);
  }, []);
  return {
    name,
    spaceId,
    isNameValid,
    isDuplicate,
    isLocked,
    isDisabled,
    checkDuplicate,
    onNameChange,
    onSpaceChange: setSpaceId,
  };
};
export interface CollectionFormProps {
  name: string;
  spaceId: string;
  isLocked?: boolean;
  isDuplicated?: boolean;
  onNameChange: (newName: string) => void;
  onSpaceChange: (newSpaceId: string) => void;
}
export const CollectionFields = ({
  name,
  spaceId,
  isLocked,
  isDuplicated,
  onNameChange,
  onSpaceChange,
}: CollectionFormProps) => {
  return (
    <>
      <NameInput
        input={name}
        setInput={onNameChange}
        hasInputError={isDuplicated ?? false}
      />
      <SpaceInput
        spaceId={spaceId}
        setSpaceId={onSpaceChange}
        isLocked={isLocked}
      />
    </>
  );
};
