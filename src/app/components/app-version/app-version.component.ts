import { Component } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';

import { version, build } from '../../../environments/version';

@Component({
	selector: 'app-version',
	imports: [NgbTooltip],
	templateUrl: './app-version.component.html',
	styleUrl: './app-version.component.scss',
})
export class AppVersionComponent {
	version = version;
	buildAgo = DateTime.fromISO(build).toRelative();
	changelogUrl = 'https://github.com/idenisovs/timesheet/blob/master/docs/changelog.md';
}
