# Day Mobile — Component Tree

The component tree rendered for the mobile version of a single day, starting from
`DayMobileComponent` (`day-mobile.component.ts`).

Notation: `[name]` is an input, `(name)` is an output.

```mermaid
flowchart TD
	DayComp["DayComponent<br>app-day"]:::outside
	DayDesktop["DayDesktopComponent<br>app-day-desktop"]:::outside

	DayMobile["DayMobileComponent<br>app-day-mobile"]:::root

	MobileHeader["DayMobileHeaderComponent<br>app-day-mobile-header"]
	DayHeader["DayHeaderComponent<br>app-day-header"]:::outside
	DailyOverview["DailyOverviewModalComponent"]:::modal

	ActivityTimes["ActivityTimesComponent<br>app-activity-times"]
	MobileActivity["DayMobileActivityComponent<br>app-day-mobile-activity"]
	Category["ActivityCategoryComponent<br>app-activity-category"]
	Duration["ActivityDurationComponent<br>app-activity-duration"]

	EditModal["ActivityEditModalComponent<br>app-activity-edit-modal"]:::modal
	Adjacent["AdjacentActivityComponent<br>app-adjacent-activity<br>&times;2 — previous / next"]
	NameInput["ActivityNameInputComponent<br>app-activity-name-input"]
	TimeInput["ActivityTimeInputComponent<br>app-activity-time-input<br>&times;2 — From / Till"]
	DurationInput["ActivityDurationInputComponent<br>app-activity-duration-input"]
	Confirmation(["ConfirmationDirective<br>appConfirmation"]):::directive
	ConfirmModal["ConfirmationModalComponent"]:::modal

	TimePicker["TimePickerModalComponent<br>app-time-picker-modal"]:::modal
	TimeBelt["TimeBeltComponent<br>app-time-belt<br>&times;2 — hours / minutes"]

	DayComp -->|"[day] [activities] · (changes)"| DayMobile
	DayMobile -.->|extends| DayDesktop

	DayMobile -->|"[day] · (add)"| MobileHeader
	MobileHeader -->|"[day] · (add)"| DayHeader
	DayHeader ==>|"NgbModal"| DailyOverview

	DayMobile -->|"[activity]"| ActivityTimes
	DayMobile -->|"[activity] · (edit)"| MobileActivity
	MobileActivity -->|"[name] [color]"| Category
	MobileActivity -->|"[duration] [color]"| Duration

	DayMobile ==>|"NgbModal — openEditModal()"| EditModal

	EditModal -->|"[time] [activity] [fallbackLabel]"| Adjacent
	EditModal -->|"[control]"| NameInput
	EditModal -->|"[label] [fieldId] [control]"| TimeInput
	EditModal -->|"[control]"| DurationInput
	EditModal -->|"[appConfirmation] · (confirmed)"| Confirmation

	Confirmation ==>|"NgbModal — when dirty"| ConfirmModal
	TimeInput ==>|"NgbModal — openTimePicker()"| TimePicker
	TimePicker -->|"[count] [value] · (valuePicked)"| TimeBelt

	classDef root stroke-width:3px
	classDef modal stroke-dasharray:5 3
	classDef directive stroke-dasharray:2 2
	classDef outside color:#888,stroke:#888
```

## Edges

| Style | Meaning |
| --- | --- |
| Solid arrow | Template containment — the child sits in the parent's template |
| Thick arrow | Opened imperatively through `NgbModal`, not present in any template |
| Dotted arrow | Class inheritance |
| Grey nodes | Components living outside of `day-mobile/`, drawn for context |

## Notes

- `DayMobileComponent` extends `DayDesktopComponent` and reuses its `FormArray` of
  `ActivityFormGroup`. The desktop template renders the inputs inline for the whole day,
  while the mobile one edits a single activity at a time inside `ActivityEditModalComponent`.
- `ActivityEditModalComponent` is not referenced from `day-mobile.component.html` — it is
  opened by `openEditModal()` and receives its inputs by assignment on
  `modalRef.componentInstance`. Its result (`save` / `remove` / `add` / `cancel`) drives what
  `DayMobileComponent` does next.
- The inputs of the edit modal are bound to the `FormControl`s of the very same
  `ActivityFormGroup` the day holds, so edits are visible to the day before being saved.
- Saving never happens in the modal: it closes with a result, and `DayMobileComponent.save()`
  emits `changes` up to `DayComponent`, which persists and pushes the activities back down.
