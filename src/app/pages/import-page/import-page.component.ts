import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-page',
  standalone: true,
  imports: [],
  templateUrl: './import-page.component.html',
  styleUrl: './import-page.component.scss'
})
export class ImportPageComponent {
  async getFile(event: Event) {
    const target = event.target as HTMLInputElement;

    if (!target.files) {
      return;
    }

    const file = target.files.item(0);

    if (!file) {
      return;
    }

    console.log(file);

    const workbook = XLSX.read(await file.arrayBuffer());

    console.log(workbook);

    const activitiesSheet = workbook.Sheets['Activities'];

    const activities = XLSX.utils.sheet_to_json(activitiesSheet);

    console.log(activities);
  }
}
