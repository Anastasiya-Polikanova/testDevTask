import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../models/models';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.scss'],
})
export class CreateUserDialogComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateUserDialogComponent>
  ) {
    this.userForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ],
      ],
      surname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(30)],
      ],
      phone: ['+7', [Validators.pattern(/^\+7\d{10}$/)]],
    });
  }

  onCreateClick(): void {
    if (this.userForm.valid) {
      const newUser: User = this.userForm.value;
      this.dialogRef.close(newUser);
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
