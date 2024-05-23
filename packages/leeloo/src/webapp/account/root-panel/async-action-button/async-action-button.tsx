import * as React from 'react';
import classnames from 'classnames';
import styles from './async-action-button.css';
import { AnimationStatus } from '../sync-action';
export interface Props {
    onClick: () => void;
    children: React.ReactNode;
    status: AnimationStatus;
    animationDuration?: number;
}
export interface State {
    actionState: AnimationStatus;
}
export const DEFAULT_ANIMATION_DURATION = 2000;
export default class AsyncActionButton extends React.PureComponent<Props, State> {
    public static defaultProps = {
        animationDuration: DEFAULT_ANIMATION_DURATION,
    };
    public state: State = {
        actionState: this.props.status,
    };
    private animationSubscription: number | null = null;
    private cancelAnimationSubscription = () => {
        if (this.animationSubscription !== null) {
            clearTimeout(this.animationSubscription);
        }
    };
    public componentDidMount() {
        this.updateActionState();
    }
    public componentWillUnmount() {
        this.cancelAnimationSubscription();
    }
    public componentDidUpdate(prevProps: Props) {
        if (prevProps.status !== this.props.status) {
            this.updateActionState();
        }
    }
    private updateActionState() {
        const { status } = this.props;
        const { actionState } = this.state;
        if (status !== actionState) {
            this.setState({
                actionState: status,
            }, this.checkActionState);
        }
    }
    private checkActionState() {
        const { animationDuration } = this.props;
        const { actionState } = this.state;
        this.cancelAnimationSubscription();
        if (actionState === 'success' || actionState === 'error') {
            this.animationSubscription = window.setTimeout(() => this.setState({
                actionState: AnimationStatus.Idle,
            }), animationDuration);
        }
    }
    private onClick = () => {
        if (this.state.actionState === 'idle') {
            this.props.onClick();
        }
    };
    public render() {
        const { children, animationDuration } = this.props;
        const { actionState } = this.state;
        const buttonClassNames = classnames(styles.button, actionState === 'loading' && styles.loading, actionState === 'success' && styles.success, actionState === 'error' && styles.error);
        const showIcon = actionState !== 'idle';
        return (<button type="button" className={buttonClassNames} onClick={this.onClick}>
        {children}
        {showIcon && (<div className={styles.icon} data-testid="syncIcon" style={{
                    animationDuration: actionState !== 'loading'
                        ? `${animationDuration}ms`
                        : undefined,
                }} role="alert" aria-label={actionState}/>)}
      </button>);
    }
}
