import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-savedata',
  templateUrl: './savedata.component.html',
  styleUrls: ['./savedata.component.scss']
})
export class SavedataComponent implements OnInit{
  selected: any
  ngOnInit(): void {
    this.selected = localStorage.getItem("text")
  }
}
