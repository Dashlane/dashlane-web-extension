import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { CollectionInput } from "../../../../collections-layout";
import { Label } from "../layout/label";
import { ErrorMessage } from "./error-message";
interface Props {
  input: string;
  setInput: (input: string) => void;
  hasInputError: boolean;
}
const inputId = "createActionSidemenuInputId";
export const NameInput = ({ input, setInput, hasInputError }: Props) => {
  const { translate } = useTranslate();
  return (
    <>
      <Label htmlFor={inputId}>
        {translate("collections_dialog_create_name_input_label")}
      </Label>
      <CollectionInput id={inputId} input={input} setInput={setInput} />
      {hasInputError && <ErrorMessage />}
    </>
  );
};
