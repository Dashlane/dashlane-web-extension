import { DSStyleObject, mergeSx, Modal } from "@dashlane/design-system";
import { Search } from "./search";
import { useSearchContext } from "./search-context";
const PLACEMENT = { top: "48px", transform: "translate(-50%, 0)" };
const INTERNAL_PADDING_RESET: Partial<DSStyleObject> = {
  "& > div": { padding: 0 },
};
export const SearchWrapper = () => {
  const { isOpen, closeSearch } = useSearchContext();
  const handleOnClose = () => {
    closeSearch();
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleOnClose}
      sx={mergeSx([PLACEMENT, INTERNAL_PADDING_RESET])}
    >
      <Search />
    </Modal>
  );
};
