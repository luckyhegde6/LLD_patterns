import { KeyGenerator } from "./KeyGenerator";

export class Base62Encoder implements KeyGenerator {
    private counter = 1;
    private chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    generate(): string {
        let num = this.counter++;
        let result = "";

        while (num > 0) {
            result = this.chars[num % 62] + result;
            num = Math.floor(num / 62);
        }

        return result;
    }
}
