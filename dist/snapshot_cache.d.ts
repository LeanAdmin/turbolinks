import { Location } from "./location";
import { Snapshot } from "./snapshot";
export declare class SnapshotCache {
    readonly keys: string[];
    readonly snapshots: {
        [url: string]: Snapshot;
    };
    readonly size: number;
    constructor(size: number);
    has(location: Location): boolean;
    get(location: Location): Snapshot | undefined;
    put(location: Location, snapshot: Snapshot): Snapshot;
    read(location: Location): Snapshot;
    write(location: Location, snapshot: Snapshot): void;
    touch(location: Location): void;
    trim(): void;
}
//# sourceMappingURL=snapshot_cache.d.ts.map