import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { SheetStoreService } from '../../../services/sheet-store.service';
import { Issue } from '../../../dto';

@Injectable({
  providedIn: 'root'
})
export class CreateIssueModalService {
  db = this.store.Instance;

  constructor(private store: SheetStoreService) { }

  async save(name: string) {
    const [key, ...nameParts] = name.split(':');

    const id = await this.db.issues.add({
      key,
      name: nameParts.join(':').trim(),
      activities: [],
      duration: '',
      createdAt: new Date()
    } as unknown as Issue);

    return await this.db.issues.get(id) as Issue;
  }

  existingIssueNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(300)
        .pipe(
          switchMap(() => {
            const issueKey = control.value.split(':')[0];
            return this.db.issues.where('key').equals(issueKey).first();
          }),
          map((issue: Issue | undefined) => {
            if (!issue) {
              return null;
            }

            return {
              unique: true
            }
          }),
          first()
        );
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
