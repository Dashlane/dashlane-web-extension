import { ExpressiveIcon, Paragraph } from "@dashlane/design-system";
interface ProfileAdminHeaderProps {
  questionNumber: string;
  headerTitle: string;
  headerDescription: string;
}
export const ProfileAdminHeader = ({
  questionNumber,
  headerTitle,
  headerDescription,
}: ProfileAdminHeaderProps) => {
  return (
    <>
      <div
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <ExpressiveIcon
          name="FeedbackHelpOutlined"
          size="medium"
          mood="brand"
        />
        <Paragraph
          color="ds.text.neutral.quiet"
          textStyle="ds.title.supporting.small"
        >
          {questionNumber}
        </Paragraph>
      </div>
      <div
        sx={{
          paddingBottom: "16px",
        }}
      >
        <Paragraph
          textStyle="ds.title.section.large"
          color="ds.text.neutral.catchy"
          sx={{
            paddingBottom: "8px",
          }}
        >
          {headerTitle}
        </Paragraph>
        <Paragraph
          color="ds.text.neutral.quiet"
          textStyle="ds.body.reduced.regular"
        >
          {headerDescription}
        </Paragraph>
      </div>
    </>
  );
};
