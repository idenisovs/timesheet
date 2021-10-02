import CsvRecord from '../dto/CsvRecord';

export default interface CsvProcessingResult {
  recordsCount: number;
  from: string;
  till: string;
  result: CsvRecord[];
}
