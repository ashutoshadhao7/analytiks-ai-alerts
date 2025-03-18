export interface DifferenceInterface {
  previousWeek: number;
  currentWeek: number;
  division: number;
  direction: 'Positive' | 'Negative';
  location: string;
}
