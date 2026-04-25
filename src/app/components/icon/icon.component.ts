import { Component, input } from '@angular/core';

type IconVariant = 'primary' | 'info' | 'warning' | 'danger' | 'success' | 'secondary';

@Component({
	selector: 'app-icon',
	imports: [],
	templateUrl: './icon.component.html',
	styleUrl: './icon.component.scss',
})
export class IconComponent {
	variant = input<IconVariant>();
}
