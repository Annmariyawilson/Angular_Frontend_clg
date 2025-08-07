import {
  Component,
  Inject,
  PLATFORM_ID,
  Input,
  OnInit,
  EventEmitter,
  Output
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss'],
})
export class SideNavbarComponent implements OnInit {
  @Input() isSidebarOpen = true;
  @Output() statusFilterEvent = new EventEmitter<string>();

  openMenus: { [key: string]: boolean } = {};
  currentRoute: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedState = localStorage.getItem('sidebarState');
      this.isSidebarOpen = savedState !== null ? JSON.parse(savedState) : window.innerWidth > 1024;
    }

    this.currentRoute = this.router.url;
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }
    
  toggleSidebar(event?: Event) {
    if (event) event.stopPropagation();
    this.isSidebarOpen = !this.isSidebarOpen;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('sidebarState', JSON.stringify(this.isSidebarOpen));
    }
  }

  toggleSubMenu(menu: string, event?: Event) {
    if (event) event.stopPropagation();
    this.openMenus[menu] = !this.openMenus[menu];
  }

  filterApplications(status: string) {
    this.statusFilterEvent.emit(status);
  }

  filterByStatus(status: string) {
    this.statusFilterEvent.emit(status);
  }
}
