import { Step } from './Step';

export class Workflow<TContext> {
	constructor(private readonly steps: readonly Step<TContext>[]) {}

	public async run(context: TContext): Promise<TContext> {
		for (const step of this.steps) {
			await step.execute(context);
		}

		return context;
	}
}
