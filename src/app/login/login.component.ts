import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  ngOnInit() {
   this.isAuthenticate();
  }

  constructor(private fb: FormBuilder,private navCtrl: NavController, private authService: AuthService, private router: Router,
    private auth: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe(success => {
        if (success) {
          this.router.navigate(['/']);
        } else {
          alert('Login failed');
        }
      });
    }
  }

  isAuthenticate(): void{
    if(this.authService.isAuthenticated()){
      this.navCtrl.navigateRoot('');
    }
  }

  async goToRegister() {
    this.navCtrl.navigateRoot('register');
  }
}
