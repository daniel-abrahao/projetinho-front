import {Component, inject, OnInit} from '@angular/core';
import {DogApiService} from '../../../core/services/dog-api.service';
import {Breed} from '../../../core/models/breed.model';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-breeds',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, RouterLink],
  templateUrl: './breeds.component.html',
  styleUrl: './breeds.component.scss'
})
export class BreedsComponent implements OnInit {
  private readonly dogApiService = inject(DogApiService);
  displayedColumns: string[] = ['name', 'bred_for', 'breed_group', 'life_span', 'temperament'];
  dataSource = new MatTableDataSource<Breed>();
  pageSize: number = 5;
  pageIndex: number = 0;
  length?: number;
  loading = true;

  ngOnInit() {
    this.updateList();
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.updateList();
  }

  private updateList() {
    this.loading = true;
    this.dogApiService.getBreeds(this.pageSize, this.pageIndex).subscribe(paginatedBreeds => {
      this.length = paginatedBreeds.pagination.count;
      this.pageSize = paginatedBreeds.pagination.limit;
      this.pageIndex = paginatedBreeds.pagination.page;
      this.dataSource.data = paginatedBreeds.data;
      this.loading = false;
    });
  }
}
