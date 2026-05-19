import { afterEveryRender, Directive, ElementRef, inject, Renderer2 } from '@angular/core';

@Directive({
	selector: '[appDarkerColor]',
})
export class DarkerColorDirective {
	private el = inject(ElementRef);
	private renderer = inject(Renderer2);
	private lastRaw = '';

	constructor() {
		afterEveryRender(() => {
			const raw: string = this.el.nativeElement.style.color;
			if (raw === this.transform(this.lastRaw)) {
				return;
			}
			this.lastRaw = raw;
			this.renderer.setStyle(this.el.nativeElement, 'color', this.transform(raw));
		});
	}

	private transform(color: string): string {
		if (!color) {
			return '';
		}
		return `color-mix(in srgb, ${color} 85%, black)`;
	}
}
