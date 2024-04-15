
export interface ITrack {
  timestamp: string ;
  pressure: number | undefined;
  position: string;
  temperature: number | undefined;
  omega: number | undefined;
  speed: number | undefined;
  carId: string;
  id: string;
}
