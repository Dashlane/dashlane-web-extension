import * as React from "react";
import { DisplayField, jsx } from "@dashlane/design-system";
import { useSpacesContext } from "../../../../app/vault/spaces-context";
interface Props {
  id: string;
  label: string;
  spaceId: string;
}
const SpaceName: React.FunctionComponent<Props> = ({ id, label, spaceId }) => {
  const { getSpace } = useSpacesContext();
  const spaceData = getSpace(spaceId);
  if (!spaceData) {
    return null;
  }
  return (
    <DisplayField
      id={id}
      label={label}
      value={spaceData.displayName}
      spaceIndicator={{
        color: spaceData.color,
        letter: spaceData.letter,
      }}
    />
  );
};
export default React.memo(SpaceName);
