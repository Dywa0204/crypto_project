import { Injectable } from '@angular/core';
import { child, Database, get, getDatabase, onValue, update } from '@angular/fire/database';
import { ref, set } from '@firebase/database';
import { Router } from '@angular/router';

import Swal from 'sweetalert2'

import * as bcrypt from 'bcryptjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor(private database: Database, private router: Router) { }

  alpabeth = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  number = "0123456789";

  registerUser(value: any){
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(value.password, salt)

    set(ref(this.database, 'user/' + value.username), {
      username: value.username,
      password: hash,
      fullname: value.fullname,
      isChoosed: false
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
    const userRef = ref(getDatabase());
    get(child(userRef, "user/" + value.username)).then(snapshot => {
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

  super(type: string, text: string, key: any){
    let plaintext = "", ciphertext = "";

    switch(type){
        case "encrypt":
            plaintext = text;
            ciphertext = this.vigenereCipher(type, text, key).ciphertext
            ciphertext = this.AES(type, ciphertext, key).ciphertext
            break;
        case "decrypt":
            ciphertext = text;
            plaintext = this.AES(type, text, key).plaintext
            plaintext = this.vigenereCipher(type, plaintext, key).plaintext
            break;
    }

    return {plaintext, ciphertext}
  }

  AES(type: string, text: string, key: any){
    let plaintext = "", ciphertext = "";

    switch(type){
        case "encrypt":
            plaintext = text;
            ciphertext = CryptoJS.AES.encrypt(text, key).toString();
            break;
        case "decrypt":
            ciphertext = text;
            plaintext = CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
            break;
    }

    return {plaintext, ciphertext}
  }

  vigenereCipher(type: string, text: string, key: any){
    let plaintext = "", ciphertext = "";

    switch(type){
        case "encrypt":
            for(let i = 0; i < text.length; i++){
                plaintext += text[i];
                
                if(text[i] == " "){
                    ciphertext += " ";
                    continue;
                }

                let pi = this.getCharacter().indexOf(text[i]);
                let ki = this.getCharacter().indexOf(this.getKeyVigenere(key, text)[i]);

                let ci = (pi + ki) % (this.getCharacter().length);

                ciphertext += this.getCharacter()[ci];
            }
            break;
        case "decrypt":
            for(let i = 0; i < text.length; i++){
                ciphertext += text[i];
                
                if(text[i] == " "){
                    plaintext += " ";
                    continue;
                }

                let ci = this.getCharacter().indexOf(text[i]);
                let ki = this.getCharacter().indexOf(this.getKeyVigenere(key, text)[i]);

                let pi = (ci - ki + this.getCharacter().length) % (this.getCharacter().length);

                plaintext += this.getCharacter()[pi];
            }
            break;
      }

      return {plaintext, ciphertext};
  }
  getKeyVigenere(key: string, text: string){
      let temp = "";

      let j = 0;
      for(let i = 0; i < text.length; i++){
          if(text[i] == " "){
              temp += " ";
              continue;
          }

          temp += key[j];
          
          if(j == key.length - 1) j = 0;
          else j++;
      }

      return temp;
  }

  getCharacter(){
    return this.alpabeth + this.alpabeth.toLowerCase() + this.number;
  }

  updateChoosed(){
    const username = localStorage.getItem("username")
    update(ref(this.database, 'user/' + username), {
        isChoosed: true
    })
  }
}
