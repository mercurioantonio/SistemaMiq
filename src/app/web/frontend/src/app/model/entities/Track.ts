import { ITrack } from "../interfaces/ITrack";

export class Track implements ITrack {

  timestamp: string = "";
  pressure: number | undefined;
  position: string = "";
  temperature: number | undefined;
  omega: number | undefined;
  speed: number | undefined;
  carId: string = "";
  id: string = "";

  constructor(data?: ITrack) {
    if (data) {
      // tslint:disable-next-line:forin
      for (const property in data) {
        (this as any)[property] = (data as any)[property];
      }
    }
  }

  public fromJS(data: any): Track {
    const result: Track = new Track();
    result.init(data);
    return result;
  }

  init(data?: Track): void {
    if (data) {
      this.id = data.id;
      this.carId = data.carId;
      this.timestamp = data.timestamp;
      this.pressure = data.pressure;
      this.position = data.position;
      this.temperature = data.temperature;
      this.omega = data.omega;
      this.speed = data.speed;
    }
  }

  toJSON(data?: any): any {
    data = typeof data === 'object' ? data : {};
    data.id = this.id;
    data.carId = this.carId;
    data.timestamp = this.timestamp;
    data.pressure = this.pressure;
    data.position = this.position;
    data.temperature = this.temperature;
    data.omega = this.omega;
    data.speed = this.speed;
    return data;
  }
}
