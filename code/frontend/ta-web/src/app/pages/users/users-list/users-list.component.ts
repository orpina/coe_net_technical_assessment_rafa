import { Component, OnInit } from '@angular/core';
import { UsersApiService } from '../services/users-api.service';
import { UserModel } from '../models/user.model';
import { MatTableModule } from '@angular/material/table';
import { SpinnerDialogService } from '../../../shared/services/spinner-dialog.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    MatTableModule
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  constructor(
    private usersAPIService: UsersApiService,
    private spinnerDialogService: SpinnerDialogService,
  ) { }

  usersList: UserModel[] = [];
  displayedColumns: string[] = ['name', 'email'];

  ngOnInit(): void {
    this.search();
  }

  search() {
    this.spinnerDialogService.startSpinner();

    this.usersAPIService.getUsers()
      .pipe(
        finalize(() => this.spinnerDialogService.closeSpinner())
      )
      .subscribe({
        next: (users: UserModel[]) => {
          this.usersList = users;
        },
        error: (err) => console.log(err)
      });
  }
}
