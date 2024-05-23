import { useMemo } from 'react';
import { Heading, IndeterminateLoader, jsx } from '@dashlane/design-system';
import { CrossCircleIcon, EmptyFolderIcon, FlexChild, FlexContainer, GridContainer, } from '@dashlane/ui-components';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { Features } from '@dashlane/communication';
import { useExperimentSearch } from '../hooks/use-experiment-search';
import { Experiment } from './experiment';
import { ExperimentSearch } from '../search';
export const DEBOUNCE_RATE = 200;
const EmptySearch = () => (<FlexContainer flexDirection={'column'} alignItems={'center'} gap={'24px'} sx={{ marginTop: '48px' }}>
    <EmptyFolderIcon size={48} color={'ds.text.neutral.quiet'}/>
    <Heading as="h4" textStyle="ds.title.section.medium" color="ds.text.neutral.quiet">
      No feature found
    </Heading>
  </FlexContainer>);
const LoadingStatus = () => (<FlexContainer alignItems={'center'} justifyContent={'center'} gap={'24px'} sx={{ marginTop: '16px', margin: '48px auto' }}>
    <IndeterminateLoader size="small" mood="neutral"/>
    <span color={'ds.text.neutral.quiet'}>Loading features</span>
  </FlexContainer>);
const ErrorStatus = () => (<FlexContainer flexDirection={'column'} alignItems={'center'} gap={'24px'} sx={{ marginTop: '48px' }}>
    <CrossCircleIcon size={48} color={'ds.text.neutral.quiet'}/>
    <Heading as="h4" textStyle="ds.title.section.medium" color="ds.text.neutral.quiet">
      Error while loading features
    </Heading>
  </FlexContainer>);
interface SearchResultsProps {
    features: Features;
}
const SearchResults = ({ features }: SearchResultsProps) => {
    const entries = Object.entries(features);
    if (!entries.length) {
        return <EmptySearch />;
    }
    return (<FlexContainer flexDirection="column" sx={{ paddingRight: '16px', width: '100%' }}>
      {entries.map(([name, value]) => (<Experiment id={name} key={name} value={value}/>))}
    </FlexContainer>);
};
interface ExperimentContentProps {
    features: Features;
    status: DataStatus;
}
const ExperimentContent = ({ features, status }: ExperimentContentProps) => {
    return status === DataStatus.Success ? (<SearchResults features={features}/>) : status === DataStatus.Error ? (<ErrorStatus />) : (<LoadingStatus />);
};
export const ExperimentList = () => {
    const { features, isSearching, actions, searchValue } = useExperimentSearch();
    const experimentContent = useMemo(() => (<ExperimentContent features={features.filtered} status={features.status}/>), [features.status, features.filtered]);
    return (<FlexContainer flexDirection="column" fullWidth gap="8px" sx={{
            padding: '24px',
            borderRadius: '8px',
            border: '1px solid transparent',
            borderColor: 'ds.border.neutral.quiet.idle',
            backgroundColor: 'ds.container.agnostic.neutral.supershy',
        }}>
      <FlexChild as={GridContainer} gap="48px" alignItems="center" gridTemplateColumns="repeat(2, 1fr)" sx={{ marginBottom: '16px' }}>
        <Heading as="h2" textStyle="ds.title.section.medium" color="ds.text.neutral.catchy">
          <span role="img" aria-label="microscope emoji" sx={{ marginRight: '8px' }}>
            🔬
          </span>
          Experiments
        </Heading>
        <ExperimentSearch isSearching={isSearching} searchValue={searchValue} onSearch={actions.onSearch}/>
      </FlexChild>
      <FlexChild sx={{
            flex: '1 1 auto',
            height: '0px',
            overflow: 'auto',
        }}>
        {experimentContent}
      </FlexChild>
    </FlexContainer>);
};
