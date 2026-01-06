import { FlagRule } from "./FlagRule";

export class FeatureFlag {
    constructor(
        public readonly key: string,
        public readonly enabled: boolean,
        public readonly rules: FlagRule[] = []
    ) { }
}
