import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InternalApiService } from '../../services/internal-api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  loginForm = new FormGroup({
    username: new FormControl(''),
    password:new FormControl('')
  })

  constructor(private internalApiService: InternalApiService, private router: Router){
    
  }
  

  login(){
    console.log('Login:', this.loginForm.value); 
    this.internalApiService.login(this.loginForm.value.username ?? '',this.loginForm.value.password ?? '').subscribe(r=> this.router.navigate(["welcome"]));   
  }
}
