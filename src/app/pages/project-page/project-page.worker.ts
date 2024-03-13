/// <reference lib="webworker" />

import { Activity, Project, Sheet } from '../../dto';
import { ProjectPageWorkerTasks } from './ProjectPageWorkerTasks';
import SheetStore from '../../store/SheetStore';

interface Task {
  task: ProjectPageWorkerTasks,
  project: Project
}

addEventListener('message', async ({ data }: MessageEvent<Task>) => {
  const { task, project } = data;

  if (task !== ProjectPageWorkerTasks.AGGREGATE_ISSUES) {
    throw new Error(`Wrong task ${data.task} specified!`);
  }

  const db = new SheetStore();

  const activities = await getProjectActivities(db, project);

  postMessage(activities);
});

async function getProjectActivities(db: SheetStore, project: Project): Promise<Activity[]> {
  const sheets = await db.sheet.filter((sheet: Sheet) => {
    return sheet.activities.some((activity: Activity) => relatesToProject(activity, project));
  }).toArray();

  return  sheets.reduce((result: Activity[], sheet: Sheet) => {
    const relatedActivities = sheet.activities.filter((activity: Activity) => relatesToProject(activity, project));

    result.push(...relatedActivities);

    return result;
  }, []);
}

function relatesToProject(activity: Activity, project: Project): boolean {
  const [projectIssueKey] = activity.name.split('-');

  if (project.keys.includes(projectIssueKey)) {
    return true;
  }

  const [projectKey] = activity.name.split(':');

  return project.keys.includes(projectKey);
}
