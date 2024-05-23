import { ComponentProps, ElementType, ReactNode } from 'react';
import { GridChild, GridContainer, jsx, PropsOf, } from '@dashlane/ui-components';
interface ResponsiveGridWithSideCardProps<M extends ReactNode & ElementType, S extends ReactNode & ElementType> extends PropsOf<typeof GridContainer> {
    mainContent: M;
    mainProps?: ComponentProps<M>;
    secondaryContent: S;
    secondaryProps?: ComponentProps<S>;
    fullWidth?: boolean;
}
const mainContentSizeHandler = (fullWidth: boolean) => !fullWidth ? '800px' : 'auto';
export const ResponsiveMainSecondaryLayout = <M extends ElementType, S extends ElementType>({ mainContent: MainContent, mainProps, secondaryContent: SecondaryContent, secondaryProps, fullWidth, ...rest }: ResponsiveGridWithSideCardProps<M, S>) => (<GridContainer gap="32px" gridTemplateAreas={["'top' 'bottom'", "'top' 'bottom'", "'left right'"]} gridTemplateColumns={[
        null,
        null,
        `minmax(auto, ${mainContentSizeHandler(fullWidth ?? false)}) 256px`,
    ]} gridTemplateRows={['auto auto', 'auto auto', 'auto']} alignContent="flex-start" sx={{
        py: '32px',
        px: '42px',
    }} {...rest}>
    <GridChild alignSelf="flex-start" gridArea={['top', 'top', 'right']}>
      <SecondaryContent {...secondaryProps}/>
    </GridChild>
    <GridChild gridArea={['bottom', 'bottom', 'left']}>
      <MainContent {...mainProps}/>
    </GridChild>
  </GridContainer>);
