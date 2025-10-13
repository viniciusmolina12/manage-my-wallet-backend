export interface Validator {
   validate(data: any): ValidatorResult;
}

export interface ValidatorResult {
   success: boolean;
   errors: string[];
}
