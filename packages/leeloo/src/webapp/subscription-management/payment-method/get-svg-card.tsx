import VisaIcon from "../../account/account-details/images/visa.svg?inline";
import MasterCardIcon from "../../account/account-details/images/mastercard.svg?inline";
import AmexCardIcon from "../../account/account-details/images/amex.svg?inline";
import DiscoverCardIcon from "../../account/account-details/images/discover-card.svg?inline";
export const getSvgCard = (type: string | undefined) => {
  switch (type) {
    case "visa":
      return <VisaIcon style={{ borderRadius: "3px" }} />;
    case "mastercard":
      return <MasterCardIcon style={{ borderRadius: "3px" }} />;
    case "american express":
    case "amex":
      return <AmexCardIcon style={{ borderRadius: "3px" }} />;
    case "discover":
      return <DiscoverCardIcon style={{ borderRadius: "3px" }} />;
    default:
      return null;
  }
};
