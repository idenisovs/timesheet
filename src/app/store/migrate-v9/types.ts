export interface WeekRecord {
	id: string;
	from: string;
	till: string;
}

export interface DayRecord {
	id: string;
	date: string;
	weekId: string;
}
