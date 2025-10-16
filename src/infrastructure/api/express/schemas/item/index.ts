import { createItemControllerSchema } from './create-item-controller.schema';
import { updateItemControllerSchema } from './update-item-controller.schema';
import { deleteItemControllerSchema } from './delete-item-controller.schema';
import { findItemControllerSchema } from './find-item-controller.schema';
import { listItemControllerSchema } from './list-item-controller.schema';

export const ITEM_CONTROLLER_SCHEMAS = {
   CREATE: createItemControllerSchema,
   UPDATE: updateItemControllerSchema,
   DELETE: deleteItemControllerSchema,
   FIND: findItemControllerSchema,
   LIST: listItemControllerSchema,
};
