import { Icon } from "@dashlane/design-system";
import { PanelHeader } from "../../../panel";
import { TabProps } from "../../../secure-notes/form/header/header";
interface Props {
  title: string;
  tabs?: TabProps[];
}
export const Header = ({ title, tabs }: Props) => {
  return (
    <PanelHeader
      icon={
        <div
          sx={{
            width: "168px",
            height: "108px",
            borderStyle: "solid",
            borderWidth: "1px",
            borderRadius: "4px",
            borderColor: "ds.border.neutral.quiet.idle",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon
            name="ItemSecretOutlined"
            color="ds.text.neutral.standard"
            size="xlarge"
          />
        </div>
      }
      title={title}
      tabs={tabs}
    />
  );
};
