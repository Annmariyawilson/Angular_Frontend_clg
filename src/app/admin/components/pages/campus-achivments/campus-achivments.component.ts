import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiteService } from 'src/app/services/site.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-campus-achivments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campus-achivments.component.html',
  styleUrls: ['./campus-achivments.component.scss']
})
export class CampusAchivmentsComponent implements OnInit {
  showForm = false;
  isEditMode = false;
  selectedFile: File | null = null;
  isLoading = false;
  imagePreviewUrl: string | ArrayBuffer | null = null;

  blogForm: any = {
    title: '',
    description: '',
    achievementType: '',
    date: new Date().toISOString(),
    achievementId: ''
  };

  blogList: any[] = [];
  filteredList: any[] = [];

  achievementTypes: string[] = ['TECHNOLOGY', 'RESEARCH', 'SPORTS', 'CULTURAL', 'OTHER'];
  selectedType: string = ''; // used for filtering dropdown
  searchQuery: string = '';

  constructor(private siteService: SiteService) {}

  ngOnInit(): void {
    this.fetchCampusAchievements();
  }

  toggleForm(mode: 'add' | 'edit', blog?: any): void {
    this.isEditMode = mode === 'edit';
    this.showForm = true;
    this.selectedFile = null;

    if (this.isEditMode && blog) {
      this.blogForm = { ...blog };
      this.imagePreviewUrl = blog.imageUrl;
    } else {
      this.blogForm = {
        title: '',
        description: '',
        achievementType: '',
        date: new Date().toISOString(),
        achievementId: ''
      };
      this.imagePreviewUrl = null;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileType = file.type;
      
      // Check if the file type is either JPG or PNG
      if (fileType === 'image/jpeg' || fileType === 'image/png') {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviewUrl = reader.result;
        };
        reader.readAsDataURL(this.selectedFile);
      } else {
        // Show error message for unsupported file type
        Swal.fire({
          icon: 'error',
          title: 'Invalid file type',
          text: 'Please upload a JPG or PNG image.',
          position: 'top-end',
          toast: true,
          timer: 3000,
          showConfirmButton: false
        });
      }
    }
  }
  
  submitForm(): void {
    if (
      this.blogForm.title &&
      this.blogForm.description &&
      this.blogForm.achievementType
    ) {
      this.isLoading = true;
  
      const formData = new FormData();
      formData.append('title', this.blogForm.title);
      formData.append('description', this.blogForm.description);
      formData.append('achievementType', this.blogForm.achievementType);
      formData.append('date', this.blogForm.date);
  
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
  
      if (this.isEditMode) {
        this.siteService.updateCampusAchievement(this.blogForm.achievementId, formData).subscribe({
          next: () => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Achievement updated successfully!',
              toast: true,
              showConfirmButton: false,
              timer: 3000
            });
            this.resetForm();
            window.location.reload(); // Force a page reload after update
          },
          error: err => {
            Swal.fire({
              icon: 'error',
              title: 'Update failed',
              text: err.message
            });
            this.isLoading = false;
          }
        });
      } else {
        if (!this.selectedFile) {
          Swal.fire({
            icon: 'warning',
            title: 'Please select an image for new achievement.',
            toast: true,
            position: 'top-end',
            timer: 3000
          });
          this.isLoading = false;
          return;
        }
        this.siteService.addCampusAchievement(formData).subscribe({
          next: () => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'New achievement added!',
              toast: true,
              showConfirmButton: false,
              timer: 3000
            });
            this.resetForm();
            window.location.reload(); // Force a page reload after adding
          },
          error: err => {
            Swal.fire({
              icon: 'error',
              title: 'Add failed',
              text: err.message
            });
            this.isLoading = false;
          }
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Please fill all fields.',
        toast: true,
        position: 'top-end',
        timer: 3000
      });
    }
  }

  fetchCampusAchievements(): void {
    this.isLoading = true;
    this.siteService.getCampusAchievements().subscribe({
      next: (res: any) => {
        const achievements = res.data || res.achievements || res || [];
        this.blogList = achievements.map((item: any) => ({
          _id: item._id,
          achievementId: item.achievementId,
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl,
          achievementType: item.achievementType,
          date: new Date(item.date).toLocaleDateString()
        }));
        this.applyFilters();
        this.isLoading = false;
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to fetch achievements',
          text: err.message
        });
        this.isLoading = false;
      }
    });
  }

  deleteContent(index: number): void {
    const blog = this.filteredList[index];
    Swal.fire({
      title: 'Are you sure?',
      text: 'This achievement will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.siteService.deleteCampusAchievement(blog.achievementId).subscribe({
          next: () => {
            this.fetchCampusAchievements();
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Achievement deleted!',
              toast: true,
              showConfirmButton: false,
              timer: 3000
            });
          },
          error: err => {
            Swal.fire({
              icon: 'error',
              title: 'Delete failed',
              text: err.message
            });
            this.isLoading = false;
          }
        });
      }
    });
  }

  resetForm(): void {
    this.blogForm = {
      title: '',
      description: '',
      achievementType: '',
      date: new Date().toISOString(),
      achievementId: ''
    };
    this.selectedFile = null;
    this.showForm = false;
    this.isEditMode = false;
    this.isLoading = false;
  }

  applyFilters(): void {
    this.filteredList = this.blogList.filter(blog => {
      const matchesSearch = this.searchQuery
        ? blog.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;
      const matchesType = this.selectedType
        ? blog.achievementType === this.selectedType
        : true;
      return matchesSearch && matchesType;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  clearFilter(): void {
    this.selectedType = '';
    this.applyFilters();
  }
}
