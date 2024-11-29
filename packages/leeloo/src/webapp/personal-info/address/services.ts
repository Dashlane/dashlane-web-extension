import { PhoneDataQuery } from "@dashlane/communication";
import { Lee } from "../../../lee";
import { getCurrentSpaceId } from "../../../libs/webapp";
import { compose } from "ramda";
const getPhonesFilterToken = ({
  lee,
}: {
  lee: Lee;
}): PhoneDataQuery["filterToken"] => {
  const currentSpaceId = getCurrentSpaceId(lee.globalState);
  if (currentSpaceId === null) {
    return {
      filterCriteria: [],
    };
  }
  return {
    filterCriteria: [
      {
        type: "equals",
        value: currentSpaceId,
        field: "spaceId",
      },
    ],
  };
};
export const phonesQueryParam = (props: { lee: Lee }): PhoneDataQuery => ({
  sortToken: { sortCriteria: [], uniqField: "id" },
  filterToken: getPhonesFilterToken(props),
});
export const phonesLiveParam = compose(btoa, JSON.stringify, phonesQueryParam);
