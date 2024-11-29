import { ChangeEvent, useMemo } from "react";
import {
  Card,
  DSStyleObject,
  mergeSx,
  Radio,
  RadioGroup,
} from "@dashlane/design-system";
const SX_STYLES: Record<string, Partial<DSStyleObject>> = {
  CARD: {
    position: "relative",
    padding: 0,
    gap: 0,
    minHeight: "182px",
    overflow: "hidden",
  },
  ILLUSTRATION: {
    width: "100%",
    height: "128px",
    backgroundSize: "cover",
    backgroundColor: "ds.container.agnostic.neutral.quiet",
  },
  RADIO: {
    padding: "16px 24px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "label > span": {
      overflow: "hidden",
    },
  },
};
interface OptionWithIllustrationProps {
  setOption: (value: any) => void;
  option: any;
  optionsList: Array<{
    label: string;
    description?: string;
    optionKey: string;
    illustrationSrc: string;
  }>;
  optionsPerRow?: "auto" | 1 | 2 | 3;
}
export const OptionWithIllustration = ({
  optionsPerRow = "auto",
  optionsList,
  option,
  setOption,
}: OptionWithIllustrationProps) => {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOption(e.target.value);
  };
  const config = useMemo(() => {
    const automaticLayout = optionsPerRow === "auto";
    const columns = automaticLayout
      ? optionsList.length % 3 === 0
        ? 3
        : 2
      : optionsPerRow;
    const gap = 8;
    const gapCorrection = gap - gap / columns;
    return { columns, gap, gapCorrection };
  }, [optionsList.length, optionsPerRow]);
  return (
    <div
      sx={{
        '> [role="radiogroup"]': {
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          gap: `${config.gap}px`,
        },
      }}
    >
      <RadioGroup
        groupName="AppearanceSettings"
        value={option}
        onChange={handleOnChange}
      >
        {optionsList.map(
          ({ label, description, optionKey, illustrationSrc }) => (
            <Card
              key={optionKey}
              sx={mergeSx([
                SX_STYLES.CARD,
                {
                  width: `calc(100% / ${config.columns} - ${config.gapCorrection}px)`,
                },
              ])}
            >
              <div
                role="img"
                aria-hidden={true}
                sx={mergeSx([
                  SX_STYLES.ILLUSTRATION,
                  {
                    backgroundImage: `url(${illustrationSrc})`,
                  },
                ])}
              />
              <div sx={SX_STYLES.RADIO}>
                <Radio
                  key={label}
                  label={label}
                  value={optionKey}
                  description={description}
                />
              </div>
            </Card>
          )
        )}
      </RadioGroup>
    </div>
  );
};
