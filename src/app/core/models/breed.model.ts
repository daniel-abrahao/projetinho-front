import {MixedMetric} from './mixed-metric.model';
import {Image} from './image.model';

export interface Breed {
  id: number;
  weight: MixedMetric;
  height: MixedMetric;
  name: string;
  bred_for: string;
  breed_group: string;
  life_span: string;
  temperament: string;
  origin: string;
  reference_image_id: string;
  image?: Image;
}
