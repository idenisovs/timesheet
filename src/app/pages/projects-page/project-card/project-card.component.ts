import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../../dto';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-project-card',
    imports: [
    RouterLink,
    DatePipe
],
    templateUrl: './project-card.component.html',
    styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
  @Input()
  project!: Project;
}
