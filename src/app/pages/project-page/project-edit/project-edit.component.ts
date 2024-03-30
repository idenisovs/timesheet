import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Project } from '../../../dto';
import { ProjectsService } from '../../../services/projects.service';

@Component({
  selector: 'app-project-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './project-edit.component.html',
  styleUrl: './project-edit.component.scss'
})
export class ProjectEditComponent implements OnInit {
  form = this.fb.group({
    name: [''],
    keys: [''],
    description: ['']
  });

  @Input()
  project!: Project;

  @Output()
  changes = new EventEmitter<Project>();

  constructor(
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form.get('name')?.setValue(this.project.name);
    this.form.get('keys')?.setValue(this.project.keys.join(', '));
    this.form.get('description')?.setValue(this.project.description ?? null);
  }

  async save() {
    const project = { ... this.project };

    project.name = this.form.get('name')?.value as string;
    project.description = this.form.get('description')?.value as string;
    project.keys = (this.form.get('keys')?.value as string).split(',').map(key => key.trim());

    await this.projectsService.update(project);

    this.changes.emit(project);
  }

  async remove() {
    if (!this.project) {
      return;
    }

    if (!confirm(`Are you sure want to remove the project ${this.project.name}?`)) {
      return;
    }

    await this.projectsService.remove(this.project);
    await this.router.navigate(['projects']);
  }
}
