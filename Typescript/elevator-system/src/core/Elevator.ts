import { ElevatorState } from "./ElevatorState";

export class Elevator {
  constructor(
    public currentFloor: number = 0,
    public state: ElevatorState = ElevatorState.IDLE
  ) {}

  moveUp() {
    this.state = ElevatorState.MOVING_UP;
    this.currentFloor++;
  }

  moveDown() {
    this.state = ElevatorState.MOVING_DOWN;
    this.currentFloor--;
  }

  stop() {
    this.state = ElevatorState.IDLE;
  }
}
