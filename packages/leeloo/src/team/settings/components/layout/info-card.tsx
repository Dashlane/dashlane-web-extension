import { PropsWithChildren, ReactNode } from "react";
import { Card, Heading } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  DEFAULT_TITLE: "webapp_tac_infocard_title",
};
interface InfoCardProps {
  supportHeader?: ReactNode;
}
export const InfoCard = ({
  supportHeader,
  children,
}: PropsWithChildren<InfoCardProps>) => {
  const { translate } = useTranslate();
  return (
    <Card
      sx={{
        display: "flex",
        gap: "8px",
        flexDirection: "column",
        background: "ds.container.agnostic.neutral.supershy",
      }}
    >
      <Heading
        as="h2"
        textStyle="ds.title.supporting.small"
        color="ds.text.neutral.quiet"
        sx={{ marginBottom: "8px" }}
      >
        {supportHeader ?? translate(I18N_KEYS.DEFAULT_TITLE)}
      </Heading>
      {children}
    </Card>
  );
};
