import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComponent } from './edit.component';
import {DogApiService} from '../../../core/services/dog-api.service';
import {of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  class MockDogApiService {
    getBreed(limit: number, page: number) {
      return of({});
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditComponent],
      providers: [
        { provide: DogApiService, useClass: MockDogApiService },
        { provide: ActivatedRoute, useValue: { paramMap: of({get: jest.fn().mockReturnValue('123')}) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
