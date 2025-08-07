import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EnquiryService } from 'src/app/services/enquiry.service';

@Component({
  selector: 'app-details',
  standalone: true,
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [EnquiryService]
})
export class DetailsComponent implements OnInit {
  studentForm!: FormGroup;
  isSidebarOpen: boolean = true;
  isToggling: boolean = false;

  statusOptions = ['Pending', 'Approved', 'Rejected', 'Completed'];
  originalStatus: string = '';
  isStatusChanged: boolean = false;

formFields = [
  { label: 'Full Name', name: 'fullName', type: 'text' },
  { label: 'Sex', name: 'sex', type: 'text' },
  { label: 'Course', name: 'course', type: 'text' },
  { label: 'Area of Study', name: 'areaOfStudy', type: 'text' },
  { label: "Father's Name", name: 'fatherName', type: 'text' },
  { label: "Mother's Name", name: 'motherName', type: 'text' },
  { label: 'Contact', name: 'contact', type: 'text' },
  { label: 'Email', name: 'email', type: 'email' },
  { label: 'Present Address', name: 'address', type: 'text' },
  { label: 'Date of Birth', name: 'dob', type: 'date' },
  { label: 'Nationality', name: 'nationality', type: 'text' },
  { label: 'Referred By', name: 'referredBy', type: 'text' }
];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private enquiryService: EnquiryService
  ) { }

  ngOnInit(): void {
    this.initializeForm();

    this.route.paramMap.subscribe(params => {
      const formId = params.get('formId');
      if (formId) {
        this.fetchApplicationDetails(formId);
      } else {
        console.error('formId is null or undefined');
      }
    });
  }

  // Initialize the student form
  initializeForm(): void {
    this.studentForm = this.fb.group({
      applicationId: [{ value: '', disabled: true }, Validators.required],
      applicationStatus: [{ value: '', disabled: true }, Validators.required],
      fullName: [{ value: '', disabled: true }, Validators.required],
      sex: [{ value: '', disabled: true }, Validators.required],
      course: [{ value: '', disabled: true }, Validators.required],
      areaOfStudy: [{ value: '', disabled: true }, Validators.required],
      fatherName: [{ value: '', disabled: true }, Validators.required],
      motherName: [{ value: '', disabled: true }, Validators.required],
      contact: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      address: [{ value: '', disabled: true }, Validators.required],
      referredBy: [{ value: '', disabled: true }, Validators.required],
      dob: [{ value: '', disabled: true }, Validators.required],
      nationality: [{ value: '', disabled: true }, Validators.required],
      status: ['', Validators.required],
      cancellationReason: [''],
      rejectionReason: ['']
    });
  }

  // Fetch application details from backend
  fetchApplicationDetails(formId: string): void {
    this.enquiryService.getEnquiryById(formId).subscribe(
      (response) => {
        if (response?.status && response.data) {
          const data = response.data;

          this.originalStatus = this.capitalizeFirstLetter(data.formStatus || '');

          this.studentForm.patchValue({
            applicationId: data.formId || '',
            fullName: data.name || '',
            fatherName: data.fatherName || '',
            motherName: data.motherName || '',
            contact: data.contactNo || '',
            email: data.email || '',
            address: data.presentAddress || '',
            dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
            nationality: data.nationality || '',
            referredBy: data.referredBy || '',
            applicationStatus: data.formStatus || '',
            course: data.course || '',
            areaOfStudy: data.areaOfStudy || '',
            sex: data.sex || '',
            status: this.originalStatus,
            rejectionReason: data.formStatus?.toLowerCase() === 'rejected' ? data.comments || '' : ''
          });

          this.trackStatusChanges();
        } else {
          console.error('Invalid response data:', response);
        }

        
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error fetching application details.',
          confirmButtonColor: '#d33'
        });
      }
    );
  }

  // Detect changes in status dropdown
  trackStatusChanges(): void {
    this.studentForm.get('status')?.valueChanges.subscribe(currentStatus => {
      this.isStatusChanged = currentStatus !== this.originalStatus;
    });
  }

  // Capitalize the first letter of status
  capitalizeFirstLetter(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  // Update application status
  updateApplicationStatus(): void {
    if (this.studentForm.valid && this.isStatusChanged) {
      const payload = {
        formId: this.studentForm.get('applicationId')?.value || '',
        status: (this.studentForm.get('status')?.value || '').toLowerCase(),
        comment: this.studentForm.get('cancellationReason')?.value || this.studentForm.get('rejectionReason')?.value || ''
      };

      this.enquiryService.updateEnquiry(payload).subscribe(
        (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Application status updated successfully!',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            this.router.navigate(['/hccmatadmin/all-applications']);
          });
        },
        (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: 'Error updating the application status.',
            confirmButtonColor: '#d33'
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'No Changes!',
        text: 'Please change the status before updating.',
        confirmButtonColor: '#f39c12'
      });
    }
  }

  // Navigate back to applications list
  goBack(): void {
    this.router.navigate(['/hccmatadmin/all-applications']);
  }

  // Toggle sidebar visibility
  toggleSidebar(): void {
    if (this.isToggling) return;
    this.isToggling = true;
    this.isSidebarOpen = !this.isSidebarOpen;
    setTimeout(() => {
      this.isToggling = false;
    }, 300);
  }
}
