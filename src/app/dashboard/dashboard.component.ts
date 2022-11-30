import { Component, OnInit } from '@angular/core';
import { Database, onValue } from '@angular/fire/database';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ref } from '@firebase/database';
import { AuthService } from '../service/auth/auth.service';

import Swal from 'sweetalert2'
import { CryptoService } from '../service/crypto/crypto.service';

declare function readImageURL(event: any): any;
declare function decodeIMG(): any

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [AuthService]
})
export class DashboardComponent implements OnInit{
  constructor(private router: Router, private database: Database, private authService: AuthService, private cryptoService: CryptoService){}
  userName = "";
  candidates: any
  choosed = "";
  btnDisable = true;
  selectedNo = 0;
  isChoosed = false
  imageSrc: any
  encoded = ""
  isImage = false;
  generated = "";

  keyForm = new FormGroup({
    key: new FormControl('', Validators.required)
  })

  ngOnInit(): void {
    if(localStorage.getItem("username")){
      let username = localStorage.getItem("username")
      const userRef = ref(this.database, 'user/' + username);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        this.userName = data.fullname
        this.isChoosed = data.isChoosed
      })

      const candidateRef = ref(this.database, 'candidate/');
      onValue(candidateRef, (snapshot) => {
        const data = snapshot.val();
        this.candidates = data.slice(1)
      })
    }else{
      this.router.navigate([""])
    }
  }

  selectCandidate(i: any){
    this.choosed = "Saya memilih nomor urut " + this.candidates[i].no
    const text = this.userName + " memilih nomor urut " + this.candidates[i].no + " Pasangan " + this.candidates[i].name1 + " dan " + this.candidates[i].name2
    localStorage.setItem("text", text)
    this.btnDisable = false;
    this.selectedNo = i+1
  }

  batal(){
    this.choosed = ""
    this.btnDisable = true;
    this.selectedNo = 0
  }

  logout(){
    this.authService.logoutUser();
  }

  onChangeFile(event: any){
    if(event.target.files){
      readImageURL(event)
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.imageSrc = reader.result;

        reader.readAsDataURL(file);
      }

      this.isImage = true
    }else{
      this.isImage = false
    }
    
  }

  onSubmit(){
    if(this.isImage){
      if(this.keyForm.valid){
        this.generated = this.cryptoService.super(
          "decrypt", 
          this.encoded, 
          this.keyForm.controls.key.value
        ).plaintext

        this.cryptoService.updateChoosed()
      }
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'File Gambar belum ada'
      })
    }
  }

  decode(){
    this.encoded = decodeIMG()
    if(this.encoded == ""){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Tidak Ada Text Terenkripsi di Gambar Tersebut'
      })
    }
  }
}
