/// <reference types="react" />
export type Color = 'light' | 'darkblue' | 'red' | undefined;
type voidFunc = () => void;
export type eventFunc = (e: any) => void;
export type onClickType = voidFunc | eventFunc | undefined;
export type Options = {
    title: string;
    subtitle?: string;
    message?: string;
    onClick?: onClickType;
    theme?: Color;
    duration?: number;
    backgroundTop?: string;
    backgroundBottom?: string;
    colorTop?: string;
    colorBottom?: string;
    closeButton?: JSX.Element | string;
    native?: boolean;
    icon?: string;
    vibrate?: number | number[];
    silent?: boolean;
};
export type Styling = {
    backgroundTop?: string;
    backgroundBottom?: string;
    colorTop?: string;
    colorBottom?: string;
};
export interface PushNotificationObject {
    title: string;
    subtitle?: string;
    message?: string;
    theme?: Color;
    styling?: Styling;
    closeButton?: JSX.Element | string;
    onClick?: onClickType;
}
export declare class PushNotification {
    title: string;
    subtitle?: string;
    message?: string;
    theme?: Color;
    id: number;
    styling?: Styling;
    closeButton?: JSX.Element | string;
    onClick?: onClickType;
    constructor(op: PushNotificationObject);
}
declare class Storage {
    Storage: Array<PushNotification>;
    Listener: (storage: any) => void;
    popAndPush: (NotificationId: number) => void;
    setTimer: (NotificationId: number, duration: number) => void;
    addListener: (listener: (v: Array<PushNotification>) => void) => void;
    addNativeNotification: (options: Options) => Promise<void>;
    addWebNotification: (options: Options) => void;
    addNotification: (options: Options) => Promise<void>;
}
declare const _default: Storage;
export default _default;
