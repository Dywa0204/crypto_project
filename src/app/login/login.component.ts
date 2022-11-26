import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth/auth.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthService]
})
export class LoginComponent {
  constructor(private authService: AuthService){}

  userForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  onSubmit(){
    if(this.userForm.valid){
      this.authService.loginUser(this.userForm.value)
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ada error mas'
      })
    }
  }
}
