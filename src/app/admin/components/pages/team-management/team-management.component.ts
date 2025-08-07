import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SiteService } from 'src/app/services/site.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-team-management',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.scss'],
})
export class TeamManagementComponent implements OnInit {


  emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  contactPattern = /^\d{10}$/;
  placePattern = /^[a-zA-Z\s]+$/;
  showForm = false;
  editingIndex: number | null = null;
  editingBoard: any = null;
  boardList: any[] = [];
  originalBoardList: any[] = [];
  selectedType = '';
  newBoard = {
    name: '',
    email: '',
    contact: '',
    place: '',
    jobTitle: '',
    category: '',
    department: '',
    type: '',
    image: null as File | null,
    imagePreview: '',
    imageUrl: '',
  };

jobTitles: string[] = [
  // Academic
  'Professor',
  'Assistant Professor',
  'Associate Professor',
  'Lecturer',
  'Senior Lecturer',
  'Visiting Professor',
  'Adjunct Professor',
  'Research Fellow',
  'Head of Department',
  'Dean',
  'Assistant Dean',
  'Academic Coordinator',
  'Course Coordinator',
  'Lab Instructor',
  'Teaching Assistant',

  // Board / Governance
  'Chairman',
  'Vice Chairman',
  'Principal',
  'Vice Principal',
  'Secretary',
  'Joint Secretary',
  'Assistant Secretary',
  'Treasurer',
  'Joint Treasurer',
  'Director',
  'Assistant Director',
  'Executive Director',
  'Board Member',
  'Trustee',
  'Founder Member',
  'Chief Advisor',
  'Advisory Board Member',
  'Patron',

  // Administrative
  'Administrative Officer',
  'Finance Officer',
  'HR Manager',
  'Public Relations Officer',
  'Legal Advisor',
  'IQAC Coordinator',
  'NAAC Coordinator',
  'NSS Program Officer',
  'Placement Cell Head',
  'Exam Cell Coordinator',
  'Admissions Officer',

  // Support & Technical Staff
  'Librarian',
  'Assistant Librarian',
  'Library Assistant',
  'IT Support Staff',
  'System Administrator',
  'Network Administrator',
  'Office Assistant',
  'Clerk',
  'Receptionist',
  'Data Entry Operator',
  'Technical Assistant',
  'Lab Assistant',

  // Maintenance & Operations
  'Cleaner',
  'Sweeper',
  'Security Staff',
  'Driver',
  'Gardener',
  'Electrician',
  'Plumber',
  'Maintenance Worker',
  'Peon',
  'Watchman'
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

  imageTouched = false;

  constructor(private router: Router, private siteService: SiteService) { }

  ngOnInit(): void {
    this.fetchBoardList();
  }

  fetchBoardList() {
    this.siteService.getBoardMembers(this.selectedType).subscribe({
      next: (res) => {
        this.boardList = res.data;
        this.originalBoardList = [...this.boardList];
      },
      error: (err) => {
        console.error('Error loading board members', err);
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Error loading board members!' });
      },
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.resetForm();
  }

  addBoardMember() {
    if (!this.newBoard.name || !this.newBoard.email || !this.newBoard.type || !this.newBoard.image) {
      Swal.fire({ icon: 'warning', title: 'Missing Fields', text: 'Name, Email, Type, and Image are required' });
      return;
    }

    // Check if adding a 4th visionary
    if (this.newBoard.type === 'Visionary') {
      const visionaryCount = this.boardList.filter(member => member.type === 'Visionary').length;
      if (visionaryCount >= 3) {
        Swal.fire({
          icon: 'warning',
          title: 'Limit Reached',
          text: 'Only up to 3 Visionaries can be added to the team.'
        });
        return;
      }
    }

    const formData = new FormData();
    formData.append('name', this.newBoard.name);
    formData.append('email', this.newBoard.email);
    formData.append('contact', this.newBoard.contact);
    formData.append('place', this.newBoard.place);
    formData.append('jobTitle', this.newBoard.jobTitle);
    formData.append('category', this.newBoard.category);
    formData.append('department', this.newBoard.department);
    formData.append('type', this.newBoard.type);
    if (this.newBoard.image) {
      formData.append('image', this.newBoard.image);
    }

    this.siteService.addBoardMember(formData).subscribe({
      next: () => {
        this.fetchBoardList();
        this.resetForm();
        Swal.fire({ icon: 'success', title: 'Success!', text: 'Board Member Added!' });
      },
      error: (err) => {
        console.error('Add failed', err);
        Swal.fire({ icon: 'error', title: 'Failed!', text: 'Failed to add board member!' });
      },
    });
  }

  toggleEdit(index: number) {
    this.editingIndex = index;
    this.editingBoard = { ...this.boardList[index], image: null, imagePreview: '', imageUrl: this.boardList[index].imageUrl };
  }

  cancelEdit() {
    this.editingIndex = null;
    this.editingBoard = null;
  }

  updateBoardMember(memberId: string) {
    if (!this.editingBoard.name || !this.editingBoard.email || !this.editingBoard.type) {
      Swal.fire({ icon: 'warning', title: 'Missing Fields', text: 'Name, Email, and Type are required' });
      return;
    }

    if (!this.emailPattern.test(this.editingBoard.email)) {
      Swal.fire({ icon: 'warning', title: 'Invalid Email', text: 'Please enter a valid email address' });
      return;
    }

    if (this.editingBoard.contact && !this.contactPattern.test(this.editingBoard.contact)) {
      Swal.fire({ icon: 'warning', title: 'Invalid Contact', text: 'Please enter a valid 10-digit contact number' });
      return;
    }

    if (this.editingBoard.place && !this.placePattern.test(this.editingBoard.place)) {
      Swal.fire({ icon: 'warning', title: 'Invalid Place', text: 'Place should contain only letters and spaces' });
      return;
    }

    const currentMember = this.boardList.find(m => m.memberId === memberId);
    const isChangingToVisionary = this.editingBoard.type === 'Visionary' && currentMember.type !== 'Visionary';

    if (isChangingToVisionary) {
      const visionaryCount = this.boardList.filter(m => m.type === 'Visionary').length;
      if (visionaryCount >= 3) {
        Swal.fire({
          icon: 'warning',
          title: 'Limit Reached',
          text: 'Only up to 3 Visionaries can be added to the team.'
        });
        return;
      }
    }

    const formData = new FormData();
    formData.append('name', this.editingBoard.name);
    formData.append('email', this.editingBoard.email);
    formData.append('contact', this.editingBoard.contact);
    formData.append('place', this.editingBoard.place);
    formData.append('jobTitle', this.editingBoard.jobTitle);
    formData.append('category', this.editingBoard.category);
    formData.append('department', this.editingBoard.department);
    formData.append('type', this.editingBoard.type);
    if (this.editingBoard.image) {
      formData.append('image', this.editingBoard.image);
    }

    this.siteService.updateBoardMember(memberId, formData).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Updated Successfully' });
        this.editingIndex = null;
        this.fetchBoardList();
      },
      error: () => {
        Swal.fire({ icon: 'error', title: 'Update Failed', text: 'Something went wrong while updating!' });
      }
    });
  }

  deleteBoardMember(memberId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this member?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((res) => {
      if (res.isConfirmed) {
        this.siteService.deleteBoardMember(memberId).subscribe({
          next: () => {
            this.fetchBoardList();
            Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Member deleted successfully' });
          },
          error: (err) => {
            console.error('Delete failed', err);
            Swal.fire({ icon: 'error', title: 'Failed!', text: 'Failed to delete member!' });
          },
        });
      }
    });
  }

  filterByType() {
    this.siteService.getBoardMembers(this.selectedType).subscribe({
      next: (res) => {
        this.boardList = res.data;
        this.originalBoardList = [...this.boardList];
      },
      error: (err) => {
        console.error('Error filtering members', err);
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Error filtering members!' });
      },
    });
  }

  search(event: any) {
    const key = event.target.value.toLowerCase();
    this.boardList = key ? this.originalBoardList.filter((m) =>
      m.name.toLowerCase().includes(key) || m.email.toLowerCase().includes(key) || m.department.toLowerCase().includes(key)) :
      [...this.originalBoardList];
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
        Swal.fire({ icon: 'error', title: 'Invalid Image Type', text: 'Only .jpg and .png images are allowed!' });
        return;
      }
      this.newBoard.image = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.newBoard.imagePreview = reader.result as string;
        this.imageTouched = true;
      };
      reader.readAsDataURL(file);
    } else {
      this.newBoard.image = null;
      this.newBoard.imagePreview = '';
      this.imageTouched = true;
    }
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file && this.editingBoard) {
      const fileType = file.type;
      if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
        Swal.fire({ icon: 'error', title: 'Invalid Image Type', text: 'Only .jpg and .png images are allowed!' });
        return;
      }
      this.editingBoard.image = file;
      const reader = new FileReader();
      reader.onload = () => this.editingBoard.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  resetForm() {
    this.newBoard = {
      name: '',
      email: '',
      contact: '',
      place: '',
      jobTitle: '',
      category: '',
      department: '',
      type: '',
      image: null,
      imagePreview: '',
      imageUrl: '',
    };
    this.imageTouched = false;
    this.showForm = false;
  }

  deleteMember(index: number) {
    const member = this.boardList[index];
    if (member && member._id) this.deleteBoardMember(member._id);
  }
}
