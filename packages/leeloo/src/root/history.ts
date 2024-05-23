import { createHashHistory, History } from 'history';
export default function (): History {
    return createHashHistory({
        basename: '/',
        hashType: 'slash',
    });
}
