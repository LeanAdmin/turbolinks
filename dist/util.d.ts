export declare function array<T>(values: ArrayLike<T>): T[];
export declare const closest: (element: Element, selector: string) => Element | null;
export declare function defer(callback: () => any): void;
export declare type DispatchOptions = {
    target: EventTarget;
    cancelable: boolean;
    data: any;
};
export declare function dispatch(eventName: string, { target, cancelable, data }?: Partial<DispatchOptions>): Event & {
    data: any;
};
export declare function unindent(strings: TemplateStringsArray, ...values: any[]): string;
export declare function uuid(): string;
export declare class PendingAction<T = any> {
    readonly promise: Promise<T>;
    pending: boolean;
    resolved: boolean;
    rejected: boolean;
    private _resolve;
    private _reject;
    constructor();
    resolve(value: T): void;
    reject(reason?: any): void;
    then(...args: any): Promise<T>;
    catch(...args: any): Promise<T>;
}
//# sourceMappingURL=util.d.ts.map