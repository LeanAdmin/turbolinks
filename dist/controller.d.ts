import { Adapter } from "./adapter";
import { History } from "./history";
import { Location, Locatable } from "./location";
import { RenderCallback } from "./renderer";
import { ScrollManager } from "./scroll_manager";
import { SnapshotCache } from "./snapshot_cache";
import { Action, Position } from "./types";
import { RenderOptions, View } from "./view";
import { Visit } from "./visit";
export declare type RestorationData = {
    scrollPosition?: Position;
};
export declare type RestorationDataMap = {
    [uuid: string]: RestorationData;
};
export declare type TimingData = {};
export declare type VisitOptions = {
    action: Action;
};
export declare type VisitProperties = {
    restorationIdentifier: string;
    restorationData: RestorationData;
    historyChanged: boolean;
};
export declare class Controller {
    static supported: boolean;
    readonly adapter: Adapter;
    readonly history: History;
    readonly restorationData: RestorationDataMap;
    readonly scrollManager: ScrollManager;
    readonly view: View;
    cache: SnapshotCache;
    currentVisit?: Visit;
    enabled: boolean;
    lastRenderedLocation?: Location;
    location: Location;
    progressBarDelay: number;
    restorationIdentifier: string;
    started: boolean;
    start(): void;
    disable(): void;
    stop(): void;
    clearCache(): void;
    visit(location: Locatable, options?: Partial<VisitOptions>): void;
    startVisitToLocationWithAction(location: Locatable, action: Action, restorationIdentifier: string): void;
    setProgressBarDelay(delay: number): void;
    startHistory(): void;
    stopHistory(): void;
    pushHistoryWithLocationAndRestorationIdentifier(locatable: Locatable, restorationIdentifier: string): void;
    replaceHistoryWithLocationAndRestorationIdentifier(locatable: Locatable, restorationIdentifier: string): void;
    historyPoppedToLocationWithRestorationIdentifier(location: Location, restorationIdentifier: string): void;
    getCachedSnapshotForLocation(location: Location): import("./snapshot").Snapshot | undefined;
    shouldCacheSnapshot(): boolean;
    cacheSnapshot(): void;
    scrollToAnchor(anchor: string): void;
    scrollToElement(element: Element): void;
    scrollToPosition(position: Position): void;
    scrollPositionChanged(position: Position): void;
    render(options: Partial<RenderOptions>, callback: RenderCallback): void;
    viewInvalidated(): void;
    viewWillRender(newBody: HTMLBodyElement): void;
    viewRendered(): void;
    pageLoaded: () => void;
    clickCaptured: () => void;
    clickBubbled: (event: MouseEvent) => void;
    applicationAllowsFollowingLinkToLocation(link: Element, location: Location): boolean;
    applicationAllowsVisitingLocation(location: Location): boolean;
    notifyApplicationAfterClickingLinkToLocation(link: Element, location: Location): Event & {
        data: any;
    };
    notifyApplicationBeforeVisitingLocation(location: Location): Event & {
        data: any;
    };
    notifyApplicationAfterVisitingLocation(location: Location): Event & {
        data: any;
    };
    notifyApplicationBeforeCachingSnapshot(): Event & {
        data: any;
    };
    notifyApplicationBeforeRender(newBody: HTMLBodyElement): Event & {
        data: any;
    };
    notifyApplicationAfterRender(): Event & {
        data: any;
    };
    notifyApplicationAfterPageLoad(timing?: TimingData): Event & {
        data: any;
    };
    startVisit(location: Location, action: Action, properties: Partial<VisitProperties>): void;
    createVisit(location: Location, action: Action, properties: Partial<VisitProperties>): Visit;
    visitCompleted(visit: Visit): void;
    clickEventIsSignificant(event: MouseEvent): boolean;
    getVisitableLinkForTarget(target: EventTarget | null): Element | null | undefined;
    getVisitableLocationForLink(link: Element): Location | undefined;
    getActionForLink(link: Element): Action;
    elementIsVisitable(element: Element): boolean;
    locationIsVisitable(location: Location): false | RegExpMatchArray | null;
    getCurrentRestorationData(): RestorationData;
    getRestorationDataForIdentifier(identifier: string): RestorationData;
}
//# sourceMappingURL=controller.d.ts.map