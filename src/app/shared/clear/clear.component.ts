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
    const check = prompt('To confirm erasing Data, wright "clear"');
    if(check === 'clear') {
      alert('clear');
      localStorage.clear();
      sessionStorage.clear();
    }
    this.router.navigate(['/'])
  }

}
