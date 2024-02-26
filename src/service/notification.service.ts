import {  Injectable } from '@angular/core';
import {  MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  showNotification(message: string, customClasses: string[] = []): void {
    const panelClasses = ['default-notification', ...customClasses];
    this.snackBar.open(message, 'Закрыть', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: panelClasses
    });
  }
}
