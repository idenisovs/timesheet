import { Injectable } from '@angular/core';
import parseDuration from 'parse-duration';
import { duration } from 'yet-another-duration';

@Injectable({
  providedIn: 'root'
})
export class DurationService {
  private static readonly DURATION_CONFIG = {
    units: {
      min: 'minutes',
      max: 'hours'
    }
  };

  constructor() { }

  public toMs(durationStr: string): number {
    return parseDuration(durationStr) ?? 0;
  }

  public toStr(durationMs: number): string {
    return duration(durationMs, DurationService.DURATION_CONFIG).toString();
  }

  public sum(durationStr: string[]): string {
    const totalDuration = durationStr.reduce((result: number, value: string) => {
      const ms = this.toMs(value);
      return result + ms;
    }, 0);

    return this.toStr(totalDuration);
  }
}
