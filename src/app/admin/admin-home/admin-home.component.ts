import { Component } from '@angular/core';
import { AdminHeaderComponent } from "../components/admin-header/admin-header.component";
import { SideNavbarComponent } from "../components/side-navbar/side-navbar.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from "../components/dashboard/dashboard.component";
@Component({
  selector: 'app-admin-home',
  standalone:true,
  imports: [AdminHeaderComponent, SideNavbarComponent, RouterModule, CommonModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent {
  title = 'admin-dashboard';
  isSidebarOpen = true;
  isToggling = false; 

  toggleSidebar() {
    if (this.isToggling) return;
    this.isToggling = true;

    this.isSidebarOpen = !this.isSidebarOpen; 

    setTimeout(() => {
      this.isToggling = false;
    }, 300);
  }
}
