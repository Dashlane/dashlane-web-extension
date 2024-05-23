import { Infobox, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    TITLE: 'webapp_collections_paywall_business_trial_title',
    DESCRIPTION: 'webapp_collections_paywall_business_trial_description',
};
interface TrialBusinessCollectionViewInfoboxProps {
    className?: string;
}
export const TrialBusinessCollectionSharingInfobox = ({ className, }: TrialBusinessCollectionViewInfoboxProps) => {
    const { translate } = useTranslate();
    return (<Infobox title={translate(I18N_KEYS.TITLE)} description={translate(I18N_KEYS.DESCRIPTION)} mood="brand" className={className}/>);
};
