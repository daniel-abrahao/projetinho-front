import {Component, inject, OnInit} from '@angular/core';
import {DogApiService} from '../../../core/services/dog-api.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Breed} from '../../../core/models/breed.model';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-breed-detail',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIcon],
  templateUrl: './breed-detail.component.html',
  styleUrl: './breed-detail.component.scss'
})
export class BreedDetailComponent implements OnInit {
  private readonly dogApiService = inject(DogApiService);
  private readonly activatedRoute = inject(ActivatedRoute);

  breed?: Breed;

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.dogApiService.getBreed(params.get('breedId')!).subscribe(breed => {
        this.breed = breed;
        if (!breed.image && breed.reference_image_id) {
          this.dogApiService.getImage(breed.reference_image_id).subscribe(image => {
            this.breed!.image = image;
          });
        }
      })
    });
  }
}
