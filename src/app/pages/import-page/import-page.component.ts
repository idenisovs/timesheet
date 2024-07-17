import { Component } from '@angular/core';

@Component({
  selector: 'app-import-page',
  standalone: true,
  imports: [],
  templateUrl: './import-page.component.html',
  styleUrl: './import-page.component.scss'
})
export class ImportPageComponent {
  getFile(event: Event) {
    const target = event.target as HTMLInputElement;

    if (!target.files) {
      return;
    }

    const file = target.files.item(0);

    if (!file) {
      return;
    }

    console.log(file);
  }
}
