import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { ApiService } from 'src/service/api.service';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmationDialogModule } from './dialog/delete-confirmation-dialog/delete-confirmation-dialog.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EditUserDialogModule } from './dialog/edit-user-dialog/edit-user-dialog.module';
import { CreateUserDialogModule } from './dialog/create-user-dialog/create-user-dialog.module';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,

    //material
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,

    //модули компонентов
    DeleteConfirmationDialogModule,
    EditUserDialogModule,
    CreateUserDialogModule,
  ],
  providers: [ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
