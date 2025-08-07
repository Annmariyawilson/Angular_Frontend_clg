import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteService } from 'src/app/services/site.service';
import { EnquiryService } from 'src/app/services/enquiry.service';
import { EventService } from 'src/app/services/event.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  applicationCount: any = {};
  enquiryCount: any = {};
  contactCount: any = {
    pending: 0,
    viewed: 0,
    replied: 0,
    closed: 0,
    rejected: 0,
    total: 0
  };

  eventCount: any = {
    total: 0,
    upcoming: 0,
    completed: 0,
    canceled: 0
  };

  boardMembers: any[] = [];
  enquiries: any[] = [];
  enquiryUpdates: any[] = [];
  selectedContact: any = null;
  contacts: any[] = [];
  events: any[] = [];
  placements: any[] = [];
  rankHolders: any[] = [];

  constructor(
    private enquiryService: EnquiryService,
    private eventService: EventService,
    private router: Router,
    private siteService: SiteService,
  ) { }

  ngOnInit(): void {
    this.fetchEnquiryData();
    this.fetchEventCount();
    this.fetchEnquiryUpdates();
    this.fetchContactCount();
    this.loadContacts();
    this.fetchEventList();
    this.loadPlacements();
    this.fetchRankHolders();
    this.fetchBoardMembers();
  }

  navigateTo(status: string) {
    this.router.navigate(['/hccmatadmin/all-applications'], {
      queryParams: { status }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'upcoming': return 'bg-primary';
      case 'completed': return 'bg-success';
      case 'canceled': return 'bg-danger';
      case 'postponed': return 'bg-warning';
      case 'in progress': return 'bg-info';
      default: return 'bg-secondary';
    }
  }
  truncateDescription(desc: string): string {
    if (!desc) return 'No description available.';
    return desc.length > 160 ? desc.slice(0, 80) + '...' : desc;
  }
  
  getStatusTextClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'upcoming': return 'text-primary';
      case 'completed': return 'text-success';
      case 'canceled': return 'text-danger';
      case 'postponed': return 'text-warning';
      case 'in progress': return 'text-info';
      default: return 'text-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status?.toLowerCase()) {
      case 'upcoming': return 'icon-clock';
      case 'completed': return 'icon-check-circle';
      case 'canceled': return 'icon-x-circle';
      case 'postponed': return 'icon-alert-triangle';
      case 'in progress': return 'icon-refresh-cw';
      default: return 'icon-info';
    }
  }

  loadContacts() {
    this.enquiryService.getAllContacts().subscribe({
      next: (res) => {
        this.contacts = res?.data || [];
      },
      error: (err: any) => {
        console.error('Error loading contacts:', err);
      }
    });
  }

  selectContact(contact: any) {
    this.selectedContact = { ...contact };
  }

  fetchEnquiryData() {
    this.enquiryService.getEnquiryList().subscribe(
      (response) => {
        if (response?.status && response?.data) {
          this.enquiries = response.data;
          this.applicationCount = response.formCount || {};
          this.enquiryCount = response.formCount || {};
        }
      },
      (error) => {
        console.error('Error fetching enquiries:', error);
      }
    );
  }

  fetchEventList() {
    this.eventService.getEvents().subscribe(
      (response) => {
        if (response?.status && response?.data) {
          this.events = response.data;
        }
      },
      (error) => {
        console.error('Error fetching event list:', error);
      }
    );
  }
  fetchBoardMembers() {
    this.siteService.getBoardMembers().subscribe(
      (response) => {
        if (response?.status && response?.data) {
          this.boardMembers = response.data;
        }
      },
      (error) => {
        console.error('Error fetching board members:', error);
      }
    );
  }
  fetchEventCount() {
    this.eventService.getEventCount().subscribe(
      (response) => {
        if (response?.status && response?.data) {
          this.eventCount = {
            total: response.data.total || 0,
            upcoming: response.data.upcoming || 0,
            completed: response.data.completed || 0,
            canceled: response.data.canceled || 0
          };
        }
      },
      (error) => {
        console.error('Error fetching event count:', error);
      }
    );
  }

  fetchEnquiryUpdates() {
    this.enquiryService.getEnquiryList().subscribe(
      (response) => {
        if (response?.status && response?.data) {
          this.enquiryUpdates = response.data.map((enquiry: any) => ({
            formId: enquiry.formId || 'N/A',
            name: enquiry.name || 'Unknown',
            email: enquiry.email || 'N/A',
            phone: enquiry.contact || 'N/A',
            status: enquiry.formStatus || 'Pending'
          }));
        }
      },
      (error) => {
        console.error('Error fetching enquiry updates:', error);
      }
    );
  }

  fetchContactCount() {
    this.enquiryService.getContactFormCounts().subscribe(
      (response) => {
        if (response?.status && response?.data) {
          this.contactCount = response.data;
        }
      },
      (error) => {
        console.error('Error fetching contact form counts:', error);
      }
    );
  }

  loadPlacements() {
    this.siteService.getPlacements().subscribe({
      next: (res: any) => {
        if (res.status) {
          this.placements = res.data;
        }
      },
      error: (err) => console.error('Error fetching placements:', err)
    });
  }

  fetchRankHolders() {
    this.siteService.getRankHolders().subscribe(
      (response) => {
        this.rankHolders = response || [];
      },
      (error) => {
        console.error('Error fetching rank holder data:', error);
      }
    );
  }
}
