import { PureComponent } from "react";
import classnames from "classnames";
import { Icon, Paragraph } from "@dashlane/design-system";
import { Space, UserSelectSpaceEvent } from "@dashlane/hermes";
import { Lee } from "../../../lee";
import { OutsideClickHandler } from "../../../libs/outside-click-handler/outside-click-handler";
import { userSwitchedSpace } from "../../../libs/webapp/reducer";
import { getCurrentSpace } from "../../../libs/carbon/spaces";
import { getCurrentSpaceId } from "../../../libs/webapp";
import { logEvent } from "../../../libs/logs/logEvent";
import {
  SpaceEntry,
  SpaceIcon,
} from "../../components/space-and-sharing-icons/space-icon";
import styles from "./styles.css";
type SpaceEntryKey = "allSpaces" | "personalSpace" | "teamSpace";
const hermesSpaceMap: Record<SpaceEntryKey, Space> = {
  allSpaces: Space.All,
  personalSpace: Space.Personal,
  teamSpace: Space.Professional,
};
export type SpaceEntries = {
  [key in SpaceEntryKey]: SpaceEntry;
};
interface Props {
  lee: Lee;
}
interface ComponentState {
  currentSpaceEntryKey: SpaceEntryKey;
  isOpen: boolean;
}
const I18N_KEYS = {
  ALL_SPACES: "webapp_spaces_switch_all_spaces",
  PERSONAL: "webapp_spaces_switch_personal",
};
const mapSpaceIdToSpaceEntryKey = (spaceId: string | null): SpaceEntryKey => {
  switch (spaceId) {
    case null:
      return "allSpaces";
    case "":
      return "personalSpace";
    default:
      return "teamSpace";
  }
};
export class SpacesSwitch extends PureComponent<Props, ComponentState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentSpaceEntryKey: this.getCurrentSpaceEntryKeyFromStore(),
      isOpen: false,
    };
  }
  private getCurrentSpaceEntryKeyFromStore(): SpaceEntryKey {
    const spaceId = getCurrentSpaceId(this.props.lee.globalState);
    return mapSpaceIdToSpaceEntryKey(spaceId);
  }
  private close = () => this.setState({ isOpen: false });
  private toggle = () => this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  private selectSpaceEntry(
    spaceEntryKey: SpaceEntryKey,
    spaceId: string | null
  ): void {
    this.setState({
      currentSpaceEntryKey: spaceEntryKey,
      isOpen: false,
    });
    logEvent(
      new UserSelectSpaceEvent({
        space: hermesSpaceMap[spaceEntryKey],
      })
    );
    this.props.lee.dispatchGlobal(userSwitchedSpace(spaceId));
  }
  private getSpaceEntries(): SpaceEntries {
    const { translate } = this.props.lee;
    const storeSpace = getCurrentSpace(this.props.lee.globalState);
    if (!storeSpace) {
      throw new Error("getSpaceEntries: storeSpace not found.");
    }
    const personalLabel = translate(I18N_KEYS.PERSONAL);
    return {
      allSpaces: {
        id: null,
        name: translate(I18N_KEYS.ALL_SPACES),
      },
      personalSpace: {
        id: "",
        name: personalLabel,
        letter: personalLabel[0],
      },
      teamSpace: {
        id: storeSpace.teamId,
        name: storeSpace.details.teamName,
        color: storeSpace.details.color,
        letter: storeSpace.details.letter,
      },
    };
  }
  private getSpaceItem(spaceEntryKey: SpaceEntryKey, spaceEntry: SpaceEntry) {
    const { isOpen } = this.state;
    const isDefaultSpace = spaceEntryKey === "allSpaces";
    const isCurrentSpace = spaceEntryKey === this.state.currentSpaceEntryKey;
    const onClick = () =>
      isCurrentSpace
        ? this.toggle()
        : this.selectSpaceEntry(spaceEntryKey, spaceEntry.id);
    return (
      <button
        className={classnames(styles.row, {
          [styles.rowActive]: isOpen && isCurrentSpace,
          [styles.rowDefault]: !isOpen && !isCurrentSpace,
        })}
        sx={{
          color: "ds.text.neutral.catchy",
        }}
        key={`space-${spaceEntry.name}`}
        onClick={onClick}
        type="button"
      >
        <div className={styles.rowLeft}>
          {spaceEntry.id === null ? (
            <Icon name="SpacesAllOutlined" color="ds.text.neutral.standard" />
          ) : (
            <SpaceIcon space={spaceEntry} />
          )}
          <Paragraph
            as="span"
            className={styles.name}
            textStyle="ds.title.block.medium"
          >
            {spaceEntry.name}
          </Paragraph>
        </div>
        {!isOpen ? (
          <Icon name="CaretDownOutlined" color="ds.text.neutral.standard" />
        ) : isDefaultSpace ? (
          <Icon name="CaretUpOutlined" color="ds.text.neutral.standard" />
        ) : null}
      </button>
    );
  }
  public render() {
    const { isOpen, currentSpaceEntryKey } = this.state;
    const spaceEntries = this.getSpaceEntries();
    const currentSpaceEntry = spaceEntries[currentSpaceEntryKey];
    return (
      <OutsideClickHandler onOutsideClick={this.close}>
        {isOpen ? (
          <div className={styles.container} onClick={this.close}>
            {Object.entries(spaceEntries).map(([key, spaceEntry]) =>
              this.getSpaceItem(key as SpaceEntryKey, spaceEntry)
            )}
          </div>
        ) : (
          this.getSpaceItem(currentSpaceEntryKey, currentSpaceEntry)
        )}
      </OutsideClickHandler>
    );
  }
}
