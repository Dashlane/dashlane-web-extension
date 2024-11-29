import { Fragment, useState } from "react";
import {
  Flex,
  Heading,
  Paragraph,
  Toggle,
  useToast,
} from "@dashlane/design-system";
import { Lab } from "@dashlane/framework-contracts";
import { useLabs } from "../hooks/use-labs";
interface ExperimentProps {
  lab: Lab;
}
export const Experiment = ({ lab }: ExperimentProps) => {
  const [active, setActive] = useState<boolean>(lab.isActivated);
  const { toggleLab } = useLabs();
  const { showToast } = useToast();
  const description = lab.displayDescription.split("\n");
  const onClickHandler = () => {
    const previousState = active;
    const nextState = !active;
    setActive(nextState);
    void toggleLab({
      id: lab.featureName,
      isActivated: nextState,
    })
      .then(() => {
        showToast({
          mood: nextState ? "brand" : "danger",
          description: `"${lab.displayName}" has been turned ${
            nextState ? "ON" : "OFF"
          }`,
        });
      })
      .catch(() => {
        setActive(previousState);
        showToast({
          mood: "danger",
          description: `An error occurred while turning ${
            nextState ? "ON" : "OFF"
          } "${lab.displayName}"`,
        });
      });
  };
  return (
    <Flex
      sx={{
        padding: "8px 0",
      }}
    >
      <Toggle
        label={
          <Heading
            as="h3"
            textStyle="ds.title.block.medium"
            color="ds.text.neutral.catchy"
          >
            {lab.displayName}
          </Heading>
        }
        description={
          <Paragraph color="ds.text.neutral.standard">
            {description.map((line, index) => (
              <Fragment key={index}>
                {line}
                {index < description.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </Paragraph>
        }
        checked={active}
        onClick={onClickHandler}
        sx={{ width: "100%" }}
      />
      <div
        sx={{
          backgroundColor: "ds.border.neutral.quiet.idle",
          width: "100%",
          height: "1px",
          marginTop: "16px",
        }}
      />
    </Flex>
  );
};
