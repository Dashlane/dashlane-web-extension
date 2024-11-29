import { FC, PropsWithChildren } from "react";
import { BaseLayout, BaseLayoutProps } from "./base-layout";
type PropsFromLayout<Layout> = Layout & WithLayoutProps;
export interface WithLayoutProps {
  withLayout?: boolean;
}
const WithGivenLayout = ({
  withLayout = true,
  children,
  layout,
  ...rest
}: PropsWithChildren<
  WithLayoutProps & {
    layout: FC;
  }
>) => {
  const Layout = layout;
  if (withLayout) {
    return <Layout {...rest}>{children}</Layout>;
  }
  return <>{children}</>;
};
export const WithBaseLayout = (props: PropsFromLayout<BaseLayoutProps>) => {
  return <WithGivenLayout layout={BaseLayout} {...props} />;
};
