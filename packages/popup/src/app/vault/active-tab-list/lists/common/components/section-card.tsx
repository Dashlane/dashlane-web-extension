import { Card, Heading, jsx } from "@dashlane/design-system";
interface Props {
  children: React.ReactNode;
  header?: string;
}
export const SectionCard = ({ children, header }: Props) => (
  <Card
    sx={{
      margin: "8px",
      padding: "8px",
      gap: "0",
    }}
  >
    {header ? (
      <Heading
        textStyle="ds.title.supporting.small"
        as="h4"
        color="ds.text.neutral.quiet"
        sx={{ paddingLeft: "8px", margin: "8px 0" }}
      >
        {header}
      </Heading>
    ) : null}
    {children}
  </Card>
);
