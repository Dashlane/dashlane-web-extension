import React, { useEffect, useState } from 'react';
import { AttachmentIcon, colors, FlexChild, FlexContainer, Paragraph, ThemeUIStyleObject, } from '@dashlane/ui-components';
import { EmbeddedAttachment } from '@dashlane/communication';
import { fromUnixTime } from 'date-fns';
import useTranslate from 'libs/i18n/useTranslate';
import { AttachmentActionsAndStatus } from 'webapp/attachments/attachment-action-and-status';
import { Id } from 'webapp/ids/types';
import { idToItemType } from 'libs/logs/events/vault/select-item';
const bytes = require('bytes');
interface AttachmentDisplayProps {
    attachment: EmbeddedAttachment;
    isUploading: boolean;
    type: Id;
    handleFileInfoDetached: (secureFileInfoId: string) => void;
}
const attachmentNameSx: ThemeUIStyleObject = {
    padding: '0px 8px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontWeight: 'bold',
};
const toBytes = (size: number) => bytes(size, {
    decimalPlaces: 0,
    unitSeparator: ' ',
});
export const AttachmentDisplay = ({ attachment, isUploading, type, handleFileInfoDetached, }: AttachmentDisplayProps) => {
    const { translate } = useTranslate();
    const [disableActions, setDisableActions] = useState<boolean>(false);
    useEffect(() => {
        setDisableActions(isUploading);
    }, [isUploading]);
    return (<FlexContainer key={attachment.id} fullWidth={true} alignItems="center">
      <FlexChild sx={{ width: '45%' }}>
        <FlexContainer alignItems="center" flexWrap="nowrap">
          <FlexContainer alignItems="center" justifyContent="center">
            <AttachmentIcon size={25} color={colors.midGreen00}/>
          </FlexContainer>
          <Paragraph sx={attachmentNameSx}>{attachment.filename}</Paragraph>
        </FlexContainer>
      </FlexChild>
      <FlexChild sx={{ width: '25%' }}>
        {translate.shortDate(fromUnixTime(attachment.creationDatetime))}
      </FlexChild>
      <FlexChild sx={{ width: '10%' }}>
        {toBytes(attachment.localSize)}
      </FlexChild>
      <FlexChild>
        <AttachmentActionsAndStatus attachment={attachment} disableActions={disableActions} setDisableActions={setDisableActions} parentType={idToItemType[type]} parentId={attachment.id} handleFileInfoDetached={handleFileInfoDetached}/>
      </FlexChild>
    </FlexContainer>);
};
