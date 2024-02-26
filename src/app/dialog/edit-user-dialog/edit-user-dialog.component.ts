import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss'],
})
export class EditUserDialogComponent {
  userForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      name: [
        data.user?.name,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ],
      ],
      surname: [
        data.user?.surname,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ],
      ],
      email: [
        data.user?.email,
        [Validators.required, Validators.email, Validators.maxLength(30)],
      ],
      phone: [data.user?.phone, [Validators.pattern(/^\+7\d{10}$/)]],
    });
  }

  ngOnInit(): void {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onUpdateClick(): void {
    const updatedUser = {
      ...this.data.user,
      ...this.userForm.value,
    };
    this.dialogRef.close(updatedUser);
  }
}
