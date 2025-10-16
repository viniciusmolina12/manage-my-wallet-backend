import { createBillControllerSchema } from './create-bill-controller.schema';
import { deleteBillControllerSchema } from './delete-bill-controller.schema';
import { findBillControllerSchema } from './find-bill-controller.schema';
import { listBillControllerSchema } from './list-bill-controller.schema';
import { summaryBillControllerSchema } from './summary-bill-controller.schema';
import { updateBillControllerSchema } from './update-bill-controller.schema';

export const BILL_CONTROLLER_SCHEMAS = {
   CREATE: createBillControllerSchema,
   DELETE: deleteBillControllerSchema,
   FIND: findBillControllerSchema,
   LIST: listBillControllerSchema,
   SUMMARY: summaryBillControllerSchema,
   UPDATE: updateBillControllerSchema,
};
