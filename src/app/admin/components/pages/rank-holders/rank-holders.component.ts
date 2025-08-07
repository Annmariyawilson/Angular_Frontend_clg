import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteService } from 'src/app/services/site.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rank-holders',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './rank-holders.component.html',
  styleUrls: ['./rank-holders.component.scss']
})
export class RankHoldersComponent implements OnInit {
  rankHolders: any[] = [];
  imageError: string | null = null;
  filteredRankHolders: any[] = [];
  currentHolder: any = {
    name: '',
    contact: '',
    place: '',
    rank: '',
    department: '',
    course: '',
    mark: ''
  };
  previewImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isEdit: boolean = false;

  @ViewChild('rankModalCloseBtn') rankModalCloseBtn!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private siteService: SiteService) {}

  ngOnInit(): void {
    this.getAllRankHolders();
  }

  getAllRankHolders(): void {
    this.siteService.getRankHolders().subscribe({
      next: (data) => {
        this.rankHolders = data;
        this.filteredRankHolders = [...this.rankHolders];
        if (data.length === 0) {
          Swal.fire('Info', 'No rank holders found.', 'info');
        }
      },
      error: (err) => {
        console.error('Error loading rank holders:', err);
        Swal.fire('Error', 'Failed to load rank holders.', 'error');
      }
    });
  }

  search(event: any): void {
    const value = event.target.value.toLowerCase();
    this.filteredRankHolders = this.rankHolders.filter(holder =>
      holder.name?.toLowerCase().includes(value) ||
      holder.course?.toLowerCase().includes(value) ||
      holder.place?.toLowerCase().includes(value)
    );
  }

  openAddModal(): void {
    this.isEdit = false;
    this.resetForm();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.previewImage = null;
    this.imageError = null;

    if (this.selectedFile) {
      const fileType = this.selectedFile.type.split('/')[0];
      if (fileType !== 'image') {
        this.imageError = 'Please upload an image file.';
        this.selectedFile = null;
        return;
      }

      const maxSize = 2 * 1024 * 1024; // 2MB
      if (this.selectedFile.size > maxSize) {
        this.imageError = 'Please upload an image smaller than 2MB.';
        this.selectedFile = null;
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    Object.keys(this.currentHolder).forEach(key => {
      formData.append(key, this.currentHolder[key]);
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const request = this.isEdit
      ? this.siteService.updateRankHolder(this.currentHolder._id, formData)
      : this.siteService.addRankHolder(formData);

    request.subscribe({
      next: () => {
        this.getAllRankHolders();
        this.rankModalCloseBtn.nativeElement.click();
        this.resetForm();

        Swal.fire(
          'Success',
          `Rank holder ${this.isEdit ? 'updated' : 'added'} successfully!`,
          'success'
        ).then(() => {
        });
      },
      error: (err) => {
        console.error('Error saving rank holder:', err);
        Swal.fire('Error', 'Something went wrong while saving.', 'error');
      }
    });
  }

  updateRankHolder(holder: any): void {
    this.isEdit = true;
    this.currentHolder = { ...holder };
    this.previewImage = holder.imageUrl || null;
    this.selectedFile = null;
    this.imageError = null;
  }

  deleteRankHolder(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the rank holder.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        this.siteService.deleteRankHolder(id).subscribe({
          next: () => {
            this.getAllRankHolders();
            Swal.fire('Deleted!', 'Rank holder has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Error deleting rank holder:', err);
            Swal.fire('Error', 'Failed to delete rank holder.', 'error');
          }
        });
      }
    });
  }

  private resetForm(): void {
    this.currentHolder = {
      name: '',
      contact: '',
      place: '',
      rank: '',
      department: '',
      course: '',
      mark: ''
    };
    this.previewImage = null;
    this.selectedFile = null;
    this.imageError = null;
    this.isEdit = false;
  
    // Clear file input manually
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
  
}
