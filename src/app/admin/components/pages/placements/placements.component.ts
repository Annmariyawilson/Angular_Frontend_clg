import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-placements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './placements.component.html',
  styleUrls: ['./placements.component.scss']
})
export class PlacementsComponent implements OnInit {
  placements: any[] = [];
  filteredPlacements: any[] = []; 

  searchKey: string = '';
  currentPlacement: any = {};
  isEdit: boolean = false;
  previewImage: string | ArrayBuffer | null = null;

  @ViewChild('placementForm') placementForm!: NgForm;
  @ViewChild('placementModalCloseBtn') placementModalCloseBtn!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private siteService: SiteService) {}

  ngOnInit(): void {
    this.loadPlacements();
  }

  loadPlacements() {
    this.siteService.getPlacements().subscribe({
      next: (res: any) => {
        if (res.status) {
          this.placements = res.data;
          this.applyFilter();
        }
      },
      error: (err) => {
        console.error('Error fetching placements:', err);
        Swal.fire('Error', 'Failed to load placements.', 'error');
      }
    });
  }

  search(event: any) {
    this.searchKey = event.target.value.toLowerCase();
    this.applyFilter();
  }

  applyFilter() {
    this.filteredPlacements = this.placements.filter(p =>
      p.name?.toLowerCase().includes(this.searchKey)
    );
  }

  onAdd() {
    this.isEdit = false;
    this.currentPlacement = {};
    this.previewImage = null;
    if (this.placementForm) this.placementForm.resetForm();
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }

  onEdit(placement: any) {
    this.isEdit = true;
    this.currentPlacement = JSON.parse(JSON.stringify(placement));
    this.previewImage = placement.imageUrl || null;
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }

  onDelete(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this placement?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.siteService.deletePlacement(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Placement has been deleted.', 'success');
            this.loadPlacements();
          },
          error: (err) => {
            console.error('Error deleting placement:', err);
            Swal.fire('Error', 'Failed to delete placement.', 'error');
          }
        });
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB
  
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        Swal.fire('Invalid File', 'Only JPG or PNG files are allowed.', 'error');
        this.fileInput.nativeElement.value = '';
        return;
      }
  
      if (file.size > maxSize) {
        Swal.fire('File Too Large', 'Image must be less than 2MB.', 'error');
        this.fileInput.nativeElement.value = '';
        return;
      }
  
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
      this.currentPlacement.imageFile = file;
    }
  }
  
  onSubmit() {
    if (!this.currentPlacement.name || !this.currentPlacement.company || !this.currentPlacement.designation) {
      Swal.fire('Error', 'Please fill in all required fields!', 'error');
      return;
    }
  
    if (!this.isEdit && !this.currentPlacement.imageFile) {
      Swal.fire('Error', 'Please upload a student image!', 'error');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', this.currentPlacement.name);
    formData.append('company', this.currentPlacement.company);
    formData.append('designation', this.currentPlacement.designation);
    formData.append('salary', this.currentPlacement.salary || '');
    formData.append('location', this.currentPlacement.location || '');
  
    if (this.currentPlacement.imageFile) {
      formData.append('image', this.currentPlacement.imageFile);
    }
  
    if (this.isEdit) {
      formData.append('_id', this.currentPlacement._id);
    }
  
    const request$ = this.isEdit
      ? this.siteService.updatePlacement(this.currentPlacement._id, formData)
      : this.siteService.addPlacement(formData);
  
    request$.subscribe({
      next: () => {
        this.placementModalCloseBtn.nativeElement.click();
        Swal.fire('Success', `${this.isEdit ? 'Placement updated' : 'Placement added'} successfully!`, 'success');
        this.loadPlacements();
        this.currentPlacement = {};
        this.previewImage = null;
        if (this.placementForm) this.placementForm.resetForm();
        if (this.fileInput) this.fileInput.nativeElement.value = '';
      },
      error: (err) => {
        console.error(`Error ${this.isEdit ? 'updating' : 'adding'} placement:`, err);
        Swal.fire('Error', `Failed to ${this.isEdit ? 'update' : 'add'} placement.`, 'error');
      }
    });
  }
  }
