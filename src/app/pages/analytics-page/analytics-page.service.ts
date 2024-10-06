import { Injectable } from '@angular/core';

import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';
import { Activity, Day, Issue, Project, ProjectOverview } from '../../dto';
import { AnalyticsPageFilters } from './AnalyticsPageFilterForm';
import { DaysRepositoryService } from '../../repository/days-repository.service';
import { ProjectRepositoryService } from '../../repository/project-repository.service';
import { IssueRepositoryService } from '../../repository/issue-repository.service';
import { OverviewService } from '../../services/overview.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsPageService {

  projectCache = new Map<string, Project>();
  issueCache = new Map<string, Issue>();

  constructor(
    private projectRepository: ProjectRepositoryService,
    private issueRepository: IssueRepositoryService,
    private activityRepository: ActivitiesRepositoryService,
    private dayRepository: DaysRepositoryService,
    private overviewService: OverviewService
  ) { }

  async getAnalytics(filters: AnalyticsPageFilters): Promise<ProjectOverview[]> {
    const days = await this.getDays(filters);
    const activities = await this.activityRepository.getByDays(days);
    return await this.overviewService.getProjectOverview(activities)
  }

  async getDays(filters: AnalyticsPageFilters): Promise<Day[]> {
    if (!filters.from && !filters.till) {
      return this.dayRepository.getAll();
    }

    if (filters.from && filters.till) {
      return this.dayRepository.getByRange(filters.from, filters.till);
    }

    throw new Error('Filter functionality is not fully implemented yet!');
  }

  async groupProjectActivities(activities: Activity[]): Promise<Map<Project, Map<Issue, Activity[]>>> {
    const group = new Map<Project, Map<Issue, Activity[]>>();

    for (let activity of activities) {
      const projectKey = activity.getProjectKey();

      if (!projectKey) {
        continue;
      }

      let project = await this.projectRepository.getByKey(projectKey);

      if (!project) {
        continue;
      }

      if (this.projectCache.has(project.id)) {
        project = this.projectCache.get(project.id) as Project;
      } else {
        this.projectCache.set(project.id, project);
      }

      if (!group.has(project)) {
        group.set(project, new Map<Issue, Activity[]>());
      }

      const issueKey = activity.getIssueKey();

      if (!issueKey) {
        continue;
      }

      let issue = await this.issueRepository.getByKey(issueKey);

      if (!issue) {
        continue;
      }

      if (this.issueCache.has(issue.id)) {
        issue = this.issueCache.get(issue.id) as Issue;
      } else {
        this.issueCache.set(issue.id, issue);
      }

      const issueActivitiesGroup = group.get(project)?.get(issue);

      if (issueActivitiesGroup) {
        issueActivitiesGroup.push(activity);
      } else {
        group.get(project)?.set(issue, [activity]);
      }
    }

    return group;
  }
}
