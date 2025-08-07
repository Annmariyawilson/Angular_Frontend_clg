import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';

import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-allevents',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.scss']
})
export class AlleventsComponent implements OnInit {
  isSidebarOpen: boolean = true;
  isToggling: boolean = false;
  tableHeading: string = 'All Events';

  events: any[] = [];
  filteredEvents: any[] = [];
  selectedStatus: string = '';

  TotalEvent = new BehaviorSubject<number>(0);
  completedEvent = new BehaviorSubject<number>(0);
  upcomingEvent = new BehaviorSubject<number>(0);
  canceledEvent = new BehaviorSubject<number>(0);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.fetchEvents();
    this.fetchEventCount();
  }

  // Fetch All Events
  fetchEvents() {
    this.eventService.getEvents().subscribe({
      next: (response) => {
        this.events = response?.data || [];
        this.applyFilter(this.selectedStatus);
      },
      error: (error) => {
        console.error('Error fetching events:', error);
        this.showToast('error', 'Failed to load events. Please try again.');
      }
    });
  }

  // Get Count of Events (for badges)
  fetchEventCount() {
    this.eventService.getEventCount().subscribe({
      next: (response) => {
        if (response.status) {
          this.TotalEvent.next(response.data.total);
          this.upcomingEvent.next(response.data.upcoming);
          this.completedEvent.next(response.data.completed);
          this.canceledEvent.next(response.data.canceled);
        }
      },
      error: (error) => {
        console.error('Error fetching event counts:', error);
      },
    });
  }

  // Filter Events Based on Status
  sortEvent(status: string) {
    this.selectedStatus = status;
    this.applyFilter(status);
    this.showToast('info', `Showing ${status.charAt(0).toUpperCase() + status.slice(1)} events`);
  }

  applyFilter(status: string) {
    if (!status) {
      this.filteredEvents = [...this.events];
      this.tableHeading = 'All Events';
    } else {
      this.filteredEvents = this.events.filter(
        (event) => event.eventStatus?.toLowerCase() === status.toLowerCase()
      );
      this.tableHeading = `${status.charAt(0).toUpperCase() + status.slice(1)} Events`;
    }
  }

  // Navigate to Edit Page
  updateDetails(eventId: string) {
    this.showToast('info', 'Navigating to edit event...');
    this.router.navigate(['/hccmatadmin/edit-event', eventId]);
  }

  // Delete Event
  deleteEvent(eventId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This event will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.deleteEvent(eventId).subscribe({
          next: () => {
            this.fetchEvents(); // Refresh list
            this.fetchEventCount(); // Refresh count
            this.showToast('success', 'Event deleted successfully!');
          },
          error: (error) => {
            console.error('Error deleting event:', error);
            this.showToast('error', 'Failed to delete event.');
          }
        });
      }
    });
  }

  // Navigate to Add Event
  goToAddEvent() {
    this.showToast('info', 'Navigating to add new event...');
    this.router.navigate(['/hccmatadmin/add-events']);
  }

  // Back Navigation
  goBack() {
    this.showToast('info', 'Navigating back...');
    this.router.navigate(['/hccmatadmin']);
  }

  // Toast helper method
  private showToast(icon: 'success' | 'error' | 'info' | 'warning', title: string) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  }
}
