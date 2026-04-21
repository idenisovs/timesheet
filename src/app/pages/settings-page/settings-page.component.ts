import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SettingsService } from '../../services/settings.service';
import { AppSettings } from '../../entities';

@Component({
	selector: 'app-settings-page',
	imports: [ReactiveFormsModule],
	templateUrl: './settings-page.component.html',
	styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent implements OnInit, OnDestroy {
	private readonly settingsService = inject(SettingsService);
	private readonly fb = inject(NonNullableFormBuilder);
	private formSub!: Subscription;

	form = this.fb.group({
		isTimeRoundingEnabled: [false],
	});

	ngOnInit() {
		this.form.patchValue(this.settingsService.settings$());

		this.formSub = this.form.valueChanges.subscribe((value: Partial<AppSettings>) => {
			this.settingsService.update(value);
		});
	}

	ngOnDestroy() {
		this.formSub.unsubscribe();
	}
}
