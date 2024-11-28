import * as React from "react";
import { CSSTransition } from "react-transition-group";
import { GeneratedPasswordItemView } from "@dashlane/communication";
import { PageView } from "@dashlane/hermes";
import { FocusOn } from "react-focus-on";
import { logPageView } from "../../../../libs/logs/logEvent";
import Modal from "../../../../components/modal";
import { PasswordGeneratedHistoryHeader } from "./Header/Header";
import { PasswordGeneratedHistoryList } from "./List/List";
import headerTransition from "./headerTransition.css";
import listTransition from "./listTransition.css";
import styles from "./styles.css";
const TRANSITION_TIME = 250;
export interface PasswordGeneratedHistoryProps {
  isVisible: boolean;
  onClose: () => void;
  onCopy: (password: string, id: string, domain?: string) => void;
  generatedPasswords: GeneratedPasswordItemView[];
}
export const PasswordGeneratedHistoryModal: React.FC<
  PasswordGeneratedHistoryProps
> = ({ isVisible, generatedPasswords, onClose, onCopy }) => {
  const [isModalVisible, setModalVisible] = React.useState(false);
  const removeModal = React.useCallback(() => {
    setModalVisible(false);
  }, []);
  React.useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      logPageView(PageView.ToolsPasswordGeneratorHistory);
    }
  }, [isVisible]);
  return (
    <Modal visible={isModalVisible} onClose={onClose}>
      <FocusOn>
        <div className={styles.modal}>
          <CSSTransition
            in={isVisible}
            timeout={TRANSITION_TIME}
            classNames={{ ...headerTransition }}
            onExited={removeModal}
            appear
          >
            <PasswordGeneratedHistoryHeader onClose={onClose} />
          </CSSTransition>
          <CSSTransition
            in={isVisible}
            timeout={TRANSITION_TIME}
            classNames={{ ...listTransition }}
            onExited={removeModal}
            appear
          >
            <PasswordGeneratedHistoryList
              onCopy={onCopy}
              generatedPasswords={generatedPasswords}
            />
          </CSSTransition>
        </div>
      </FocusOn>
    </Modal>
  );
};
