import React, { forwardRef } from 'react';
import { useSearchContext } from 'src/app/vault/search-field/search-context';
import { SpaceIndicator } from 'src/components/space-indicator/space-indicator';
import classnames from 'classnames';
import styles from './styles.css';
export interface ContentProps {
    onClick: () => void;
    subtitle: string;
    thumbnail: JSX.Element;
    title: string;
    itemSpaceId?: string;
}
export const Content = forwardRef<HTMLDivElement, ContentProps>((props: ContentProps, ref) => {
    const { searchValue } = useSearchContext();
    const { thumbnail, itemSpaceId, subtitle, title, onClick } = props;
    const highlightSearchValue = (text: string) => {
        if (!searchValue || !text) {
            return text;
        }
        const index = text.toLowerCase().indexOf(searchValue.toLowerCase());
        if (index < 0) {
            return text;
        }
        return (<>
          <span>{text.substring(0, index)}</span>
          <span className={styles.searchedValue}>
            {text.substring(index, index + searchValue.length)}
          </span>
          <span>{text.substring(index + searchValue.length)}</span>
        </>);
    };
    return (<div role="button" className={styles.content} onClick={onClick} tabIndex={0} ref={ref}>
        <div className={styles.thumbnailContainer}>{thumbnail}</div>
        <p className={styles.textColumn}>
          <span style={{ display: 'flex' }}>
            <span className={classnames(styles.text, styles.title)} title={title}>
              {highlightSearchValue(title)}
            </span>
            {itemSpaceId && (<SpaceIndicator className={styles.spaceIndicator} spaceId={itemSpaceId}/>)}
          </span>
          <span className={classnames(styles.text, styles.subtitle)} title={subtitle}>
            {highlightSearchValue(subtitle)}
          </span>
        </p>
      </div>);
});
Content.displayName = 'Content';
