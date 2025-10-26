import { Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { BlogPostComponent } from './components/blog-post-component/blog-post-component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    BlogPostComponent,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  isLoggedIn: Signal<boolean>;

  constructor(private authService: AuthService, private dialog: MatDialog) {
    this.isLoggedIn = this.authService.isLoggedIn;
  }

  openLoginDialog(activeTab: string = 'login'): void {
    this.dialog.open(LoginComponent, {
      width: '400px',
      data: { activeTab }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
