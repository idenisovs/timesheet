import { Component, computed, effect, input, output, signal } from '@angular/core';

@Component({
	selector: 'app-time-belt',
	imports: [],
	templateUrl: './time-belt.component.html',
	styleUrl: './time-belt.component.scss',
})
export class TimeBeltComponent {
	public readonly count = input.required<number>();
	public readonly value = input(0);

	public readonly valuePicked = output<number>();

	protected readonly itemHeight = 40;
	protected readonly visibleCount = 5;

	protected readonly values = computed(() => {
		return Array.from({ length: this.count() }, (_, value) => value);
	});

	protected readonly offset = signal(this.offsetForValue(0));

	private readonly isDragging = signal(false);
	private startY = 0;
	private startOffset = 0;

	constructor() {
		effect(() => {
			this.offset.set(this.offsetForValue(this.value()));
		});
	}

	protected get ViewportHeight(): number {
		return this.itemHeight * this.visibleCount;
	}

	protected get CenterIndex(): number {
		return Math.floor((this.visibleCount - 1) / 2);
	}

	protected readonly StripTransform = computed(() => {
		return `translateY(${this.offset()}px)`;
	});

	protected readonly SelectedValue = computed(() => {
		const raw = this.CenterIndex - this.offset() / this.itemHeight;
		return this.clampValue(Math.round(raw));
	});

	protected onPointerDown(event: PointerEvent) {
		this.isDragging.set(true);
		this.startY = event.clientY;
		this.startOffset = this.offset();

		const target = event.target as HTMLElement;
		target.setPointerCapture(event.pointerId);
	}

	protected onPointerMove(event: PointerEvent) {
		if (!this.isDragging()) {
			return;
		}

		const diff = event.clientY - this.startY;
		this.offset.set(this.clampOffset(this.startOffset + diff));
	}

	protected onPointerUp() {
		if (!this.isDragging()) {
			return;
		}

		this.isDragging.set(false);

		const snapped = this.offsetForValue(this.SelectedValue());
		this.offset.set(snapped);
		this.valuePicked.emit(this.SelectedValue());
	}

	protected format(value: number): string {
		return value.toString().padStart(2, '0');
	}

	private offsetForValue(value: number): number {
		return (this.CenterIndex - value) * this.itemHeight;
	}

	private clampOffset(value: number): number {
		const max = this.offsetForValue(0);
		const min = this.offsetForValue(this.count() - 1);

		if (value > max) {
			return max;
		}

		if (value < min) {
			return min;
		}

		return value;
	}

	private clampValue(value: number): number {
		if (value < 0) {
			return 0;
		}

		if (value > this.count() - 1) {
			return this.count() - 1;
		}

		return value;
	}
}
