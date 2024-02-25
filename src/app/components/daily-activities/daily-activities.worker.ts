/// <reference lib="webworker" />

import SheetStore from '../../store/SheetStore';
import { Task } from '../../dto';
import { getTasks } from '../../utils/tasks';

addEventListener('message', async ({ data }: { data: 'updateTasks' }) => {
  if (data !== 'updateTasks') {
    throw new Error(`Unknown action ${data} is requested!`);
  }

  const db = new SheetStore();

  const sheets = await db.sheet.toArray()
  const tasks = getTasks(sheets);

  for (let task of tasks) {
    const existingTask = await db.tasks.where('key').equals(task.key).first();

    if (existingTask) {
      await db.tasks.update(existingTask, task);
    } else {
      await db.tasks.add(task as Task);
    }
  }

  const existingTasks = await db.tasks.toArray();

  for (let existingTask of existingTasks) {
    const task = tasks.find((item) => item.key === existingTask.key)

    if (!task) {
      await db.tasks.delete(existingTask.id);
    }
  }
});
