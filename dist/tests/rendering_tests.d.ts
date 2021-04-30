import { TurbolinksTestCase } from "./helpers/turbolinks_test_case";
import { Element } from "@theintern/leadfoot";
export declare class RenderingTests extends TurbolinksTestCase {
    setup(): Promise<void>;
    "test triggers before-render and render events"(): Promise<void>;
    "test triggers before-render and render events for error pages"(): Promise<void>;
    "test reloads when tracked elements change"(): Promise<void>;
    "test reloads when turbolinks-visit-control setting is reload"(): Promise<void>;
    "test accumulates asset elements in head"(): Promise<void>;
    "test replaces provisional elements in head"(): Promise<void>;
    "test evaluates head script elements once"(): Promise<void>;
    "test evaluates body script elements on each render"(): Promise<void>;
    "test does not evaluate data-turbolinks-eval=false scripts"(): Promise<void>;
    "test preserves permanent elements"(): Promise<void>;
    "test before-cache event"(): Promise<void>;
    "test mutation record as before-cache notification"(): Promise<void>;
    "test error pages"(): Promise<void>;
    readonly assetElements: Promise<Element[]>;
    readonly provisionalElements: Promise<Element[]>;
    readonly headElements: Promise<Element[]>;
    readonly permanentElement: Promise<Element>;
    readonly headScriptEvaluationCount: Promise<number | undefined>;
    readonly bodyScriptEvaluationCount: Promise<number | undefined>;
    modifyBodyBeforeCaching(): Promise<any>;
    beforeCache(callback: (body: HTMLElement) => void): Promise<any>;
    modifyBodyAfterRemoval(): Promise<any>;
}
declare global {
    interface Window {
        headScriptEvaluationCount?: number;
        bodyScriptEvaluationCount?: number;
    }
}
//# sourceMappingURL=rendering_tests.d.ts.map