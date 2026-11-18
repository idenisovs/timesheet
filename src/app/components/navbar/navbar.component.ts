import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbCollapse, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { ColorModeService } from '@services/color-mode.service';
import { SettingsService } from '@services/settings.service';

@Component({
    selector: 'app-navbar',
    imports: [
        RouterLink,
        RouterLinkActive,
        NgbCollapse,
        NgbPopover
    ],
    templateUrl: './navbar.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  protected readonly settings = inject(SettingsService).settings$;
  protected readonly colorModeService = inject(ColorModeService);

  isMenuCollapsed = true

  get ColorMode() {
    return this.colorModeService.ColorMode;
  }
}
