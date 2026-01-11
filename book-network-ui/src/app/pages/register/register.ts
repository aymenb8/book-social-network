import {Component, signal} from '@angular/core';
import {RegistrationRequest} from '../../services/models/registration-request';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/services/authentication.service';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  registerRequest: RegistrationRequest = { email: '', firstname: '', lastname: '', password: '' };
  errorMsg = signal<string[]>([]);

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
  }

  protected register(){
    this.errorMsg.set([]);
    this.authService.register({
      body: this.registerRequest,
    }).then((res) => {
      this.router.navigate(['activate-account']);
    }).catch((err) => {
      this.errorMsg.set(err.error.validationErrors)
    })
  }

  protected login() {
    this.router.navigate(['login']);
  }
}
