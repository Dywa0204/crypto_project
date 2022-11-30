import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CryptoService } from '../service/crypto/crypto.service';

import Swal from 'sweetalert2'
import { Route, Router } from '@angular/router';

declare function readImageURL(event: any): any;
declare function encodeIMG(message: any): any


@Component({
  selector: 'app-savedata',
  templateUrl: './savedata.component.html',
  styleUrls: ['./savedata.component.scss']
})
export class SavedataComponent implements OnInit{
  selected: any
  generated = "adwdaw"
  isSubmit = false
  isImage = false;
  imageSrc: any
  imageSrc2: any

  constructor(private cryptoService: CryptoService, private router: Router){}

  keyForm = new FormGroup({
    key: new FormControl('', Validators.required)
  })

  ngOnInit(): void {
    this.selected = localStorage.getItem("text")
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

      this.isImage = true;
    } 
    else this.isImage = false
  }

  onSubmit(){
    if(this.isImage){
      if(this.keyForm.valid){
        this.generated = this.cryptoService.super(
          "encrypt", 
          this.selected, 
          this.keyForm.controls.key.value
        ).ciphertext
  
        this.isSubmit = true
        this.cryptoService.updateChoosed()

        this.imageSrc2 = encodeIMG(this.generated)
      }
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'File Gambar belum ada'
      })
    }
  }

  downloadFile(){
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', this.imageSrc2);
    link.setAttribute('download', `image.png`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  backDashboard(){
    this.router.navigate(["/dashboard"])
  }
}
