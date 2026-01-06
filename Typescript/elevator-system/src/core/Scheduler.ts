import { Request } from "./Request";
import { Elevator } from "./Elevator";
import { Direction } from "./Direction";

export class Scheduler {
    private upQueue: number[] = [];
    private downQueue: number[] = [];

    addRequest(request: Request) {
        if (request.direction === Direction.UP) {
            this.upQueue.push(request.floor);
            this.upQueue.sort((a, b) => a - b);
        } else {
            this.downQueue.push(request.floor);
            this.downQueue.sort((a, b) => b - a);
        }
    }

    getNextFloor(elevator: Elevator): number | null {
        if (elevator.state === "IDLE") {
            return this.upQueue[0] ?? this.downQueue[0] ?? null;
        }

        if (elevator.state === "MOVING_UP") {
            return this.upQueue[0] ?? null;
        }

        if (elevator.state === "MOVING_DOWN") {
            return this.downQueue[0] ?? null;
        }

        return null;
    }

    removeFloor(floor: number) {
        this.upQueue = this.upQueue.filter(f => f !== floor);
        this.downQueue = this.downQueue.filter(f => f !== floor);
    }
}
