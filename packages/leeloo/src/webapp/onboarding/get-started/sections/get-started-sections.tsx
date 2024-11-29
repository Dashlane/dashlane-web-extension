import { Heading } from "@dashlane/design-system";
import { DataStatus, useFeatureFlips } from "@dashlane/framework-react";
import { GetStartedSection } from "./get-started-section";
import { useGetStartedTaskCompletion } from "../hooks/use-get-started-task-completion";
import { useGuideSectionsDefinition } from "../hooks/use-guide-sections-definition";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { GuideSectionItems, GuideSections } from "../types/section.types";
import { GuideUserType } from "../types/user.types";
interface GetStartedSectionsProps {
  userType: GuideUserType;
}
export const GetStartedSections = ({ userType }: GetStartedSectionsProps) => {
  const featureFlipsResponse = useFeatureFlips();
  const { translate } = useTranslate();
  const guideSections = useGuideSectionsDefinition(userType);
  const tasksCompletion = useGetStartedTaskCompletion();
  const enabledTasks = (taskMap: GuideSectionItems) => {
    return Object.entries(taskMap).filter(
      ([, { featureFlip, hidden }]) =>
        !hidden &&
        (featureFlip === undefined ||
          (!!featureFlip &&
            featureFlipsResponse.status === DataStatus.Success &&
            featureFlipsResponse.data[featureFlip]))
    );
  };
  const enabledSections = (sections: GuideSections) => {
    if (featureFlipsResponse.status !== DataStatus.Success) {
      return [];
    }
    return Object.entries(sections).filter(
      ([, { featureFlips }]) =>
        featureFlips === undefined ||
        (Array.isArray(featureFlips) &&
          featureFlipsResponse.status === DataStatus.Success &&
          featureFlips.every((ff) => !!featureFlipsResponse.data[ff]))
    );
  };
  if (tasksCompletion.status !== DataStatus.Success) {
    return null;
  }
  return (
    <ul
      sx={{
        display: "flex",
        gap: "32px",
        flexDirection: "column",
      }}
    >
      {enabledSections(guideSections).map(([sectionName, { name, items }]) => (
        <li key={`section-${sectionName}`}>
          {userType === GuideUserType.TEAM_CREATOR ? (
            <Heading
              textStyle="ds.title.section.medium"
              color="ds.text.neutral.catchy"
              as="h2"
              sx={{ marginBottom: "16px" }}
            >
              {translate(name)}
            </Heading>
          ) : null}

          <GetStartedSection
            completionStatus={tasksCompletion.tasks}
            tasks={enabledTasks(items)}
          />
        </li>
      ))}
    </ul>
  );
};
