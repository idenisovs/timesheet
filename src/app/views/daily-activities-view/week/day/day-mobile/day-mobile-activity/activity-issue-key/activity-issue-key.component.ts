import { Component, input, InputSignal } from '@angular/core';

@Component({
	selector: 'app-activity-issue-key',
	imports: [],
	templateUrl: './activity-issue-key.component.html',
	styleUrl: './activity-issue-key.component.scss',
})
export class ActivityIssueKeyComponent {
	public issueKey: InputSignal<string> = input.required<string>();
	public color: InputSignal<string | undefined> = input<string | undefined>(undefined);

	protected darkerColor(color: string | undefined): string {
		if (!color) {
			return '';
		}
		return `color-mix(in srgb, ${color} 85%, black)`;
	}
}
