import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { Actions } from '../../services/Actions';
import { ActionsService } from '../../services/actions.service';

@Component({
  selector: 'app-page-action-button',
  standalone: true,
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './page-action-button.component.html',
  styleUrl: './page-action-button.component.scss'
})
export class PageActionButtonComponent {
  @Input()
  icon?: string;

  @Input()
  action?: Actions;

  @Output()
  click = new EventEmitter<void>();

  constructor(private actionsService: ActionsService) {}

  handleClick() {
    if (this.action) {
      this.actionsService.on.emit(this.action);
    }
  }
}
