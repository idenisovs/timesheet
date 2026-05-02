import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

export enum BarPosition {
	Solo = 'solo',
	First = 'first',
	Middle = 'middle',
	Last = 'last',
}

@Component({
	selector: 'app-color-bar',
	imports: [
		NgClass,
	],
	templateUrl: './color-bar.component.html',
	styleUrl: './color-bar.component.scss',
})
export class ColorBarComponent {
	color = input.required<string>();
	position = input<BarPosition>(BarPosition.Solo);

	clicked = output<void>();
}
