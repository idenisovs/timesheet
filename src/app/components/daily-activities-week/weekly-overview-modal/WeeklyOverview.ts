import { IssueOverview } from './IssueOverview';

export interface WeeklyOverview {
    duration: string;
    activities: number;
    issueOverviewList: IssueOverview[];
}
