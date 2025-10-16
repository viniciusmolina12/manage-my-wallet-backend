import { createVendorControllerSchema } from './create-vendor-controller.schema';
import { updateVendorControllerSchema } from './update-vendor-controller.schema';
import { deleteVendorControllerSchema } from './delete-vendor-controller.schema';
import { findVendorControllerSchema } from './find-vendor-controller.schema';
import { listVendorControllerSchema } from './list-vendor-controller.schema';

export const VENDOR_CONTROLLER_SCHEMAS = {
   CREATE: createVendorControllerSchema,
   UPDATE: updateVendorControllerSchema,
   DELETE: deleteVendorControllerSchema,
   FIND: findVendorControllerSchema,
   LIST: listVendorControllerSchema,
};
