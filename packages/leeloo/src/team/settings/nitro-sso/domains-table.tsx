import { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { Button, Heading, Icon, Paragraph } from "@dashlane/design-system";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import {
  confidentialSSOApi,
  SsoProvisioning,
} from "@dashlane/sso-scim-contracts";
import { GridChild, GridContainer, Pagination } from "@dashlane/ui-components";
import { useTeamSpaceContext } from "../components/TeamSpaceContext";
import { DomainDetailModal } from "./domain-detail-modal";
import { I18N_KEYS as I18N_ERROR_KEYS } from "./domain-error-helpers";
import useTranslate from "../../../libs/i18n/useTranslate";
import { JustInTimeProvisioning } from "../just-in-time-provisioning/just-in-time-provisioning";
import { DomainRow } from "./domains-table-row";
export const I18N_KEYS = {
  VERIFY_DOMAIN_TITLE: "sso_confidential_verify_domain_step_title",
  TABLE_HEADER_STATUS:
    "sso_confidential_verify_domain_step_table_header_status",
  TABLE_HEADER_DOMAIN:
    "sso_confidential_verify_domain_step_table_header_domain",
  BUTTON_ADD_LABEL:
    "sso_confidential_verify_domain_step_add_domain_button_label",
  PAGINATION_ITEM_COUNT: "_common_pagination_item_count",
  ...I18N_ERROR_KEYS,
};
const DOMAINS_PER_PAGE = 20;
type Row = {
  id: string;
  domainName: string;
};
export const getProvisionedDomains = (
  rows: Row[],
  domainVerificationInfo: SsoProvisioning["domainVerificationInfo"]
) => {
  return new Map(
    rows.toReversed().reduce<[string, string][]>((acc, { id, domainName }) => {
      if (domainVerificationInfo[domainName]) {
        acc.push([domainName, id]);
      }
      return acc;
    }, [])
  );
};
export const DomainsTable = () => {
  const { translate } = useTranslate();
  const [rows, setRows] = useState<Row[]>([]);
  const [page, setPage] = useState<number>(1);
  const [modalDomain, setModalDomain] = useState<string | null>(null);
  const { spaceDetails } = useTeamSpaceContext();
  const ssoProvisioningState = useModuleQuery(
    confidentialSSOApi,
    "ssoProvisioning"
  );
  const addDomainClicked = () => {
    setPage(Math.ceil((rows.length + 1) / DOMAINS_PER_PAGE));
    setRows([...rows, { id: uuid(), domainName: "" }]);
  };
  const deleteDomain = async (rowId: string) => {
    const newRows = rows.filter(({ id }) => id !== rowId);
    const lastPage = Math.ceil(newRows.length / DOMAINS_PER_PAGE);
    if (page > lastPage) {
      setPage(lastPage);
    }
    setRows(newRows);
  };
  const onOpenModal = async (rowId: string) => {
    const { domainName } = rows.find(({ id }) => id === rowId) as Row;
    setModalDomain(domainName);
  };
  const closeModal = () => {
    setModalDomain(null);
  };
  const onDomainUpdate = (rowId: string, newDomainName: string) => {
    const newRows = rows.map((row) => {
      const { id } = row;
      if (id === rowId) {
        return { id, domainName: newDomainName };
      }
      return row;
    });
    setRows(newRows);
  };
  const domainVerificationInfo =
    ssoProvisioningState.data?.domainVerificationInfo;
  const ssoActive = ssoProvisioningState.data?.enableSSO.ssoEnabled ?? false;
  const isFormReady =
    ssoProvisioningState.data?.global.ssoIsNitroProvider &&
    !!ssoProvisioningState.data?.idpMetadata.metadataValue;
  useEffect(() => {
    if (
      ssoProvisioningState.data?.domainVerificationInfo &&
      rows.length === 0
    ) {
      const domains = Object.keys(
        ssoProvisioningState.data?.domainVerificationInfo ?? {}
      );
      setRows(
        domains.length
          ? domains.map((domainName) => ({ id: uuid(), domainName }))
          : [
              {
                id: uuid(),
                domainName: spaceDetails?.associatedEmail.split("@")[1] ?? "",
              },
            ]
      );
    }
  }, [rows.length, ssoProvisioningState.data?.domainVerificationInfo]);
  const provisionedDomains = useMemo(
    () =>
      domainVerificationInfo
        ? getProvisionedDomains(rows, domainVerificationInfo)
        : new Map(),
    [domainVerificationInfo, rows]
  );
  if (ssoProvisioningState.status !== DataStatus.Success) {
    return null;
  }
  const firstDomainIndex = (page - 1) * DOMAINS_PER_PAGE;
  const renderDomainRows = () =>
    rows
      .slice(firstDomainIndex, firstDomainIndex + DOMAINS_PER_PAGE)
      .map(({ id, domainName }) => {
        return domainVerificationInfo ? (
          <DomainRow
            key={id}
            disabled={!isFormReady}
            domainName={domainName}
            domainVerificationInfo={domainVerificationInfo[domainName]}
            id={id}
            onDeleteDomain={() => deleteDomain(id)}
            onModalOpen={() => onOpenModal(id)}
            onUpdateDomain={(newDomainName) =>
              onDomainUpdate(id, newDomainName)
            }
            provisionedDomains={provisionedDomains}
            ssoActive={ssoActive}
          />
        ) : null;
      });
  return (
    <div sx={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <Heading
        as="h3"
        color="ds.text.neutral.standard"
        textStyle="ds.title.section.medium"
      >
        {translate(I18N_KEYS.VERIFY_DOMAIN_TITLE)}
      </Heading>

      <GridContainer gap="16px 10px" gridTemplateColumns="100px 1fr 126px 40px">
        <GridChild>
          <Heading
            as="h4"
            color="ds.text.neutral.quiet"
            textStyle="ds.title.supporting.small"
          >
            {translate(I18N_KEYS.TABLE_HEADER_STATUS)}
          </Heading>
        </GridChild>
        <GridChild gridColumnStart={2} gridColumnEnd={5}>
          <Heading
            as="h4"
            color="ds.text.neutral.quiet"
            textStyle="ds.title.supporting.small"
          >
            {translate(I18N_KEYS.TABLE_HEADER_DOMAIN)}
          </Heading>
        </GridChild>

        {rows.length > 0 ? (
          <>
            <GridChild
              gridColumnStart={1}
              gridColumnEnd={5}
              sx={{ borderBottom: "1px solid ds.border.neutral.quiet.idle" }}
            />
            {renderDomainRows()}
          </>
        ) : null}

        <GridChild gridColumnStart={2}>
          <Button
            mood="brand"
            intensity="supershy"
            layout="iconLeading"
            icon={<Icon name="ActionAddOutlined" />}
            size="small"
            onClick={addDomainClicked}
            disabled={!isFormReady}
          >
            {translate(I18N_KEYS.BUTTON_ADD_LABEL)}
          </Button>
        </GridChild>
        {rows.length > DOMAINS_PER_PAGE ? (
          <GridChild
            gridColumnStart={1}
            gridColumnEnd={5}
            sx={{
              alignItems: "center",
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              padding: "24px",
            }}
          >
            <Paragraph
              color="ds.text.neutral.quiet"
              textStyle="ds.body.helper.regular"
            >
              {translate(I18N_KEYS.PAGINATION_ITEM_COUNT, {
                first: firstDomainIndex + 1,
                last: Math.min(
                  firstDomainIndex + DOMAINS_PER_PAGE,
                  rows.length
                ),
                total: rows.length,
              })}
            </Paragraph>
            <Pagination
              key={page}
              currentPage={page}
              onPageChange={setPage}
              totalPages={Math.ceil(rows.length / DOMAINS_PER_PAGE)}
            />
          </GridChild>
        ) : null}
      </GridContainer>
      <JustInTimeProvisioning />
      {modalDomain && domainVerificationInfo?.[modalDomain] ? (
        <DomainDetailModal
          domainName={modalDomain}
          domainVerificationInfo={domainVerificationInfo[modalDomain]}
          onClose={closeModal}
        />
      ) : null}
    </div>
  );
};
