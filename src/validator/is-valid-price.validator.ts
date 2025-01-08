import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
  
  @ValidatorConstraint({ name: 'isValidPrice' })
  export class IsDecimalValidConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
      const decimalPlaces = value.toString().split('.')[1]?.length;
      if (decimalPlaces > 2) {
        return false; // If more than 2 decimal places
      }
  
      if (value < 0) {
        return false; // If the value is negative
      }
  
      return true;
    }
  }
  
  export function IsValidPrice(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
      registerDecorator({
        name: 'isValidPrice',
        target: object.constructor,
        propertyName: propertyName,
        constraints: [],
        options: validationOptions,
        validator: IsDecimalValidConstraint,
      });
    };
  }
  