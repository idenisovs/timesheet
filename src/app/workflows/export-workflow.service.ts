import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

import { getDateString } from '../utils';
import { ActivitiesRepositoryService } from '../repository/activities-repository.service';
import { Activity, Day, Issue, Project } from '../dto';
import { DaysRepositoryService } from '../repository/days-repository.service';
import { IssueRepositoryService } from '../repository/issue-repository.service';
import { ProjectRepositoryService } from '../repository/project-repository.service';

@Injectable({
  providedIn: 'root'
})
export class ExportWorkflowService {

  constructor(
    private activitiesRepository: ActivitiesRepositoryService,
    private daysRepository: DaysRepositoryService,
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
    const days = await this.daysRepository.getAll();
    const activities = await this.activitiesRepository.getAll() as Activity[];

    const activitiesJson = activities.map((activity: Activity) => {
      return {
        ...activity,
        date: this.getDateOfActivity(days, activity)
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
        createdAt: this.getDateStr(issue.createdAt as Date)
      }
    });

    return XLSX.utils.json_to_sheet(issuesJson);
  }

  async getProjectsSheet() {
    const projects = await this.projectsRepository.getAll();

    const projectsJson = projects.map((project: Project) => ({
      ...project,
      createdAt: this.getDateStr(project.createdAt),
      keys: project.keys.join(';')
    }));

    return XLSX.utils.json_to_sheet(projectsJson);
  }

  getDateOfActivity(days: Day[], activity: Activity) {
    const day = days.find((day) => activity.dayId === day.id);

    if (day) {
      return this.getDateStr(day.date);
    } else {
      return this.getDateStr(activity.date);
    }
  }

  getDateStr(date: Date) {
    const day = date.getDate();
    let dayStr = day.toString();
    if (day < 10) {
      dayStr = '0' + dayStr;
    }

    const month = date.getMonth() + 1;
    let monthStr = month.toString();
    if (month < 10) {
      monthStr = '0' + month;
    }

    const yearStr = date.getFullYear().toString();

    return `${yearStr}-${monthStr}-${dayStr}`;
  }
}
