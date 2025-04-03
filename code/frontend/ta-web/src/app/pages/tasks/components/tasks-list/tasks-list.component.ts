import { Component, WritableSignal, signal } from '@angular/core';
import { TaskModel } from '../../models/task.model';
import { MatTableModule } from '@angular/material/table';
import { ColumnDefinition } from '../../../../shared/models/table-col-definition.model';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerDialogService } from '../../../../shared/services/spinner-dialog.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PaginatorConfig } from '../../../../shared/models/paginator-config.model';
import { TasksSearchService } from '../../services/tasks-search.service';
import { SortConfig } from '../../../../shared/models/sort-config.model';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { filter, finalize, map, switchMap, tap } from 'rxjs';
import { PaginatedResponse } from '../../../../shared/models/paginated-response.model';
import { AddTaskComponent } from '../../add-task/add-task.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FieldPipe } from '../../../../shared/pipes/field.pipe';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { BooleanToYesNoPipe } from '../../../../shared/pipes/bool-yes-no.pipe';
import { BasicConfirmationComponent } from '../../../../shared/components/basic-confirmation.component';
import { TasksApiService } from '../../services/tasks-api.service';
import { SnackBarService } from '../../../../shared/services/snackbar.service';
import { KeyValueModel } from '../../../../shared/models/key-value.model';
import { TaskSearchFilterModel } from '../../models/task-search-filters.model';
import { MatSelectModule } from '@angular/material/select';
import { UsersApiService } from '../../../users/services/users-api.service';
import { UserModel } from '../../../users/models/user.model';

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
    FieldPipe,
    BooleanToYesNoPipe,
    CommonModule,
    MatSelectModule
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css'
})
export class TasksListComponent {
  constructor(
    public dialog: MatDialog,
    private tasksSearchService: TasksSearchService,
    private tasksApiService: TasksApiService,
    private spinnerDialogService: SpinnerDialogService,
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    private usersApiService: UsersApiService
  ) { }

  filterForm!: FormGroup;
  tasksList: WritableSignal<TaskModel[]> = signal([]);
  usersKeyValue: KeyValueModel[] = [];

  private _totalItemsCount: number = 0;
  private _columns: ColumnDefinition[] = [
    {
      field: 'title', title: 'Title', align: 'left', type: 'text', maxWidth: 500
    },
    {
      field: 'description', title: 'Description', align: 'left', type: 'text'
    },
    {
      field: 'isCompleted', title: 'Completed', align: 'left', type: 'boolText', maxWidth: 100
    },
    {
      field: 'options', title: '', align: 'center', type: 'options', maxWidth: 50, sortDisabled: true
    }
  ];

  ngOnInit(): void {
    this.usersApiService.getUsers()
      .pipe(map((users: UserModel[]) => users.map(u => (<KeyValueModel>{ key: u.id, value: u.name }))))
      .subscribe({
        next: (users: KeyValueModel[]) => {
          this.usersKeyValue = users;
        }
      });

    this._initForm();
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

    const searchParams = this.filterForm.getRawValue() as TaskSearchFilterModel;

    this.tasksSearchService.getPaginated<TaskModel>(searchParams)
      .pipe(
        finalize(() => this.spinnerDialogService.closeSpinner())
      )
      .subscribe({
        next: (response: PaginatedResponse<TaskModel>) => {
          this._totalItemsCount = response.totalItems;
          this.tasksList.update(() => response.items)
        }
      });
  }

  completeTask(id: number) {
    const dialogRef = this.dialog.open(BasicConfirmationComponent, {
      data: {
        message: "¿Do you want to mark this task as completed. This can only be undone by a manager?"
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(
        filter(dialogResponse => !!dialogResponse),
        tap(() => this.spinnerDialogService.startSpinner()),
        switchMap(() => this.tasksApiService.complete(id)),
        finalize(() => this.spinnerDialogService.closeSpinner())
      )
      .subscribe({
        next: () => {
          this.snackbarService.displaySuccess("Task completed.")
          this.search();
        }
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

  clearSearch(event: Event) {
    event.stopPropagation();
    this.filterControl?.reset();
    this.search();
  }

  clearUser(event: Event) {
    event.stopPropagation();
    this.assignedUserControl?.reset();
    this.search();
  }

  private _initForm() {
    this.filterForm = this.fb.group({
      filter: new FormControl<string | undefined>(undefined),
      assignedUserId: new FormControl<string | undefined>(undefined)
    });
  }

  get filterControl(): FormControl | null {
    return this.filterForm.get('filter') as FormControl;
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

  get assignedUserControl(): FormControl | null {
    return this.filterForm.get('assignedUserId') as FormControl;
  }
}
