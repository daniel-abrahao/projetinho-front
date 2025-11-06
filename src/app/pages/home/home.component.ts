import {Component, inject, OnInit} from '@angular/core';
import {DogApiService} from '../../core/services/dog-api.service';
import {Image} from '../../core/models/image.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly dogApiService = inject(DogApiService);

  image: Image | null = null;

  ngOnInit(): void {
    this.dogApiService.getRandomImage().subscribe(image => {
      this.image = image
    })
  }
}
