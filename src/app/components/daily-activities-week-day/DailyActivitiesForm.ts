import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface ActivityForm {
  id: FormControl<string | null>;
  name: FormControl<string | null>;
  till: FormControl<string | null>;
  from: FormControl<string | null>;
  duration: FormControl<string | null>;
}

export type ActivityFormGroup = FormGroup<ActivityForm>;

export interface DailyActivitiesForm {
  activities: FormArray<ActivityFormGroup>
}
