import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DailyActivityItemService {

  constructor() { }

  public getTwoDigitFormat(x: number): string {
    if (x > 9) {
      return String(x);
    } else {
      return `0${x}`;
    }
  }

  public getTimeString(date: Date): string {
    const result: string[] = [];

    const hours = date.getHours();

    result.push(this.getTwoDigitFormat(hours));

    const minutes = date.getMinutes();

    result.push(this.getTwoDigitFormat(minutes));

    return result.join(':');
  }

  public getDateObj(time: string): Date {
    const [hh, mm] = time.split(':');

    const date = new Date();

    date.setHours(Number(hh));
    date.setMinutes(Number(mm));

    return date;
  }

  getCurrentTime(): string {
    const date = new Date();
    const [hh, mm] = date.toTimeString().split(':');
    return `${hh}:${mm}`;
  }
}
