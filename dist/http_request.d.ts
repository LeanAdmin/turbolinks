import { Location } from "./location";
export declare type StatusCode = number;
export declare enum SystemStatusCode {
    networkFailure = 0,
    timeoutFailure = -1,
    contentTypeMismatch = -2
}
export interface HttpRequestDelegate {
    requestStarted(): void;
    requestProgressed(progress: number): void;
    requestFinished(): void;
    requestCompletedWithResponse(response: string, redirectedToLocation?: Location): void;
    requestFailedWithStatusCode(statusCode: StatusCode, response?: string): void;
}
export declare class HttpRequest {
    static timeout: number;
    readonly delegate: HttpRequestDelegate;
    readonly location: Location;
    readonly referrer?: Location;
    readonly url: string;
    failed: boolean;
    progress: number;
    sent: boolean;
    xhr?: XMLHttpRequest;
    constructor(delegate: HttpRequestDelegate, location: Location, referrer?: Location);
    send(): void;
    cancel(): void;
    requestProgressed: (event: ProgressEvent) => void;
    requestLoaded: () => void;
    requestFailed: () => void;
    requestTimedOut: () => void;
    requestCanceled: () => void;
    notifyApplicationBeforeRequestStart(): void;
    notifyApplicationAfterRequestEnd(): void;
    createXHR(): void;
    endRequest(callback?: (xhr: XMLHttpRequest) => void): void;
    setProgress(progress: number): void;
    destroy(): void;
}
//# sourceMappingURL=http_request.d.ts.map