import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl,
    ValidationErrors,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register-page',
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit {
    registerForm!: FormGroup;
    loading = false;
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.setupPasswordMatchListener();
    }

    // Initialize form controls and validators
    private initializeForm(): void {
        this.registerForm = this.fb.group(
            {
                name: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(6)]],
                confirmPassword: ['', Validators.required],
                code: [''], // Access code required only when passwords match
            },
            { validators: this.passwordMatchValidator }
        );
    }

    // Revalidate "code" field only if passwords match
    private setupPasswordMatchListener(): void {
        this.registerForm.statusChanges.subscribe(() => {
            const passwordsMatch = !this.registerForm.hasError('passwordMismatch');
            const codeControl = this.registerForm.get('code');

            if (passwordsMatch) {
                codeControl?.setValidators([Validators.required]);
            } else {
                codeControl?.clearValidators();
            }
            codeControl?.updateValueAndValidity({ onlySelf: true });
        });
    }

    // Custom validator to check if password and confirmPassword match
    private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { passwordMismatch: true };
    }

    // Form control getters for template access
    get name(): AbstractControl | null {
        return this.registerForm.get('name');
    }

    get email(): AbstractControl | null {
        return this.registerForm.get('email');
    }

    get password(): AbstractControl | null {
        return this.registerForm.get('password');
    }

    get confirmPassword(): AbstractControl | null {
        return this.registerForm.get('confirmPassword');
    }

    get code(): AbstractControl | null {
        return this.registerForm.get('code');
    }

    // Submit the form
    onSubmit(): void {
        this.errorMessage = '';

        if (this.registerForm.invalid) return;

        const { name, email, password, code } = this.registerForm.value;
        this.loading = true;

        this.authService.signup(name, email, password, code).subscribe({
            next: () => {
                this.loading = false;
                alert('Registration successful! Please log in.');
                this.router.navigate(['/hccmat']);
            },
            error: (err) => {
                this.loading = false;
                this.errorMessage = err.error?.message || 'Registration failed';
            },
        });
    }
}
