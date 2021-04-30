import { TurbolinksTestCase } from "./helpers/turbolinks_test_case";
export declare class AsyncScriptTests extends TurbolinksTestCase {
    setup(): Promise<void>;
    "test does not emit turbolinks:load when loaded asynchronously after DOMContentLoaded"(): Promise<void>;
    "test following a link when loaded asynchronously after DOMContentLoaded"(): Promise<void>;
}
//# sourceMappingURL=async_script_tests.d.ts.map