import { useEffect, useState } from 'react';
import { GeographicStateLevel, QueryStaticDataCollectionsRequest, StaticDataQueryType, } from '@dashlane/communication';
import { jsx } from '@dashlane/design-system';
import { PageView } from '@dashlane/hermes';
import { Lee } from 'lee';
import { queryStaticDataCollections } from 'libs/carbon/triggers';
import errorAction from 'libs/logs/errorActions';
import { logPageView } from 'libs/logs/logEvent';
import { getCurrentSpaceId } from 'libs/webapp';
import { staticDataRetrieved } from 'libs/webapp/reducer';
import { PersonalDataSectionView } from 'webapp/personal-data-section-view/personal-data-section-view';
import { CategoryKey, CategoryStates } from 'webapp/personal-info/types';
import { PersonalInfoHeader } from 'webapp/personal-info/personal-info-header';
import { Content } from './content';
interface Props {
    lee: Lee;
}
export const PersonalInfo = ({ lee }: Props) => {
    const [categories, setCategories] = useState<CategoryStates>({
        addresses: { open: true },
        companies: { open: true },
        emails: { open: true },
        identities: { open: true },
        personalWebsites: { open: true },
        phones: { open: true },
    });
    const toggleCategory = (category: CategoryKey): void => {
        setCategories({
            ...categories,
            [category]: {
                open: !categories[category].open,
            },
        });
    };
    useEffect(() => {
        const request: QueryStaticDataCollectionsRequest = { queries: [] };
        if (!lee.globalState.webapp.callingCodes) {
            request.queries.push({ type: StaticDataQueryType.CALLING_CODES });
        }
        if (!lee.globalState.webapp.geographicStates) {
            request.queries.push({
                type: StaticDataQueryType.GEOGRAPHIC_STATES,
                level: GeographicStateLevel.LEVEL_0,
            }, {
                type: StaticDataQueryType.GEOGRAPHIC_STATES,
                level: GeographicStateLevel.LEVEL_1,
            });
        }
        if (request.queries.length) {
            queryStaticDataCollections(request)
                .then((results) => {
                const dispatchParams = results.reduce((acc, result) => {
                    if (result.type === StaticDataQueryType.CALLING_CODES) {
                        return { ...acc, callingCodes: result.collection };
                    }
                    else if (result.type === StaticDataQueryType.GEOGRAPHIC_STATES) {
                        const mergedGeographicStates = { ...acc['geographicStates'] };
                        Object.keys(result.collection).forEach((country) => {
                            mergedGeographicStates[country] = {
                                ...mergedGeographicStates[country],
                                ...result.collection[country],
                            };
                        });
                        return {
                            ...acc,
                            geographicStates: mergedGeographicStates,
                        };
                    }
                    errorAction(new Error(`queryStaticDataCollections: Unexpected result type (${result})`));
                    return acc;
                }, {});
                lee.dispatchGlobal(staticDataRetrieved(dispatchParams));
            })
                .catch((error) => errorAction(error));
        }
        logPageView(PageView.ItemPersonalInfoList);
    }, []);
    const currentSpaceId = getCurrentSpaceId(lee.globalState);
    return (<PersonalDataSectionView>
      <PersonalInfoHeader />
      <Content categoryStates={categories} currentSpaceId={currentSpaceId} onToggleGrid={toggleCategory}/>
    </PersonalDataSectionView>);
};
