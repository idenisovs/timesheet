export interface Step<TContext> {
	execute(context: TContext): Promise<void>;
}
