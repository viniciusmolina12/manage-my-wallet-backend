import {
   ControllerStatusCode,
   OutputControllerDto,
} from '../interfaces/controller.dto';

export function response<T>(
   code: ControllerStatusCode,
   message?: string | string[],
   data?: T
): OutputControllerDto<T> {
   return {
      code,
      data,
      message,
   };
}
