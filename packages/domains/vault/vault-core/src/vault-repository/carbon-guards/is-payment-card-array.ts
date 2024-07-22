import { PaymentCard } from "@dashlane/communication";
import { VaultItemType } from "@dashlane/vault-contracts";
import { isVaultItemArray } from "./is-vault-item-array";
export const isPaymentCardArray = (uut: unknown): uut is PaymentCard[] =>
  isVaultItemArray(uut, VaultItemType.PaymentCard);
