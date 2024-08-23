import { IssueOverview } from './IssueOverview';

export interface WeeklyOverview {
    duration: string;
    workWeekRatio: number;
    activities: number;
    issueOverviewList: IssueOverview[];
}
