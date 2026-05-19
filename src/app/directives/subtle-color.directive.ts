import { afterEveryRender, Directive, ElementRef, inject, Renderer2 } from '@angular/core';

@Directive({
	selector: '[appSubtleColor]',
})
export class SubtleColorDirective {
	private el = inject(ElementRef);
	private renderer = inject(Renderer2);
	private lastRaw = '';

	constructor() {
		afterEveryRender(() => {
			const raw: string = this.el.nativeElement.style.backgroundColor;
			if (raw === this.transform(this.lastRaw)) {
				return;
			}
			this.lastRaw = raw;
			this.renderer.setStyle(this.el.nativeElement, 'background-color', this.transform(raw));
		});
	}

	private transform(color: string): string {
		if (!color) {
			return '';
		}
		return `color-mix(in srgb, ${color} 3%, transparent)`;
	}
}
