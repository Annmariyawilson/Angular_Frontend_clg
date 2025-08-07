import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SiteService } from 'src/app/services/site.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-faculty',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './all-faculty.component.html',
  styleUrls: ['./all-faculty.component.scss'],
})
export class AllFacultyComponent implements OnInit {
  sortKey: string = '';
  isEditing: boolean = false;
  showForm: boolean = false;
  facultyList: any[] = [];
  originalFacultyList: any[] = [];
  editingIndex: number | null = null;
  editingFaculty: any = null;
  imageTouched = false;

jobTitles = [
  'Professor',
  'Assistant Professor',
  'Associate Professor',
  'Senior Lecturer',
  'Lecturer',
  'Visiting Professor',
  'Adjunct Professor',
  'Research Fellow',
  'Head of Department',
  'Assistant Dean',
  'Dean of Academics',
  'Principal',
  'Vice Principal',
  'Academic Coordinator',
  'Course Coordinator',
  'Placement Officer',
  'Training and Development Officer',
  'Program Director',
  'Department Coordinator',
  'Lab Instructor',
  'IT Support Faculty',
  'Library Science Faculty',
  'Student Counselor',
  'Soft Skills Trainer',
  'Language Instructor',
  'Physical Education Trainer'
];

categories = [
  'Permanent',
  'Contract',
  'Guest',
  'Temporary',
  'Probationary',
  'Adjunct',
  'Visiting',
  'Freelancer',
  'Retired',
  'Part-Time',
  'Full-Time',
  'Honorary',
  'On Deputation',
  'Intern Faculty',
  'Consultant Faculty',
  'Research Associate',
  'Teaching Assistant',
  'Industry Expert',
  'Emeritus Professor'
];

  departments = [
  'Department of Commerce',
  'Department of Computer Science',
  'Department of English',
  'Department of Management',
  'Department of Tourism',
  'Department of Mathematics',
  'Department of Physics',
  'Department of Chemistry',
  'Department of History',
  'Department of Social Work',
  'Department of Psychology',
  'Department of Data Science and AI',
  'Department of Business Analytics',
  'Department of Supply Chain Management',
  'Department of Cyber Security',
  'Department of Aviation and Logistics',
  'Department of Robotics and AI',
  'Department of Digital Marketing',
  'Department of Foreign Languages (German, French)',
  'Department of Fashion Design and Textiles',
  'Department of Library and Information Science',
  'Department of Communication and Public Speaking',
  'Department of Organic Farming and Sustainability'
];

  newFaculty = {
    name: '',
    email: '',
    contact: '',
    place: '',
    jobTitle: '',
    category: '',
    department: '',
    image: null as File | null,
    imagePreview: ''
  };
name: any;

  constructor(private router: Router, private siteService: SiteService) {}

  ngOnInit(): void {
    this.fetchFacultyList();
  }

  fetchFacultyList() {
    this.siteService.getFaculty().subscribe(
      (response) => {
        this.facultyList = response.data;
        this.originalFacultyList = [...response.data];
      },
      (error) => {
        console.error('Error fetching faculty:', error);
        Swal.fire('Error', 'Failed to fetch faculty list', 'error');
      }
    );
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  addFaculty() {
    this.imageTouched = true;
  
    if (!this.newFaculty.image) {
      Swal.fire('Warning', 'Image is required', 'warning');
      return;
    }
  
    if (
      this.newFaculty.name &&
      this.newFaculty.email &&
      this.newFaculty.contact &&
      this.newFaculty.place &&
      this.newFaculty.jobTitle &&
      this.newFaculty.category &&
      this.newFaculty.department
    ) {
      const formData = new FormData();
      for (const key in this.newFaculty) {
        if (key !== 'imagePreview' && this.newFaculty[key as keyof typeof this.newFaculty]) {
          formData.append(
            key,
            this.newFaculty[key as keyof typeof this.newFaculty] as any
          );
        }
      }
  
      this.siteService.addFaculty(formData).subscribe(
        (response) => {
          this.fetchFacultyList(); 
          this.resetForm(); 
          Swal.fire('Success', 'Faculty added successfully!', 'success');
        },
        (error) => {
          console.error('Error adding faculty:', error);
          Swal.fire('Error', 'Failed to add faculty', 'error');
        }
      );
    } else {
      Swal.fire('Warning', 'Please fill all required fields', 'warning');
    }
  }
  
  toggleEdit(index: number) {
    if (this.editingIndex === index) {
      this.updateFaculty(this.facultyList[index]._id);
    } else {
      this.editingIndex = index;
      this.editingFaculty = { ...this.facultyList[index], image: null };
    }
  }

  cancelEdit() {
    this.editingIndex = null;
    this.editingFaculty = null;
  }

  updateFaculty(facultyId: string) {
    if (!this.editingFaculty) return;

    const formData = new FormData();
    for (const key in this.editingFaculty) {
      const value = this.editingFaculty[key];
      if (key === 'image' && value instanceof File) {
        formData.append('image', value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    }

    this.siteService.updateFaculty(facultyId, formData).subscribe(
      () => {
        this.fetchFacultyList();
        this.cancelEdit();
        Swal.fire('Success', 'Faculty updated successfully!', 'success');
      },
      (error) => {
        console.error('Error updating faculty:', error);
        Swal.fire('Error', 'Failed to update faculty', 'error');
      }
    );
  }

  deleteUser(facultyId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.siteService.deleteFaculty(facultyId).subscribe(
          () => {
            this.fetchFacultyList();
            Swal.fire('Deleted!', 'Faculty member has been deleted.', 'success');
          },
          (error) => {
            console.error('Error deleting faculty:', error);
            Swal.fire('Error', 'Failed to delete faculty', 'error');
          }
        );
      } else {
        Swal.fire('Cancelled', 'The deletion has been cancelled', 'info');
      }
    });
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newFaculty.image = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.newFaculty.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file && this.editingFaculty) {
      this.editingFaculty.image = file;
    }
  }

  search(event: any) {
    const searchKey = event.target.value.toLowerCase();
    if (!searchKey) {
      this.facultyList = [...this.originalFacultyList];
    } else {
      this.facultyList = this.originalFacultyList.filter(faculty =>
        faculty.name.toLowerCase().includes(searchKey) ||
        faculty.email.toLowerCase().includes(searchKey) ||
        faculty.department.toLowerCase().includes(searchKey)
      );
    }
  }

  resetForm() {
    this.newFaculty = {
      name: '',
      email: '',
      contact: '',
      place: '',
      jobTitle: '',
      category: '',
      department: '',
      image: null,
      imagePreview: ''
    };
    this.showForm = false;
  }
}
