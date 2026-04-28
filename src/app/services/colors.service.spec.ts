import { TestBed } from '@angular/core/testing';
import { ColorsService } from './colors.service';

describe('ColorsService', () => {
    let service: ColorsService;

    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({});
        service = TestBed.inject(ColorsService);
    });

    it('should return all 50 colors in column-first order, then wrap back to the start', () => {
        const expected: string[] = [];

        for (let step = 0; step < 50; step++) {
            const index = (step % 10) * 5 + Math.floor(step / 10);
            expected.push((service as any).palette[index]);
        }

        const result: string[] = [];
        for (let i = 0; i < 51; i++) {
            result.push(service.getNextColor());
        }

        expect(result.slice(0, 50)).toEqual(expected);
        expect(result[50]).toEqual(expected[0]);
    });
});
