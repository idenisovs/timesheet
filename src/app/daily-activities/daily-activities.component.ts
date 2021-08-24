import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { getDateString } from '../utils';

@Component({
  selector: 'app-daily-activities',
  templateUrl: './daily-activities.component.html',
  styleUrls: ['./daily-activities.component.scss']
})
export class DailyActivitiesComponent implements OnInit {
  isChanged = false;
  today = new Date();

  form = this.fb.group({
    id: [''],
    date: [getDateString(this.today)],
    activities: this.fb.array([
      this.fb.group({
        name: [''],
        from: [''],
        till: [''],
        duration: ['']
      })
    ])
  });

  get Activities(): FormGroup[] {
    return (this.form.get('activities') as FormArray).controls as FormGroup[];
  }

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
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

    this.isChanged = true;
  }

  removeActivityRecord(idx: number) {
    this.Activities.splice(idx, 1);
  }

  async save() {
    this.isChanged = false;
    console.log('Saving item...');

    console.log(this.form.value);

    // await this.store.save();
    console.log('Item saved!');
  }
}
