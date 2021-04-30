import { Position } from "./types";
export interface ScrollManagerDelegate {
    scrollPositionChanged(position: Position): void;
}
export declare class ScrollManager {
    readonly delegate: ScrollManagerDelegate;
    started: boolean;
    constructor(delegate: ScrollManagerDelegate);
    start(): void;
    stop(): void;
    scrollToElement(element: Element): void;
    scrollToPosition({ x, y }: Position): void;
    onScroll: () => void;
    updatePosition(position: Position): void;
}
//# sourceMappingURL=scroll_manager.d.ts.map