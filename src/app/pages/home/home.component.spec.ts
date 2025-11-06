import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { DogApiService } from '../../core/services/dog-api.service';
import { of } from 'rxjs';
import { Image } from '../../core/models/image.model';

class MockDogApiService {
  getRandomImage() {
    return of({ id: '1', url: 'test-url' } as Image);
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: DogApiService, useClass: MockDogApiService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch a random image on init', () => {
    expect(component.image).not.toBeNull();
    expect(component.image?.id).toBe('1');
    expect(component.image?.url).toBe('test-url');
  });
});
