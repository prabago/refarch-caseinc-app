import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from "./authentication.service";
import { AlertService } from "./alert.service";
import { User } from "./User";

/**
Supports exposing the login forms and calls the back end service, persist the user in local storage
and route to the return url.
*/
@Component({
  selector: 'login',
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
  user: User = new User();
  returnUrl: string;
  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private alertService: AlertService
    ){}

  ngOnInit() {
      // reset login status
      
      console.log('logging out user - login component')
      this.authenticationService.logout()
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login(){
    this.authenticationService.login(this.user)
          .subscribe(
              data => {
                console.log(data);
                  this.user=data;
                  sessionStorage.setItem('currentUser', JSON.stringify(this.user));
                  this.router.navigate([this.returnUrl]);
              },
              error => {
                  this.alertService.error(error);
                  this.authenticationService.logout();
                  this.router.navigate(['/']);
              });
  }

  logout(){
      this.authenticationService.logout()
        
  }
}
