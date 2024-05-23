import { FlexContainer, FolderIcon, jsx } from '@dashlane/ui-components';
interface CollectionLogoProps {
    disabled?: boolean;
}
export const CollectionLogo = ({ disabled = false }: CollectionLogoProps) => (<FlexContainer justifyContent="space-around" alignItems="center" sx={{
        minWidth: '48px',
        width: '48px',
        height: '32px',
        borderRadius: 2,
        backgroundColor: 'ds.container.agnostic.neutral.standard',
        flexShrink: 0,
        borderColor: 'ds.border.neutral.quiet.idle',
        borderStyle: 'solid',
        borderWidth: '1px',
    }}>
    <FolderIcon disabled={disabled} color={'ds.oddity.focus'}/>
  </FlexContainer>);
