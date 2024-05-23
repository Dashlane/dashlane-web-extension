import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import LinkComponent from 'libs/dashlane-style/link';
export interface MarkupLinkParams {
    linkTarget?: '_blank' | '_top';
    onLinkClicked?: (link: string) => void;
}
export interface CreateMarkupParams {
    markdownValue: string;
    linkParams?: MarkupLinkParams;
    linkProps?: Record<string, unknown>;
}
export const CreateMarkup = (params: CreateMarkupParams) => {
    const { markdownValue = '', linkParams = {}, linkProps } = params;
    const { linkTarget, onLinkClicked = () => { } } = linkParams;
    const translationContainsLineBreaks = markdownValue.includes('\n');
    return (<ReactMarkdown source={markdownValue} allowedTypes={[
            'Text',
            'Link',
            'Emph',
            'Strong',
            'Paragraph',
            'Softbreak',
            'List',
            'Item',
            'Code',
        ]} containerTagName="span" softBreak="br" renderers={{
            Paragraph: translationContainsLineBreaks ? 'p' : 'span',
            Link: function Link(props: {
                href: string;
                children: string;
            }) {
                return (<LinkComponent {...linkProps} aria-label={markdownValue} href={props.href} target={linkTarget} onClick={() => {
                        onLinkClicked(props.href);
                    }}>
              {props.children}
            </LinkComponent>);
            },
        }}/>);
};
