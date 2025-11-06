import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import {map, Observable, of, tap} from 'rxjs';
import {PaginatedResponse} from "../models/paginated-response.model";
import {Breed} from '../models/breed.model';
import {Image} from '../models/image.model';

@Injectable({
  providedIn: 'root'
})
export class DogApiService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = '/api';

  getBreeds(limit: number = 10, page: number = 1) {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('page', page.toString());
    return this.http.get<Breed[]>(`${this.API_URL}/v1/breeds`, { params, observe: 'response' })
      .pipe(map(DogApiService.mapToPaginatedResponse));
  }

  searchBreeds(query: string, limit: number = 10, page: number = 1) {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', limit.toString())
      .set('page', page.toString());
    return this.http.get<Breed[]>(`${this.API_URL}/v1/breeds/search`, { params, observe: 'response' })
      .pipe(map(DogApiService.mapToPaginatedResponse));
  }

  getRandomImage() {
    const storageKey = 'randomImage';
    const localCacheExpire = localStorage.getItem(`${storageKey}Expire`);
    let observable: Observable<Image[]>;

    if (localCacheExpire && new Date(parseInt(localCacheExpire, 10)).getTime() > new Date().getTime()) {
      const localCache = JSON.parse(localStorage.getItem(storageKey)!) as Image[];
      observable = of(localCache);
    } else {
      observable = this.http.get<Image[]>(`${this.API_URL}/v1/images/search?has_breeds=1`);
    }

    return observable
      .pipe(
        tap(images => {
          localStorage.setItem(`${storageKey}Expire`, (new Date().getTime() + 60*60*1000).toString());
          localStorage.setItem(storageKey, JSON.stringify(images));
        }),
        map(result => {
          if (result && result.length) {
            return result[0];
          }
          return null;
        }),
      );
  }

  getImages(limit: number, page: number) {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('page', page.toString());
    return this.http.get<Image[]>(`${this.API_URL}/v1/images/search`, { params, observe: 'response' })
      .pipe(map(DogApiService.mapToPaginatedResponse));
  }

  private static mapToPaginatedResponse<T>(response: HttpResponse<T>): PaginatedResponse<T> {
    const paginationCount = Number(response.headers.get('pagination-count'));
    const paginationLimit = Number(response.headers.get('pagination-limit'));
    const paginationPage = Number(response.headers.get('pagination-page'));

    return {
      data: response.body as T,
      pagination: {
        count: paginationCount,
        limit: paginationLimit,
        page: paginationPage,
      },
    };
  }
}
