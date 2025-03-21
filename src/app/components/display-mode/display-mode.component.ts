import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { ScreenService } from '../../services/screen.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-display-mode',
  standalone: true,
  imports: [],
  templateUrl: './display-mode.component.html',
  styleUrl: './display-mode.component.scss'
})
export class DisplayModeComponent implements OnInit, OnDestroy {
  public isMobile = false;

  private screenService = inject(ScreenService);

  private screenServiceSub: Subscription | null = null;

  ngOnInit() {
    this.screenServiceSub = this.screenService.isMobile$.subscribe(value => {
      this.isMobile = value;
    });
  }

  ngOnDestroy() {
    this.screenServiceSub?.unsubscribe();
  }
}
