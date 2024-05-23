import { useEffect, useMemo, useRef, useState } from 'react';
import { Eyebrow, IconButton, InfoCircleIcon, Paragraph, Tooltip, } from '@dashlane/ui-components';
import { jsx } from '@dashlane/design-system';
import { ParsedURL } from '@dashlane/url-parser';
import { DataModelType, ParsedCSVData, PremiumStatusSpace, SupportedVaultItemKeys, } from '@dashlane/communication';
import { DataStatus } from '@dashlane/framework-react';
import { useSpaces } from 'libs/carbon/hooks/useSpaces';
import { useIsPersonalSpaceDisabled } from 'libs/hooks/use-is-personal-space-disabled';
import useTranslate from 'libs/i18n/useTranslate';
import LoadingSpinner from 'libs/dashlane-style/loading-spinner';
import { headerCellStyles } from './styles';
import { useImportPreviewContext } from '../hooks/useImportPreviewContext';
import { ImportPreviewTableData } from './import-preview-table-data';
const I18N_KEYS = {
    ITEM_TYPE_TOOLTIP: 'webapp_import_preview_item_type_tooltip',
    SPACE_TOOLTIP: 'webapp_import_preview_space_tooltip_markup',
    SMART_SPACE_TOOLTIP: 'webapp_import_preview_smart_space_tooltip',
    TOOLTIP_SHOW_LABEL: '_common_password_show_label',
    TOOLTIP_HIDE_LABEL: '_common_password_hide_label',
};
export const I18N_HEADER_KEYS: Record<string | SupportedVaultItemKeys | 'Other', string> = {
    Url: 'webapp_import_preview_header_url',
    Login: 'webapp_import_preview_header_login',
    Password: 'webapp_import_preview_header_password',
    OtpSecret: 'webapp_import_preview_header_otp',
    Note: 'webapp_import_preview_header_notes',
    Title: 'webapp_import_preview_header_name',
    kwType: 'webapp_import_preview_header_type',
    SpaceId: 'webapp_import_preview_header_space',
    Other: 'webapp_import_preview_header_other',
    CardNumber: 'webapp_import_preview_header_card_number',
    OwnerName: 'webapp_import_preview_header_card_owner',
    SecurityCode: 'webapp_import_preview_header_card_security_code',
    ExpireMonth: 'webapp_import_preview_header_card_expiry_month',
    ExpireYear: 'webapp_import_preview_header_card_expiry_year',
    BankAccountName: 'webapp_import_preview_header_bank_name',
    BankAccountIBAN: 'webapp_import_preview_header_bank_IBAN_account_number',
    BankAccountBIC: 'webapp_import_preview_header_bank_SWIFT_routing_number',
};
export type ImportDataModelType = Extract<DataModelType, 'KWAuthentifiant' | 'KWSecureNote' | 'KWBankStatement' | 'KWPaymentMean_creditCard'> | 'DoNotImport';
export interface ImportPreviewTableProps {
    tableHeaders: ParsedCSVData['headers'];
    tableData: {
        [itemId: string]: ParsedCSVData['items'][number];
    };
    setTableData: React.Dispatch<React.SetStateAction<{
        [itemId: string]: ParsedCSVData['items'][number];
    }>>;
    setHasChanges: (changes: boolean) => void;
}
export const ImportPreviewTable = ({ tableHeaders, tableData, setTableData, setHasChanges, }: ImportPreviewTableProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLTableElement>(null);
    const spaces = useSpaces();
    const { defaultSpace } = useImportPreviewContext();
    const [spaceList, setSpaceList] = useState<PremiumStatusSpace[]>([]);
    const [isForcedDomainsEnabled, setIsForcedDomainsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [disabledItemRows, setDisabledItemRows] = useState<string[]>([]);
    const memoizedForcedSpaceDomainsMap: Map<string, string[]> = useMemo(() => {
        const forcedSpaceDomainsMap = new Map<string, string[]>();
        if (spaces.status === DataStatus.Success) {
            spaces.data.forEach((space: PremiumStatusSpace) => {
                if (space.info?.forcedDomainsEnabled) {
                    if (!isForcedDomainsEnabled) {
                        setIsForcedDomainsEnabled(true);
                    }
                    forcedSpaceDomainsMap.set(space.teamId, space.info?.teamDomains ?? []);
                }
            });
        }
        return forcedSpaceDomainsMap;
    }, [isForcedDomainsEnabled, spaces]);
    const isPersonalSpaceDisabled = useIsPersonalSpaceDisabled();
    const shouldDisplaySpaceSelector = isPersonalSpaceDisabled.status === DataStatus.Success &&
        !isPersonalSpaceDisabled.isDisabled;
    const { translate } = useTranslate();
    useEffect(() => {
        if (spaces.status === DataStatus.Success) {
            setSpaceList(spaces.data);
        }
        if (spaces.status !== DataStatus.Loading) {
            setIsLoading(false);
        }
    }, [memoizedForcedSpaceDomainsMap, isForcedDomainsEnabled, spaces]);
    useEffect(() => {
        if (isLoading) {
            return;
        }
        Object.keys(tableData).forEach((itemId) => {
            const item = tableData[itemId];
            if (!item) {
                return;
            }
            const credentialUrl = item.baseDataModel['Url'];
            const credentialEmail = item.baseDataModel['Email'];
            const credentialLogin = item.baseDataModel['Login'];
            const hasSmartSpaceField = credentialUrl || credentialEmail || credentialLogin;
            const currentItemSpaceId = item.baseDataModel['SpaceId'];
            let newSpaceId = defaultSpace ?? currentItemSpaceId;
            if (hasSmartSpaceField) {
                const credentialDomain = new ParsedURL(credentialUrl).getRootDomain();
                const emailDomain = new ParsedURL(credentialEmail).getRootDomain();
                const loginDomain = new ParsedURL(credentialLogin).getRootDomain();
                for (const [spaceId, domains] of memoizedForcedSpaceDomainsMap) {
                    if (domains.includes(credentialDomain) ||
                        domains.includes(emailDomain) ||
                        domains.includes(loginDomain)) {
                        newSpaceId = spaceId;
                        setDisabledItemRows((current) => [...current, itemId]);
                        break;
                    }
                }
            }
            if (currentItemSpaceId !== newSpaceId) {
                item.baseDataModel['SpaceId'] = newSpaceId;
                setTableData((prevTableData) => ({
                    ...prevTableData,
                    [itemId]: item,
                }));
            }
        });
    }, [defaultSpace, memoizedForcedSpaceDomainsMap, isLoading]);
    const handleSpaceSelectChange = (itemId: string, spaceId: string) => {
        const item = tableData[itemId];
        if (item) {
            item.baseDataModel['SpaceId'] = spaceId;
            setTableData((prevTableData) => ({
                ...prevTableData,
                [itemId]: item,
            }));
            setHasChanges(true);
        }
    };
    const handleItemTypeChange = (itemId: string, modelType: ImportDataModelType) => {
        const item = tableData[itemId];
        if (item) {
            if (modelType === DataModelType.KWSecureNote) {
                if (item.rawData['Content']) {
                    item.baseDataModel['Content'] = item.rawData['Content'];
                }
                else {
                    item.baseDataModel['Content'] = Object.entries(item.rawData).reduce((prev, [key, value]) => {
                        return value ? prev + ` ${key}: ${value} \n` : '';
                    }, '');
                }
            }
            item.baseDataModel.kwType =
                modelType !== 'DoNotImport' ? modelType : undefined;
            setTableData((prevTableData) => ({
                ...prevTableData,
                [itemId]: item,
            }));
            setHasChanges(true);
        }
    };
    if (isLoading) {
        return <LoadingSpinner />;
    }
    return (<div sx={{ display: 'inline-grid', position: 'relative', marginY: '24px' }}>
      <div ref={wrapperRef} sx={{
            overflow: 'auto',
            scrollSnapType: 'x mandatory',
            maxHeight: '50vh',
        }} role="region" aria-label="Import Data Table">
        <table ref={tableRef} sx={{
            width: '100%',
        }}>
          <thead sx={{ position: 'sticky', zIndex: 1 }}>
            <tr>
              <th sx={headerCellStyles}>
                <Eyebrow size="medium">
                  {translate(I18N_HEADER_KEYS.kwType)}
                </Eyebrow>
                <Tooltip content={<div>{translate(I18N_KEYS.ITEM_TYPE_TOOLTIP)}</div>} placement="top">
                  <IconButton sx={{
            verticalAlign: 'middle',
        }} aria-label={translate(I18N_HEADER_KEYS.kwType)} icon={<InfoCircleIcon />}/>
                </Tooltip>
              </th>
              {spaceList.length && shouldDisplaySpaceSelector ? (<th sx={headerCellStyles}>
                  <Eyebrow size="medium">
                    {translate(I18N_HEADER_KEYS.SpaceId)}
                  </Eyebrow>
                  <Tooltip content={<div>
                        {isForcedDomainsEnabled
                    ? translate(I18N_KEYS.SMART_SPACE_TOOLTIP)
                    : translate.markup(I18N_KEYS.SPACE_TOOLTIP, {
                        spaceName: spaceList[0].teamName,
                    })}
                      </div>} placement="top">
                    <IconButton sx={{
                verticalAlign: 'middle',
            }} aria-label={translate(I18N_HEADER_KEYS.SpaceId)} icon={<InfoCircleIcon />}/>
                  </Tooltip>
                </th>) : null}

              {tableHeaders.map((header) => header.matched ? (<th sx={headerCellStyles} key={header.original}>
                    <Eyebrow size="medium">
                      {I18N_HEADER_KEYS[header.matched]
                ? translate(I18N_HEADER_KEYS[header.matched])
                : translate(I18N_HEADER_KEYS.Other)}
                    </Eyebrow>
                    <br />
                    <Paragraph size="small" sx={{ fontSize: '10px' }}>
                      {header.original ? `(${header.original})` : ''}
                    </Paragraph>
                  </th>) : null)}
            </tr>
          </thead>
          <ImportPreviewTableData wrapperRef={wrapperRef} tableData={Object.entries(tableData)} tableHeaders={tableHeaders} disabledItemRows={disabledItemRows} spaceList={spaceList} handleItemTypeChange={handleItemTypeChange} handleSpaceSelectChange={handleSpaceSelectChange}/>
        </table>
      </div>
    </div>);
};
