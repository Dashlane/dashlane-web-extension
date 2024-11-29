import * as React from "react";
import classnames from "classnames";
import { assertUnreachable } from "../../assert-unreachable";
import styles from "./styles.css";
import QuestionSvgIcon from "./icons/question.svg?inline";
import InfoSvgIcon from "./icons/info.svg?inline";
interface Props {
  type?: "info" | "question";
  maxWidth?: number;
  iconClassNames?: string[];
}
interface State {
  isTooltipVisible: boolean;
}
const DEFAULT_MAX_WIDTH = 312;
const DEFAULT_TYPE = "info";
export default class TooltipModern extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      isTooltipVisible: false,
    };
  }
  private showTooltip = (): void => {
    this.setState({ isTooltipVisible: true });
  };
  private hideTooltip = (): void => {
    this.setState({ isTooltipVisible: false });
  };
  private renderIcon = () => {
    const { type = DEFAULT_TYPE } = this.props;
    switch (type) {
      case "info":
        return <InfoSvgIcon />;
      case "question":
        return <QuestionSvgIcon />;
      default:
        assertUnreachable(type);
    }
    return null;
  };
  public render() {
    const {
      iconClassNames = [],
      maxWidth = DEFAULT_MAX_WIDTH,
      children,
    } = this.props;
    const icon = this.renderIcon();
    return (
      <div
        className={styles.container}
        onMouseEnter={this.showTooltip}
        onMouseLeave={this.hideTooltip}
      >
        <div className={classnames(styles.iconContainer, ...iconClassNames)}>
          {icon}
        </div>
        <div
          className={classnames(`${styles.tooltipContainer}`, {
            [`${styles.tooltipDisplayed}`]: this.state.isTooltipVisible,
          })}
          style={{ maxWidth: `${maxWidth}px` }}
        >
          {children}
          <div className={styles.triangle} />
        </div>
      </div>
    );
  }
}
