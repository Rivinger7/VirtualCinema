import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    LucideAngularModule,
    InputTextModule,
    IconFieldModule,
    FloatLabelModule,
    InputIconModule,
    ButtonModule,
  ],
  templateUrl: './login-dialog.html',
})
export class LoginDialog {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  readonly eyeIcon = Eye;
  readonly eyeOffIcon = EyeOff;

  readonly loginForm: FormGroup;
  private loginFormSubmitted: boolean = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit(): void {
    this.loginFormSubmitted = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Handle login logic here (e.g., call an authentication service)

    this.loginForm.reset();
    this.loginFormSubmitted = false;
  }

  isInvalid(controlName: string): boolean | undefined {
    const control = this.loginForm.get(controlName);
    return control?.invalid && (control.touched || this.loginFormSubmitted);
  }
}
