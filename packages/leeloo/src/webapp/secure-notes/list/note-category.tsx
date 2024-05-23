import { jsx } from '@dashlane/design-system';
import { useModuleQuery } from '@dashlane/framework-react';
import { vaultItemsCrudApi } from '@dashlane/vault-contracts';
import IntelligentTooltipOnOverflow from 'libs/dashlane-style/intelligent-tooltip-on-overflow';
interface NoteCategoryProps {
    categoryId: string;
}
export const NoteCategory = ({ categoryId }: NoteCategoryProps) => {
    const { data: category } = useModuleQuery(vaultItemsCrudApi, 'secureNoteCategory', {
        id: categoryId,
    });
    return (<IntelligentTooltipOnOverflow>
      {category ?? ''}
    </IntelligentTooltipOnOverflow>);
};
