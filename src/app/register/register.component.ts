import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2'
import { CryptoService } from '../service/crypto/crypto.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [CryptoService]
})
export class RegisterComponent implements OnInit{
  constructor(private cryptoService: CryptoService, private router: Router){}

  userForm = new FormGroup({
    fullname: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  ngOnInit(): void {
    if(localStorage.getItem("username")){
      this.router.navigate(["/dashboard"])
    }
  }

  onSubmit(){
    if(this.userForm.valid){
      this.cryptoService.registerUser(this.userForm.value)
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ada error mas'
      })
    }
  }
}
