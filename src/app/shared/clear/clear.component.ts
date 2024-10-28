import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clear',
  templateUrl: './clear.component.html',
  styleUrls: ['./clear.component.scss']
})
export class ClearComponent implements OnInit {

  constructor(
    private router : Router
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    sessionStorage.clear();
    alert('clear')
    this.router.navigate(['/'])
  }

}
