import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-daily-activities',
  templateUrl: './daily-activities.component.html',
  styleUrls: ['./daily-activities.component.scss']
})
export class DailyActivitiesComponent implements OnInit {
  today = new Date();

  form = this.fb.group({
    activities: this.fb.array([
      this.fb.group({
        name: [''],
        from: [''],
        till: [''],
        duration: ['']
      })
    ])
  });

  get activities(): FormGroup[] {
    return (this.form.get('activities') as FormArray).controls as FormGroup[];
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {}

  addActivityRecord() {
    this.activities.push(this.fb.group({
      name: [''],
      from: [''],
      till: [''],
      duration: ['']
    }));
  }

  removeActivityRecord(idx: number) {
    this.activities.splice(idx, 1);
  }

  save() {}

}
