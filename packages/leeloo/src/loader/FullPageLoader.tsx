import { Fragment, PropsWithChildren } from 'react';
import { jsx } from '@dashlane/design-system';
import Animation from 'libs/dashlane-style/animation';
import loadingLottie from 'libs/assets/lottie-loading.json';
export type Props = PropsWithChildren<{
    isLoading?: boolean;
}>;
export const FullPageLoader = ({ isLoading = true, children }: Props) => {
    return isLoading ? (<div sx={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
        }}>
      <Animation height={150} width={150} animationParams={{
            renderer: 'svg',
            animationData: loadingLottie,
            loop: true,
            autoplay: true,
        }}/>
    </div>) : (<>{children}</>);
};
