import { VaultHeader } from "../components/header/vault-header";
export const PasskeysHeader = () => {
  return (
    <VaultHeader
      tooltipPassThrough={false}
      tooltipContent={""}
      handleAddNew={(e) => {
        return;
      }}
      addNewDisabled={true}
      shareButtonElement={null}
      shouldDisplayNewAccountImportButton={false}
      shouldDisplayAddButton={false}
    />
  );
};
