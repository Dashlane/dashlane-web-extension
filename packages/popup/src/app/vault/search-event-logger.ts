import { debounce } from 'lodash';
import { UserSearchVaultItemEvent } from '@dashlane/hermes';
import { logEvent } from 'src/libs/logs/logEvent';
const SearchEventLogger = {
    charactersTypedCount: 0,
    totalCount: 0,
    logSearchEvent: debounce(function (this: {
        charactersTypedCount: number;
        totalCount: number;
    }, hasInteracted = true) {
        logEvent(new UserSearchVaultItemEvent({
            charactersTypedCount: this.charactersTypedCount,
            hasInteracted: hasInteracted,
            totalCount: this.totalCount,
        }));
    }, 300),
};
export default SearchEventLogger;
