import { FormEvent, useRef, useState } from 'react';
import { jsx } from '@dashlane/design-system';
import { useCollectionsContext } from 'webapp/vault/collections-context';
import { NameInput } from './name-input/name-input';
import { SpaceInput } from './space-input';
export interface CollectionFormProps {
    formId: string;
    onSubmit: (collectionName: string, spaceId: string) => Promise<void>;
    setIsSubmitDisabled: (disabled: boolean) => void;
    name?: string;
    lockedSpaceId?: string;
}
export const CollectionForm = ({ formId, onSubmit, setIsSubmitDisabled, name = '', lockedSpaceId, }: CollectionFormProps) => {
    const { collections } = useCollectionsContext();
    const [collectionAlreadyExist, setCollectionAlreadyExist] = useState(false);
    const [input, setInput] = useState(name);
    const [spaceId, setSpaceId] = useState(lockedSpaceId ?? '');
    const nameMementoRef = useRef(name);
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const collectionName = input.trim();
        if (collections.some((collection) => collection.name === collectionName && collection.spaceId === spaceId)) {
            return setCollectionAlreadyExist(true);
        }
        await onSubmit(collectionName, spaceId);
        setInput('');
    };
    const isInputValid = (input: string) => {
        const trimmedInput = input.trim();
        return Boolean(trimmedInput) && trimmedInput !== nameMementoRef.current;
    };
    const onInputChange = (newInput: string) => {
        setInput(newInput);
        setCollectionAlreadyExist(false);
        setIsSubmitDisabled(!isInputValid(newInput));
    };
    return (<form id={formId} onSubmit={handleSubmit}>
      <NameInput input={input} setInput={onInputChange} hasInputError={collectionAlreadyExist}/>
      <SpaceInput spaceId={spaceId} setSpaceId={setSpaceId} isLocked={lockedSpaceId !== undefined}/>
    </form>);
};
