import { Component, OnInit } from '@angular/core';
import { UsersApiService } from '../services/users-api.service';
import { UserModel } from '../models/user.model';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    MatTableModule
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit{
  constructor(private usersAPIService: UsersApiService){}

  usersList: UserModel[] = [];
  displayedColumns: string[] = ['name', 'email'];

  ngOnInit(): void {
      this.search();
  }

  search() {
      this.usersAPIService.getUsers()
          .subscribe( (response:any[]) =>
          {
              console.log(response)
              this.usersList = response;
          }        
         
      );
  }
}
