import { memo } from 'react';
import { DSTheme, Paragraph } from '@dashlane/design-system';
import { FlexContainer, jsx, ThemeUIStyleObject, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { Link, redirect } from 'libs/router';
import { idToItemType, logSelectId } from 'libs/logs/events/vault/select-item';
import { getFallbackIdTitle } from 'webapp/ids/helpers';
import { IdVaultItemType, ThumbnailSize } from 'webapp/ids/types';
import { IdThumbnail } from 'webapp/ids/content/thumbnails/id-thumbnail';
import { QuickActions } from 'webapp/ids/quick-actions/quick-actions';
import { Criticality } from './common';
const focusBorder: ThemeUIStyleObject = {
    outline: 'none',
    boxShadow: (theme: DSTheme) => `
    0 0 0 2px ${theme.colors.ds.container.expressive.neutral.quiet.hover},
    0 0 0 3px ${theme.colors.ds.container.expressive.neutral.quiet.active}
  `,
};
const cancelFocusBorder = {
    outline: 'none',
    boxShadow: 'none',
};
const containerStyles: ThemeUIStyleObject = {
    borderRadius: '8px',
    margin: '12px 12px 12px 0',
    cursor: 'pointer',
    width: '376px',
    height: '124px',
    gap: '16px',
    padding: '8px',
    '.card-quick-actions': {
        display: 'none',
    },
    ':focus': focusBorder,
    ':focus:not(:focus-visible)': cancelFocusBorder,
    ':hover, :focus, :focus-within': {
        backgroundColor: 'ds.container.expressive.neutral.quiet.hover',
        '.card-quick-actions': {
            display: 'inherit',
        },
    },
};
interface IdItemComponentProps {
    itemId: string;
    type: IdVaultItemType;
    title: string;
    description?: string;
    country: string;
    additionalDescription?: string;
    criticalityStatus?: Criticality;
    editRoute: string;
    copiableValue: string;
}
interface DescriptionProps {
    text?: string;
}
interface AdditionalDescriptionProps {
    text?: string;
    criticality?: Criticality;
}
const Description = ({ text }: DescriptionProps) => {
    return text ? (<Paragraph as="span" textStyle="ds.body.reduced.regular" color="ds.text.neutral.quiet" sx={{
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        }}>
      {text}
    </Paragraph>) : null;
};
const AdditionalDescription = ({ text, criticality, }: AdditionalDescriptionProps) => {
    const bold = criticality && criticality !== Criticality.MONTHSLEFT;
    const getCriticalityColor = (criticalityStatus?: Criticality) => {
        if (!criticalityStatus) {
            return 'ds.text.neutral.quiet';
        }
        if (['expired', 'daysleft'].includes(criticalityStatus)) {
            return 'ds.text.danger.quiet';
        }
        else if (criticalityStatus === Criticality.MONTHSLEFT) {
            return 'ds.text.warning.quiet';
        }
        return 'ds.text.neutral.quiet';
    };
    return text ? (<Paragraph as="span" textStyle="ds.body.reduced.regular" color={getCriticalityColor(criticality)} sx={bold ? { fontWeight: '600' } : {}}>
      {text}
    </Paragraph>) : null;
};
export const IdItemArticleComponent = ({ itemId, title, description, country, additionalDescription, criticalityStatus, editRoute, type, copiableValue, }: IdItemComponentProps) => {
    const { translate } = useTranslate();
    const handleClick = () => {
        logSelectId(itemId, idToItemType[type]);
        redirect(editRoute);
    };
    return (<FlexContainer flexDirection="row" flexWrap="nowrap" alignItems="center" tabIndex={0} sx={containerStyles} onClick={handleClick} as="article">
      <IdThumbnail size={ThumbnailSize.Large} country={country} type={type}/>
      <FlexContainer flexDirection="column" flexWrap="nowrap" sx={{
            height: '100%',
            minWidth: 0,
            width: '100%',
        }}>
        <Link sx={{
            marginTop: '4px',
            marginBottom: '4px',
            outline: 'none',
            textDecoration: 'none',
        }} to={editRoute} title={title}>
          <Paragraph as="strong" textStyle="ds.body.standard.regular" color="ds.text.neutral.catchy" sx={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        }}>
            {title || getFallbackIdTitle(type, country, translate)}
          </Paragraph>
        </Link>

        <FlexContainer className="card-contents" flexDirection="column" flexWrap="nowrap" sx={{
            minWidth: 0,
        }}>
          <Description text={description}/>
          <AdditionalDescription text={additionalDescription} criticality={criticalityStatus}/>
          
        </FlexContainer>

        <span sx={{ marginTop: '4px' }} className="card-quick-actions">
          <QuickActions itemId={itemId} copyValue={copiableValue} editRoute={editRoute} variant="list" type={type}/>
        </span>
      </FlexContainer>
    </FlexContainer>);
};
export const IdItemArticle = memo(IdItemArticleComponent);
