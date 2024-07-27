import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import parseDuration from 'parse-duration';
import { duration } from 'yet-another-duration';

import { Issue } from '../../../dto';
import { IssueRepositoryService } from '../../../repository/issue-repository.service';

@Injectable({
  providedIn: 'root'
})
export class CreateIssueModalService {
  constructor(
    private issueRepository: IssueRepositoryService
  ) { }

  async save(name: string, estimate: string) {
    const [key, ...nameParts] = name.split(':');

    const issue = new Issue({
      key,
      name: nameParts.join(':').trim(),
      estimate: this.normalizeDuration(estimate)
    })

    return this.issueRepository.create(issue);
  }

  existingIssueNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(300)
        .pipe(
          switchMap(() => {
            const issueKey = control.value.split(':')[0];
            return this.issueRepository.getByKey(issueKey);
          }),
          map((issue: Issue | null) => {
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
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value.match(/^\w+-\d+/)) {
        return null;
      }

      return {
        format: true
      };
    }
  }

  durationFieldValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const { value } = control;

      if (!value.length) {
        return null;
      }

      const duration = parseDuration(value);

      if (duration !== null) {
        return null;
      }

      return {
        format: true
      };
    }
  }

  normalizeDuration(value?: string) {
    if (!value) {
      return '';
    }

    const durationMs = parseDuration(value);

    if (!durationMs) {
      return value;
    }

    return duration(durationMs, {
      units: {
        max: 'hours',
        min: 'minutes'
      }
    }).toString();
  }
}
