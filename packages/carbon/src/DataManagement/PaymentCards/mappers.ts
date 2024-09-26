import { PaymentCard } from "@dashlane/communication";
import { PaymentCardMappers } from "DataManagement/PaymentCards/types";
import { lastUseMapper } from "DataManagement/PersonalData/mappers";
export const getPaymentCardMappers = (): PaymentCardMappers => ({
  spaceId: (p: PaymentCard) => p.SpaceId,
  name: (p: PaymentCard) => p.Name,
  lastUse: lastUseMapper,
  id: (p: PaymentCard) => p.Id,
});
