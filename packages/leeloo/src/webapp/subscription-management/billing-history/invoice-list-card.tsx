import { useMemo, useState } from "react";
import { fromUnixTime } from "date-fns";
import { Pagination } from "@dashlane/ui-components";
import {
  Button,
  Card,
  Flex,
  Heading,
  Paragraph,
} from "@dashlane/design-system";
import { Invoice, InvoiceSortField } from "@dashlane/communication";
import { downloadFile } from "../../../libs/file-download/file-download";
import { carbonConnector } from "../../../libs/carbon/connector";
import { LocaleFormat } from "../../../libs/i18n/helpers";
import { OrderDir } from "../../../libs/sortHelper";
import {
  useInvoiceList,
  useInvoicesCount,
} from "../../../libs/carbon/hooks/useInvoiceList";
import useTranslate from "../../../libs/i18n/useTranslate";
import { Header as ListHeader } from "../../list-view/header";
import { InvoiceItem } from "./invoice-item";
import { InvoiceListFilters, PlanFilters } from "./invoice-list-filters";
import { EditInvoiceDialog, InvoiceCustomData } from "./edit-invoice-dialog";
import styles from "./invoice.css";
const I18N_KEYS = {
  CARD_TITLE: "manage_subscription_billing_section_title",
  BILLING_ACTIONS: "manage_subscription_billing_section_table_head_actions",
  BILLING_DATE: "manage_subscription_billing_section_table_head_date",
  BILLING_ITEM: "manage_subscription_billing_section_table_head_item",
  BILLING_PRICE: "manage_subscription_billing_section_table_head_price",
  BILLING_YEARS_BTN: "manage_subscription_billing_section_filter_years",
  BILLING_PLANS: "manage_subscription_billing_section_filter_all_plans",
  BILLING_BTN_GO: "manage_subscription_billing_section_go_to_page_button",
  BILLING_GO_TO_BTN: "manage_subscription_billing_section_go_to_page_label",
  BILLING_ITEMS_PER_PAGE: "manage_subscription_billing_section_items_per_page",
  NO_INVOICES_FOUND: "manage_subscription_billing_section_no_results",
  NO_INVOICES_RESET: "manage_subscription_billing_section_reset_filters",
};
const PAGE_SIZE = 10;
export interface SortingOptions {
  field: InvoiceSortField;
  direction: OrderDir;
}
export const InvoiceListCard = () => {
  const { translate } = useTranslate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentYearFilter, setCurrentYearFilter] = useState<string>("");
  const [currentPlanFilter, setCurrentPlanFilter] = useState<PlanFilters>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [sortOptions, setSortOptions] = useState<SortingOptions>({
    direction: OrderDir.descending,
    field: "startDate",
  });
  const invoiceCount = useInvoicesCount();
  const filteredInvoices = useInvoiceList({
    currentPlanFilter,
    currentYearFilter,
    sortDirection: sortOptions.direction,
    sortField: sortOptions.field,
  });
  const visibleInvoices = useMemo(() => {
    const pageStartIndex = (currentPage - 1) * PAGE_SIZE;
    return [...filteredInvoices].slice(
      pageStartIndex,
      pageStartIndex + PAGE_SIZE
    );
  }, [currentPage, filteredInvoices]);
  const onCustomizeInvoiceRequested = (invoice: Invoice) => {
    setIsEditModalOpen(true);
    setSelectedInvoice(invoice);
  };
  const downloadInvoice = async (
    invoice: Invoice,
    invoiceCustomData?: InvoiceCustomData
  ) => {
    if (invoice) {
      const filename = `dashlane_invoice_${translate
        .shortDate(fromUnixTime(invoice?.startDate), LocaleFormat.L)
        .replace(/[^a-zA-Z0-9]/g, "_")}`;
      const response = await carbonConnector.downloadCustomerInvoice({
        invoiceId: invoice.invoiceId,
        lang: "en",
        ...invoiceCustomData,
      });
      if (response.success) {
        const { data } = JSON.parse(response.data);
        const arrayBuffer = new Uint8Array(data).buffer;
        downloadFile(arrayBuffer, filename, "application/pdf");
      }
    }
  };
  const downloadCustomInvoice = (invoiceCustomData: InvoiceCustomData) => {
    if (selectedInvoice) {
      setIsEditModalOpen(false);
      downloadInvoice(selectedInvoice, invoiceCustomData);
    }
  };
  const getHeader = () => {
    return [
      {
        key: "item",
        sortable: false,
        content: translate(I18N_KEYS.BILLING_ITEM),
        className: styles.invoiceListColumn,
      },
      {
        key: "startDate",
        sortable: true,
        content: translate(I18N_KEYS.BILLING_DATE),
        className: styles.invoiceListColumn,
      },
      {
        key: "amountPaid",
        sortable: true,
        content: translate(I18N_KEYS.BILLING_PRICE),
        className: styles.invoiceListColumn,
      },
      {
        key: "action",
        sortable: false,
        content: translate(I18N_KEYS.BILLING_ACTIONS),
        className: styles.invoiceListColumn,
      },
    ];
  };
  const changePlanFilter = (newPlanFilter: PlanFilters) => {
    setCurrentPage(1);
    setCurrentPlanFilter(newPlanFilter);
  };
  const changeYearFilter = (newYearFilter: string) => {
    setCurrentPage(1);
    setCurrentYearFilter(newYearFilter || "");
  };
  const resetFilters = () => {
    setCurrentPage(1);
    setCurrentPlanFilter("");
    setCurrentYearFilter("");
  };
  const sortInvoices = (newSortOptions: SortingOptions) => {
    setSortOptions(newSortOptions);
  };
  return (
    <Card padding="32px" gap="5px">
      <div sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Heading as="h1" textStyle="ds.title.section.large">
          {translate(I18N_KEYS.CARD_TITLE)}
        </Heading>
        <InvoiceListFilters
          changePlanFilter={changePlanFilter}
          changeYearFilter={changeYearFilter}
          currentPlanFilter={currentPlanFilter}
          currentYearFilter={currentYearFilter}
        />
      </div>
      {filteredInvoices.length > 0 ? (
        <>
          <ListHeader
            containerClassName={styles.listHeader}
            header={getHeader()}
            onSort={sortInvoices}
            options={sortOptions}
          />
          {visibleInvoices.map((invoice: Invoice) => (
            <InvoiceItem
              key={invoice.invoiceId}
              invoice={invoice}
              onCustomizeInvoiceRequested={onCustomizeInvoiceRequested}
              onDownloadInvoiceRequested={downloadInvoice}
            />
          ))}
          <Pagination
            sx={{ marginTop: "8px" }}
            totalPages={
              filteredInvoices.length > PAGE_SIZE
                ? Math.ceil(filteredInvoices.length / PAGE_SIZE)
                : 0
            }
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      ) : null}
      {filteredInvoices.length === 0 && invoiceCount > 0 ? (
        <Flex
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          sx={{ height: "300px" }}
          gap={"16px"}
        >
          <Paragraph color="ds.text.neutral.quiet">
            {translate(I18N_KEYS.NO_INVOICES_FOUND)}
          </Paragraph>
          <Button
            mood="neutral"
            intensity="quiet"
            onClick={resetFilters}
            icon="ActionRefreshOutlined"
            layout="iconLeading"
          >
            {translate(I18N_KEYS.NO_INVOICES_RESET)}
          </Button>
        </Flex>
      ) : null}

      <EditInvoiceDialog
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onDownloadInvoice={downloadCustomInvoice}
      />
    </Card>
  );
};
