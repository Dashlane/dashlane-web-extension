import { useEffect, useState } from 'react';
import { isEmpty } from 'ramda';
import { cookiesGetAll, cookiesRemove } from '@dashlane/webextensions-apis';
import { ImportSource } from '@dashlane/communication';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { useImportPreviewContext } from 'webapp/import-data/hooks/useImportPreviewContext';
import { useHistory, useRouterGlobalSettingsContext } from 'libs/router';
import { useSpaces } from 'libs/carbon/hooks/useSpaces';
import { useIsPersonalSpaceDisabled } from 'libs/hooks/use-is-personal-space-disabled';
import { ImportDataRoutes } from 'webapp/import-data/routes';
const lastPassDomain = 'lastpass.com';
const lastPassCookieName = 'PHPSESSID';
export interface UseLastPassEffects {
    listenForLastPassCookie: () => void;
    cookieData: string;
}
export const useLastPassEffects = (): UseLastPassEffects => {
    const [cookieData, setCookieData] = useState('');
    const [intervalId, setIntervalId] = useState<number | undefined>(undefined);
    const { preview: { previewFile, state: previewState }, setPreviewDataItems, setPreviewDataHeaders, previewDataHeaders, previewDataItems, } = useImportPreviewContext();
    const { routes } = useRouterGlobalSettingsContext();
    const isPersonalSpaceDisabled = useIsPersonalSpaceDisabled();
    const history = useHistory();
    const spaces = useSpaces();
    const hasMultipleSpaces = spaces.status === DataStatus.Success &&
        spaces.data.length > 0 &&
        isPersonalSpaceDisabled.status === DataStatus.Success &&
        !isPersonalSpaceDisabled.isDisabled;
    useEffect(() => {
        cookiesRemove({
            url: `*****${lastPassDomain}`,
            name: lastPassCookieName,
        });
    }, []);
    useEffect(() => {
        return () => {
            clearInterval(intervalId);
        };
    }, [intervalId]);
    const listenForLastPassCookie = () => {
        if (intervalId) {
            window.clearInterval(intervalId);
        }
        const id = window.setInterval(async () => {
            const cookies = await cookiesGetAll({
                domain: lastPassDomain,
                name: lastPassCookieName,
            });
            const cookie = cookies.find((c) => c.domain === 'lastpass.com');
            if (cookie) {
                setCookieData(cookie.value);
            }
        }, 5000);
        setIntervalId(id);
    };
    useEffect(() => {
        if (previewDataHeaders.length && !isEmpty(previewDataItems)) {
            const nextStepRoute = hasMultipleSpaces
                ? ImportDataRoutes.ImportSpaceSelect
                : ImportDataRoutes.ImportPreview;
            history.push(`/${ImportDataRoutes.ImportRoot}/${nextStepRoute}`);
        }
    }, [
        hasMultipleSpaces,
        history,
        previewDataHeaders.length,
        previewDataItems,
        routes.importData,
    ]);
    useEffect(() => {
        if (previewState.file && previewState.fileName && previewState.format) {
            previewFile(ImportSource.Lastpass).then((previewData) => {
                if (previewData.success && previewData.data.items.length) {
                    const previewDataMap = {};
                    previewData.data.items.forEach((item) => {
                        previewDataMap[item.baseDataModel.Id] = item;
                    });
                    setPreviewDataItems(previewDataMap);
                    setPreviewDataHeaders(previewData.data.headers);
                }
            });
        }
    }, [
        previewState.file,
        previewFile,
        setPreviewDataItems,
        setPreviewDataHeaders,
        hasMultipleSpaces,
        history,
        routes.importData,
        previewState.fileName,
        previewState.format,
    ]);
    return {
        listenForLastPassCookie,
        cookieData,
    };
};
