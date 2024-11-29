import * as React from "react";
import classnames from "classnames";
import {
  FamilyRenewalInformation,
  JoinFamilyUserStatus,
} from "@dashlane/communication";
import { FEATURES_URL } from "../../app/routes/constants";
import PrimaryButton from "../../libs/dashlane-style/buttons/modern/primary";
import useTranslate from "../../libs/i18n/useTranslate";
import { redirectToUrl } from "../../libs/external-urls";
import { TranslatorInterface } from "../../libs/i18n/types";
import { JoinFamily } from "../join/join";
import { CancelRenewal } from "../cancel-renewal/cancel-renewal";
import sharedStyles from "../shared/styles.css";
import styles from "./styles.css";
import DownloadIcon from "../assets/download-outlined.svg?inline";
import whatIsDashlaneImage from "../assets/What-is-Dashlane.jpg";
import threeWaysImage from "../assets/3-ways-to-get-the-most.jpg";
import strongerPasswordImage from "../assets/How-do-I-make-my-PW-stronger.jpg";
export interface ConfirmProps {
  userStatus: JoinFamilyUserStatus;
  renewalInformation: FamilyRenewalInformation;
}
type Content = {
  description: string[];
  button: {
    title: string;
    href: string;
    icon?: JSX.Element;
  };
  link?: {
    title: string;
    href: string;
  };
  media: {
    title: string;
    href: string;
    imgsrc: string;
  };
};
type ContentByStatus = {
  [key in JoinFamilyUserStatus]: Content;
};
const contentByUserStatusCode = (
  translate: TranslatorInterface
): ContentByStatus => {
  return {
    NEW_USER: {
      description: [
        translate("family_invitee_page_confirm_description_new_user"),
        translate("family_invitee_page_confirm_description_perk_new_user"),
      ],
      button: {
        title: translate("family_invitee_page_confirm_button_title_new_user"),
        href: "__REDACTED__",
        icon: <DownloadIcon />,
      },
      link: {
        title: translate("family_invitee_page_learn_more_link_title"),
        href: FEATURES_URL,
      },
      media: {
        title: translate("family_invitee_page_confirm_media_title_new_user"),
        href: "__REDACTED__",
        imgsrc: whatIsDashlaneImage,
      },
    },
    EXISTING_FREE_USER: {
      description: [
        translate("family_invitee_page_confirm_description_existing_free_user"),
        translate(
          "family_invitee_page_confirm_description_perk_existing_free_user"
        ),
      ],
      button: {
        title: translate(
          "family_invitee_page_confirm_button_title_existing_free_user"
        ),
        href: "__REDACTED__",
      },
      media: {
        title: translate(
          "family_invitee_page_confirm_media_title_existing_free_user"
        ),
        href: "__REDACTED__",
        imgsrc: threeWaysImage,
      },
    },
    EXISTING_PREMIUM_USER: {
      description: [
        translate(
          "family_invitee_page_confirm_description_existing_premium_user"
        ),
        translate(
          "family_invitee_page_confirm_description_perk_existing_premium_user"
        ),
      ],
      button: {
        title: translate(
          "family_invitee_page_confirm_button_title_existing_premium_user"
        ),
        href: "__REDACTED__",
      },
      media: {
        title: translate(
          "family_invitee_page_confirm_media_title_existing_premium_user"
        ),
        href: "__REDACTED__",
        imgsrc: strongerPasswordImage,
      },
    },
  };
};
export const Confirm = ({ userStatus, renewalInformation }: ConfirmProps) => {
  const { translate } = useTranslate();
  if (!userStatus) {
    return null;
  }
  const { description, button, link, media } =
    contentByUserStatusCode(translate)[userStatus];
  const handleLink = (
    event: React.SyntheticEvent<HTMLElement>,
    href: string
  ): void => {
    event.preventDefault();
    redirectToUrl(href);
  };
  return (
    <JoinFamily>
      <div className={sharedStyles.joinFamilyRow}>
        <div className={sharedStyles.joinFamilyColumn}>
          <h1 className={sharedStyles.title}>
            {translate("family_invitee_page_confirm_heading")}
          </h1>

          {description.map((paragraph: string, idx: number) => (
            <p key={idx} className={sharedStyles.description}>
              {paragraph}
            </p>
          ))}

          <PrimaryButton
            size="medium"
            classNames={[styles.button]}
            label={button.title}
            icon={button.icon}
            onClick={(event) => handleLink(event, button.href)}
          />

          {link ? (
            <a
              href={link.href}
              className={sharedStyles.link}
              onClick={(event) => handleLink(event, link.href)}
            >
              {link.title}
            </a>
          ) : null}

          {renewalInformation.showRenewalMessage ? (
            <CancelRenewal platform={renewalInformation.platform} />
          ) : null}
        </div>
        <div
          className={classnames(
            styles.reverseColumnOnMobile,
            sharedStyles.joinFamilyColumn,
            sharedStyles.mediaContainer
          )}
        >
          <a
            href={media.href}
            onClick={(event) => handleLink(event, media.href)}
            title={media.title}
          >
            <img
              className={styles.mediaImage}
              src={media.imgsrc}
              alt={media.title}
            />
          </a>
          <h2 className={styles.mediaTitle}>{media.title}</h2>
        </div>
      </div>
    </JoinFamily>
  );
};
