import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {DogApiService} from './dog-api.service';
import {Breed} from '../models/breed.model';
import {Image} from '../models/image.model';
import {PaginatedResponse} from '../models/paginated-response.model';
import {HttpResponse, provideHttpClient} from '@angular/common/http';

describe('DogApiService', () => {
  let service: DogApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        DogApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(DogApiService);
    httpTestingController = TestBed.inject(HttpTestingController);

    jest.spyOn(localStorage, 'getItem').mockReturnValue(null);
    jest.spyOn(localStorage, 'setItem').mockReturnValue(undefined);
    jest.spyOn(localStorage, 'removeItem').mockReturnValue(undefined);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve breeds with pagination', (done) => {
    const mockBreeds: Breed[] = [{
      id: 1,
      name: 'Poodle',
      bred_for: '',
      breed_group: '',
      life_span: '',
      temperament: ''
    } as unknown as Breed];
    const mockResponse: PaginatedResponse<Breed[]> = {
      data: mockBreeds,
      pagination: {count: 1, limit: 10, page: 1}
    };

    service.getBreeds(10, 1).subscribe(response => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpTestingController.expectOne('/api/v1/breeds?limit=10&page=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockBreeds, {headers: {'pagination-count': '1', 'pagination-limit': '10', 'pagination-page': '1'}});
  });

  it('should search breeds with a query and pagination', (done) => {
    const mockBreeds: Breed[] = [{
      id: 1,
      name: 'Poodle',
      bred_for: '',
      breed_group: '',
      life_span: '',
      temperament: ''
    } as unknown as Breed];
    const mockResponse: PaginatedResponse<Breed[]> = {
      data: mockBreeds,
      pagination: {count: 1, limit: 10, page: 1}
    };

    service.searchBreeds('poodle', 10, 1).subscribe(response => {
      expect(response).toEqual(mockResponse);
      done();
    });
    const req = httpTestingController.expectOne('/api/v1/breeds/search?q=poodle&limit=10&page=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockBreeds, {headers: {'pagination-count': '1', 'pagination-limit': '10', 'pagination-page': '1'}});
  });

  it('should retrieve a single breed by ID', (done) => {
    const mockBreed: Breed = {id: 1, name: 'Poodle', bred_for: '', breed_group: '', life_span: '', temperament: ''} as unknown as Breed;

    service.getBreed('1').subscribe(breed => {
      expect(breed).toEqual(mockBreed);
      done();
    });

    const req = httpTestingController.expectOne('/api/v1/breeds/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockBreed);
  });

  it('should retrieve a random image (cache miss)', (done) => {
    const mockImage: Image = {id: 'img1', url: 'url1', width: 100, height: 100};
    const mockImages: Image[] = [mockImage];

    jest.spyOn(localStorage, 'getItem').mockReturnValue(null);

    service.getRandomImage().subscribe(image => {
      expect(image).toEqual(mockImage);
      expect(localStorage.setItem).toHaveBeenCalledWith('randomImage', JSON.stringify(mockImages));
      expect(localStorage.setItem).toHaveBeenCalledWith('randomImageExpire', expect.any(String));
      done();
    });

    const req = httpTestingController.expectOne('/api/v1/images/search?has_breeds=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockImages);
  });

  it('should retrieve a random image from cache (cache hit)', (done) => {
    const mockImage: Image = {id: 'img2', url: 'url2', width: 100, height: 100};
    const mockImages: Image[] = [mockImage];
    const futureTime = (new Date().getTime() + 60 * 60 * 1000).toString();

    jest.spyOn(localStorage, 'getItem').mockImplementation((key: string) => {
      if (key === 'randomImage') return JSON.stringify(mockImages);
      if (key === 'randomImageExpire') return futureTime;
      return null;
    });

    service.getRandomImage().subscribe(image => {
      expect(image).toEqual(mockImage);
      expect(localStorage.getItem).toHaveBeenCalledWith('randomImage');
      expect(localStorage.getItem).toHaveBeenCalledWith('randomImageExpire');
      expect(httpTestingController.expectNone('/api/v1/images/search?has_breeds=1')).toBeUndefined(); // No HTTP request should be made
      done();
    });
  });

  it('should retrieve images with pagination', (done) => {
    const mockImages: Image[] = [{id: 'img1', url: 'url1', width: 100, height: 100}];
    const mockResponse: PaginatedResponse<Image[]> = {
      data: mockImages,
      pagination: {count: 1, limit: 10, page: 1}
    };

    service.getImages(10, 1).subscribe(response => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpTestingController.expectOne('/api/v1/images/search?limit=10&page=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockImages, {headers: {'pagination-count': '1', 'pagination-limit': '10', 'pagination-page': '1'}});
  });

  it('should retrieve a single image by ID', (done) => {
    const mockImage: Image = {id: 'img1', url: 'url1', width: 100, height: 100};

    service.getImage('img1').subscribe(image => {
      expect(image).toEqual(mockImage);
      done();
    });

    const req = httpTestingController.expectOne('/api/v1/images/img1');
    expect(req.request.method).toBe('GET');
    req.flush(mockImage);
  });
});
