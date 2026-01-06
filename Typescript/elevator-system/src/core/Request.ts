import { Direction } from "./Direction";

export class Request {
  constructor(
    public readonly floor: number,
    public readonly direction: Direction
  ) {}
}
