import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EnquiryService } from 'src/app/services/enquiry.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-allapplications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-applications.component.html',
  styleUrls: ['./all-applications.component.scss']
})
export class AllapplicationsComponent implements OnInit {
  isSidebarOpen: boolean = false;
  isToggling: boolean = false;
  tableHeading: string = 'All Applications';

  applications: any[] = [];
  filteredApplications: any[] = [];

  searchTerm: string = '';
  selectedStatus: string = 'All';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 6;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private enquiryService: EnquiryService
  ) {}

  ngOnInit() {
    this.fetchApplications();
  }

  fetchApplications() {
    this.enquiryService.getEnquiryList().subscribe(
      (response) => {
        if (response?.status && Array.isArray(response.data)) {
          this.applications = response.data;
          this.route.queryParams.subscribe(params => {
            this.selectedStatus = params['status'] || 'All';
            this.applySearchAndFilter();
          });
        } else {
          this.applications = [];
          this.filteredApplications = [];
        }
      },
      (error) => {
        console.error('Error fetching applications:', error);
      }
    );
  }

  goBack() {
    this.router.navigate(['/hccmatadmin/dashboard']);
  }

  viewDetails(application: any) {
    if (!application?.formId) {
      alert("Invalid application data.");
      return;
    }
    this.router.navigate(['/hccmatadmin/details', application.formId]); 
  }

  deleteApplication(formId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.enquiryService.deleteEnquiry(formId).subscribe(
          (response) => {
            this.applications = this.applications.filter(app => app.formId !== formId);
            this.applySearchAndFilter();
            Swal.fire('Deleted!', 'Application has been deleted.', 'success');
          },
          (error) => {
            Swal.fire('Failed!', 'Failed to delete application.', 'error');
          }
        );
      }
    });
  }

  applySearchAndFilter() {
    const status = this.selectedStatus.toLowerCase();
    const term = this.searchTerm.toLowerCase();

    this.filteredApplications = this.applications.filter(application => {
      const matchesStatus = status === 'all' || application.formStatus?.toLowerCase() === status;

      const combinedFields = `
        ${application.formId ?? ''}
        ${application.name ?? ''}
        ${application.course ?? ''}
        ${application.sex ?? ''}
        ${application.contactNo ?? ''}
        ${application.email ?? ''}
        ${application.dob ?? ''}
        ${application.nationality ?? ''}
      `.toLowerCase();

      const matchesSearch = combinedFields.includes(term);

      return matchesStatus && matchesSearch;
    });

    this.currentPage = 1; // Reset page on filter change
  }

  // Pagination helpers
  get paginatedApplications(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredApplications.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredApplications.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
