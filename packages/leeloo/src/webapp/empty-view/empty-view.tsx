import { Heading } from "@dashlane/design-system";
import { PropsWithChildren } from "react";
interface EmptyViewProps {
  icon: React.ReactNode;
  title?: string;
  titleStyle?: React.CSSProperties;
  childrenStyle?: React.CSSProperties;
}
export const EmptyView = (props: PropsWithChildren<EmptyViewProps>) => {
  return (
    <div
      sx={{
        whiteSpace: "normal",
        height: "100%",
      }}
    >
      <div
        sx={{
          margin: "0 auto",
          textAlign: "center",
          maxWidth: "480px",
          paddingTop: "5%",
        }}
      >
        <div
          sx={{
            display: "flex",
            alignItems: "flex-end",
            height: "180px",
            justifyContent: "space-around",
            marginBottom: "20px",
          }}
        >
          {props.icon}
        </div>
        {props.title ? (
          <Heading
            as="h1"
            textStyle="ds.title.section.medium"
            sx={{
              marginBottom: "16px",
              marginTop: "20px",
            }}
            color="ds.text.neutral.catchy"
            style={props.titleStyle}
          >
            {props.title}
          </Heading>
        ) : null}
        <div
          sx={{
            color: "ds.text.neutral.standard",
            textStyle: "ds.text.body.standard",
            lineHeight: "20px",
          }}
          style={props.childrenStyle}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
};
