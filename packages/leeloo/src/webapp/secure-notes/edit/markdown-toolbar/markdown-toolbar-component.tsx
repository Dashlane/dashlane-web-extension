import { Button } from "@dashlane/design-system";
import {
  FormatterResult,
  MarkdownContentSelection,
  markdownTools,
  MarkdownToolType,
} from "./markdown-tools";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  PREVIEW_MARKDOWN: "webapp_secure_notes_content_markdown_preview",
};
interface Props {
  fieldRef: React.RefObject<HTMLTextAreaElement>;
  content: string;
  setContent: (content: string) => void;
  isPreviewing: boolean;
  setIsPreviewing: (preview: boolean) => void;
}
export const MarkdownToolbar = ({
  fieldRef,
  content,
  isPreviewing,
  setContent,
  setIsPreviewing,
}: Props) => {
  const { translate } = useTranslate();
  const handleToolClick = (tool: MarkdownToolType) => () => {
    const formattingTool = markdownTools[tool].format as (
      text: string,
      selection: MarkdownContentSelection
    ) => FormatterResult;
    const { updatedContent, updatedSelectionRange } = formattingTool(content, {
      start: fieldRef.current?.selectionStart ?? 0,
      end: fieldRef.current?.selectionEnd ?? 0,
    });
    setContent(updatedContent);
    setTimeout(() => {
      if (fieldRef.current) {
        fieldRef.current.focus();
        fieldRef.current.selectionStart = updatedSelectionRange.start;
        fieldRef.current.selectionEnd = updatedSelectionRange.end;
      }
    }, 200);
  };
  return (
    <div
      sx={{
        display: "flex",
        height: "50px",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
        marginTop: "16px",
        backgroundColor: "ds.background.alternate",
        borderRadius: "8px",
      }}
    >
      <div sx={{ gap: "4px" }}>
        {Object.keys(markdownTools).map((tool) => {
          return (
            <Button
              key={tool}
              mood="neutral"
              intensity="supershy"
              layout="iconOnly"
              icon={markdownTools[tool].icon}
              onClick={handleToolClick(tool as MarkdownToolType)}
              disabled={isPreviewing}
              aria-label={markdownTools[tool].label}
              title={markdownTools[tool].label}
              name={markdownTools[tool].label}
            />
          );
        })}
      </div>

      {content ? (
        <div sx={{ padding: "8px 10px" }}>
          <Button
            aria-label={translate(I18N_KEYS.PREVIEW_MARKDOWN)}
            onClick={() => setIsPreviewing(!isPreviewing)}
            layout="iconTrailing"
            intensity="quiet"
            size="small"
            mood="neutral"
            icon={isPreviewing ? "ActionHideFilled" : "ActionRevealFilled"}
          >
            {translate(I18N_KEYS.PREVIEW_MARKDOWN)}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
