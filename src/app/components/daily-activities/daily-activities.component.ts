import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { getDateString } from '../../utils';
import Sheet from '../../dto/Sheet';
import { SheetStoreService } from '../../services/sheet-store.service';

@Component({
  selector: 'app-daily-activities',
  templateUrl: './daily-activities.component.html',
  styleUrls: ['./daily-activities.component.scss']
})
export class DailyActivitiesComponent implements OnInit {
  isChanged = false;
  date = new Date();

  form = this.fb.group({
    id: [''],
    date: [getDateString(this.date)],
    activities: this.fb.array([
      this.fb.group({
        name: [''],
        from: [''],
        till: [''],
        duration: ['']
      })
    ])
  });

  @Input()
  sheet?: Sheet;

  get Activities(): FormGroup[] {
    return (this.form.get('activities') as FormArray).controls as FormGroup[];
  }

  constructor(
    private fb: FormBuilder,
    private store: SheetStoreService
  ) { }

  ngOnInit(): void {
    if (this.sheet) {
      this.date = new Date(this.sheet.date);
      this.form.patchValue(this.sheet);

      const activities = this.sheet.activities.map((activity) => {
        return this.fb.group({
          name: [activity.name],
          from: [activity.from],
          till: [activity.till],
          duration: [activity.duration]
        })
      });

      this.form.setControl('activities', this.fb.array(activities));
    }

    this.form.valueChanges.subscribe(() => {
      this.isChanged = true;
    });
  }

  addActivityRecord() {
    const activities = this.form.get('activities') as FormArray;

    activities.push(this.fb.group({
      name: [''],
      from: [''],
      till: [''],
      duration: ['']
    }));
  }

  removeActivityRecord(idx: number) {
    this.Activities.splice(idx, 1);
  }

  async save() {
    this.isChanged = false;
    console.log('Saving item...');

    // console.log(this.form.value);

    await this.store.save(this.form.value);
    console.log('Item saved!');
  }
}
