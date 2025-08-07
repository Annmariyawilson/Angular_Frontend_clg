import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-add-events',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-events.component.html',
  styleUrl: './add-events.component.scss'
})
export class AddEventsComponent {
  previewImage: string | ArrayBuffer | null = null;
  isSidebarOpen: boolean = false;
  isToggling: boolean = false;

  event: any = {
    title: '',
    description: '',
    targetAudience: '',
    eventDate: '',
    endDate: '',
    category: '',
    location: '',
    totalSlots: 0,
    bookedSlots: 0,
    eventStatus: '',
    // website: ''
  };

  selectedFile: File | null = null;
  isEditing: boolean = false;
  eventId: string | null = null;

  // Define minDate property
  minDate: string = new Date().toISOString().split('T')[0];

  constructor(private eventService: EventService, private router: Router) {}

  toggleSidebar() {
    if (this.isToggling) return;
    this.isToggling = true;
    this.isSidebarOpen = !this.isSidebarOpen;
    setTimeout(() => { this.isToggling = false; }, 300);
  }

  // Submit Event method
  submitEvent(form: NgForm) {
    if (form.valid) {
      this.addEvent(); // Trigger the event submission
    } else {
      console.warn('Form is invalid');
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Method to add or update the event
  addEvent() {
    const formData = new FormData();
    formData.append("title", this.event.title);
    formData.append("description", this.event.description);
    formData.append("eventDate", this.event.eventDate);
    formData.append("endDate", this.event.endDate);
    formData.append("category", this.event.category);
    formData.append("location", this.event.location);
    formData.append("totalSlots", this.event.totalSlots?.toString() || '');
    formData.append("bookedSlots", this.event.bookedSlots ? this.event.bookedSlots.toString() : '0');
    formData.append("eventStatus", this.event.eventStatus);
    // formData.append("website", this.event.website);
    formData.append("targetAudience", this.event.targetAudience);

    if (this.selectedFile) {
      formData.append("image", this.selectedFile, this.selectedFile.name);
    }

    if (this.isEditing && this.eventId) {
      // Update existing event
      this.eventService.updateEvent(this.eventId, formData).subscribe({
        next: (response) => {
          this.showToast('success', 'Event updated successfully!');
          this.router.navigate(['hccmatadmin/all-events']);
        },
        error: (error) => {
          console.error("Error updating event:", error);
          this.showToast('error', 'Failed to update event. Please check your inputs.');
        }
      });
    } else {
      // Create new event
      this.eventService.createEvent(formData).subscribe({
        next: (response) => {
          this.showToast('success', 'Event created successfully!');
          this.router.navigate(['hccmatadmin/all-events']);
        },
        error: (error) => {
          console.error("Error creating event:", error);
          this.showToast('error', 'Failed to create event. Please check your inputs.');
        }
      });
    }
  }

  // Show a Toast notification
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

  // Method to handle edit mode when updating an event
  setEditMode(eventId: string, eventData: any) {
    this.isEditing = true;
    this.eventId = eventId;
    this.event = { ...eventData };
    if (eventData.imageUrl) {
      this.previewImage = eventData.imageUrl;
    }
    this.showToast('info', 'Editing event');
  }
}
