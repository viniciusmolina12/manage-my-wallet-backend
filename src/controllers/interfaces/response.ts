import { ControllerStatusCode, OutputControllerDto } from "./controller.dto";

export function response<T> (code: ControllerStatusCode, message?: string, data?: T): OutputControllerDto<T> {
    return {
        code,
        data,
        message
    }
}