import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../../dto';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
  @Input()
  project!: Project;
}
