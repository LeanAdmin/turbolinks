import { BrowserTestCase } from "./browser_test_case";
import { RemoteChannel } from "./remote_channel";
import { Element } from "@theintern/leadfoot";
declare type EventLog = [string, any];
export declare class TurbolinksTestCase extends BrowserTestCase {
    eventLogChannel: RemoteChannel<EventLog>;
    lastBody?: Element;
    beforeTest(): Promise<void>;
    readonly nextWindowHandle: Promise<string>;
    nextEventNamed(eventName: string): Promise<any>;
    readonly nextBeat: Promise<void>;
    readonly nextBody: Promise<Element>;
    readonly changedBody: Promise<Element | undefined>;
    readonly visitAction: Promise<string>;
    drainEventLog(): Promise<void>;
}
export {};
//# sourceMappingURL=turbolinks_test_case.d.ts.map