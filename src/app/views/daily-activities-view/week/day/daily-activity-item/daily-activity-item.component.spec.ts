import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { DailyActivityItemComponent } from './daily-activity-item.component';
import { DailyActivityItemService } from './daily-activity-item.service';
import { ColorsService } from '../../../../../services/colors.service';
import { ActivityFormGroup } from '../DailyActivitiesForm';

function makeForm(overrides: {
	id?: string;
	name?: string;
	from?: string;
	till?: string;
	duration?: string;
	color?: string;
} = {}): ActivityFormGroup {
	return new FormGroup({
		id: new FormControl(overrides.id ?? 'test-id'),
		name: new FormControl(overrides.name ?? ''),
		from: new FormControl(overrides.from ?? ''),
		till: new FormControl(overrides.till ?? ''),
		duration: new FormControl(overrides.duration ?? ''),
		color: new FormControl(overrides.color ?? '#FF0000'),
	}) as ActivityFormGroup;
}

describe('DailyActivityItemComponent', () => {
	let fixture: ComponentFixture<DailyActivityItemComponent>;
	let component: DailyActivityItemComponent;
	let serviceSpy: jasmine.SpyObj<DailyActivityItemService>;
	let colorsSpy: jasmine.SpyObj<ColorsService>;
	let clipboardWriteSpy: jasmine.Spy;

	beforeEach(() => {
		serviceSpy = jasmine.createSpyObj<DailyActivityItemService>('DailyActivityItemService', [
			'handleFromChanges',
			'handleTillChanges',
			'handleDurationChanges',
			'setCurrentTime',
			'getPrefixFromName',
			'findColorForName',
			'isActivityUnique',
		]);
		serviceSpy.getPrefixFromName.and.returnValue('');
		serviceSpy.findColorForName.and.resolveTo(null);
		serviceSpy.isActivityUnique.and.resolveTo(true);

		colorsSpy = jasmine.createSpyObj<ColorsService>('ColorsService', ['getNextColorHsl']);
		colorsSpy.getNextColorHsl.and.returnValue('hsl(0, 85%, 55%)');

		clipboardWriteSpy = jasmine.createSpy('writeText').and.resolveTo();
		Object.defineProperty(navigator, 'clipboard', {
			value: { writeText: clipboardWriteSpy },
			configurable: true,
		});

		sessionStorage.clear();

		TestBed.configureTestingModule({
			imports: [DailyActivityItemComponent],
			providers: [
				{ provide: DailyActivityItemService, useValue: serviceSpy },
				{ provide: ColorsService, useValue: colorsSpy },
			],
		});
	});

	function createComponent(form = makeForm(), activities: ActivityFormGroup[] = []): ActivityFormGroup {
		fixture = TestBed.createComponent(DailyActivityItemComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('activityFormItem', form);
		fixture.componentRef.setInput('activities', activities);
		fixture.detectChanges();
		return form;
	}

	describe('getters and setters', () => {
		it('ActivityId returns id from form group', () => {
			createComponent(makeForm({ id: 'abc-123' }));
			expect(component.ActivityId).toBe('abc-123');
		});

		it('ActivityName returns name from form group', () => {
			createComponent(makeForm({ name: 'My Task' }));
			expect(component.ActivityName).toBe('My Task');
		});

		it('ActivityName setter updates form control', () => {
			const form = createComponent(makeForm({ name: '' }));
			component.ActivityName = 'Updated';
			expect(form.get('name')?.value).toBe('Updated');
		});

		it('ActivityColor returns color from form group', () => {
			createComponent(makeForm({ color: '#AABBCC' }));
			expect(component.ActivityColor).toBe('#AABBCC');
		});

		it('ActivityColor setter updates form control', () => {
			const form = createComponent(makeForm({ color: '#000000' }));
			component.ActivityColor = '#FFFFFF';
			expect(form.get('color')?.value).toBe('#FFFFFF');
		});

		it('CurrentPrefix delegates to service with current name', () => {
			serviceSpy.getPrefixFromName.and.returnValue('TST');
			createComponent(makeForm({ name: 'TST: task' }));
			expect(component.CurrentPrefix).toBe('TST');
			expect(serviceSpy.getPrefixFromName).toHaveBeenCalledWith('TST: task');
		});
	});

	describe('service delegation', () => {
		beforeEach(() => createComponent());

		it('handleFromChanges delegates to service', () => {
			component.handleFromChanges();
			expect(serviceSpy.handleFromChanges).toHaveBeenCalledWith(component.activityFormItem());
		});

		it('handleTillChanges delegates to service', () => {
			component.handleTillChanges();
			expect(serviceSpy.handleTillChanges).toHaveBeenCalledWith(component.activityFormItem());
		});

		it('handleDurationChanges delegates to service', () => {
			component.handleDurationChanges();
			expect(serviceSpy.handleDurationChanges).toHaveBeenCalledWith(component.activityFormItem());
		});

		it('setCurrentTime delegates "from" to service', () => {
			component.setCurrentTime('from');
			expect(serviceSpy.setCurrentTime).toHaveBeenCalledWith(component.activityFormItem(), 'from');
		});

		it('setCurrentTime delegates "till" to service', () => {
			component.setCurrentTime('till');
			expect(serviceSpy.setCurrentTime).toHaveBeenCalledWith(component.activityFormItem(), 'till');
		});
	});

	describe('copyActivityName', () => {
		it('does nothing when name is empty', async () => {
			createComponent(makeForm({ name: '' }));
			await component.copyActivityName();
			expect(clipboardWriteSpy).not.toHaveBeenCalled();
			expect(sessionStorage.getItem('clipboard')).toBeNull();
		});

		it('writes name to clipboard', async () => {
			createComponent(makeForm({ name: 'My Activity' }));
			await component.copyActivityName();
			expect(clipboardWriteSpy).toHaveBeenCalledWith('My Activity');
		});

		it('writes name to sessionStorage', async () => {
			createComponent(makeForm({ name: 'My Activity' }));
			await component.copyActivityName();
			expect(sessionStorage.getItem('clipboard')).toBe('My Activity');
		});
	});

	describe('pasteActivityName', () => {
		it('does nothing when sessionStorage has no clipboard value', async () => {
			createComponent();
			await component.pasteActivityName();
			expect(serviceSpy.findColorForName).not.toHaveBeenCalled();
		});

		it('sets activity name from sessionStorage', async () => {
			sessionStorage.setItem('clipboard', 'Pasted Task');
			const form = createComponent(makeForm({ name: '' }));
			await component.pasteActivityName();
			expect(form.get('name')?.value).toBe('Pasted Task');
		});

		it('triggers name change handling after paste', async () => {
			sessionStorage.setItem('clipboard', 'Pasted Task');
			serviceSpy.findColorForName.and.resolveTo('#112233');
			createComponent(makeForm({ name: '' }));
			await component.pasteActivityName();
			expect(serviceSpy.findColorForName).toHaveBeenCalled();
		});
	});

	describe('setTimeFromPreviousActivity', () => {
		it('copies previous activity till into current from', () => {
			const prev = makeForm({ till: '09:30' });
			const current = makeForm({ from: '' });
			createComponent(current, [prev, current]);
			fixture.componentRef.setInput('idx', 1);
			fixture.detectChanges();

			component.setTimeFromPreviousActivity();

			expect(current.get('from')?.value).toBe('09:30');
			expect(serviceSpy.handleFromChanges).toHaveBeenCalledWith(current);
		});

		it('returns early when previous activity has no till field', () => {
			const prev = new FormGroup({
				id: new FormControl('prev'),
				name: new FormControl('prev-name'),
			}) as unknown as ActivityFormGroup;
			const current = makeForm({ from: '08:00' });
			createComponent(current, [prev, current]);
			fixture.componentRef.setInput('idx', 1);
			fixture.detectChanges();

			component.setTimeFromPreviousActivity();

			expect(serviceSpy.handleFromChanges).not.toHaveBeenCalled();
			expect(current.get('from')?.value).toBe('08:00');
		});
	});

	describe('color change logic', () => {
		describe('prefixBasedColorChange', () => {
			it('does nothing when prefix is unchanged after init', async () => {
				serviceSpy.getPrefixFromName.and.returnValue('TST');
				const form = createComponent(makeForm({ name: 'TST: task', color: '#000000' }));
				// After effect: originalPrefix = 'TST'; CurrentPrefix is still 'TST'

				await component.handleNameChanges();

				expect(form.get('color')?.value).toBe('#000000');
				expect(serviceSpy.findColorForName).not.toHaveBeenCalled();
			});

			it('sets color from service when prefix changes and color is found', async () => {
				serviceSpy.getPrefixFromName.and.returnValue('');
				const form = createComponent(makeForm({ name: 'task', color: '#000000' }));
				// Change prefix
				serviceSpy.getPrefixFromName.and.returnValue('TST');
				serviceSpy.findColorForName.and.resolveTo('#AABBCC');

				await component.handleNameChanges();

				expect(form.get('color')?.value).toBe('#AABBCC');
				expect(colorsSpy.getNextColorHsl).not.toHaveBeenCalled();
			});

			it('generates a new color when prefix changes and no color is found', async () => {
				serviceSpy.getPrefixFromName.and.returnValue('');
				const form = createComponent(makeForm({ name: 'task', color: '#000000' }));
				// Change prefix
				serviceSpy.getPrefixFromName.and.returnValue('TST');
				serviceSpy.findColorForName.and.resolveTo(null);

				await component.handleNameChanges();

				expect(colorsSpy.getNextColorHsl).toHaveBeenCalled();
				expect(form.get('color')?.value).toBe('hsl(0, 85%, 55%)');
			});
		});

		describe('nameBasedColorChange', () => {
			it('sets color from service when a color is found for the name', async () => {
				const form = createComponent(makeForm({ name: 'My Activity', color: '#000000' }));
				serviceSpy.findColorForName.and.resolveTo('#CCDDEE');

				await component.handleNameChanges();

				expect(form.get('color')?.value).toBe('#CCDDEE');
				expect(colorsSpy.getNextColorHsl).not.toHaveBeenCalled();
			});

			it('generates a new color when original name is not unique', async () => {
				const form = createComponent(makeForm({ name: 'Repeated Task', color: '#000000' }));
				serviceSpy.findColorForName.and.resolveTo(null);
				serviceSpy.isActivityUnique.and.resolveTo(false);

				await component.handleNameChanges();

				expect(colorsSpy.getNextColorHsl).toHaveBeenCalled();
				expect(form.get('color')?.value).toBe('hsl(0, 85%, 55%)');
			});

			it('does not generate a new color when original name is unique', async () => {
				const form = createComponent(makeForm({ name: 'Unique Task', color: '#000000' }));
				serviceSpy.findColorForName.and.resolveTo(null);
				serviceSpy.isActivityUnique.and.resolveTo(true);

				await component.handleNameChanges();

				expect(colorsSpy.getNextColorHsl).not.toHaveBeenCalled();
				expect(form.get('color')?.value).toBe('#000000');
			});

			it('does not generate a new color when original name was empty', async () => {
				// Effect sets originalName = '' → isOriginalNameEmpty = true → requestColorChange exits early
				createComponent(makeForm({ name: '', color: '#000000' }));
				serviceSpy.findColorForName.and.resolveTo(null);
				serviceSpy.isActivityUnique.and.resolveTo(false);

				await component.handleNameChanges();

				expect(colorsSpy.getNextColorHsl).not.toHaveBeenCalled();
			});

			it('generates a new color only once per activity change', async () => {
				createComponent(makeForm({ name: 'Repeated Task', color: '#000000' }));
				serviceSpy.findColorForName.and.resolveTo(null);
				serviceSpy.isActivityUnique.and.resolveTo(false);

				await component.handleNameChanges();
				await component.handleNameChanges();

				expect(colorsSpy.getNextColorHsl).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe('constructor effect', () => {
		it('resets color change guard when activityFormItem input changes', async () => {
			createComponent(makeForm({ name: 'Repeated Task', color: '#000000' }));
			serviceSpy.findColorForName.and.resolveTo(null);
			serviceSpy.isActivityUnique.and.resolveTo(false);
			await component.handleNameChanges(); // isColorChanged = true

			expect(colorsSpy.getNextColorHsl).toHaveBeenCalledTimes(1);

			// Swap input → effect resets isColorChanged to false
			fixture.componentRef.setInput('activityFormItem', makeForm({ name: 'Another Repeated', color: '#111111' }));
			fixture.detectChanges();

			await component.handleNameChanges();
			expect(colorsSpy.getNextColorHsl).toHaveBeenCalledTimes(2);
		});
	});

	describe('outputs', () => {
		beforeEach(() => {
			createComponent();
			fixture.componentRef.setInput('isLast', true);
			fixture.detectChanges();
		});

		it('emits add when add button is clicked', () => {
			let emitted = false;
			component.add.subscribe(() => (emitted = true));

			fixture.nativeElement.querySelectorAll('.btn-outline-info')[0].click();

			expect(emitted).toBeTrue();
		});

		it('emits remove with activity id when remove button is clicked', () => {
			fixture.componentRef.setInput('activityFormItem', makeForm({ id: 'my-act-id' }));
			fixture.detectChanges();

			let emittedId: string | undefined;
			component.remove.subscribe((id: string) => (emittedId = id));

			fixture.nativeElement.querySelectorAll('.btn-outline-info')[1].click();

			expect(emittedId).toBe('my-act-id');
		});

		it('emits save when save button is clicked', () => {
			let emitted = false;
			component.save.subscribe(() => (emitted = true));

			fixture.nativeElement.querySelector('.btn-outline-primary').click();

			expect(emitted).toBeTrue();
		});
	});
});
