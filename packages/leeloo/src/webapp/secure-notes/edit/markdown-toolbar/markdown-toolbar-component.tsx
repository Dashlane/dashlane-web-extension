import { Fragment } from 'react';
import { Button, jsx } from '@dashlane/design-system';
import { FlexChild, FlexContainer } from '@dashlane/ui-components';
import { FormatterResult, MarkdownContentSelection, markdownTools, MarkdownToolType, } from './markdown-tools';
interface Props {
    fieldRef: React.RefObject<HTMLTextAreaElement>;
    content: string;
    setContent: (content: string) => void;
    isPreviewing: boolean;
    setIsPreviewing: (preview: boolean) => void;
}
export const MarkdownToolbar = ({ fieldRef, content, isPreviewing, setContent, setIsPreviewing, }: Props) => {
    const handleToolClick = (tool: MarkdownToolType) => () => {
        const formattingTool = markdownTools[tool].format as (text: string, selection: MarkdownContentSelection) => FormatterResult;
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
    return (<>
      <FlexContainer gap="6px">
        {Object.keys(markdownTools).map((tool) => {
            return (<Button key={tool} mood="neutral" intensity="supershy" layout="iconOnly" icon={markdownTools[tool].icon} onClick={handleToolClick(tool as MarkdownToolType)} disabled={isPreviewing} aria-label={markdownTools[tool].label} title={markdownTools[tool].label} name={markdownTools[tool].label}/>);
        })}
        {content ? (<FlexChild sx={{ marginLeft: 'auto' }}>
            <Button aria-label="Preview" onClick={() => setIsPreviewing(!isPreviewing)} layout="iconTrailing" intensity="quiet" mood="neutral" icon={isPreviewing ? 'ActionHideFilled' : 'ActionRevealFilled'}>
              Preview
            </Button>
          </FlexChild>) : null}
      </FlexContainer>
      <hr sx={{ width: '100%' }}/>
    </>);
};
