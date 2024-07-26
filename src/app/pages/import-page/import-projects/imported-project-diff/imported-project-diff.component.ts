import { Component, Input } from '@angular/core';
import { Project } from '../../../../dto';

@Component({
  selector: 'app-imported-project-diff',
  standalone: true,
  imports: [],
  templateUrl: './imported-project-diff.component.html',
  styleUrl: './imported-project-diff.component.scss'
})
export class ImportedProjectDiffComponent {
  @Input()
  importedProject!: Project;
}
