import { Badge, Heading, jsx, Paragraph, Toggle, } from '@dashlane/design-system';
import { getExperimentData } from './experiment-data';
import { FlexContainer, Link } from '@dashlane/ui-components';
import { openUrl } from 'libs/external-urls';
interface ExperimentProps {
    id: string;
    value: boolean;
}
export const Experiment = ({ id, value }: ExperimentProps) => {
    const { name, supportLink, description, isNew } = getExperimentData(id);
    const toggleName = (<Heading as="h3" textStyle="ds.title.block.medium" color="ds.text.neutral.catchy">
      {name}
      {isNew ? (<Badge sx={{ display: 'inline-block', marginLeft: '8px' }} mood="brand" intensity="quiet" label="New"/>) : null}
    </Heading>);
    const toggleDescription = (<Paragraph color="ds.text.neutral.standard">
      {description || 'No description available for this feature.'}
    </Paragraph>);
    const onClickHandler = () => {
        if (supportLink) {
            openUrl(supportLink);
        }
    };
    return (<FlexContainer sx={{
            padding: '8px 0',
        }}>
      <Toggle label={toggleName} description={toggleDescription} checked={value} readOnly sx={{ width: '100%', wordBreak: 'break-all' }}/>
      
      {supportLink ? (<Link color="ds.text.brand.quiet" onClick={onClickHandler} sx={{ marginTop: '4px' }}>
          Learn more
        </Link>) : null}
      <div sx={{
            backgroundColor: 'ds.border.neutral.quiet.idle',
            width: '100%',
            height: '1px',
            marginTop: '16px',
        }}/>
    </FlexContainer>);
};
