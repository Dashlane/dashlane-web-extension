import { memo, useCallback, useMemo, useRef } from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useFeatureFlip, useModuleQuery } from "@dashlane/framework-react";
import {
  DSCSSObject,
  Flex,
  IndeterminateLoader,
} from "@dashlane/design-system";
import {
  autofillSettingsApi,
  CredentialPreferences,
} from "@dashlane/autofill-contracts";
import { Credential } from "@dashlane/vault-contracts";
import { InfiniteScrollList } from "../../pagination/infinite-scroll-list";
import { CredentialListItem } from "./credential-list-item";
import { useCredentialsContext } from "../credentials-view/credentials-context";
import { useIsB2CUserFrozen } from "../../../libs/frozen-state/hooks/use-is-b2c-user-frozen";
interface RowData {
  credentials: Credential[];
  preferences: Record<string, CredentialPreferences>;
  isUserFrozen: boolean;
  hasMore?: boolean;
}
const EmptyStyle = {};
const CredentialRow = memo(
  ({ data, index, style }: ListChildComponentProps<RowData>) => {
    const isLoadingRow = index >= data.credentials.length;
    if (isLoadingRow && !data.hasMore) {
      return null;
    }
    return isLoadingRow ? (
      <Flex
        sx={{
          ...style,
          height: "60px",
        }}
        alignContent="center"
        justifyContent="center"
      >
        <IndeterminateLoader size="xlarge" />
      </Flex>
    ) : (
      <CredentialListItem
        key={data.credentials[index].id}
        sx={{ ...style, pointerEvents: "auto" } as DSCSSObject}
        credential={data.credentials[index]}
        credentialPreferences={data.preferences[data.credentials[index].id]}
        isUserFrozen={data.isUserFrozen}
      />
    );
  }
);
CredentialRow.displayName = "CredentialRow";
export const CredentialsList = () => {
  const { credentials, credentialIds, hasMore, onNextPage } =
    useCredentialsContext();
  const virtualizationEnabled = useFeatureFlip(
    "sharingVault_web_vaultPerformanceImp"
  );
  const pageNumberRef = useRef(1);
  const loadedItems = useRef(credentials.length);
  const isLoading = useRef(false);
  const { data: credentialPreferences } = useModuleQuery(
    autofillSettingsApi,
    "getPreferencesForCredentials",
    {
      credentialIds: credentialIds,
    }
  );
  const isUserFrozen = useIsB2CUserFrozen();
  const onItemRendered = useCallback(
    ({ overscanStopIndex }) => {
      if (
        overscanStopIndex >= credentials.length - 1 &&
        hasMore &&
        !isLoading.current
      ) {
        isLoading.current = true;
        loadedItems.current = credentials.length;
        onNextPage(++pageNumberRef.current);
      } else if (
        isLoading.current &&
        loadedItems.current !== credentials.length
      ) {
        isLoading.current = false;
      }
    },
    [credentials.length, hasMore, onNextPage]
  );
  const rowData: RowData = useMemo(() => {
    const credentialPreferencesByID = credentialPreferences?.reduce(
      (acc, credentialPreference) => {
        acc[credentialPreference.id] = credentialPreference;
        return acc;
      },
      {} as Record<string, CredentialPreferences>
    );
    return {
      credentials: credentials,
      preferences: credentialPreferencesByID ?? {},
      isUserFrozen: isUserFrozen ?? true,
      hasMore: hasMore,
    };
  }, [credentialPreferences, credentials, hasMore, isUserFrozen]);
  if (virtualizationEnabled === null) {
    return null;
  }
  if (virtualizationEnabled) {
    return (
      <div style={{ flex: "1 1 auto" }}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList<RowData>
              data-testid="credentials-list"
              height={height}
              itemCount={hasMore ? credentials.length + 1 : credentials.length}
              itemData={rowData}
              itemSize={60}
              width={width}
              onItemsRendered={onItemRendered}
              overscanCount={20}
            >
              {CredentialRow}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    );
  } else {
    return (
      <InfiniteScrollList onNextPage={onNextPage} hasMore={hasMore}>
        {Array.from(Array(credentials?.length + 1).keys()).map((index) => (
          <CredentialRow
            key={rowData.credentials[index]?.id ?? "loading"}
            data={rowData}
            index={index}
            style={EmptyStyle}
          />
        ))}
      </InfiniteScrollList>
    );
  }
};
