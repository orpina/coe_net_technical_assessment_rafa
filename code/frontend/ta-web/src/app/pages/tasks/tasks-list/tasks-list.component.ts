import { Component } from '@angular/core';
import { TasksApiService } from '../services/tasks-api.service';
import { TaskModel } from '../models/task.model';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    MatTableModule
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css'
})
export class TasksListComponent {
  constructor(private tasksAPIService: TasksApiService) { }

  tasksList: TaskModel[] = [];
  displayedColumns: string[] = ['title', 'description'];

  ngOnInit(): void {
    this.search();
  }

  search() {
    this.tasksAPIService.getTasks()
      .subscribe((response: any[]) => {
        console.log(response)
        this.tasksList = response;
      });
  }
}
