import { Component, Input } from '@angular/core';
import { NgForOf } from '@angular/common';
import { Activity } from '../../../dto';

@Component({
  selector: 'app-activities-list',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './activities-list.component.html',
  styleUrl: './activities-list.component.scss'
})
export class ActivitiesListComponent {
  @Input()
  activities: Activity[] = [];
}
