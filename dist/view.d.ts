import { Location } from "./location";
import { Snapshot } from "./snapshot";
import { RenderCallback, RenderDelegate } from "./snapshot_renderer";
export declare type RenderOptions = {
    snapshot: Snapshot;
    error: string;
    isPreview: boolean;
};
export declare class View {
    readonly delegate: RenderDelegate;
    readonly htmlElement: HTMLHtmlElement;
    constructor(delegate: RenderDelegate);
    getRootLocation(): Location;
    getElementForAnchor(anchor: string): Element | null;
    getSnapshot(): Snapshot;
    render({ snapshot, error, isPreview }: Partial<RenderOptions>, callback: RenderCallback): void;
    markAsPreview(isPreview: boolean | undefined): void;
    renderSnapshot(snapshot: Snapshot, isPreview: boolean | undefined, callback: RenderCallback): void;
    renderError(error: string | undefined, callback: RenderCallback): void;
}
//# sourceMappingURL=view.d.ts.map