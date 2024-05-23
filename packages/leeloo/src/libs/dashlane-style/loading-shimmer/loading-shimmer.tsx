import { colors, jsx } from '@dashlane/design-system';
export interface LoadingShimmerProps {
    height: string | number;
    width: string | number;
}
export const LoadingShimmer = ({ height, width }: LoadingShimmerProps) => {
    const bg = colors.lightTheme.ds.container.agnostic.neutral.supershy;
    const shimmer = colors.lightTheme.ds.background.alternate;
    return (<div sx={{
            height: height,
            width: width,
            animation: 'shimmer 0.8s linear infinite alternate',
            '@keyframes shimmer': {
                from: {
                    backgroundColor: bg,
                    opacity: 0.5,
                },
                to: {
                    backgroundColor: shimmer,
                    opacity: 1,
                },
            },
        }}/>);
};
