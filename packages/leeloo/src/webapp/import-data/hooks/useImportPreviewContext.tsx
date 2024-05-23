import React, { useState } from 'react';
import { ImportSource, ParsedCSVData } from '@dashlane/communication';
import { usePreviewData } from './use-preview-data';
import { useImportData } from './use-import-data';
import { ImportDataStep } from './types';
import { ImportMethod } from '../types';
export type PreviewDataItems = {
    [itemId: string]: ParsedCSVData['items'][number];
};
export type PreviewDataHeaders = ParsedCSVData['headers'];
interface ImportPreviewContextValue {
    preview: ReturnType<typeof usePreviewData>;
    import: ReturnType<typeof useImportData>;
    importSource: ImportSource;
    setImportSource: (source: ImportSource) => void;
    previewDataItems: PreviewDataItems;
    setPreviewDataItems: (dataItem: PreviewDataItems) => void;
    previewDataHeaders: PreviewDataHeaders;
    setPreviewDataHeaders: (dataHeader: PreviewDataHeaders) => void;
    defaultSpace: string | null;
    setDefaultSpace: (space: string) => void;
    resetContext: () => void;
    importMethod: ImportMethod;
    setImportMethod: (importMethod: ImportMethod) => void;
}
const notInitializedFn = () => {
    throw new Error('method called before initialization');
};
export const ImportPreviewContext = React.createContext<ImportPreviewContextValue>({
    preview: {
        previewFile: notInitializedFn,
        processFile: notInitializedFn,
        resetState: notInitializedFn,
        setAttemptedCount: notInitializedFn,
        state: {
            format: null,
            fileName: '',
            file: null,
            requiresPassword: false,
            attemptedItemCount: 0,
        },
    },
    import: {
        startImport: notInitializedFn,
        dismiss: notInitializedFn,
        state: {
            status: ImportDataStep.IDLE,
        },
    },
    importSource: ImportSource.Other,
    setImportSource: notInitializedFn,
    previewDataItems: {},
    setPreviewDataItems: notInitializedFn,
    previewDataHeaders: [],
    setPreviewDataHeaders: notInitializedFn,
    resetContext: notInitializedFn,
    defaultSpace: null,
    setDefaultSpace: notInitializedFn,
    importMethod: ImportMethod.FILE,
    setImportMethod: notInitializedFn,
});
export const ImportPreviewContextProvider = ({ children, }: React.PropsWithChildren<Record<never, never>>) => {
    const previewHook = usePreviewData();
    const importHook = useImportData();
    const [importMethod, setImportMethod] = useState<ImportMethod>(ImportMethod.FILE);
    const [importSource, setImportSource] = useState<ImportSource>(ImportSource.Other);
    const [previewDataItems, setPreviewDataItems] = useState<PreviewDataItems>({});
    const [previewDataHeaders, setPreviewDataHeaders] = useState<PreviewDataHeaders>([]);
    const [defaultSpace, setDefaultSpace] = useState<string | null>(null);
    const resetContext = () => {
        previewHook.resetState();
        importHook.dismiss();
        setImportSource(ImportSource.Other);
        setDefaultSpace(null);
        setPreviewDataItems({});
        setPreviewDataHeaders([]);
    };
    return (<ImportPreviewContext.Provider value={{
            preview: previewHook,
            import: importHook,
            importSource,
            setImportSource,
            previewDataItems,
            setPreviewDataItems,
            previewDataHeaders,
            setPreviewDataHeaders,
            resetContext,
            defaultSpace,
            setDefaultSpace,
            importMethod,
            setImportMethod,
        }}>
      {children}
    </ImportPreviewContext.Provider>);
};
export const useImportPreviewContext = () => React.useContext(ImportPreviewContext);
