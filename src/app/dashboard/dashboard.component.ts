import { Component, OnInit } from '@angular/core';
import { Database, onValue } from '@angular/fire/database';
import { Router } from '@angular/router';
import { ref } from '@firebase/database';
import { AuthService } from '../service/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [AuthService]
})
export class DashboardComponent implements OnInit{
  constructor(private router: Router, private database: Database){}
  userName = "";
  candidates: any
  choosed = "";
  btnDisable = true;
  selectedNo = 0;

  ngOnInit(): void {
    if(localStorage.getItem("username")){
      let username = localStorage.getItem("username")
      const userRef = ref(this.database, 'user/' + username);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        this.userName = data.fullname
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
    const text = this.userName + " memilih nomor urut " + this.candidates[i].no
    localStorage.setItem("text", text)
    this.btnDisable = false;
    this.selectedNo = i+1
  }

  batal(){
    this.choosed = ""
    this.btnDisable = true;
    this.selectedNo = 0
  }
}
