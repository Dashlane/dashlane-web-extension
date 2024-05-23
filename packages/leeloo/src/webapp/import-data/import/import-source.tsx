import { ChangeEvent, Fragment, ReactNode, useEffect, useState } from 'react';
import { BackupFileType, HelpCenterArticleCta, ImportDataStep, PageView, } from '@dashlane/hermes';
import { colors, Eyebrow, FlexContainer, Heading, jsx, Paragraph, Radio, RadioGroup, SelectDropdownMenu, } from '@dashlane/ui-components';
import { Button, Icon, Infobox, Tooltip } from '@dashlane/design-system';
import { ImportSource as ImportSourceTypes, PremiumStatusSpace, } from '@dashlane/communication';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { useFeatureFlip } from '@dashlane/framework-react';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import useTranslate from 'libs/i18n/useTranslate';
import { logPageView } from 'libs/logs/logEvent';
import { useHistory } from 'libs/router';
import { useIsPersonalSpaceDisabled } from 'libs/hooks/use-is-personal-space-disabled';
import { useSpaces } from 'libs/carbon/hooks/useSpaces';
import { useIsFreeB2CUser } from 'libs/carbon/hooks/useNodePremiumStatus';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { logHelpCenterEvent, logImportStart } from 'webapp/import-data/logs';
import { ImportDataRoutes } from '../routes';
import { useNavigateAwayListener } from '../hooks/use-navigate-away-listener';
import { useImportPreviewContext } from '../hooks/useImportPreviewContext';
import { ImportFormat, ImportMethod } from '../types';
import { SourceToDirectImportRoute, SupportedDirectImportSources, } from '../direct-import/types';
import OnePasswordLogo from './source-images/1password.png';
import BitWardenLogo from './source-images/bitwarden.png';
import CSVLogo from './source-images/csv.png';
import DashLogo from './source-images/dash.png';
import ChromeLogo from './source-images/chrome.png';
import FirefoxLogo from './source-images/firefox.png';
import SafariLogo from './source-images/safari.png';
import EdgeLogo from './source-images/edge.png';
import KeePassLogo from './source-images/keepass.png';
import KeeperLogo from './source-images/keeper.png';
import LastPassLogo from './source-images/lastpass.png';
const I18N_KEYS = {
    HEADER: 'webapp_account_import_source_header',
    DROPDOWN_LABEL: 'webapp_account_import_source_dropdown_label',
    PLACEHOLDER: 'webapp_account_import_source_dropdown_placeholder',
    GET_STARTED_BUTTON: 'webapp_account_import_source_get_started_button',
    DIRECT_IMPORT_FROM_BUTTON: 'webapp_account_import_source_direct_import_button_markup',
    DIRECT_IMPORT_OPTION: 'webapp_account_import_source_option_direct_import',
    CSV_OPTION: 'webapp_account_import_source_option_csv',
    IMPORT_METHOD_HEADER: 'webapp_account_import_source_method_header',
    HELP_TIP_INFOBOX: 'webapp_account_import_help_tip_infobox_markup',
    FREE_B2C_RESTRICTED_TOOLTIP: 'webapp_account_import_select_free_b2c_restriction_tooltip',
};
const I18N_SOURCE_KEYS: Record<ImportFormat, Record<string, string>> = {
    CSV: {
        STEP_TITLE: 'webapp_account_import_select_csv_step_title',
        STEP_TITLE_SPACES: 'webapp_account_import_select_csv_step_title_spaces',
        STEP_ONE: 'webapp_account_import_select_csv_step1',
        STEP_TWO: 'webapp_account_import_select_csv_step2',
        STEP_TWO_SPACES: 'webapp_account_import_select_csv_space_step2',
        STEP_THREE_SPACES: 'webapp_account_import_select_csv_preview_step3',
        HELP_LINK: 'webapp_account_import_select_csv_help_markup',
    },
    DASH: {
        STEP_TITLE: 'webapp_account_import_select_dash_step_title',
        STEP_ONE: 'webapp_account_import_select_dash_step1',
        STEP_TWO: 'webapp_account_import_select_dash_step2',
        HELP_LINK: 'webapp_account_import_select_dash_help_markup',
    },
    DIRECT: {
        STEP_TITLE: 'webapp_account_import_select_direct_title',
        STEP_ONE: 'webapp_account_import_select_direct_step1',
        STEP_TWO: 'webapp_account_import_select_direct_step2',
        STEP_THREE: 'webapp_account_import_select_csv_preview_step3',
    },
};
export const IMPORT_GUIDE: Record<ImportSourceTypes, string> = {
    '1password': '*****',
    bitwarden: '*****',
    chrome: '*****',
    dash: '*****',
    edge: '*****',
    firefox: '*****',
    keepass: '*****',
    keeper: '*****',
    lastpass: '*****',
    other: '*****',
    safari: '*****',
};
const SOURCE_ICONS: Record<ImportSourceTypes, string> = {
    '1password': OnePasswordLogo,
    bitwarden: BitWardenLogo,
    chrome: ChromeLogo,
    dash: DashLogo,
    edge: EdgeLogo,
    firefox: FirefoxLogo,
    keepass: KeePassLogo,
    keeper: KeeperLogo,
    lastpass: LastPassLogo,
    other: CSVLogo,
    safari: SafariLogo,
};
const SOURCE_OPTIONS_I18N_KEYS: Record<ImportSourceTypes, string> = {
    '1password': 'webapp_account_import_source_label_1password',
    bitwarden: 'webapp_account_import_source_label_bitwarden',
    chrome: 'webapp_account_import_source_label_chrome',
    dash: 'webapp_account_import_source_label_dash',
    edge: 'webapp_account_import_source_label_edge',
    firefox: 'webapp_account_import_source_label_firefox',
    keepass: 'webapp_account_import_source_label_keepass',
    keeper: 'webapp_account_import_source_label_keeper',
    lastpass: 'webapp_account_import_source_label_lastpass',
    other: 'webapp_account_import_source_label_csv',
    safari: 'webapp_account_import_source_label_safari',
};
export const ImportSource = () => {
    const { translate } = useTranslate();
    const history = useHistory();
    const { importSource, setImportSource, resetContext, setImportMethod } = useImportPreviewContext();
    const spaces = useSpaces();
    const useIsFreeB2C = useIsFreeB2CUser();
    const hasB2CPasswordLimitFF = useFeatureFlip(FEATURE_FLIPS_WITHOUT_MODULE.B2CRestrictPasswordFreePlanPhase1);
    const isPersonalSpaceDisabled = useIsPersonalSpaceDisabled();
    const { shouldShowTrialDiscontinuedDialog } = useTrialDiscontinuedDialogContext();
    const [sourceType, setSourceType] = useState<ImportFormat | ''>('');
    const [spaceList, setSpaceList] = useState<PremiumStatusSpace[]>([]);
    const isPersonalSpaceEnabled = isPersonalSpaceDisabled.status === DataStatus.Success &&
        !isPersonalSpaceDisabled.isDisabled;
    const hasMultipleSpaces = spaceList.length > 0;
    const showMultipleSpacesStep = isPersonalSpaceEnabled &&
        hasMultipleSpaces &&
        sourceType === ImportFormat.CSV;
    const directImportSelected = sourceType === ImportFormat.DIRECT;
    const showDirectImport = APP_PACKAGED_IN_EXTENSION &&
        SupportedDirectImportSources.includes(importSource);
    const dataLoading = useIsFreeB2C.isLoading ||
        hasB2CPasswordLimitFF === null ||
        hasB2CPasswordLimitFF === undefined ||
        shouldShowTrialDiscontinuedDialog === null;
    const isImportDisabled = !dataLoading && shouldShowTrialDiscontinuedDialog;
    const shouldRestrictImportSources = !dataLoading && hasB2CPasswordLimitFF && useIsFreeB2C.isFreeB2C;
    const availableImportSourceTypes = shouldRestrictImportSources
        ? [ImportSourceTypes.Dash]
        : Object.values(ImportSourceTypes);
    const IMPORT_SOURCE_OPTIONS: {
        value: ImportFormat;
        source: ImportSourceTypes;
        label: ReactNode;
    }[] = availableImportSourceTypes.map((importSourceType) => {
        const defaultNonDashValue = SupportedDirectImportSources.includes(importSourceType) &&
            APP_PACKAGED_IN_EXTENSION
            ? ImportFormat.DIRECT
            : ImportFormat.CSV;
        return {
            value: importSourceType === ImportSourceTypes.Dash
                ? ImportFormat.DASH
                : defaultNonDashValue,
            source: importSourceType,
            label: (<FlexContainer alignItems="center">
          <img alt={translate(SOURCE_OPTIONS_I18N_KEYS[importSourceType])} height={24} sx={{ borderRadius: '100%' }} aria-hidden src={SOURCE_ICONS[importSourceType]}/>
          <span style={{ marginLeft: 5 }}>
            {translate(SOURCE_OPTIONS_I18N_KEYS[importSourceType])}
          </span>
        </FlexContainer>),
        };
    });
    useNavigateAwayListener({
        importStep: ImportDataStep.SelectImportSource,
        importSource: importSource,
        isDirectImport: directImportSelected,
    });
    const handleImportSourceChange = (option: (typeof IMPORT_SOURCE_OPTIONS)[number]) => {
        setSourceType(option.value);
        setImportSource(option.source);
    };
    const handleRadioMethodChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedValue = e.target.value;
        if (selectedValue in ImportFormat) {
            setSourceType(ImportFormat[selectedValue]);
        }
    };
    const handleDirectImportClick = () => {
        history.push(`${ImportDataRoutes.DirectImport}/${SourceToDirectImportRoute[importSource]}`);
    };
    const handleGetStartedClick = () => {
        const isDirectImport = sourceType === ImportFormat.DIRECT;
        const backupFileType = ImportFormat.DASH
            ? BackupFileType.SecureVault
            : BackupFileType.Csv;
        logImportStart(backupFileType, importSource, ImportDataStep.SelectImportSource, isDirectImport);
        if (isDirectImport) {
            setImportMethod(ImportMethod.DIRECT);
            handleDirectImportClick();
            return;
        }
        history.push(ImportDataRoutes.ImportSelect);
    };
    useEffect(() => {
        if (spaces.status === DataStatus.Success) {
            setSpaceList(spaces.data);
        }
    }, [spaces]);
    useEffect(() => {
        logPageView(PageView.ImportSelectPasswordSource);
    }, []);
    useEffect(() => {
        resetContext();
    }, []);
    return (<FlexContainer flexDirection="column">
      <Heading size="small">{translate(I18N_KEYS.HEADER)}</Heading>
      <br />
      <FlexContainer flexDirection="column">
        <Eyebrow color={colors.dashGreen01} size="small">
          {translate(I18N_KEYS.DROPDOWN_LABEL)}
        </Eyebrow>
        <Tooltip content={translate(I18N_KEYS.FREE_B2C_RESTRICTED_TOOLTIP)} passThrough={!shouldRestrictImportSources} wrapTrigger>
          <SelectDropdownMenu customStyles={{
            container: (styles) => ({
                ...styles,
                maxWidth: 'auto',
            }),
        }} id="importSelect" isClearable={false} isSearchable={false} isLoading={dataLoading} isDisabled={isImportDisabled} onChange={handleImportSourceChange} options={IMPORT_SOURCE_OPTIONS} placeholder={translate(I18N_KEYS.PLACEHOLDER)}/>
        </Tooltip>
        {showDirectImport ? (<>
            <Heading sx={{ marginY: '12px' }} size="x-small">
              {translate(I18N_KEYS.IMPORT_METHOD_HEADER)}
            </Heading>
            <RadioGroup value={sourceType} onChange={handleRadioMethodChange}>
              <FlexContainer flexDirection="column">
                <Radio data-testid="direct-import-method" label={translate(I18N_KEYS.DIRECT_IMPORT_OPTION, {
                source: translate(SOURCE_OPTIONS_I18N_KEYS[importSource]),
            })} value={ImportFormat.DIRECT}/>
                <Radio data-testid="csv-import-method" label={translate(I18N_KEYS.CSV_OPTION)} value={ImportFormat.CSV}/>
              </FlexContainer>
            </RadioGroup>
          </>) : null}

        {sourceType ? (<FlexContainer flexDirection="column" sx={{ maxWidth: '480px' }}>
            <Heading sx={{ marginY: '12px' }} size="x-small">
              {showMultipleSpacesStep
                ? translate(I18N_SOURCE_KEYS[sourceType].STEP_TITLE_SPACES)
                : translate(I18N_SOURCE_KEYS[sourceType].STEP_TITLE, directImportSelected
                    ? {
                        source: translate(SOURCE_OPTIONS_I18N_KEYS[importSource]),
                    }
                    : {})}
            </Heading>
            <Paragraph color="ds.text.neutral.quiet" sx={{ marginBottom: '8px' }}>
              {translate(I18N_SOURCE_KEYS[sourceType].STEP_ONE, directImportSelected
                ? {
                    source: translate(SOURCE_OPTIONS_I18N_KEYS[importSource]),
                }
                : {})}
            </Paragraph>
            <Paragraph color={colors.grey00} sx={{ marginBottom: '12px' }}>
              {showMultipleSpacesStep
                ? translate(I18N_SOURCE_KEYS[sourceType].STEP_TWO_SPACES)
                : translate(I18N_SOURCE_KEYS[sourceType].STEP_TWO, directImportSelected
                    ? {
                        source: translate(SOURCE_OPTIONS_I18N_KEYS[importSource]),
                    }
                    : {})}
            </Paragraph>

            <Paragraph color={colors.grey00} sx={{ marginBottom: '12px' }}>
              {showMultipleSpacesStep
                ? translate(I18N_SOURCE_KEYS[sourceType].STEP_THREE_SPACES)
                : sourceType === ImportFormat.DIRECT
                    ? translate(I18N_SOURCE_KEYS.DIRECT.STEP_THREE)
                    : null}
            </Paragraph>
            {!directImportSelected ? (<Infobox sx={{ marginY: '12px' }} mood="neutral" title={translate.markup(I18N_SOURCE_KEYS[sourceType].HELP_LINK, { supportLink: IMPORT_GUIDE[importSource] }, {
                    linkTarget: '_blank',
                    onLinkClicked: () => logHelpCenterEvent(HelpCenterArticleCta.LearnAboutCsvImportFormatting),
                })}/>) : (<Infobox sx={{ marginY: '12px' }} mood="brand" title={translate.markup(I18N_KEYS.HELP_TIP_INFOBOX, {
                    supportLink: IMPORT_GUIDE[importSource],
                    source: translate(SOURCE_OPTIONS_I18N_KEYS[importSource]),
                }, {
                    linkTarget: '_blank',
                    onLinkClicked: () => logHelpCenterEvent(HelpCenterArticleCta.LearnAboutCsvImportFormatting),
                })}/>)}
          </FlexContainer>) : null}

        <FlexContainer flexDirection="row" gap={4} sx={{ marginTop: '12px' }}>
          <Button type="button" mood={'brand'} intensity={'catchy'} onClick={handleGetStartedClick} disabled={!sourceType} layout={directImportSelected ? 'iconTrailing' : 'labelOnly'} icon={directImportSelected ? (<Icon name="ActionOpenExternalLinkOutlined"/>) : undefined}>
            {directImportSelected ? (<>
                {translate.markup(I18N_KEYS.DIRECT_IMPORT_FROM_BUTTON, {
                source: translate(SOURCE_OPTIONS_I18N_KEYS[importSource]),
            })}
              </>) : (translate(I18N_KEYS.GET_STARTED_BUTTON))}
          </Button>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>);
};
