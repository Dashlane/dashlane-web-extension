import * as React from 'react';
import classnames from 'classnames';
import styles from './styles.css';
interface Props {
    children?: React.ReactNode;
    tooltipText?: string;
    className?: string;
}
interface State {
    tooltipActive: boolean;
}
export default class IntelligentTooltipOnOverflow extends React.Component<Props, State> {
    private containerRef: HTMLElement | null = null;
    public constructor(props: Props) {
        super(props);
        this.state = { tooltipActive: true };
    }
    public componentDidMount() {
        this.setState({
            tooltipActive: this.isTooltipNeeded(),
        });
    }
    public componentDidUpdate(prevProps: Props, prevState: State) {
        const upToDateTooltipActiveState = this.isTooltipNeeded();
        if (upToDateTooltipActiveState === prevState.tooltipActive) {
            return;
        }
        this.setState({
            tooltipActive: upToDateTooltipActiveState,
        });
    }
    private isTooltipNeeded() {
        if (!this.containerRef) {
            return false;
        }
        return this.containerRef.offsetWidth < this.containerRef.scrollWidth;
    }
    private setContainerRef = (el: HTMLElement) => {
        this.containerRef = el;
    };
    public render() {
        let title: undefined | string = undefined;
        if (this.state.tooltipActive) {
            const { tooltipText = this.props.children } = this.props;
            if (typeof tooltipText === 'string') {
                title = tooltipText;
            }
        }
        return (<span ref={this.setContainerRef} title={title} className={classnames(styles.container, this.props.className)}>
        {this.props.children}
      </span>);
    }
}
