import { Activity, Issue, Project } from '../../dto';

export type ActivityTree = Map<Project, Map<Issue, Activity[]>>;

export type Totals = {
  activities: number,
  time: string,
  rate: number
};
