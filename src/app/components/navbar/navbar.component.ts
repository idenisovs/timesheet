import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { ColorModeService } from '../../services/color-mode.service';

@Component({
    selector: 'app-navbar',
    imports: [
        RouterLink,
        RouterLinkActive,
        NgbCollapse
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isMenuCollapsed = true

  get ColorMode() {
    return this.colorModeService.ColorMode;
  }

  constructor(private colorModeService: ColorModeService) {}
}
