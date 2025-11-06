import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreedsComponent } from './breeds.component';
import { DogApiService } from '../../../core/services/dog-api.service';
import { of } from 'rxjs';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';
import { Breed } from '../../../core/models/breed.model';

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

describe('BreedsComponent', () => {
  let component: BreedsComponent;
  let fixture: ComponentFixture<BreedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreedsComponent],
      providers: [
        { provide: DogApiService, useClass: MockDogApiService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch breeds on init', () => {
    expect(component.dataSource.data.length).toBe(1);
    expect(component.length()).toBe(1);
    expect(component.pageSize()).toBe(5);
    expect(component.pageIndex()).toBe(0);
  });

  it('should handle page events', () => {
    const dogApiService = TestBed.inject(DogApiService);
    const getBreedsSpy = jest.spyOn(dogApiService, 'getBreeds');

    component.handlePageEvent({ length: 100, pageSize: 10, pageIndex: 1 });

    expect(component.length()).toBe(1);
    expect(component.pageSize()).toBe(5);
    expect(component.pageIndex()).toBe(0);
    expect(getBreedsSpy).toHaveBeenCalledWith(10, 1);
  });
});
