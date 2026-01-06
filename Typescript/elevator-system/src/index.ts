import { Elevator } from "./core/Elevator";
import { Scheduler } from "./core/Scheduler";
import { ElevatorController } from "./core/ElevatorController";
import { Request } from "./core/Request";
import { Direction } from "./core/Direction";

const elevator = new Elevator();
const scheduler = new Scheduler();
const controller = new ElevatorController(elevator, scheduler);

controller.request(new Request(5, Direction.UP));
controller.request(new Request(2, Direction.DOWN));

for (let i = 0; i < 10; i++) {
    controller.step();
    console.log(`Floor: ${elevator.currentFloor}, State: ${elevator.state}`);
}
