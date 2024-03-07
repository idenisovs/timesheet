import { Pipe, PipeTransform } from '@angular/core';

const months: Record<string, string> = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'April',
  '09': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December'
};

@Pipe({
  name: 'dateIndex',
  standalone: true
})
export class DateIndexPipe implements PipeTransform {

  transform(value: string): string {
    const [month, year] = value.split(', ');

    const monthName = months[month];

    return `${monthName}, ${year}`;
  }

}
