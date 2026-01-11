import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { AuthenticationRequest } from '../../services/models/authentication-request';
import { AuthenticationService } from '../../services/services/authentication.service';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  authRequest: AuthenticationRequest = {email: '', password: ''};
  errorMsg = signal<string[]>([]);

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private tokenService: TokenService
  ) {
  }

  login(){
    this.errorMsg.set([]);
    this.authService.authenticate({
      body: this.authRequest
    }).then((res) => {
        this.tokenService.token = res.token as string;
        this.router.navigate(['books']);
      }).catch((err) => {
      if(err.error.validationErrors){
        this.errorMsg.set(err.error.validationErrors);
      } else {
        this.errorMsg.set([err.error.error]);
      }
    })
  }

  register(){
      this.router.navigate(['register'])
  }

}
