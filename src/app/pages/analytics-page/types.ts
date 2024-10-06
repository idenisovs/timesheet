import { Activity, Issue, Project } from '../../dto';

export type ActivityTree = Map<Project, Map<Issue, Activity[]>>;
