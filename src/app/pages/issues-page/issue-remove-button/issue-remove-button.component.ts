import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-issue-remove-button',
    imports: [
    NgbTooltip
],
    templateUrl: './issue-remove-button.component.html',
    styleUrl: './issue-remove-button.component.scss'
})
export class IssueRemoveButtonComponent {
  @Input()
  disabled = false;

  @Output()
  remove = new EventEmitter<void>();

  displayConfirmationDialog() {
    if (confirm('Are you sure want to remove this issue?')) {
      this.remove.emit();
    }
  }
}
