import { Elevator } from "../src/core/Elevator";
import { Scheduler } from "../src/core/Scheduler";
import { ElevatorController } from "../src/core/ElevatorController";
import { Request } from "../src/core/Request";
import { Direction } from "../src/core/Direction";

test("elevator moves to requested floor", () => {
    const elevator = new Elevator();
    const scheduler = new Scheduler();
    const controller = new ElevatorController(elevator, scheduler);

    controller.request(new Request(3, Direction.UP));

    for (let i = 0; i < 5; i++) controller.step();

    expect(elevator.currentFloor).toBe(3);
});
