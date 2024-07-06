export class Issue {
  id = crypto.randomUUID();
  key = '';
  name = '';
  activities: string[] = [];
  duration = '0m';
  estimate?: string;
  createdAt = new Date();

  constructor(props?: Partial<Issue>) {
    if (!props) {
      return;
    }

    Object.assign(this, props);

    if (props.createdAt) {
      this.createdAt = new Date(props.createdAt);
    }
  }
}
