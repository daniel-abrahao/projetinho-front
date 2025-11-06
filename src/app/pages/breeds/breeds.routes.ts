import {Routes} from '@angular/router';
import {BreedsComponent} from './breeds/breeds.component';
import {BreedDetailComponent} from './breed-detail/breed-detail.component';
import {EditComponent} from './edit/edit.component';

export const routes: Routes = [
  {
    path: '',
    component: BreedsComponent,
  },
  {
    path: 'edit/:breedId',
    component: EditComponent,
  },
  {
    path: ':breedId',
    component: BreedDetailComponent,
  }
]
