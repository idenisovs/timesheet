import { IssueOverview } from './IssueOverview';
import { ActivityOverview } from './ActivityOverview';

export interface WeeklyOverview {
    duration: string;
    workWeekRatio: number;
    activities: number;
    issueOverviewList: IssueOverview[];
    generalActivityOverviewList: ActivityOverview[];
}
