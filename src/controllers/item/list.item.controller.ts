import EntityError from '@core/domain/@shared/error/entity.error';
import ListItemUsecase from '@core/usecases/item/list/list.usecase';
import {
   OutputControllerDto,
   InputControllerDto,
} from '@controllers/@shared/interfaces/controller.dto';
import { response } from '@controllers/@shared/protocols';
import { Validator } from '@core/interfaces/validator.interface';
import { SearchItem } from '@core/domain/item/repository/item.repository';
import { Filter } from '@core/domain/@shared/filter/filter';

interface InputListItemControllerDto {
   userId: string;
   page: number;
   perPage: number;
   order: string;
   search: SearchItem;
}

interface OutputListItemControllerDto {
   items: {
      id: string;
      name: string;
      description?: string;
      categoryId: string;
      createdAt: Date;
      updatedAt: Date;
   }[];
}

export default class ListItemController {
   constructor(
      private readonly listItemUseCase: ListItemUsecase,
      private readonly validator: Validator
   ) {
      this.listItemUseCase = listItemUseCase;
      this.validator = validator;
   }
   public async handle(
      input: InputControllerDto<InputListItemControllerDto>
   ): Promise<OutputControllerDto<OutputListItemControllerDto>> {
      try {
         const { success, errors } = this.validator.validate(input.data);
         if (!success) return response(400, errors);
         const { userId, page, perPage, order, search } = input.data;
         const filter = new Filter(page, perPage, order, search);
         const { items, meta } = await this.listItemUseCase.execute(
            { userId },
            filter
         );
         const output = {
            items: items.map((item) => ({
               id: item.id,
               name: item.name,
               description: item.description,
               categoryId: item.categoryId,
               createdAt: item.createdAt,
               updatedAt: item.updatedAt,
            })),
            meta,
         };
         return response<OutputListItemControllerDto>(
            200,
            'Items listed succesfully',
            output
         );
      } catch (e: any) {
         if (e instanceof EntityError) return response(400, e.message);
         return response(500, e.message);
      }
   }
}
