import { ChangeEvent } from 'react';
import { IndeterminateLoader, jsx, TextField } from '@dashlane/design-system';
interface ExperimentSearchProps {
    isSearching: boolean;
    searchValue: string;
    onSearch: (event: ChangeEvent<HTMLInputElement>) => void;
}
export const ExperimentSearch = ({ isSearching, searchValue, onSearch, }: ExperimentSearchProps) => {
    const placeholder = 'Search in experiments';
    return (<div sx={{ position: 'relative', width: '100%' }}>
      <TextField placeholder={placeholder} label={placeholder} value={searchValue} onChange={onSearch} autoFocus={true} labelPersists={false}/>
      {isSearching ? (<IndeterminateLoader color={'ds.text.brand.standard'} sx={{
                position: 'absolute',
                top: '14px',
                right: '11px',
                zIndex: '2',
            }}/>) : null}
    </div>);
};
