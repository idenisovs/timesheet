import { Component, Input } from '@angular/core';
import { NgbDropdownItem } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-menu-item',
	imports: [
		NgbDropdownItem,
	],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent {
  @Input()
  label!: string;

  @Input()
  icon!: string;
}
