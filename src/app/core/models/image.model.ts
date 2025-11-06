import {Breed} from './breed.model';

export interface Image {
  id: string;
  width: number;
  height: number;
  url: string;
  breeds?: Breed[];
}
