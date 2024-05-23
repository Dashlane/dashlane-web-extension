import ReactDOM from 'react-dom';
export const getDOMNode = (el: Element | null): Element | null => {
    const found = ReactDOM.findDOMNode(el);
    if (!(found instanceof Element || found === null)) {
        throw new Error(`invalid element: ${JSON.stringify(found)}`);
    }
    return found;
};
export const getParents = (limitElement: Element | null, target: Element | null, parents: (Element | null)[] = []): (Element | null)[] => {
    const parent = target?.parentElement;
    if (!parent || parent === limitElement) {
        return parents;
    }
    return getParents(limitElement, parent, parents.concat([parent]));
};
export const enumToClassName = (enumString: string): string => enumString.charAt(0).toLowerCase() + enumString.slice(1);
