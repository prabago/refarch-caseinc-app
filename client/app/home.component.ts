import {Component} from '@angular/core';
import { Router }   from '@angular/router';
import { HomeService }  from './home.service';
/*
Main page component to display access to the different demo features.
*/

@Component({
    selector: 'home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html'
  })

  export class HomeComponent {
    mode:string='orange';

    constructor(private router: Router,private homeService : HomeService) {
      this.homeService.getMode().subscribe(
        data => {this.mode=data.mode;},
        error => {console.log(error);}
      )
    }

    inventory(){
      this.router.navigate(['inventory']);
    }


    itSupport(){
      this.router.navigate(['itSupport']);
    }
    // ADD Here methods to be called from HTLM button to route to other component

  }
