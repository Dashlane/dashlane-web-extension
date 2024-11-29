import {
  memo,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { throttle } from "lodash";
import { Flex, Icon } from "@dashlane/design-system";
import { SelectDropdownMenu } from "@dashlane/ui-components";
import {
  DataModelType,
  ParsedCSVData,
  PremiumStatusSpace,
} from "@dashlane/communication";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useIsPersonalSpaceDisabled } from "../../../libs/hooks/use-is-personal-space-disabled";
import { DataStatus } from "@dashlane/framework-react";
import { InputWithActionButton } from "../../../libs/dashlane-style/text-input-with-action-button/input-with-action-button";
import {
  CELL_HEIGHT,
  innerTableCellStyles,
  ROW_HEIGHT,
  tableCellStyles,
  tableRowStyles,
} from "./styles";
import { TranslatorInterface } from "../../../libs/i18n/types";
import { SpaceIcon } from "../../components/space-and-sharing-icons/space-icon";
import { LoadingShimmer } from "../../../libs/dashlane-style/loading-shimmer/loading-shimmer";
import { ImportDataModelType } from "./import-preview-table";
export interface ImportPreviewTableDataProps {
  wrapperRef: RefObject<HTMLDivElement>;
  tableData: Array<[string, ParsedCSVData["items"][number]]>;
  tableHeaders: ParsedCSVData["headers"];
  disabledItemRows: string[];
  spaceList: PremiumStatusSpace[];
  handleItemTypeChange: (
    itemId: string,
    modelType: ImportDataModelType
  ) => void;
  handleSpaceSelectChange: (itemId: string, spaceId: string) => void;
}
type SelectOptionType = {
  label: ReactNode;
  value: string;
};
const importVaultIcons: Record<ImportDataModelType, ReactNode> = {
  KWAuthentifiant: (
    <Icon
      name="ItemLoginFilled"
      size="small"
      color="ds.text.neutral.standard"
    />
  ),
  KWSecureNote: (
    <Icon
      name="ItemSecureNoteFilled"
      size="small"
      color="ds.text.neutral.standard"
    />
  ),
  KWBankStatement: (
    <Icon
      name="ItemBankAccountFilled"
      size="small"
      color="ds.text.neutral.standard"
    />
  ),
  KWPaymentMean_creditCard: (
    <Icon
      name="ItemPaymentFilled"
      size="small"
      color="ds.text.neutral.standard"
    />
  ),
  DoNotImport: null,
};
const KW_TYPE_TO_I18N_KEY: Record<ImportDataModelType, string> = {
  KWAuthentifiant: "webapp_import_item_type_login",
  KWSecureNote: "webapp_import_item_type_secure_note",
  KWBankStatement: "webapp_import_item_type_bank",
  KWPaymentMean_creditCard: "webapp_import_item_type_payment",
  DoNotImport: "webapp_import_item_type_do_not_import",
};
export const I18N_KEYS = {
  ITEM_TYPE_TOOLTIP: "webapp_import_preview_item_type_tooltip",
  SPACE_TOOLTIP: "webapp_import_preview_space_tooltip_markup",
  SMART_SPACE_TOOLTIP: "webapp_import_preview_smart_space_tooltip",
  TOOLTIP_SHOW_LABEL: "_common_password_show_label",
  TOOLTIP_HIDE_LABEL: "_common_password_hide_label",
  SPACE_SELECT_PLACEHOLDER: "webapp_form_field_space_placeholder",
  PERSONAL_SPACE: "webapp_form_field_personal_space",
};
const formatDataCellContent = (
  header: ParsedCSVData["headers"][number],
  item: ParsedCSVData["items"][number],
  translate: TranslatorInterface
) => {
  let cellContent: ReactNode = header.matched
    ? item.baseDataModel[header.matched]
    : item.rawData[header.original];
  switch (header.matched) {
    case "Password": {
      cellContent = item.baseDataModel[header.matched] ? (
        <InputWithActionButton
          passwordInputProps={{
            readOnly: true,
            value: item.baseDataModel[header.matched],
            hidePasswordTooltipText: translate(I18N_KEYS.TOOLTIP_HIDE_LABEL),
            showPasswordTooltipText: translate(I18N_KEYS.TOOLTIP_SHOW_LABEL),
          }}
        />
      ) : null;
      break;
    }
    case "Content":
    case "Note": {
      switch (item.baseDataModel.kwType) {
        case DataModelType.KWSecureNote: {
          cellContent = item.baseDataModel["Content"];
          break;
        }
        case DataModelType.KWAuthentifiant: {
          cellContent = item.baseDataModel["Note"];
          break;
        }
        default:
          break;
      }
      break;
    }
  }
  if (!cellContent) {
    cellContent = "--";
  }
  return cellContent;
};
export const ImportPreviewTableDataComponent = ({
  wrapperRef,
  tableData,
  tableHeaders,
  disabledItemRows,
  spaceList,
  handleItemTypeChange,
  handleSpaceSelectChange,
}: ImportPreviewTableDataProps) => {
  const [displayStart, setDisplayStart] = useState(0);
  const [displayEnd, setDisplayEnd] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const isPersonalSpaceDisabled = useIsPersonalSpaceDisabled();
  const shouldDisplaySpaceSelector =
    isPersonalSpaceDisabled.status === DataStatus.Success &&
    !isPersonalSpaceDisabled.isDisabled;
  const { translate } = useTranslate();
  const wrapperHeight = wrapperRef.current?.clientHeight ?? 1;
  const rowsToRender = Math.floor((wrapperHeight * 4) / CELL_HEIGHT);
  const columnCount = 1 + tableHeaders.length + (spaceList.length ? 1 : 0);
  const VAULT_ITEM_TYPE_OPTIONS = useMemo(
    () =>
      Object.keys(KW_TYPE_TO_I18N_KEY).reduce(
        (prev, itemType) => ({
          ...prev,
          [itemType]: {
            value: itemType,
            label: (
              <Flex alignItems="center">
                {importVaultIcons[itemType]}
                <span sx={{ marginLeft: 2 }}>
                  {translate(KW_TYPE_TO_I18N_KEY[itemType])}
                </span>
              </Flex>
            ),
          },
        }),
        {}
      ),
    [translate]
  );
  const personalSpaceTranslation = translate(I18N_KEYS.PERSONAL_SPACE);
  const spaceSelectOptions = useMemo(
    () => [
      ...spaceList.reduce(
        (options, space) => [
          ...options,
          {
            value: space.teamId,
            label: (
              <Flex alignItems="center">
                <SpaceIcon
                  space={{
                    ...space,
                    id: space.teamId,
                    name: space.teamName,
                  }}
                />
                <span sx={{ marginLeft: 2 }}>{space.teamName}</span>
              </Flex>
            ),
          },
        ],
        []
      ),
      {
        value: "",
        label: (
          <Flex alignItems="center">
            <SpaceIcon
              space={{
                id: "",
                name: personalSpaceTranslation,
                letter: personalSpaceTranslation[0],
              }}
            />
            <span sx={{ marginLeft: 2 }}>{personalSpaceTranslation}</span>
          </Flex>
        ),
      },
    ],
    [personalSpaceTranslation, spaceList]
  );
  const FillerRow = ({ position }: { position: "start" | "end" }) => {
    const height =
      position === "start"
        ? displayStart * ROW_HEIGHT
        : (tableData.length - displayEnd) * ROW_HEIGHT;
    return (
      <tr
        key={`${position}-loader`}
        sx={{
          height: height,
        }}
      >
        <td colSpan={columnCount}>
          <LoadingShimmer width="100%" height={height} />
        </td>
      </tr>
    );
  };
  const setDisplayPositions = useCallback(
    (scroll: number) => {
      const scrollWithOffset = Math.floor(
        scroll - rowsToRender - wrapperHeight / 2
      );
      const displayStartPosition = Math.floor(
        Math.max(0, Math.floor(scrollWithOffset / ROW_HEIGHT))
      );
      const startWithRows = Math.max(displayStartPosition + rowsToRender, 1);
      const displayEndPosition = Math.floor(
        Math.min(startWithRows, tableData.length)
      );
      setDisplayStart(displayStartPosition);
      setDisplayEnd(displayEndPosition);
    },
    [wrapperHeight, rowsToRender, tableData.length]
  );
  useEffect(() => {
    setDisplayPositions(scrollPosition);
  }, [scrollPosition, setDisplayPositions]);
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const onScroll = throttle(() => {
      const scrollTop = wrapperRef.current?.scrollTop;
      if (scrollTop !== undefined) {
        setScrollPosition(scrollTop);
      }
    }, 1000);
    wrapper?.addEventListener("scroll", onScroll);
    return () => {
      wrapper?.removeEventListener("scroll", onScroll);
    };
  }, [setDisplayPositions, wrapperRef]);
  return (
    <tbody>
      {displayStart !== 0 ? <FillerRow position="start" /> : null}
      {tableData
        .slice(displayStart, displayEnd)
        .filter(
          ([, dataItem]) =>
            dataItem.baseDataModel.kwType !== DataModelType.KWCollection
        )
        .map((dataItem) => {
          const [itemId, item] = dataItem;
          return (
            <tr sx={tableRowStyles} key={item.baseDataModel.Id}>
              <td sx={tableCellStyles}>
                <div sx={innerTableCellStyles}>
                  <SelectDropdownMenu
                    menuPortalTarget={document.body}
                    isSearchable={false}
                    onChange={(e: SelectOptionType) => {
                      handleItemTypeChange(itemId, DataModelType[e.value]);
                    }}
                    defaultValue={
                      VAULT_ITEM_TYPE_OPTIONS[
                        item.baseDataModel.kwType ?? DataModelType.KWSecureNote
                      ]
                    }
                    options={Object.values(VAULT_ITEM_TYPE_OPTIONS)}
                  />
                </div>
              </td>
              {spaceList.length && shouldDisplaySpaceSelector ? (
                <td sx={tableCellStyles}>
                  <div sx={innerTableCellStyles} data-testid="space-select">
                    <SelectDropdownMenu
                      name="spaceSelect"
                      menuPortalTarget={document.body}
                      isSearchable={false}
                      options={spaceSelectOptions}
                      defaultValue={
                        item.baseDataModel["SpaceId"] !== undefined
                          ? spaceSelectOptions.find(
                              (option) =>
                                option.value === item.baseDataModel["SpaceId"]
                            ) ?? spaceSelectOptions[0]
                          : undefined
                      }
                      isDisabled={disabledItemRows.includes(itemId)}
                      onChange={(e: SelectOptionType) =>
                        handleSpaceSelectChange(itemId, e.value)
                      }
                    />
                  </div>
                </td>
              ) : null}

              {tableHeaders.map((header) =>
                header.matched ? (
                  <td sx={tableCellStyles} key={header.original}>
                    <div sx={innerTableCellStyles}>
                      {formatDataCellContent(header, item, translate)}
                    </div>
                  </td>
                ) : null
              )}
            </tr>
          );
        })}
      {displayEnd !== tableData.length ? <FillerRow position="end" /> : null}
    </tbody>
  );
};
export const ImportPreviewTableData = memo(ImportPreviewTableDataComponent);
