import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { NotificationService } from 'src/service/notification.service';
import { of, throwError } from 'rxjs';

import { AppComponent } from './app.component';
import { ApiService } from '../service/api.service';
import { AppModule } from './app.module';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { User } from 'src/models/models';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getUsers']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'showNotification',
    ]);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [AppModule],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users on ngOnInit', () => {
    const mockUsers = {
      users: [
        {
          name: 'John',
          surname: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
        },
      ],
    };
    apiServiceSpy.getUsers.and.returnValue(of(mockUsers));

    component.ngOnInit();

    expect(apiServiceSpy.getUsers).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockUsers.users);
    expect(notificationServiceSpy.showNotification).toHaveBeenCalledWith(
      'Данные загружены'
    );
  });

  it('should handle error while fetching users on ngOnInit', () => {
    const errorMessage = 'Server error';
    apiServiceSpy.getUsers.and.returnValue(
      throwError({ message: errorMessage })
    );

    component.ngOnInit();

    expect(apiServiceSpy.getUsers).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual([]);
    expect(notificationServiceSpy.showNotification).toHaveBeenCalledWith(
      'Ошибка сервера'
    );
  });

  it('should check if at least one user is selected', () => {
    component.dataSource.data = [
      {
        id: 1,
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        selected: false,
      },
      {
        id: 2,
        name: 'Jane',
        surname: 'Doe',
        email: 'jane@example.com',
        phone: '9876543210',
        selected: true,
      },
    ];

    const result = component.isAtLeastOneSelected();

    expect(result).toBe(true);
  });
  it('should select all users', () => {
    const event: MatCheckboxChange = { checked: true } as MatCheckboxChange;

    component.selectAll(event);

    expect(component.dataSource.data.every((user) => user.selected)).toBe(true);
  });

  function createTestUser(
    id: number,
    name: string,
    selected: boolean,
    surname = 'Doe',
    email = 'test@example.com',
    phone = '1234567890'
  ) {
    return { id, name, surname, email, phone, selected } as User;
  }
  it('should delete selected users', fakeAsync(() => {
    const selectedUser = createTestUser(1, 'John', true);
    component.dataSource.data = [selectedUser];

    const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', [
      'afterClosed',
    ]);
    matDialogRefSpy.afterClosed.and.returnValue(of(true));
    dialogSpy.open.and.returnValue(matDialogRefSpy);
    component.deleteSelectedUsers();
    tick();

    expect(component.dataSource.data.length).toBe(0);
    expect(notificationServiceSpy.showNotification).toHaveBeenCalledWith(
      'Пользователи удалены'
    );
  }));
  it('should open Create User Dialog', fakeAsync(() => {
    const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', [
      'afterClosed',
    ]);
    matDialogRefSpy.afterClosed.and.returnValue(
      of(createTestUser(1, 'New User', false))
    );

    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    matDialogSpy.open.and.returnValue({ afterClosed: () => of({}) });

    dialogSpy.open.and.returnValue(matDialogRefSpy);
    component.openCreateUserDialog();
    tick();

    expect(component.dataSource.data.length).toBe(1);
    expect(notificationServiceSpy.showNotification).toHaveBeenCalledWith(
      'Пользователь добавлен'
    );
  }));
  it('should open Edit User Dialog', fakeAsync(() => {
    const userToEdit = createTestUser(1, 'John', false);
    component.dataSource.data = [userToEdit];

    const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', [
      'afterClosed',
    ]);
    matDialogRefSpy.afterClosed.and.returnValue(
      of({ ...userToEdit, name: 'Updated John' })
    );

    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    matDialogSpy.open.and.returnValue({ afterClosed: () => of({}) });
    dialogSpy.open.and.returnValue(matDialogRefSpy);
    component.openEditUserDialog(userToEdit);
    tick();

    expect(component.dataSource.data[0].name).toBe('Updated John');
    expect(notificationServiceSpy.showNotification).toHaveBeenCalledWith(
      'Пользователь изменен'
    );
  }));
});
