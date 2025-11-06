import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreedDetailComponent } from './breed-detail.component';
import {of} from 'rxjs';
import {DogApiService} from '../../../core/services/dog-api.service';
import {PaginatedResponse} from '../../../core/models/paginated-response.model';
import {Breed} from '../../../core/models/breed.model';
import {ActivatedRoute} from '@angular/router';

describe('BreedDetailComponent', () => {
  let component: BreedDetailComponent;
  let fixture: ComponentFixture<BreedDetailComponent>;

  const mockPaginatedBreeds: PaginatedResponse<Breed[]> = {
    data: [{ id: 1, name: 'Beagle', bred_for: 'Hunting', breed_group: 'Hound', life_span: '12 - 15 years', temperament: 'Gentle, Intelligent' }] as Breed[],
    pagination: { count: 1, limit: 5, page: 0 }
  };
  class MockDogApiService {
    getBreeds(limit: number, page: number) {
      return of(mockPaginatedBreeds);
    }

    searchBreeds(term: string, limit: number, page: number) {
      return of(mockPaginatedBreeds);
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreedDetailComponent],
      providers: [
        { provide: DogApiService, useClass: MockDogApiService },
        { provide: ActivatedRoute, useValue: { paramMap: of({get: jest.fn().mockReturnValue('123')}) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
