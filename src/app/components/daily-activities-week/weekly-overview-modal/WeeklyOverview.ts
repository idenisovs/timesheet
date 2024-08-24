import { IssueOverview } from './IssueOverview';
import { GeneralActivityOverview } from './GeneralActivityOverview';

export interface WeeklyOverview {
    duration: string;
    workWeekRatio: number;
    activities: number;
    issueOverviewList: IssueOverview[];
    generalActivityOverviewList: GeneralActivityOverview[];
}
