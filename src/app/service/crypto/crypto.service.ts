import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }

  alpabeth = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  number = "0123456789";

  vigenere_cipher(type: string, text: string, key: string){
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
}
