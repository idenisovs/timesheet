import { Component, OnInit } from '@angular/core';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [
    NgbInputDatepicker,
    ReactiveFormsModule,
  ],
  templateUrl: './analytics-page.component.html',
  styleUrl: './analytics-page.component.scss'
})
export class AnalyticsPageComponent implements OnInit {
  filtersForm = this.fb.group({
    dateFrom: [{ year: 2024, month: 9, day: 1}],
    dateTill: [{ year: 2024, month: 9, day: 13}]
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.filtersForm.valueChanges.subscribe((changes) => {
      console.log(changes);
    });
  }
}
