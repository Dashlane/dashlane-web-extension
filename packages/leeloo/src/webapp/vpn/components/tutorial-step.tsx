import { CheckCircleIcon, colors, GridChild, GridContainer, jsx, keyframes, LoadingIcon, mergeSx, ThemeUIStyleObject, } from '@dashlane/ui-components';
import { PropsWithChildren, ReactNode } from 'react';
import { VPN_ACTIVATING_ANIMATION_DURATION } from './animation-constants';
import { TutorialStepNumber } from './tutorial-step-number';
import { TutorialStepTitle } from './tutorial-step-title';
const defaultLayout = "'summary actions' 'details actions'";
const smallScreenSizeLayout = "'summary' 'details' 'actions'";
const layoutStyle: ThemeUIStyleObject = {
    gridTemplateAreas: [
        smallScreenSizeLayout,
        smallScreenSizeLayout,
        defaultLayout,
    ],
};
export enum TutorialStepStatus {
    INITIAL = 'initial',
    IN_PROCESS = 'in_process',
    COMPLETED = 'completed'
}
export interface TutorialStepOptions {
    easeOut: boolean;
    easeIn: boolean;
}
export type TutorialStepProps = PropsWithChildren<{
    actions?: ReactNode;
    number?: number;
    status?: TutorialStepStatus;
    title: string;
    options?: TutorialStepOptions;
}>;
const getIcon = (status: TutorialStepStatus, index: number) => {
    switch (status) {
        case TutorialStepStatus.INITIAL:
            return <TutorialStepNumber content={index} size={20}/>;
        case TutorialStepStatus.IN_PROCESS:
            return <LoadingIcon color={colors.dashGreen00} size={20}/>;
        case TutorialStepStatus.COMPLETED:
            return (<CheckCircleIcon color={colors.accessibleValidatorGreen} size={20}/>);
    }
};
const easeOut = keyframes({
    from: {
        opacity: 1,
        maxHeight: '240px',
        animationTimingFunction: 'cubic-bezier(0.03, 0.85, 0.34, 1)',
    },
    '62%': {
        opacity: 0,
        maxHeight: '240px',
        animationTimingFunction: 'cubic-bezier(0.43, 0.01, 0, 1)',
    },
    to: { opacity: 0, maxHeight: '176px' },
});
const easeIn = keyframes({
    from: { opacity: 0 },
    to: { opacity: 1 },
});
const easeOutAnimationSx: ThemeUIStyleObject = {
    animation: `${easeOut} ${VPN_ACTIVATING_ANIMATION_DURATION}ms`,
};
const easeInAnimationSx: ThemeUIStyleObject = {
    animation: `${easeIn} 249ms cubic-bezier(0.87, 0, 0.93, 0.5)`,
};
export const TutorialStep = ({ actions, number = 1, status = TutorialStepStatus.INITIAL, title, options, children, }: TutorialStepProps) => {
    const containerSx = options
        ? mergeSx([
            layoutStyle,
            options.easeOut ? easeOutAnimationSx : {},
            options.easeIn ? easeInAnimationSx : {},
        ])
        : layoutStyle;
    return (<GridContainer alignItems="center" gap="16px" sx={containerSx}>
      <GridChild gridArea="summary">
        <TutorialStepTitle title={title} icon={getIcon(status, number)}/>
      </GridChild>
      <GridChild gridArea="details" sx={{ alignSelf: 'flex-start' }}>
        {children}
      </GridChild>
      <GridChild gridArea="actions" sx={{ justifySelf: 'flex-end' }}>
        {actions}
      </GridChild>
    </GridContainer>);
};
