import { Injectable } from '@angular/core';
import { Database, onValue } from '@angular/fire/database';
import { ref, set } from '@firebase/database';

import Swal from 'sweetalert2'

import * as bcrypt from 'bcryptjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private database: Database, private router: Router) { }

  registerUser(value: any){
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(value.password, salt)

    set(ref(this.database, 'user/' + value.username), {
      username: value.username,
      password: hash,
      fullname: value.fullname
    }).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User Teregistrasi, Silahkan Login'
      })
      this.router.navigate([""])
    }).catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ada error mas'
      })
    })
  }

  loginUser(value: any){
    let tempPassword;
    const userRef = ref(this.database, 'user/' + value.username);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();

      tempPassword = bcrypt.compareSync(value.password, data.password);
      if(tempPassword){
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Login Berhasil'
        })
        this.router.navigate(["/dashboard"])
        localStorage.setItem("username", value.username)
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Login Gagal'
        })
      }
    })
  }
}
