import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CreateIssueModalService {

  constructor() { }

  existingIssueNameValidator(): AsyncValidatorFn {
    return async (control: AbstractControl): Promise<ValidationErrors|null> => {
      console.log('Control:');
      console.log(control.value);

      if (!control.value.length) {
        return {
          issueNameLength: true
        }
      }

      return null;
    }
  }

  issueNameFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors|null => {
      if (control.value.match(/^\w+-\d+/)) {
        return null;
      }

      return {
        format: true
      };
    }
  }
}
