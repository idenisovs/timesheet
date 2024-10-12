import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PercentPipe } from '@angular/common';
import { ProjectOverview } from '../../../../dto';

@Component({
  selector: '[app-project-row]',
  standalone: true,
  imports: [
    PercentPipe,
  ],
  templateUrl: './project-row.component.html',
  styleUrl: './project-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectRowComponent {
  @Input()
  projectOverview!: ProjectOverview;
}
