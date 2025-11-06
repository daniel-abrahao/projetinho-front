import {Component, inject, OnInit, signal} from '@angular/core';
import {DogApiService} from '../../../core/services/dog-api.service';
import {Breed} from '../../../core/models/breed.model';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, filter, Observable, switchMap, tap} from 'rxjs';
import {PaginatedResponse} from '../../../core/models/paginated-response.model';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {DeleteConfirmationDialogComponent} from './delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-breeds',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, RouterLink, NgClass, MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './breeds.component.html',
  styleUrl: './breeds.component.scss'
})
export class BreedsComponent implements OnInit {
  private readonly dogApiService = inject(DogApiService);
  private readonly dialog = inject(MatDialog);
  pageSize = signal(5);
  pageIndex = signal(0);
  length = signal(0);
  loading = signal(true);

  searchControl = new FormControl('');

  displayedColumns: string[] = ['name', 'bred_for', 'breed_group', 'life_span', 'temperament', 'actions'];
  dataSource = new MatTableDataSource<Breed>();

  ngOnInit() {
    this.updateList();
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.updateList();
    });
  }

  handlePageEvent(e: PageEvent) {
    this.length.set(e.length);
    this.pageSize.set(e.pageSize);
    this.pageIndex.set(e.pageIndex);
    this.updateList();
  }

  openDeleteConfirmationDialog(breed: Breed): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '300px',
      data: { name: breed.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alert("Desculpa, a funcionalidade não está disponível na API");
      }
    });
  }

  private updateList() {
    this.loading.set(true);

    let observable: Observable<PaginatedResponse<Breed[]>>;;
    if (this.searchControl.value?.trim()) {
      observable = this.dogApiService.searchBreeds(this.searchControl.value!, this.pageSize(), this.pageIndex())
    } else {
      observable = this.dogApiService.getBreeds(this.pageSize(), this.pageIndex());
    }

    observable.subscribe(paginatedBreeds => {
      this.length.set(paginatedBreeds.pagination.count);
      this.pageSize.set(paginatedBreeds.pagination.limit);
      this.pageIndex.set(paginatedBreeds.pagination.page);
      this.dataSource.data = paginatedBreeds.data;
      this.loading.set(false);
    });
  }
}
