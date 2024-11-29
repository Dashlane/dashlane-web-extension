import { Heading, Icon } from "@dashlane/design-system";
interface Props {
  title: string;
  iconName?:
    | "RecoveryKeyOutlined"
    | "FeedbackSuccessOutlined"
    | "FeedbackFailOutlined";
  isSuccess?: boolean;
}
export const HeaderAccountRecoveryKey = ({
  title,
  iconName,
  isSuccess,
}: Props) => {
  return (
    <div>
      {iconName ? (
        <Icon
          sx={{ size: "77px", marginBottom: "16px" }}
          name={iconName}
          color="ds.text.brand.quiet"
        />
      ) : (
        ""
      )}

      <Heading
        sx={!isSuccess ? { marginBottom: "16px" } : undefined}
        as={"h2"}
        textStyle={isSuccess ? "ds.title.section.large" : undefined}
      >
        {title}
      </Heading>
    </div>
  );
};
