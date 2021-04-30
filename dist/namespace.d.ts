import { Controller, VisitOptions } from "./controller";
import { Locatable } from "./location";
declare const _default: {
    pendingScripts: never[];
    loadedAllScripts: never[];
    readonly supported: boolean;
    controller: Controller;
    visit(location: Locatable, options?: Partial<VisitOptions> | undefined): void;
    clearCache(): void;
    setProgressBarDelay(delay: number): void;
    start(): void;
};
export default _default;
//# sourceMappingURL=namespace.d.ts.map