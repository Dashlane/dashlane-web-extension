import { CredentialsHeader } from "../credentials-view/credentials-header";
import { useHasCredentialsContext } from "../credentials-view/has-credentials-context";
import { CompromisedCredentialsProvider } from "../credentials-view/compromised-credentials-context";
import { MultiSelectMenu } from "../../list-view/multi-select";
import { CredentialsList } from "./credentials-list";
import { CredentialsListEmptyView } from "./credentials-list-empty-view";
import { CredentialsListViewHeader } from "./credentials-list-view-header";
import { WithBaseLayout, WithLayoutProps } from "../../layout/with-layout";
import {
  UpgradeNoticeBanner,
  UpgradeNoticeType,
} from "../header/upgrade-notice-banner";
import { useFeatureFlip } from "@dashlane/framework-react";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { EmptyStateHeader } from "../../empty-state/shared/empty-state-header";
import { CredentialsEmptyState } from "../empty-state/credentials-empty-state";
import { SharingProvider } from "../credentials-view/sharing-context";
const I18N_KEYS = {
  EMPTY_STATE_PAGE_TITLE: "webapp_credentials_empty_state_page_title",
};
export const CredentialsListView = ({ withLayout = true }: WithLayoutProps) => {
  const hasCredentials = useHasCredentialsContext();
  const emptyStateBatch1FeatureFlip = useFeatureFlip(
    FEATURE_FLIPS_WITHOUT_MODULE.EmptyStateBatch1
  );
  if (hasCredentials === undefined) {
    return null;
  }
  if (!hasCredentials) {
    return (
      <WithBaseLayout
        withLayout={withLayout}
        header={
          emptyStateBatch1FeatureFlip ? (
            <EmptyStateHeader title={I18N_KEYS.EMPTY_STATE_PAGE_TITLE} />
          ) : (
            <CredentialsHeader />
          )
        }
      >
        {emptyStateBatch1FeatureFlip ? (
          <CredentialsEmptyState />
        ) : (
          <CredentialsListEmptyView />
        )}
      </WithBaseLayout>
    );
  }
  return (
    <WithBaseLayout withLayout={withLayout} header={<CredentialsHeader />}>
      <SharingProvider>
        <CompromisedCredentialsProvider>
          <MultiSelectMenu type="credentials" />
          <div
            sx={{
              position: "relative",
              height: "100%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <UpgradeNoticeBanner
              noticeType={UpgradeNoticeType.Credentials}
              customSx={{ marginBottom: "8px" }}
            />
            <CredentialsListViewHeader />
            <CredentialsList />
          </div>
        </CompromisedCredentialsProvider>
      </SharingProvider>
    </WithBaseLayout>
  );
};
