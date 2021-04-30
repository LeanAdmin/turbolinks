import { Adapter } from "./adapter";
import { Controller, RestorationData } from "./controller";
import { HttpRequest } from "./http_request";
import { Location } from "./location";
import { RenderCallback } from "./renderer";
import { Snapshot } from "./snapshot";
import { Action } from "./types";
export declare enum TimingMetric {
    visitStart = "visitStart",
    requestStart = "requestStart",
    requestEnd = "requestEnd",
    visitEnd = "visitEnd"
}
export declare type TimingMetrics = Partial<{
    [metric in TimingMetric]: any;
}>;
export declare enum VisitState {
    initialized = "initialized",
    started = "started",
    canceled = "canceled",
    failed = "failed",
    completed = "completed"
}
export declare class Visit {
    readonly controller: Controller;
    readonly action: Action;
    readonly adapter: Adapter;
    readonly identifier: string;
    readonly restorationIdentifier: string;
    readonly timingMetrics: TimingMetrics;
    followedRedirect: boolean;
    frame?: number;
    historyChanged: boolean;
    location: Location;
    progress: number;
    referrer?: Location;
    redirectedToLocation?: Location;
    request?: HttpRequest;
    response?: string;
    restorationData?: RestorationData;
    scrolled: boolean;
    snapshotCached: boolean;
    state: VisitState;
    constructor(controller: Controller, location: Location, action: Action, restorationIdentifier?: string);
    start(): void;
    cancel(): void;
    complete(): void;
    fail(): void;
    changeHistory(): void;
    issueRequest(): void;
    getCachedSnapshot(): Snapshot | undefined;
    hasCachedSnapshot(): boolean;
    loadCachedSnapshot(): void;
    loadResponse(): void;
    followRedirect(): void;
    requestStarted(): void;
    requestProgressed(progress: number): void;
    requestCompletedWithResponse(response: string, redirectedToLocation?: Location): void;
    requestFailedWithStatusCode(statusCode: number, response?: string): void;
    requestFinished(): void;
    performScroll: () => void;
    scrollToRestoredPosition(): true | undefined;
    scrollToAnchor(): true | undefined;
    scrollToTop(): void;
    recordTimingMetric(metric: TimingMetric): void;
    getTimingMetrics(): TimingMetrics;
    getHistoryMethodForAction(action: Action): (locatable: import("./location").Locatable, restorationIdentifier: string) => void;
    shouldIssueRequest(): boolean;
    cacheSnapshot(): void;
    render(callback: RenderCallback): void;
    cancelRender(): void;
}
//# sourceMappingURL=visit.d.ts.map