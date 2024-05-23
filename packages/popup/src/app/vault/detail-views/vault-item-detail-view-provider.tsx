import { createContext, memo, ReactNode, useRef } from 'react';
import { jsx } from '@dashlane/ui-components';
import { VaultItemType } from '@dashlane/vault-contracts';
import usePopupPersistedState from 'src/app/UIState/usePopupPersistedState';
import { SecureNoteDetailView } from './secure-note-detail-view/secure-note-detail-view';
import { PaymentCardDetailView } from './payment-card-detail-view/payment-card-detail-view';
import { CredentialDetailView } from './credential-detail-view/credential-detail-view';
import { BankAccountDetailView } from './bank-account-detail-view/bank-account-detail-view';
import { EmailDetailView } from './personal-info-detail-view/email-detail-view/email-detail-view';
import { IdCardDetailView } from './ids-detail-view/id-card-detail-view/id-card-detail-view';
import { IdentityDetailView } from './personal-info-detail-view/identity-detail-view/identity-detail-view';
import { SocialSecurityIdDetailView } from './ids-detail-view/social-security-id-detail-view/social-security-id-view';
import { DriverLicenseDetailView } from './ids-detail-view/driver-license-detail-view/driver-license-detail-view';
import { PassportDetailView } from './ids-detail-view/passport-detail-view/passport-view';
import { FiscalIdDetailView } from './ids-detail-view/fiscal-id-detail-view/fiscal-id-view';
import { WebsiteDetailView } from './personal-info-detail-view/website-detail-view/website-view';
import { CompanyDetailView } from './personal-info-detail-view/company-detail-view/company-view';
import { AddressDetailView } from './personal-info-detail-view/address-detail-view/address-view';
import { PhoneDetailView } from './personal-info-detail-view/phone-detail-view/phone-view';
import { DetailViewModal } from './common/detail-view-modal';
export class ActiveItemDetail {
    type;
    id;
    constructor(type: VaultItemType, id: string) {
        this.type = type;
        this.id = id;
    }
    static get storageKey() {
        return 'vaultItemDetailView_activeItemKey';
    }
}
interface Context {
    openDetailView: (itemType: VaultItemType, itemId: string) => void;
}
interface VaultItemDetailViewProviderProps {
    children: ReactNode;
    onCloseModal?: () => void;
}
export const VaultItemDetailViewContext = createContext<Context>({} as Context);
const ItemTypeToDetailViewDictionary = {
    [VaultItemType.Address]: AddressDetailView,
    [VaultItemType.BankAccount]: BankAccountDetailView,
    [VaultItemType.Company]: CompanyDetailView,
    [VaultItemType.Credential]: CredentialDetailView,
    [VaultItemType.PaymentCard]: PaymentCardDetailView,
    [VaultItemType.DriversLicense]: DriverLicenseDetailView,
    [VaultItemType.Email]: EmailDetailView,
    [VaultItemType.FiscalId]: FiscalIdDetailView,
    [VaultItemType.IdCard]: IdCardDetailView,
    [VaultItemType.Identity]: IdentityDetailView,
    [VaultItemType.Passport]: PassportDetailView,
    [VaultItemType.Phone]: PhoneDetailView,
    [VaultItemType.SecureNote]: SecureNoteDetailView,
    [VaultItemType.SocialSecurityId]: SocialSecurityIdDetailView,
    [VaultItemType.Website]: WebsiteDetailView,
};
const VaultItemDetailViewProviderComponent = ({ children, onCloseModal, }: VaultItemDetailViewProviderProps) => {
    const [activeItem, setActiveItem] = usePopupPersistedState<ActiveItemDetail | null>(ActiveItemDetail.storageKey, null);
    const shouldSkipAnimationRef = useRef(true);
    const openDetailView = (itemType: VaultItemType, itemId: string) => {
        const activeItemDetail = new ActiveItemDetail(itemType, itemId);
        shouldSkipAnimationRef.current = false;
        setActiveItem(activeItemDetail);
    };
    const closeDetailView = () => {
        setActiveItem(null);
        onCloseModal?.();
    };
    const getActiveDetailView = (activeItem: ActiveItemDetail) => {
        const DetailViewComponent = ItemTypeToDetailViewDictionary[activeItem.type];
        return (<DetailViewComponent itemId={activeItem.id} onClose={closeDetailView}/>);
    };
    return (<VaultItemDetailViewContext.Provider value={{ openDetailView }}>
      {children}
      {activeItem && (<DetailViewModal onClose={closeDetailView} skipAnimation={shouldSkipAnimationRef.current}>
          {getActiveDetailView(activeItem)}
        </DetailViewModal>)}
    </VaultItemDetailViewContext.Provider>);
};
export const VaultItemDetailViewProvider = memo(VaultItemDetailViewProviderComponent);
