import { SnowflakeGenerator } from "../src/core/SnowflakeGenerator";

test("generates unique IDs", () => {
    const gen = new SnowflakeGenerator({
        epoch: 0,
        nodeId: 1,
        nodeIdBits: 10,
        sequenceBits: 12
    });

    const id1 = gen.generate();
    const id2 = gen.generate();

    expect(id1).not.toBe(id2);
    expect(id2 > id1).toBe(true);
});
