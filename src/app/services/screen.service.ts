import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScreenService implements OnDestroy {
  private readonly isMobileSubject = new BehaviorSubject<boolean>(this.isMobile());
  private readonly resizeEventSub: Subscription;

  public get isMobile$(): Observable<boolean> {
    return this.isMobileSubject.asObservable();
  }

  constructor() {
    this.resizeEventSub = fromEvent(window, 'resize')
      .pipe(
        map(() => this.isMobile()),
        distinctUntilChanged()
      )
      .subscribe((value: boolean) => {
        this.isMobileSubject.next(value)
      });
  }

  ngOnDestroy() {
    this.resizeEventSub.unsubscribe();
  }

  private isMobile(): boolean {
    return window.innerWidth < 768;
  }
}
