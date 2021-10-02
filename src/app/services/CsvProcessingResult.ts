import { CsvRecord } from '../dto';

export default interface CsvProcessingResult {
  recordsCount: number;
  from: string;
  till: string;
  result: CsvRecord[];
}
