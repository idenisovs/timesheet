import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

import { getDateString } from '../utils';
import { ActivitiesRepositoryService } from '../repository/activities-repository.service';
import { Activity, Issue, Project } from '../dto';
import { IssueRepositoryService } from '../repository/issue-repository.service';
import { ProjectRepositoryService } from '../repository/project-repository.service';

@Injectable({
  providedIn: 'root'
})
export class ExportWorkflowService {

  constructor(
    private activitiesRepository: ActivitiesRepositoryService,
    private issuesRepository: IssueRepositoryService,
    private projectsRepository: ProjectRepositoryService
  ) { }

  public async export() {
    const activitiesSheet = await this.getActivitiesSheet();

    const workbook = XLSX.utils.book_new(activitiesSheet, 'Activities');

    const issuesSheet = await this.getIssuesSheet();

    XLSX.utils.book_append_sheet(workbook, issuesSheet, 'Issues');

    const projectsSheet = await this.getProjectsSheet();

    XLSX.utils.book_append_sheet(workbook, projectsSheet, 'Projects');

    XLSX.writeFile(workbook, `timesheet-${getDateString()}.ods`, { compression: true });
  }

  async getActivitiesSheet() {
    const activities = await this.activitiesRepository.getAll() as Activity[];

    const activitiesJson = activities.map((activity: Activity) => {
      return {
        ...activity,
        date: activity.date.toISOString()
      };
    })

    return XLSX.utils.json_to_sheet(activitiesJson);
  }

  async getIssuesSheet() {
    const issues = await this.issuesRepository.getAll();

    const issuesJson = issues.map((issue: Partial<Issue>) => {
      delete issue.activities;
      return {
        ...issue,
        createdAt: issue.createdAt?.toISOString()
      }
    });

    return XLSX.utils.json_to_sheet(issuesJson);
  }

  async getProjectsSheet() {
    const projects = await this.projectsRepository.getAll();

    const projectsJson = projects.map((project: Project) => ({
      ...project,
      createdAt: project.createdAt.toISOString(),
      keys: project.keys.join(';')
    }));

    return XLSX.utils.json_to_sheet(projectsJson);
  }
}
