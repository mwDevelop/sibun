import { atom, selector } from "recoil";

export const testAtom = atom({
    key: 'testAtom',
    default: true
});

export const ProfileEditSaveAtom = atom({
    key: 'ProfileEditSaveAtom',
    default: 'ready' /* ready -> active -> execute -> ready */
});

export const DevicePositionAtom = atom({ //caching device position
    key: 'DevicePositionAtom',
    default: null
});