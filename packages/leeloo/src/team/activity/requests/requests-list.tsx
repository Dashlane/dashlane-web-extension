import { memo } from "react";
import { uniqueId } from "lodash";
import { fromUnixTime } from "date-fns";
import { MasterPasswordResetDemand } from "@dashlane/communication";
import {
  Button,
  Icon,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { Avatar } from "../../../libs/dashlane-style/avatar/avatar";
import useTranslate from "../../../libs/i18n/useTranslate";
import { TableHeader } from "../../page/table-header";
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  TABLE: {
    width: "100%",
    lineHeight: "1.5",
    textAlign: "left",
  },
  TABLE_BODY: {
    tr: {
      boxShadow: "inset 0 -1px 0 0 ds.border.neutral.quiet.idle",
      height: "60px",
      td: {
        padding: "16px",
        verticalAlign: "middle",
        variant: "text.ds.body.reduced.regular",
        color: "ds.text.neutral.standard",
      },
    },
  },
  LOGIN_CELL: {
    display: "flex",
    padding: "15px 16px 14px",
  },
  LOGIN_TEXT: {
    height: "31px",
    marginLeft: "16px",
    maxWidth: "300px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  ACTION_CELL: {
    display: "flex",
    gap: "36px",
    justifyContent: "flex-end",
  },
};
const I18N_KEYS = {
  TABLE_HEAD_MEMBER: "team_master_password_reset_table_head_member",
  TABLE_HEAD_TIME: "team_master_password_reset_table_head_time",
  BUTTON_ACCEPT: "team_master_password_reset_dialog_accept_button_ok",
  BUTTON_DECLINE: "team_master_password_reset_dialog_decline_button_ok",
};
interface Props {
  onAccept: (request: MasterPasswordResetDemand) => void;
  onDecline: (request: MasterPasswordResetDemand) => void;
  dateFormatter: (date: Date) => string;
  requests: MasterPasswordResetDemand[];
}
const ListComponent = ({
  onAccept,
  onDecline,
  dateFormatter,
  requests,
}: Props) => {
  const { translate } = useTranslate();
  const columns = [
    {
      headerLabel: translate(I18N_KEYS.TABLE_HEAD_MEMBER),
      headerKey: "member",
    },
    { headerLabel: translate(I18N_KEYS.TABLE_HEAD_TIME), headerKey: "time" },
    { headerLabel: "", headerKey: "actions" },
  ];
  return (
    <table sx={SX_STYLES.TABLE}>
      <TableHeader columns={columns} />
      <tbody key="table-body" sx={SX_STYLES.TABLE_BODY}>
        {requests.map((request: MasterPasswordResetDemand) => {
          const creationDate = fromUnixTime(request.creationDateUnix);
          const formattedDate = dateFormatter(creationDate);
          return (
            <tr key={uniqueId()}>
              <td sx={SX_STYLES.LOGIN_CELL}>
                <Avatar email={request.login} size={30} />
                <div id="user-email" sx={SX_STYLES.LOGIN_TEXT}>
                  <Paragraph
                    color="ds.text.neutral.catchy"
                    textStyle="ds.body.standard.regular"
                  >
                    {request.login}
                  </Paragraph>
                </div>
              </td>
              <td>{formattedDate}</td>
              <td sx={SX_STYLES.ACTION_CELL}>
                <Button
                  mood="danger"
                  intensity="supershy"
                  layout="iconOnly"
                  size="medium"
                  icon={<Icon name="FeedbackFailFilled" />}
                  onClick={() => onDecline(request)}
                  aria-label={translate(I18N_KEYS.BUTTON_DECLINE)}
                />
                <Button
                  mood="positive"
                  intensity="supershy"
                  layout="iconOnly"
                  size="medium"
                  icon={<Icon name="FeedbackSuccessFilled" />}
                  onClick={() => onAccept(request)}
                  aria-label={translate(I18N_KEYS.BUTTON_ACCEPT)}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export const List = memo(ListComponent);
