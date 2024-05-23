import { ReactNode } from 'react';
import { Badge, Button, Heading, Infobox, jsx, Paragraph, } from '@dashlane/design-system';
import { Card, FlexChild, GridChild, GridContainer, Link, } from '@dashlane/ui-components';
import { DisabledButtonWithTooltip } from 'libs/dashlane-style/buttons/DisabledButtonWithTooltip';
import { openUrl } from 'libs/external-urls';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    STANDARD_TASK_LEARN_MORE: 'team_get_started_task_learn_more',
    TASK_DISABLED: 'team_get_started_task_disabled',
    TASK_COMPLETED: 'team_get_started_task_completed',
};
interface TaskCardProps {
    isCompleted: boolean;
    title: string;
    content: string;
    helpDocLink: string;
    ctaOnClick: () => void;
    ctaText: string;
    upNextImage: ReactNode;
    isDisabled?: boolean;
    disabledText?: string;
    isCtaDisabled?: boolean;
    disabledCtaTooltipText?: string;
    isUpNext?: boolean;
    infoBoxText?: string;
}
export const TaskCard = ({ isCompleted, isDisabled, title, content, helpDocLink, ctaOnClick, ctaText, upNextImage, disabledText, isCtaDisabled, disabledCtaTooltipText, isUpNext, infoBoxText, }: TaskCardProps) => {
    const { translate } = useTranslate();
    const LearnMoreLink = () => helpDocLink ? (<FlexChild as={Paragraph} innerAs={Link} size="small" color={isCompleted ? 'ds.text.neutral.quiet' : 'ds.text.brand.standard'} rel="noopener noreferrer" target="_blank" href={helpDocLink}>
        {translate(I18N_KEYS.STANDARD_TASK_LEARN_MORE)}
      </FlexChild>) : null;
    const LearnMoreButton = () => helpDocLink ? (<Button sx={{ marginLeft: '8px' }} mood="brand" intensity="supershy" size="medium" onClick={() => openUrl(helpDocLink)}>
        {translate(I18N_KEYS.STANDARD_TASK_LEARN_MORE)}
      </Button>) : null;
    return (<Card sx={{
            padding: '32px',
            marginTop: '8px',
            marginBottom: isUpNext ? '32px' : 'auto',
            borderColor: 'ds.border.neutral.quiet.idle',
            backgroundColor: isCompleted
                ? 'ds.container.agnostic.neutral.standard'
                : 'ds.container.agnostic.neutral.supershy',
            boxShadow: isUpNext ? '0px 12px 24px rgba(0, 0, 0, 0.24)' : 'unset',
        }}>
      <GridContainer gap="8px" gridTemplateRows="auto" gridTemplateColumns="2fr auto" gridTemplateAreas={isUpNext
            ? "'title image' 'content image' 'cta image'"
            : "'title cta' 'content cta' 'learnMore cta'"}>
        <GridChild gridArea="title">
          <Heading as="h2" textStyle={isUpNext ? 'ds.title.section.medium' : 'ds.title.block.medium'} sx={{
            marginBottom: isUpNext ? '16px' : '8px',
            fontWeight: 'bold',
        }} color={isCompleted ? 'ds.text.neutral.quiet' : 'ds.text.neutral.catchy'}>
            {translate(title)}
          </Heading>
        </GridChild>
        <GridChild gridArea="content">
          <Paragraph textStyle={isUpNext ? 'ds.body.standard.regular' : 'ds.body.reduced.regular'} color={isCompleted ? 'ds.text.neutral.quiet' : 'ds.text.neutral.standard'}>
            {translate(content)}
          </Paragraph>

          {infoBoxText && !isCompleted && isUpNext && !isCtaDisabled ? (<Infobox sx={{ marginTop: '16px' }} mood="brand" title={translate(infoBoxText)}/>) : null}
        </GridChild>

        {isUpNext ? (<GridChild gridArea="image" sx={{ paddingLeft: '32px' }}>
            {upNextImage}
          </GridChild>) : null}

        <GridChild gridArea="cta" justifySelf={isUpNext ? 'start' : 'end'} sx={{ marginTop: isUpNext ? '32px' : '0' }}>
          {isCompleted || isDisabled ? (<Badge label={isDisabled
                ? disabledText
                    ? translate(disabledText)
                    : translate(I18N_KEYS.TASK_DISABLED)
                : translate(I18N_KEYS.TASK_COMPLETED)} mood={isDisabled ? 'neutral' : 'positive'} intensity="catchy"/>) : (<DisabledButtonWithTooltip disabled={isCtaDisabled} size={isUpNext ? 'medium' : 'small'} mood={isUpNext ? 'brand' : 'neutral'} intensity={isUpNext ? 'catchy' : 'quiet'} onClick={ctaOnClick} content={disabledCtaTooltipText ? translate(disabledCtaTooltipText) : ''}>
              {translate(ctaText)}
            </DisabledButtonWithTooltip>)}

          {isUpNext ? <LearnMoreButton /> : null}
        </GridChild>

        {!isUpNext ? (<GridChild gridArea="learnMore">
            <LearnMoreLink />
          </GridChild>) : null}
      </GridContainer>

      {infoBoxText && !isCompleted && !isUpNext && !isCtaDisabled ? (<Infobox sx={{ marginTop: '32px' }} mood="brand" title={translate(infoBoxText)}/>) : null}
    </Card>);
};
