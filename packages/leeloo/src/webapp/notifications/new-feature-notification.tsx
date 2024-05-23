import React from 'react';
import { Button, Heading, jsx, Paragraph } from '@dashlane/design-system';
import { Tooltip } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { CollectionIntroImage } from 'webapp/sidemenu/collections-menu/guided-intro/collection-intro-image';
const I18N_KEYS = {
    BUTTON: 'webapp_credentials_multiselect_shift_tooltip_button',
};
interface Coordinates {
    x: number;
    y: number;
}
interface Props {
    buttonCoordinates?: Coordinates;
    title: string;
    description: string;
    setIsNotificationVisible: () => void;
}
export const NewFeatureNotification = ({ buttonCoordinates = { x: 0, y: 0 }, title, description, setIsNotificationVisible, }: Props) => {
    const { translate } = useTranslate();
    return (<Tooltip placement="right-start" trigger="click" type="dark" sx={{
            textTransform: 'none',
            textAlign: 'left',
            padding: '10px',
            maxWidth: '450px',
            '@keyframes fadeIn': {
                '0%': {
                    opacity: 0,
                    transform: `translate(${buttonCoordinates.x}, ${buttonCoordinates.y}) scale3d(0, 0, 1)`,
                },
                '100%': {
                    opacity: 1,
                    transform: `translate(${buttonCoordinates.x}, ${buttonCoordinates.y}) scale3d(0, 0, 1)`,
                },
            },
            animation: 'fadeIn 250ms ease-out',
        }} content={<>
          <Heading as="h1" color="ds.text.inverse.catchy" sx={{
                variant: 'text.ds.title.block.large',
                marginBottom: '8px',
            }}>
            {title}
          </Heading>
          <Paragraph color="ds.text.inverse.catchy" sx={{
                variant: 'text.ds.body.standard.regular',
                marginBottom: '8px',
            }}>
            {description}
          </Paragraph>
          <CollectionIntroImage />
          <Button sx={{
                float: 'right',
            }} onClick={() => setIsNotificationVisible()}>
            {translate(I18N_KEYS.BUTTON)}
          </Button>
        </>}>
      <Button layout="iconOnly" icon="FeedbackInfoOutlined" intensity="supershy"/>
    </Tooltip>);
};
