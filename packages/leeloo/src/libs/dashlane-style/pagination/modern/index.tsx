import { ReactNodeArray } from 'react';
import { Button, jsx } from '@dashlane/design-system';
import styles from './styles.css';
const BUTTON_SIZE = { minWidth: '12px', height: '20px' };
interface Props {
    currentPageIndex: number;
    isShort?: boolean;
    itemsLength: number;
    itemsPerPage: number;
    onChange: (page: number) => void;
}
const Pagination = ({ currentPageIndex, isShort, itemsLength, itemsPerPage, onChange, }: Props) => {
    const key = () => String(Math.random() * 0xffff).replace(/\./, '');
    function generate(indexFrom: number, indexTo?: number) {
        return [...Array((indexTo ? indexTo : indexFrom) + 1).keys()]
            .slice(indexFrom)
            .map((index) => index === currentPageIndex ? (<li key={key()}>
            <Button mood="neutral" intensity="quiet" onClick={() => onChange(index)}>
              <span sx={BUTTON_SIZE}>{index + 1}</span>
            </Button>
          </li>) : (<li key={key()}>
            <Button mood="neutral" intensity="supershy" onClick={() => onChange(index)}>
              <span sx={BUTTON_SIZE}>{index + 1}</span>
            </Button>
          </li>));
    }
    const indexMax = itemsLength ? Math.ceil(itemsLength / itemsPerPage) - 1 : 0;
    function getBoxes() {
        if (indexMax < 7) {
            return generate(0, indexMax);
        }
        const refIndex = currentPageIndex === 0
            ? currentPageIndex + 1
            : currentPageIndex === indexMax
                ? currentPageIndex - 1
                : currentPageIndex;
        const arr: ReactNodeArray = [];
        return arr
            .concat(refIndex > 2 ? generate(0) : generate(0, refIndex + 1))
            .concat([
            <li key={key()}>
          <Button disabled mood="neutral" intensity="supershy">
            <span sx={BUTTON_SIZE}>...</span>
          </Button>
        </li>,
        ])
            .concat(refIndex > 2 && refIndex < indexMax - 2
            ? generate(refIndex - 1, refIndex + 1)
            : [])
            .concat(refIndex > 2 && refIndex < indexMax - 2
            ? [
                <li key={key()}>
                <Button disabled mood="neutral" intensity="supershy">
                  <span sx={BUTTON_SIZE}>...</span>
                </Button>
              </li>,
            ]
            : [])
            .concat(refIndex < indexMax - 2
            ? generate(indexMax)
            : generate(refIndex - 1, indexMax));
    }
    return (<ul className={styles.container}>
      {currentPageIndex === 0 ? (<li key={key()}>
          <Button disabled layout="iconOnly" icon="CaretLeftOutlined" mood="neutral" intensity="supershy"/>
        </li>) : (<li key={key()}>
          <Button layout="iconOnly" icon="CaretLeftOutlined" mood="neutral" intensity="supershy" onClick={() => onChange(currentPageIndex - 1)}/>
        </li>)}
      {!isShort && getBoxes()}
      {currentPageIndex === indexMax ? (<li key={key()}>
          <Button disabled layout="iconOnly" icon="CaretRightOutlined" mood="neutral" intensity="supershy"/>
        </li>) : (<li key={key()}>
          <Button layout="iconOnly" icon="CaretLeftOutlined" mood="neutral" intensity="supershy" onClick={() => onChange(currentPageIndex + 1)}/>
        </li>)}
    </ul>);
};
export default Pagination;
