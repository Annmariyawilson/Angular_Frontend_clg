import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EnquiryService } from 'src/app/services/enquiry.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent implements OnInit {

  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    termsAccepted: false
  };

  isSubmitting = false;
  submissionSuccess = false;
  submissionError = '';

  constructor(private enquiryService: EnquiryService) {}

  ngOnInit(): void {}

  submitForm(form: NgForm): void {
    if (form.invalid) {
      this.submissionError = 'Please fill out all required fields correctly.';
      return;
    }
  
    this.isSubmitting = true;
    this.submissionError = '';
    this.submissionSuccess = false;
  
    this.enquiryService.submitContact(this.formData).subscribe({
      next: () => {
        this.submissionSuccess = true;
        form.resetForm({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          termsAccepted: false
        });
  
        Swal.fire({
          icon: 'success',
          title: 'Message Sent!',
          text: 'Your message has been successfully sent. We will get back to you soon.',
          confirmButtonText: 'OK'
        }).then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 1500); 
        });
      },
      error: (err) => {
        console.error('Submission failed:', err);
        this.submissionError = 'Something went wrong. Please try again later.';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
  }
