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
}
