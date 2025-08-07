import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiteService } from 'src/app/services/site.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-addtestimonial',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './add-testimonial.component.html',
    styleUrls: ['./add-testimonial.component.scss'],
})
export class AddtestimonialComponent implements OnInit {
    name = '';
    profession = '';
    text = '';
    selectedImage: File | null = null;
    imagePreview: string | ArrayBuffer | null = null;

    testimonials: any[] = [];

    constructor(private siteService: SiteService) {}

    ngOnInit(): void {
        this.fetchTestimonials();
    }

    fetchTestimonials() {
        this.siteService.getTestimonials().subscribe({
            next: (data) => {
                this.testimonials = data;
            },
            error: (err) => console.error('Error fetching testimonials', err),
        });
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            this.selectedImage = input.files[0];
            const reader = new FileReader();
            reader.onload = () => (this.imagePreview = reader.result);
            reader.readAsDataURL(this.selectedImage);
        }
    }

    onSubmit(): void {
        if (!this.name || !this.profession || !this.text) {
            Swal.fire('Please fill all fields', '', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('name', this.name);
        formData.append('profession', this.profession);
        formData.append('text', this.text);
        if (this.selectedImage) formData.append('image', this.selectedImage);

        this.siteService.addTestimonial(formData).subscribe({
            next: (res) => {
                if (res?.data) {
                    this.testimonials.unshift(res.data);
                    Swal.fire(
                        'Added!',
                        'Testimonial added successfully',
                        'success'
                    );
                    this.resetForm();
                } else {
                    Swal.fire(
                        'Error',
                        'Unexpected response from server',
                        'error'
                    );
                }
            },
            error: () =>
                Swal.fire('Error', 'Failed to add testimonial', 'error'),
        });
    }

    deleteTestimonial(id: string) {
        console.log('Deleting testimonial with ID:', id); // <-- Debug log
        Swal.fire({
            title: 'Delete this testimonial?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
        }).then((result) => {
            if (result.isConfirmed) {
                this.siteService.deleteTestimonial(id).subscribe({
                    next: () => {
                        this.testimonials = this.testimonials.filter(
                            (t) => t.testimonialId !== id
                        );
                        Swal.fire('Deleted!', '', 'success');
                    },
                    error: (err) => {
                        console.error('API Error:', err);
                        Swal.fire(
                            'Error',
                            err?.error?.message || 'Failed to delete',
                            'error'
                        );
                    },
                });
            }
        });
    }

    resetForm() {
        this.name = '';
        this.profession = '';
        this.text = '';
        this.selectedImage = null;
        this.imagePreview = null;
    }
}
