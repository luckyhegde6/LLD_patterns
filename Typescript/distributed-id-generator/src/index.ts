import { SnowflakeGenerator } from "./core/SnowflakeGenerator";

const generator = new SnowflakeGenerator({
    epoch: 1700000000000,
    nodeId: 1,
    nodeIdBits: 10,
    sequenceBits: 12
});

console.log(generator.generate().toString());
console.log(generator.generate().toString());
