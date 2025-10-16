import { createCategoryControllerSchema } from './create-category-controller.schema';
import { deleteCategoryControllerSchema } from './delete-category-controller.schema';

export const CATEGORY_CONTROLLER_SCHEMAS = {
   CREATE: createCategoryControllerSchema,
   DELETE: deleteCategoryControllerSchema,
};
