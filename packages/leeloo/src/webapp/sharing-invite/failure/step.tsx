import { Fragment } from 'react';
import { DialogBody, DialogFooter, Heading, jsx, LoadingIcon, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { SHARING_INVITE_CONTENT_HEIGHT } from '../item';
import { DetailedError } from '../types';
import { NoteError } from './error-item';
import { CredentialErrorConnected } from './error-item-connected';
const I18N_KEYS = {
    CANCEL: 'webapp_sharing_invite_cancel',
    FAIL_DETAIL: 'webapp_sharing_invite_failure_detail_2',
    FAILURE: 'webapp_sharing_invite_failure_2',
    SHARE_AGAIN: 'webapp_sharing_invite_share_items_again',
};
export interface FailureStepProps {
    credentialErrors: DetailedError[];
    itemsCount: number;
    isLoading: boolean;
    noteErrors: DetailedError[];
    onDismiss: () => void;
    shareAllItems: () => void;
}
export const FailureStep = (props: FailureStepProps) => {
    const { credentialErrors, itemsCount, isLoading, noteErrors, onDismiss, shareAllItems, } = props;
    const { translate } = useTranslate();
    const errorsCount = credentialErrors.length + noteErrors.length;
    const subtitle = translate(I18N_KEYS.FAIL_DETAIL, {
        count: itemsCount,
        errorsCount,
    });
    return (<>
      <Heading as="h1" size="small" sx={{ mb: '16px' }}>
        {translate(I18N_KEYS.FAILURE, { count: itemsCount })}
      </Heading>
      <DialogBody>
        <Paragraph>{subtitle}</Paragraph>
        <ul sx={{
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'ds.border.neutral.quiet.idle',
            marginTop: '10px',
            maxHeight: SHARING_INVITE_CONTENT_HEIGHT,
            overflowY: 'scroll',
        }}>
          {credentialErrors.map((e) => (<CredentialErrorConnected translate={translate} detailedError={e} itemId={e.itemId} key={e.itemId}/>))}
          {noteErrors.map((e) => (<NoteError translate={translate} detailedError={e} itemId={e.itemId} key={e.itemId}/>))}
        </ul>
      </DialogBody>
      <DialogFooter secondaryButtonTitle={translate(I18N_KEYS.CANCEL)} secondaryButtonOnClick={onDismiss} secondaryButtonProps={{ disabled: isLoading, type: 'button' }} primaryButtonTitle={isLoading ? (<LoadingIcon size={24} color="ds.text.inverse.catchy"/>) : (translate(I18N_KEYS.SHARE_AGAIN))} primaryButtonOnClick={shareAllItems} primaryButtonProps={{
            disabled: isLoading,
            type: 'button',
        }}/>
    </>);
};
