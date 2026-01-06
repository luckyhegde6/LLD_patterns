import { EqualSplit } from "../src/strategy/EqualSplit";

test("equal split divides correctly", () => {
    const strategy = new EqualSplit();
    const splits = strategy.split(300, [
        { userId: "u1", amount: 0 },
        { userId: "u2", amount: 0 }
    ]);

    expect(splits[0].amount).toBe(150);
});
