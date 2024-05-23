import { AccordionDetails, AccordionSection, AccordionSummary, jsx, Paragraph, ThemeUIStyleObject, } from '@dashlane/ui-components';
import { TranslationOptions } from 'libs/i18n/types';
import { useTranslateWithMarkup } from 'libs/i18n/useTranslateWithMarkup';
interface VpnFaqSectionProps {
    summary: TranslationOptions;
    parts: TranslationOptions[];
}
const paragraphStyle: ThemeUIStyleObject = {
    marginTop: '8px',
};
const getParagraphStyle = (index: number) => (index > 0 ? paragraphStyle : {});
export const VpnFaqSection = ({ summary, parts }: VpnFaqSectionProps) => {
    const { translateWithMarkup } = useTranslateWithMarkup();
    return (<AccordionSection>
      <AccordionSummary>{translateWithMarkup(summary)}</AccordionSummary>
      <AccordionDetails>
        {parts?.map((part, index) => (<Paragraph sx={getParagraphStyle(index)} size="x-small" key={part.key}>
            {translateWithMarkup(part)}
          </Paragraph>))}
      </AccordionDetails>
    </AccordionSection>);
};
