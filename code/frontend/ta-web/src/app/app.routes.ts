import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AboutComponent } from './pages/about/about.component';
import { UsersListComponent } from './pages/users/users-list/users-list.component';
import { TasksListComponent } from './pages/tasks/components/tasks-list/tasks-list.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent  },
    { path: 'about', component: AboutComponent  },
    { path: 'users', component: UsersListComponent, title: 'Users List'},
    { path: 'tasks', component: TasksListComponent, title: 'Tasks'},
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];
