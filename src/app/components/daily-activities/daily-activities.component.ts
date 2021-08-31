import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { getDateString } from '../../utils';
import Sheet from '../../dto/Sheet';
import { SheetStoreService } from '../../services/sheet-store.service';
import { Activity } from '../../dto/Activity';
import parseDuration from 'parse-duration';
import { duration } from 'yet-another-duration';

@Component({
  selector: 'app-daily-activities',
  templateUrl: './daily-activities.component.html',
  styleUrls: ['./daily-activities.component.scss']
})
export class DailyActivitiesComponent implements OnInit {
  isChanged = false;
  date = new Date();
  totalDuration = '0h';

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

      if (!this.sheet.activities.length) {
        this.sheet.activities.push({
          name: '',
          from: '',
          till: '',
          duration: ''
        })
      }

      const activities = this.sheet.activities.map((activity) => {
        return this.fb.group({
          name: [activity.name],
          from: [activity.from],
          till: [activity.till],
          duration: [activity.duration]
        })
      });

      this.form.setControl('activities', this.fb.array(activities));

      this.totalDuration = this.getTotalDuration();
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
    const activities = this.form.get('activities') as FormArray;

    activities.removeAt(idx);

    if (!activities.length) {
      this.addActivityRecord();
    }
  }

  async save() {
    this.isChanged = false;
    await this.store.save(this.form.value);
    this.totalDuration = this.getTotalDuration();
  }

  getTotalDuration(): string {
    const activities = this.form.get('activities')?.value as Activity[];

    const totalDuration = activities.reduce<number>((result: number, activity: Activity) => {
      const activityDuration = parseDuration(activity.duration);

      if (activityDuration) {
        return result + activityDuration;
      }

      return result;
    }, 0)

    return duration(totalDuration || 0, {
      units: {
        min: 'minutes'
      }
    }).toString();
  }

}
