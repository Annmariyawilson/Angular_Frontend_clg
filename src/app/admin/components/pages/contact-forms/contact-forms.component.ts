import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnquiryService } from 'src/app/services/enquiry.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Pipe({
  name: 'truncateWords',
  standalone: true
})
export class TruncateWordsPipe implements PipeTransform {
  transform(value: string, wordLimit: number): string {
    if (!value) return '';
    const words = value.split(' ');
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(' ') + '...'
      : value;
  }
}

@Component({
  selector: 'app-contact-forms',
  standalone: true,
  imports: [CommonModule, FormsModule, TruncateWordsPipe],
  templateUrl: './contact-forms.component.html',
  styleUrls: ['./contact-forms.component.scss']
})
export class ContactFormsComponent implements OnInit {
  contacts: any[] = [];
  selectedContact: any = null;
  formView: boolean = false;
  searchTerm: string = '';
  selectedStatus: string = '';
  statusOptions: string[] = [ "viewed",'closed', 'pending'];
  statusViewForm: string[] = [ "viewed",'closed' ];

  constructor(private enquiryService: EnquiryService, private router: Router) { }

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts() {
    this.enquiryService.getAllContacts().subscribe({
      next: (res) => {
        this.contacts = res?.data || [];
      },
      error: (err: any) => {
        console.error('Error loading contacts:', err);
      },
    });
  }

  get filteredContacts() {
    return this.contacts.filter(contact => {
      const matchesStatus = !this.selectedStatus || contact.status === this.selectedStatus;
      const matchesSearch = !this.searchTerm || (
        contact.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.subject?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.message?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      return matchesStatus && matchesSearch;
    });
  }

  selectContact(contact: any) {
    this.selectedContact = { ...contact };
    if(contact.status !=='closed'){this.enquiryService.updateContactStatus({
      contactId: this.selectedContact.contactId,
      status: 'viewed',
    }).subscribe({
      next: () => {
        this.selectedContact.formViewedStatus = true;
        this.selectedContact.status = 'viewed';

        // Optional: Update the main contacts array as well
        const index = this.contacts.findIndex(c => c.contactId === contact.contactId);
        if (index > -1) {
          this.contacts[index] = { ...this.contacts[index], formViewedStatus: true, status: 'viewed' };
        }
      },
      error: (err) => {
        this.showToast('error', err);
        
      }
    });}
  }

  closeSidebar() {
    this.selectedContact = null;
  }

 
  saveStatus(contact: any) {
    this.enquiryService.updateContactStatus({
      contactId: contact.contactId,
      status: contact.status
    }).subscribe({
      next: () => {
        const index = this.contacts.findIndex(c => c.contactId === contact.contactId);
        if (index > -1) {
          this.contacts[index] = { ...this.contacts[index], status: contact.status };
        }
        this.showToast('success', `Status updated to "${contact.status}"`);
        this.closeSidebar()
        
      
      },
      error: (err: any) => {
        console.error('Failed to update status', err);
        this.showToast('error', 'Failed to update status');
      }
    });
  }

  deleteContact(contactId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This contact will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.enquiryService.deleteContact(contactId).subscribe({
          next: () => {
            this.contacts = this.contacts.filter(c => c.contactId !== contactId);
            if (this.selectedContact?.contactId === contactId) {
              this.selectedContact = null;
            }
            this.showToast('success', 'Contact deleted successfully');
          },
          error: (err: any) => {
            console.error('Error deleting contact:', err);
            this.showToast('error', 'Failed to delete contact');
          }
        });
      }
    });
  }

  private showToast(icon: 'success' | 'error' | 'info' | 'warning', title: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
    Toast.fire({ icon, title });
  }
}
