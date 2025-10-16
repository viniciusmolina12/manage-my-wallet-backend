import { createCategoryControllerSchema } from './create-category-controller.schema';
import { deleteCategoryControllerSchema } from './delete-category-controller.schema';
import { findCategoryControllerSchema } from './find-category-controller.schema';
import { listCategoryControllerSchema } from './list-category-controller.schema';
import { updateCategoryControllerSchema } from './update-category-controller.schema';

export const CATEGORY_CONTROLLER_SCHEMAS = {
   CREATE: createCategoryControllerSchema,
   DELETE: deleteCategoryControllerSchema,
   FIND: findCategoryControllerSchema,
   LIST: listCategoryControllerSchema,
   UPDATE: updateCategoryControllerSchema,
};
