import { jsx, Paragraph } from '@dashlane/design-system';
import { useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { Country } from '@dashlane/vault-contracts';
import { carbonConnector } from 'libs/carbon/connector';
interface Props {
    bankCode: string;
    country: Country;
}
const useBankDetails = ({ bankCode, country }: Props) => {
    const banksResult = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getBanks,
            queryParam: { country },
        },
    }, []);
    if (banksResult.status !== 'success') {
        return undefined;
    }
    return banksResult.data.banks?.find((bankDetail) => bankDetail.code === bankCode.split('-').pop());
};
export const LocalizedBankName = (props: Props) => {
    const bankDetails = useBankDetails(props);
    return (<Paragraph color="ds.text.neutral.quiet" textStyle="ds.body.standard.regular" sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }}>
      {bankDetails?.localizedString || ''}
    </Paragraph>);
};
