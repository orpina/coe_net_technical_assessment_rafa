import { Component, WritableSignal, signal } from '@angular/core';
import { TaskModel } from '../../models/task.model';
import { MatTableModule } from '@angular/material/table';
import { ColumnDefinition } from '../../../../shared/models/table-col-definition.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerDialogService } from '../../../../shared/services/spinner-dialog.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PaginatorConfig } from '../../../../shared/models/paginator-config.model';
import { TasksSearchService } from '../../services/tasks-search.service';
import { SortConfig } from '../../../../shared/models/sort-config.model';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { finalize } from 'rxjs';
import { PaginatedResponse } from '../../../../shared/models/paginated-response.model';
import { AddTaskComponent } from '../../add-task/add-task.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FieldPipe } from '../../../../shared/pipes/field.pipe';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    FieldPipe
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css'
})
export class TasksListComponent {
  constructor(
    public dialog: MatDialog,
    private tasksSearchService: TasksSearchService,
    private spinnerDialogService: SpinnerDialogService,
  ) { }

  filter = new FormControl();
  tasksList: WritableSignal<TaskModel[]> = signal([]);

  private _totalItemsCount: number = 0;
  private _columns: ColumnDefinition[] = [
    {
      field: 'title', title: 'Title', align: 'left', type: 'text', maxWidth: 500
    },
    {
      field: 'description', title: 'Description', align: 'left', type: 'text'
    },
    {
      field: 'options', title: '', align: 'center', type: 'options', maxWidth: 50, sortDisabled: true
    }
  ];

  ngOnInit(): void {
    this.search();
  }

  handlePageEvent(e: PageEvent) {
    const pageConfig = <PaginatorConfig>{
      pageSize: e.pageSize,
      pageIndex: e.pageSize !== this.tasksSearchService.pageConfig.pageSize ? 0 : e.pageIndex
    }

    this.tasksSearchService.pageConfig = pageConfig;
    this.search();
  }

  sortChange(sort: Sort) {
    this.tasksSearchService.sortConfig = <SortConfig>{
      sortProperty: sort.active,
      sortDirection: sort.direction
    };

    this.search();
  }

  search() {
    this.spinnerDialogService.startSpinner();

    const searchParams = {
      filter: this.filter?.value
    };

    this.tasksSearchService.getPaginated<TaskModel>(searchParams)
      .pipe(
        finalize(() => this.spinnerDialogService.closeSpinner())
      )
      .subscribe({
        next: (response: PaginatedResponse<TaskModel>) => {
          this._totalItemsCount = response.totalItems;
          this.tasksList.update(() => response.items)
        },
        error: (err) => console.log(err)
      });
  }

  addTask() {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      disableClose: true,
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.search();
    });
  }

  get paginatorLength(): number {
    return this._totalItemsCount;
  }

  get columns(): ColumnDefinition[] {
    return this._columns;
  }

  get itemsPerPage(): Readonly<number[]> {
    return this.tasksSearchService.itemsPerPage;
  }

  get columnNames(): string[] {
    return this.columns.map((col) => col.field);
  }

  get sortActive(): string {
    return this.tasksSearchService.sortConfig.sortProperty;
  }

  get sortDirection(): SortDirection {
    return this.tasksSearchService.sortConfig.sortDirection;
  }
}
