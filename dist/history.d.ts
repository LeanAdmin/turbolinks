import { Location } from "./location";
export interface HistoryDelegate {
    historyPoppedToLocationWithRestorationIdentifier(location: Location, restorationIdentifier: string): void;
}
declare type HistoryMethod = (state: any, title: string, url?: string | null | undefined) => void;
export declare class History {
    readonly delegate: HistoryDelegate;
    started: boolean;
    pageLoaded: boolean;
    constructor(delegate: HistoryDelegate);
    start(): void;
    stop(): void;
    push(location: Location, restorationIdentifier: string): void;
    replace(location: Location, restorationIdentifier: string): void;
    onPopState: (event: PopStateEvent) => void;
    onPageLoad: (event: Event) => void;
    shouldHandlePopState(): boolean;
    pageIsLoaded(): boolean;
    update(method: HistoryMethod, location: Location, restorationIdentifier: string): void;
}
export {};
//# sourceMappingURL=history.d.ts.map