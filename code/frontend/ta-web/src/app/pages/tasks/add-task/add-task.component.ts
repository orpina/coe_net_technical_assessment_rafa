import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SnackBarService } from '../../../shared/services/snackbar.service';
import { SpinnerDialogService } from '../../../shared/services/spinner-dialog.service';
import { TaskModel } from '../models/task.model';
import { TasksApiService } from '../services/tasks-api.service';
import { finalize, map } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { UsersApiService } from '../../users/services/users-api.service';
import { UserModel } from '../../users/models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { KeyValueModel } from '../../../shared/models/key-value.model';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})

export class AddTaskComponent {
  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    private spinnerDialogService: SpinnerDialogService,
    private tasksApiService: TasksApiService,
    private matDialogRef: MatDialogRef<AddTaskComponent>,
    private usersApiService: UsersApiService) { }

  taskForm!: FormGroup;
  usersKeyValue: KeyValueModel[] = [];

  ngOnInit() {
    this.usersApiService.getUsers()
      .pipe(map((users: UserModel[]) => users.map(u => (<KeyValueModel>{ key: u.id, value: u.name }))))
      .subscribe({
        next: (users: KeyValueModel[]) => {
          this.usersKeyValue = users;
        }
      });

    this._initForm();
  }

  private _initForm() {
    this.taskForm = this.fb.group({
      title: new FormControl<string | undefined>(undefined, [Validators.required, Validators.maxLength(250)]),
      description: new FormControl<string | undefined>(undefined, [Validators.required, Validators.maxLength(500)]),
      assignedUserId: new FormControl<number | undefined>(undefined)
    });
  }

  save() {
    if (this.taskForm.invalid) {
      this.snackbarService.displayError('Form has invalid fields.');
      return;
    }

    this.spinnerDialogService.startSpinner();
    const model = this.taskForm.getRawValue() as TaskModel;

    this.tasksApiService.add(model)
      .pipe(
        finalize(() => this.spinnerDialogService.closeSpinner())
      )
      .subscribe({
        next: () => this.matDialogRef.close(),
        complete: () => this.snackbarService.displaySuccess("Task added."),
      });
  }

  clearUser(event: Event) {
    event.stopPropagation();
    this.assignedUserControl?.reset();
  }

  get isInvalid() {
    return this.taskForm.invalid;
  }

  get titleControl(): FormControl | null {
    return this.taskForm.get('title') as FormControl;
  }

  get descriptionControl(): FormControl | null {
    return this.taskForm.get('description') as FormControl;
  }

  get assignedUserControl(): FormControl | null {
    return this.taskForm.get('assignedUserId') as FormControl;
  }
}
