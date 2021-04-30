import { TurbolinksTestCase } from "./helpers/turbolinks_test_case";
export declare class NavigationTests extends TurbolinksTestCase {
    setup(): Promise<void>;
    "test after loading the page"(): Promise<void>;
    "test following a same-origin unannotated link"(): Promise<void>;
    "test following a same-origin data-turbolinks-action=replace link"(): Promise<void>;
    "test following a same-origin data-turbolinks=false link"(): Promise<void>;
    "test following a same-origin unannotated link inside a data-turbolinks=false container"(): Promise<void>;
    "test following a same-origin data-turbolinks=true link inside a data-turbolinks=false container"(): Promise<void>;
    "test following a same-origin anchored link"(): Promise<void>;
    "test following a same-origin link to a named anchor"(): Promise<void>;
    "test following a cross-origin unannotated link"(): Promise<void>;
    "test following a same-origin [target] link"(): Promise<void>;
    "test following a same-origin [download] link"(): Promise<void>;
    "test following a same-origin link inside an SVG element"(): Promise<void>;
    "test following a cross-origin link inside an SVG element"(): Promise<void>;
    "test clicking the back button"(): Promise<void>;
    "test clicking the forward button"(): Promise<void>;
}
//# sourceMappingURL=navigation_tests.d.ts.map