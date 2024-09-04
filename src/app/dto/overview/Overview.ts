import { IssueOverview } from './IssueOverview';

export interface Overview {
    duration: string;
    durationRatio: number;
    activities: number;
    issueOverviewList: IssueOverview[];
}
