import { Elevator } from "./Elevator";
import { Scheduler } from "./Scheduler";
import { Request } from "./Request";
import { ElevatorState } from "./ElevatorState";

export class ElevatorController {
    constructor(
        private elevator: Elevator,
        private scheduler: Scheduler
    ) { }

    request(request: Request) {
        this.scheduler.addRequest(request);
    }

    step() {
        const next = this.scheduler.getNextFloor(this.elevator);
        if (next === null) return;

        if (this.elevator.currentFloor < next) {
            this.elevator.moveUp();
        } else if (this.elevator.currentFloor > next) {
            this.elevator.moveDown();
        } else {
            this.elevator.stop();
            this.scheduler.removeFloor(next);
        }
    }
}
