import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventService } from 'src/app/services/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-events',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './updateevents.component.html',
  styleUrl: './updateevents.component.scss'
})
export class UpdateEventsComponent implements OnInit {
  isSidebarOpen: boolean = true;
  isToggling: boolean = false;
  eventId: string = '';
  todayDate: string = '';

  event = {
    imageUrl: '',
    title: '',
    description: '',
    targetAudience: '',
    eventDate: '',
    endDate: '',
    category: '',
    location: '',
    totalSlots: 0,
    bookedSlots: 0,
    eventStatus: 'upcoming',
  };

  selectedFile: File | null = null;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];

    this.eventId = this.route.snapshot.paramMap.get('eventId') || '';
    if (this.eventId) {
      this.loadEventData();
    } else {
      console.error("No event ID found in URL.");
    }
  }

  loadEventData() {
    this.eventService.getEventById(this.eventId).subscribe(
      (eventData) => {
        if (eventData && eventData.status) {
          this.event = { ...this.event, ...eventData.data };
          this.event.eventDate = this.formatDate(this.event.eventDate);
          this.event.endDate = this.formatDate(this.event.endDate);
        } else {
          console.error('Invalid event data:', eventData);
        }
      },
      (error) => {
        console.error('Error fetching event data:', error);
      }
    );
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.event.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleSidebar() {
    if (this.isToggling) return;
    this.isToggling = true;
    this.isSidebarOpen = !this.isSidebarOpen;
    setTimeout(() => (this.isToggling = false), 300);
  }

  updateEvent() {
    if (!this.eventId) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Event ID',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false
      });
      return;
    }
  
    const startDate = new Date(this.event.eventDate);
    const endDate = new Date(this.event.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    if (
      !this.event.title || !this.event.description || !this.event.eventDate ||
      !this.event.endDate || !this.event.category || !this.event.location
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Please fill all required fields',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false
      });
      return;
    }
  
    if (startDate < today) {
      Swal.fire({
        icon: 'error',
        title: 'Start date cannot be in the past',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false
      });
      return;
    }
  
    if (endDate < startDate) {
      Swal.fire({
        icon: 'error',
        title: 'End date cannot be before the start date',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false
      });
      return;
    }
  
    if (startDate.getFullYear() > 9999 || endDate.getFullYear() > 9999) {
      Swal.fire({
        icon: 'error',
        title: 'Year should not exceed 4 digits',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false
      });
      return;
    }
  
    const formattedEventDate = startDate.toISOString();
    const formattedEndDate = endDate.toISOString();
  
    const formData = new FormData();
    formData.append('title', this.event.title);
    formData.append('description', this.event.description);
    formData.append('targetAudience', this.event.targetAudience);
    formData.append('eventDate', formattedEventDate);
    formData.append('endDate', formattedEndDate);
    formData.append('category', this.event.category);
    formData.append('location', this.event.location);
    formData.append('totalSlots', this.event.totalSlots.toString());
    formData.append('bookedSlots', this.event.bookedSlots.toString());
    formData.append('eventStatus', this.event.eventStatus);
  
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
  
    this.eventService.updateEvent(this.eventId, formData).subscribe(
      (response) => {
        if (response.status) {
          this.event = { ...this.event, ...response.data };
          Swal.fire({
            icon: 'success',
            title: 'Event updated successfully!',
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false
          });
          this.router.navigate(['/hccmatadmin/all-events']);
        }
      },
      (error) => {
        console.error('Error updating event:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to update event!',
          text: 'Please check required fields.',
          toast: true,
          position: 'top-end',
          timer: 3000,
          showConfirmButton: false
        });
      }
    );
  }
}  