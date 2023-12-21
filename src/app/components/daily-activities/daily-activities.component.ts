import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { duration } from 'yet-another-duration';

import { getDateString, calculateTotalDuration } from '../../utils';
import { Sheet, Activity } from '../../dto';
import { SheetStoreService } from '../../services/sheet-store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DailyActivitiesSummaryComponent } from './daily-activities-summary/daily-activities-summary.component';

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

  get Activities(): UntypedFormGroup[] {
    return (this.form.get('activities') as UntypedFormArray).controls as UntypedFormGroup[];
  }

  get ImportedActivities(): boolean {
    if (!this.sheet) {
      return false;
    }
    return this.sheet.activities.some((activity) => activity.isImported);
  }

  constructor(
    private fb: UntypedFormBuilder,
    private store: SheetStoreService,
    private modal: NgbModal
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
    const activities = this.form.get('activities') as UntypedFormArray;

    activities.push(this.fb.group({
      name: [''],
      from: [''],
      till: [''],
      duration: ['']
    }));
  }

  removeActivityRecord(idx: number) {
    this.sheet?.activities.splice(idx, 1);
    const activities = this.form.get('activities') as UntypedFormArray;

    activities.removeAt(idx);

    if (!activities.length) {
      this.addActivityRecord();
    }
  }

  async save() {
    await this.store.save(this.form.value);

    this.isChanged = false;
    this.totalDuration = this.getTotalDuration();

    if (this.sheet && this.sheet.activities) {
      this.sheet.activities = this.form.get('activities')?.value;
    }

  }

  getTotalDuration(): string {
    const activities = this.form.get('activities')?.value as Activity[];

    const totalDuration = calculateTotalDuration(activities);

    return duration(totalDuration || 0, {
      units: {
        min: 'minutes'
      }
    }).toString();
  }

  isImportedActivity(idx: number): boolean {
    if (!this.sheet || !this.sheet.activities) {
      return false;
    }

    const activity = this.sheet.activities[idx];

    return activity ? !!activity.isImported : false;
  }

  showDailySummary() {
    const dailySummaryModalRef =  this.modal.open(DailyActivitiesSummaryComponent, {
      centered: true,
      size: 'lg'
    });

    const dailySummaryModal = (dailySummaryModalRef.componentInstance as DailyActivitiesSummaryComponent)

    dailySummaryModal.sheet = this.sheet;
  }
}
