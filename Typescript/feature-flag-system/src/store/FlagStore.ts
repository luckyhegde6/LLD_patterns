import { FeatureFlag } from "../core/FeatureFlag";

export interface FlagStore {
    get(key: string): FeatureFlag | undefined;
    save(flag: FeatureFlag): void;
}
