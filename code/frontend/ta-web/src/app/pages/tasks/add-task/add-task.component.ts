import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { A11yModule } from '@angular/cdk/a11y';
import { SnackBarService } from '../../../shared/services/snackbar.service';
import { SpinnerDialogService } from '../../../shared/services/spinner-dialog.service';
import { TaskModel } from '../models/task.model';
import { TasksApiService } from '../services/tasks-api.service';
import { finalize } from 'rxjs';


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
    // A11yModule
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
    private matDialogRef: MatDialogRef<AddTaskComponent>,) { }

  taskForm!: FormGroup;

  ngOnInit() {
    this._initForm();
  }

  private _initForm() {
    this.taskForm = this.fb.group({
      title: new FormControl<string | undefined>(undefined, [Validators.required, Validators.maxLength(250)]),
      description: new FormControl<string | undefined>(undefined, [Validators.required, Validators.maxLength(500)])
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
        complete: () => this.snackbarService.displaySuccess("Producto añadido al inventario."),
        error: () => this.snackbarService.displaySuccess("Ocurrió un error al añadir el producto al inventario.")
      });
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
}
