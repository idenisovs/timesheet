import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Project } from '../dto';
import { ProjectsService } from '../services/projects.service';

export const projectResolver: ResolveFn<Project | null> = async (route) => {
  const projectId = route.paramMap.get('projectId');

  if (!projectId) {
    return null;
  }

  const projects = inject(ProjectsService);

  const project = await projects.getById(projectId);

  return project ?? null;
};
