import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Project } from '../dto';
import { ProjectRepositoryService } from '../repository/project-repository.service';

export const projectResolver: ResolveFn<Project | null> = async (route) => {
  const projectId = route.paramMap.get('projectId');

  if (!projectId) {
    return null;
  }

  const projects = inject(ProjectRepositoryService);

  return await projects.getById(projectId);
};
