import { ReactNode, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { jsx, ThemeUIStyleObject } from '@dashlane/design-system';
import { OverflowButton } from './overflow-button';
import { UlRow, UlRowRef } from './ul-row';
interface Props {
    collectionListItems: ReactNode[];
    sx?: ThemeUIStyleObject;
}
export const CollectionsList = ({ collectionListItems, sx, ...rest }: Props) => {
    const [isOverflowButtonOpen, setIsOverflowButtonOpen] = useState(false);
    const [amountToDisplay, setAmountToDisplay] = useState(0);
    const [widths, setWidths] = useState({
        ulRowWidth: 0,
        totalCollectionItemsWidth: 0,
    });
    const ulRowRef = useRef<UlRowRef>(null);
    const collectionItemsWidthsRef = useRef<number[]>([]);
    const overflowButtonWidthRef = useRef(0);
    const amountThatFitInListRef = useRef(0);
    const listItemsLength = collectionListItems.length;
    useEffect(() => {
        if (!ulRowRef.current?.ulElement) {
            return;
        }
        const updateUlRowWidth = debounce(() => {
            if (!ulRowRef.current) {
                return;
            }
            const ulRowWidth = ulRowRef.current.getWidth();
            if (ulRowWidth === widths.ulRowWidth) {
                return;
            }
            setWidths((prevState) => ({
                ...prevState,
                ulRowWidth,
            }));
        }, 100);
        const resizeObserver = new ResizeObserver(() => {
            updateUlRowWidth();
        });
        resizeObserver.observe(ulRowRef.current.ulElement);
        return () => resizeObserver.disconnect();
    }, [ulRowRef.current]);
    useEffect(() => {
        if (!ulRowRef.current) {
            return;
        }
        collectionItemsWidthsRef.current = ulRowRef.current.getListItemsWidths();
        overflowButtonWidthRef.current =
            collectionItemsWidthsRef.current.pop() ?? 0;
        setWidths({
            ulRowWidth: ulRowRef.current.getWidth(),
            totalCollectionItemsWidth: collectionItemsWidthsRef.current.reduce((accumulator, currentValue) => accumulator + currentValue, 0),
        });
    }, [listItemsLength]);
    useEffect(() => {
        if (!ulRowRef.current) {
            return;
        }
        if (widths.ulRowWidth >= widths.totalCollectionItemsWidth) {
            amountThatFitInListRef.current = listItemsLength;
        }
        else {
            const maxWidth = widths.ulRowWidth - overflowButtonWidthRef.current;
            let widthSum = 0;
            for (let index = 0; index < collectionItemsWidthsRef.current.length; index++) {
                widthSum += collectionItemsWidthsRef.current[index];
                if (widthSum >= maxWidth) {
                    amountThatFitInListRef.current = index;
                    break;
                }
            }
        }
        if (isOverflowButtonOpen) {
            setAmountToDisplay(listItemsLength);
        }
        else {
            setAmountToDisplay(amountThatFitInListRef.current);
        }
        if (amountThatFitInListRef.current >= listItemsLength &&
            isOverflowButtonOpen) {
            setIsOverflowButtonOpen(false);
        }
    }, [widths]);
    if (listItemsLength === 0) {
        return null;
    }
    const onOverflowButtonClick = () => {
        setAmountToDisplay(isOverflowButtonOpen ? amountThatFitInListRef.current : listItemsLength);
        setIsOverflowButtonOpen((prevState) => !prevState);
    };
    const amountLeft = listItemsLength - amountToDisplay;
    const isOverflowButtonVisible = isOverflowButtonOpen || amountLeft > 0;
    return (<UlRow data-testid="collectionsList" ref={ulRowRef} {...rest} sx={{
            [`li:nth-of-type(n+${amountToDisplay + 1})`]: {
                transition: 'none',
                visibility: 'hidden',
                position: 'absolute',
                width: 'fit-content',
            },
            ...(isOverflowButtonVisible && {
                'li:last-child': {
                    visibility: 'visible',
                    position: 'unset',
                },
            }),
            flexWrap: isOverflowButtonOpen ? 'wrap' : 'nowrap',
            lineHeight: '19px',
            ...sx,
        }}>
      {collectionListItems}
      <li>
        <OverflowButton amountLeft={amountLeft} isOpen={isOverflowButtonOpen} onClick={onOverflowButtonClick}/>
      </li>
    </UlRow>);
};
