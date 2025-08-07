import { Component , EventEmitter, Output} from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router,RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent {
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  isDropdownOpen = false;
  isSearchOpen = false;
  searchQuery = '';

  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    
    Swal.fire({
      icon: 'success',
      title: 'Logged Out!',
      text: 'successfully logged out.',
      toast: true,            
      position: 'top-end',    
      showConfirmButton: false,  
      timer: 3000,           
      didClose: () => {
        window.location.reload();
      }
    });
  }
    
  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectDropdownItem() {
    this.isDropdownOpen = false;
  }

  toggleSidebar(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.toggleSidebarEvent.emit();
  }
}
