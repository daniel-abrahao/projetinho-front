import {Routes} from '@angular/router';
import {BreedsComponent} from './breeds/breeds.component';
import {BreedDetailComponent} from './breed-detail/breed-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: BreedsComponent,
  },
  {
    path: ':breedId',
    component: BreedDetailComponent,
  }
]
