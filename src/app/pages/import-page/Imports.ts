export interface ImportedProject {
  id: string;
  name: string;
  keys: string;
  description: string;
  createdAt: string;
}

export interface ImportedIssue {
  id: string;
  key: string;
  name: string;
  duration: string;
  estimate: string;
  createdAt: string;
}

export interface ImportedActivity {
  id: string;
  name: string;
  date: string;
  from: string;
  till: string;
  duration: string;
  weekId: string;
  dayId: string;
}
