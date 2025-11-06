import {Component, inject, OnInit, signal} from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import {DogApiService} from '../../../core/services/dog-api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Breed} from '../../../core/models/breed.model';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButton
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  private readonly dogApiService = inject(DogApiService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  breedForm!: FormGroup;
  breedId = signal<string|null>(null);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const breedId = params.get('breedId');
      if (breedId) {
        this.breedId.set(breedId);
        this.dogApiService.getBreed(breedId).subscribe(breed => {
          this.breedForm.patchValue(breed);
        })
      }
    });

    this.breedForm = new FormGroup({
      name: new FormControl('', Validators.required),
      bred_for: new FormControl(''),
      breed_group: new FormControl(''),
      life_span: new FormControl(''),
      temperament: new FormControl(''),
      weight: new FormGroup({
        imperial: new FormControl(''),
        metric: new FormControl('')
      }),
      height: new FormGroup({
        imperial: new FormControl(''),
        metric: new FormControl('')
      })
    });
  }

  onSubmit(): void {
    if (this.breedForm.valid) {
      alert('Desculpe, a API não permite alterar os dados.');
      if (this.breedId()) {
        this.router.navigate(['/breeds', this.breedId()]);
      } else {
        this.router.navigate(['/breeds']);
      }
    }
  }
}
