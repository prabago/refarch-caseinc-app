import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from "./authentication.service";
import { AlertService } from "./alert.service";
import { User } from "./User";

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
      this.authenticationService.logout();
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login(){
    this.authenticationService.login(this.user)
          .subscribe(
              data => {
                  this.user=data;
                  this.router.navigate([this.returnUrl]);
              },
              error => {
                  this.alertService.error(error);
              });
  }
}
