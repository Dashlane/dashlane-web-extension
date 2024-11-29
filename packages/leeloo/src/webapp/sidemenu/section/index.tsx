import { Paragraph } from "@dashlane/design-system";
import { Children, ReactElement, ReactNode } from "react";
interface Props {
  children: ReactNode;
  title?: ReactNode;
  isCollapsed?: boolean;
  className?: string;
}
export const SidemenuSection = ({
  children,
  title,
  isCollapsed = false,
  className,
}: Props) => (
  <section className={className}>
    {title ? (
      <Paragraph
        color="ds.text.neutral.standard"
        textStyle="ds.title.supporting.small"
        sx={{
          visibility: isCollapsed ? "hidden" : "visible",
          marginLeft: "14px",
          marginBottom: "8px",
        }}
      >
        {title}
      </Paragraph>
    ) : null}
    <ul>
      {Children.toArray(children).map((childElement, index) => {
        const { props } = childElement as ReactElement;
        const key =
          props.to ||
          props.id ||
          props.collection?.id ||
          `sideMenu_section_${title}_${index}`;
        return <li key={key}>{childElement}</li>;
      })}
    </ul>
  </section>
);
