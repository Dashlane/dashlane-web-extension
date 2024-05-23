import { Store } from 'store/create';
function hook(obj: Record<string, any>, name: string, action: () => void) {
    const orig = obj[name] || (() => 0);
    obj[name] = () => {
        orig.call(obj);
        action.call(obj);
    };
}
function limitByFramerate(f: () => void): () => void {
    let refreshScheduled = false;
    return () => {
        if (refreshScheduled) {
            return;
        }
        refreshScheduled = true;
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(() => {
                f();
                refreshScheduled = false;
            });
        }
    };
}
export default function rerender(component: React.Component, store: Store) {
    let unsubscribe: (() => void) | null = null;
    const handle = limitByFramerate(() => {
        if (unsubscribe) {
            component.forceUpdate();
        }
    });
    hook(component, 'componentDidMount', () => {
        unsubscribe = store.subscribe(handle);
        handle();
    });
    hook(component, 'componentWillUnmount', () => {
        if (unsubscribe) {
            unsubscribe();
        }
        unsubscribe = null;
    });
}
