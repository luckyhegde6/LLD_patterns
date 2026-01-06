import { FlagStore } from "./FlagStore";
import { FeatureFlag } from "../core/FeatureFlag";

export class InMemoryFlagStore implements FlagStore {
    private flags = new Map<string, FeatureFlag>();

    get(key: string): FeatureFlag | undefined {
        return this.flags.get(key);
    }

    save(flag: FeatureFlag): void {
        this.flags.set(flag.key, flag);
    }
}
