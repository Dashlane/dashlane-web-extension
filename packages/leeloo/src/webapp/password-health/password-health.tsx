import { useEffect, useMemo } from "react";
import { Flex, Heading, mergeSx } from "@dashlane/design-system";
import {
  Alert,
  AlertSeverity,
  AlertWrapper,
  GridChild,
  GridContainer,
  LoadingIcon,
} from "@dashlane/ui-components";
import { Lee } from "../../lee";
import useTranslate from "../../libs/i18n/useTranslate";
import { getCurrentSpaceId } from "../../libs/webapp";
import { PasswordHealthScores } from "./scores/PasswordHealthScores";
import { TipManager } from "./tips/tip-manager/tip-manager";
import { PersonalDataSectionView } from "../personal-data-section-view/personal-data-section-view";
import { Connected as NotificationsDropdown } from "../bell-notifications/connected";
import { sendPasswordHealthViewPageLog } from "./logs/logs";
import { Header } from "../components/header/header";
import { HeaderAccountMenu } from "../components/header/header-account-menu";
import { usePasswordHealthState } from "./hooks/use-password-health-state";
import { passwordHealthStyles } from "./password-health-styles";
import { PasswordHealthList } from "./list/password-health-list";
import { useIsHeaderWidthAboveSize } from "../components/header/useIsHeaderWidthAboveSize";
import { HEADER_BREAKPOINT_SIZE } from "../components/header/constants";
const I18N_KEYS = {
  PAGE_TITLE: "webapp_password_health_page_title",
  PAGE_LOADING_ALERT: "webapp_password_health_page_loading_alert",
};
interface PasswordHealthProps {
  lee: Lee;
}
export const PasswordHealth = ({ lee }: PasswordHealthProps) => {
  const { translate } = useTranslate();
  const spaceId = getCurrentSpaceId(lee.globalState);
  const { counters, isInitialized } = usePasswordHealthState(spaceId);
  const nonExcludedCredentialsCount = useMemo(
    () => (isInitialized && counters ? counters.total - counters.excluded : 5),
    [isInitialized, counters]
  );
  const passwordHealthScore =
    counters?.score && isInitialized ? counters.score : null;
  useEffect(() => {
    sendPasswordHealthViewPageLog();
  }, []);
  const isWindowWidthAboveSize = useIsHeaderWidthAboveSize(
    HEADER_BREAKPOINT_SIZE
  );
  return (
    <PersonalDataSectionView>
      {!isInitialized ? (
        <AlertWrapper>
          <Alert severity={AlertSeverity.SUBTLE} showIcon={false}>
            <GridContainer
              as={"span"}
              gap={20}
              gridTemplateColumns={"20px 1fr"}
              alignItems={"center"}
              sx={{ paddingRight: "4px" }}
            >
              <LoadingIcon size={24} color={"ds.text.brand.standard"} />
              {translate(I18N_KEYS.PAGE_LOADING_ALERT)}
            </GridContainer>
          </Alert>
        </AlertWrapper>
      ) : null}
      <div sx={passwordHealthStyles.rootContainer}>
        <Flex sx={passwordHealthStyles.headerContainer}>
          <Header
            startWidgets={
              <Heading
                as="h1"
                textStyle="ds.title.section.large"
                color="ds.text.neutral.catchy"
              >
                {translate(I18N_KEYS.PAGE_TITLE)}
              </Heading>
            }
            endWidget={
              <>
                <HeaderAccountMenu />
                <NotificationsDropdown />
              </>
            }
          />
        </Flex>
        <GridContainer
          gridTemplateAreas="'score tips' 'list list'"
          gridTemplateColumns="1fr auto"
          sx={mergeSx([
            passwordHealthStyles.passwordHealthGrid,
            isWindowWidthAboveSize
              ? {}
              : passwordHealthStyles.passwordHealthZoomed,
          ])}
        >
          <GridChild
            as={Flex}
            gridArea="score"
            sx={passwordHealthStyles.passwordHealthScore}
          >
            <PasswordHealthScores
              compromisedPasswordCount={counters?.compromised ?? 0}
              passwordHealthScore={passwordHealthScore}
              reusedPasswordCount={counters?.reused ?? 0}
              totalPasswordCount={counters?.total ?? 0}
              weakPasswordCount={counters?.weak ?? 0}
            />
          </GridChild>
          <GridChild
            as={Flex}
            gridArea="tips"
            justifyContent="center"
            sx={
              isWindowWidthAboveSize
                ? passwordHealthStyles.passwordHealthTips
                : passwordHealthStyles.passwordHealthTipsZoomed
            }
          >
            <TipManager
              isWindowWidthAboveSize
              nonExcludedCredentialsCount={nonExcludedCredentialsCount}
            />
          </GridChild>
          <GridChild
            as={GridContainer}
            gridArea="list"
            gridTemplateRows="auto 1fr"
          >
            <PasswordHealthList spaceId={spaceId} />
          </GridChild>
        </GridContainer>
      </div>
    </PersonalDataSectionView>
  );
};
