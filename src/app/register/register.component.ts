import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth/auth.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [AuthService]
})
export class RegisterComponent {
  constructor(private authService: AuthService){}

  userForm = new FormGroup({
    fullname: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  onSubmit(){
    if(this.userForm.valid){
      this.authService.registerUser(this.userForm.value)
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ada error mas'
      })
    }
  }
}
