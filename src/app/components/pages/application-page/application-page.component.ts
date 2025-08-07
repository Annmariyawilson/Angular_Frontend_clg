import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnquiryService } from 'src/app/services/enquiry.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-application-page',
  templateUrl: './application-page.component.html',
  styleUrls: ['./application-page.component.scss']
})
export class ApplicationPageComponent implements OnInit {
  applicationForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  displayedCourses: string[] = [];

UG_Courses: string[] = [
  "B.COM (Honours) - Co-Operation, Finance & Taxation, Logistics Management",
  "BA (Honours) English",
  "BBA (Honours) - Business Analytics, Supply Chain Management (AICTE Approved)",
  "BSW (Honours) - Medical and Psychiatric, Labour Welfare Social Work",
  "BCA (Honours) - Data Science & AI (AICTE Approved)",
  "BTTM (Honours) - Aviation Management, Tour Operation Management"
];

PG_Courses: string[] = [
  "M.COM - Master of Commerce in Finance & Taxation",
  "MTTM - Master of Tourism and Travel Management",
  "MSW - Master of Social Work",
  "MAHRM - Master of Arts in Human Resource Management",
  "M.Sc Computer Science - Master of Science in Computer Science",
  "MCA - Master of Computer Applications"
];

Distance_Courses: string[] = ["CHR", "CTE", "PGDPM"];

  constructor(
    private fb: FormBuilder,
    private enquiryService: EnquiryService,
    private cdRef: ChangeDetectorRef
  ) {
    this.applicationForm = this.fb.group({
      name: ['', Validators.required],
      fatherName: ['', Validators.required],
      motherName: ['', Validators.required],
      sex: ['', Validators.required],
      contactNo: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]{10}$')  
      ]],
      email: ['', [
        Validators.required, 
        Validators.pattern('^[a-zA-Z0-9._%+-]+@gmail\.com$')  
      ]],
      presentAddress: ['', Validators.required],
      dob: ['', [
        Validators.required, 
      ]],
      nationality: ['', Validators.required],
      areaOfStudy: ['', Validators.required],
      course: ['', Validators.required],
      referredBy: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onCategoryChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (!selectedValue) {
      this.displayedCourses = [];
    } else {
      this.applicationForm.patchValue({ course: '' });

      switch (selectedValue) {
        case 'UG':
          this.displayedCourses = [...this.UG_Courses];
          break;
        case 'PG':
          this.displayedCourses = [...this.PG_Courses];
          break;
        case 'Distance':
          this.displayedCourses = [...this.Distance_Courses];
          break;
        default:
          this.displayedCourses = [];
      }
    }

    this.cdRef.detectChanges();

  }

submitApplication(): void {
  if (this.applicationForm.invalid) {
    this.applicationForm.markAllAsTouched();
    this.errorMessage = 'Please fill in all required fields correctly.';
    return;
  }

  this.isSubmitting = true;


  this.enquiryService.addEnquiry(this.applicationForm.value).subscribe({
    next: () => {
      this.successMessage = 'Application submitted successfully!';
      this.isSubmitting = false;

      Swal.fire({
        icon: 'success',
        title: 'Thank you!',
        text: 'Your application has been submitted successfully.',
        confirmButtonText: 'OK'
      });

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
    error: (error) => {
      console.error('Error submitting application:', error); 
      this.errorMessage = 'Failed to submit the application. Please try again later.';
      this.isSubmitting = false;
    },
  });

  
}



}
