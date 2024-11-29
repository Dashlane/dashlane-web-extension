import { Component, ReactNode } from "react";
import { AlertSeverity } from "@dashlane/ui-components";
import { useAlert } from "../../libs/alert-notifications/use-alert";
import useTranslate from "../../libs/i18n/useTranslate";
import { Redirect } from "../../libs/router";
interface Props {
  children: ReactNode;
  redirectPath: string;
}
interface ErrorBoundaryProps {
  onError: () => void;
  redirectPath: string;
}
interface ErrorBoundaryState {
  hasError: boolean;
}
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state = {
    hasError: false,
  };
  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }
  public componentDidCatch() {
    this.props.onError();
    this.setState({
      hasError: false,
    });
  }
  render() {
    return this.state.hasError ? (
      <Redirect to={this.props.redirectPath} />
    ) : (
      this.props.children
    );
  }
}
export const VaultItemPanelsErrorBoundaryRedirect = ({
  redirectPath,
  children,
}: Props) => {
  const alert = useAlert();
  const { translate } = useTranslate();
  return (
    <ErrorBoundary
      redirectPath={redirectPath}
      onError={() => {
        alert.showAlert(
          translate("_common_generic_error"),
          AlertSeverity.ERROR
        );
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
