const usedStorages: Storage[] = [];
export default function (storage: Storage) {
    if (usedStorages.includes(storage)) {
        throw new Error('User storage used more than once !');
    }
    usedStorages.push(storage);
}
