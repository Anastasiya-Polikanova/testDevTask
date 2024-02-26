import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ApiService } from '../service/api.service';
import { User, Users } from '../models/models';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from './dialog/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CreateUserDialogComponent } from './dialog/create-user-dialog/create-user-dialog.component';
import { NotificationService } from 'src/service/notification.service';
import { EditUserDialogComponent } from './dialog/edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['select', 'name', 'surname', 'email', 'phone'];
  dataSource = new MatTableDataSource<User>([]);

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.apiService.getUsers().subscribe(
      (response: Users) => {
        response.users.forEach((user, index) => {
          user.id = index + 1;
        });
        this.dataSource.data = response.users;
        this.notificationService.showNotification('Данные загружены');
      },
      (error: any) => {
        this.notificationService.showNotification('Ошибка сервера');
      }
    );
  }

  toggleSelection(user: User, event: MatCheckboxChange): void {}

  isAtLeastOneSelected(): boolean {
    return this.dataSource.data.some((user) => user.selected);
  }

  selectAll(event: MatCheckboxChange): void {
    this.dataSource.data.forEach((user) => (user.selected = event.checked));
  }

  deleteSelectedUsers(): void {
    const selectedUsers = this.dataSource.data.filter((user) => user.selected);

    if (selectedUsers.length === 0) {
      this.notificationService.showNotification(
        'Выберите пользователей для удаления'
      );
    } else {
      const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
        data: { selectedUsers },
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.dataSource.data = this.dataSource.data.filter(
            (user) => !user.selected
          );
          this.notificationService.showNotification('Пользователи удалены');
        }
      });
    }
  }

  openCreateUserDialog(): void {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {});

    dialogRef.afterClosed().subscribe((newUser: User) => {
      if (newUser) {
        this.dataSource.data.push(newUser);
        this.dataSource._updateChangeSubscription();
        this.notificationService.showNotification('Пользователь добавлен');
      }
    });
  }

  openEditUserDialog(user: User): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      data: { user },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const index = this.dataSource.data.findIndex((u) => u.id === result.id);
        if (index !== -1) {
          this.dataSource.data[index] = result;
          this.dataSource.data = [...this.dataSource.data];
          this.notificationService.showNotification('Пользователь изменен');
        }
      }
    });
  }
}
