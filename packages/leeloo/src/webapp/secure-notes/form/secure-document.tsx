import { AttachmentIcon, colors, FlexChild, FlexContainer, jsx, Paragraph, ThemeUIStyleObject, } from '@dashlane/ui-components';
import { EmbeddedAttachment } from '@dashlane/communication';
import { fromUnixTime } from 'date-fns';
import useTranslate from 'libs/i18n/useTranslate';
import { useSecureFileDownloadAlerts } from 'webapp/secure-files/hooks/use-secure-file-download-alerts';
import { AttachmentActionsAndStatus } from 'webapp/attachments/attachment-action-and-status';
import { ItemType } from '@dashlane/hermes';
const bytes = require('bytes');
interface SecureDocumentProps {
    attachment: EmbeddedAttachment;
    disableActions: boolean;
    setDisableActions: (state: boolean) => void;
    handleFileInfoDetached?: (secureFileInfoId: string) => void;
    isAttachmentEnabled?: boolean;
    onModalDisplayStateChange?: (isModalOpen: boolean) => void;
    noteId?: string;
}
const rowSx: ThemeUIStyleObject = {
    color: `${colors.grey00}`,
    minHeight: '60px',
    borderBottom: `solid 1px ${colors.grey05}`,
    position: 'relative',
    '&:hover': {
        '& > *:last-child': {
            opacity: 1,
        },
    },
};
const attachmentIconSx: ThemeUIStyleObject = {
    width: 36,
    minWidth: 36,
    height: 36,
    borderRadius: '50%',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    background: colors.dashGreen06,
};
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
const AttachmentFileName = ({ attachment }: SecureDocumentProps) => {
    return (<FlexContainer alignItems="center" flexWrap="nowrap">
      <FlexContainer sx={attachmentIconSx} alignItems="center" justifyContent="center">
        <AttachmentIcon size={25} color={colors.midGreen00}/>
      </FlexContainer>
      <Paragraph sx={attachmentNameSx}>{attachment.filename}</Paragraph>
    </FlexContainer>);
};
export const SecureDocument = (props: SecureDocumentProps) => {
    const { attachment } = props;
    const { translate } = useTranslate();
    useSecureFileDownloadAlerts(attachment);
    return (<FlexContainer fullWidth={true} alignItems="center" sx={rowSx}>
      <FlexChild sx={{ width: '45%' }}>
        <AttachmentFileName {...props}/>
      </FlexChild>
      <FlexChild sx={{ width: '25%' }}>
        {translate.shortDate(fromUnixTime(attachment.creationDatetime))}
      </FlexChild>
      <FlexChild sx={{ width: '10%' }}>
        {toBytes(attachment.localSize)}
      </FlexChild>
      {props.isAttachmentEnabled ? (<AttachmentActionsAndStatus parentType={ItemType.SecureNote} parentId={props.noteId} {...props}/>) : null}
    </FlexContainer>);
};
