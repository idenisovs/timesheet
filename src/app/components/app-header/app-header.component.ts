import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppVersionComponent } from '../app-version/app-version.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
	imports: [
		AppVersionComponent,
		RouterOutlet,
	],
  templateUrl: './app-header.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {

}
