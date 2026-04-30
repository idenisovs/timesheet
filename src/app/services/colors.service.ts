import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ColorsService {
    private readonly palette: string[] = [
        '#FF1744', '#FF4081', '#F50057', '#D500F9', '#651FFF',
        '#3D5AFE', '#2979FF', '#00B0FF', '#00E5FF', '#1DE9B6',
        '#00E676', '#76FF03', '#C6FF00', '#FFEA00', '#FFC400',
        '#FF6D00', '#FF3D00', '#F4511E', '#E91E63', '#9C27B0',
        '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
        '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B',
        '#FFC107', '#FF9800', '#FF5722', '#FF6B6B', '#FF8E53',
        '#FE6B8B', '#C471ED', '#845EC2', '#4B4FCC', '#0081CF',
        '#00C9A7', '#4FFBDF', '#F9F871', '#FF9671', '#FF6F91',
        '#B39CD0', '#926CF6', '#6A48D7', '#0090FF', '#00D4AA',
    ];

    private readonly storageKey = 'colors-service-step';
    private readonly hslStorageKey = 'colors-service-hsl-step';

    private get CurrentStep(): number {
		const currentStep = localStorage.getItem(this.storageKey) ?? '0';
        return parseInt(currentStep, 10);
    }

    private set CurrentStep(value: number) {
        localStorage.setItem(this.storageKey, String(value));
    }

    private get CurrentHslStep(): number {
        const currentStep = localStorage.getItem(this.hslStorageKey) ?? '0';
        return parseInt(currentStep, 10);
    }

    private set CurrentHslStep(value: number) {
        localStorage.setItem(this.hslStorageKey, String(value));
    }

    public getNextColor(): string {
        const step = this.CurrentStep;
        const index = (step % 10) * 5 + Math.floor(step / 10);
        this.CurrentStep = (step + 1) % 50;
        return this.palette[index];
    }

    public getNextColorHsl(): string {
        const step = this.CurrentHslStep;
        const hue = (step * 137) % 360;
        this.CurrentHslStep = step + 1;
        return `hsl(${hue}, 85%, 55%)`;
    }
}

