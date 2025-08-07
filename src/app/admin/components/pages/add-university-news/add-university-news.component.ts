import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NewsService } from 'src/app/services/news.service';
import Swal from 'sweetalert2';

export interface NewsItem {
  _id: string | null;
  newsId: string;
  title: string;
  description?: string;
  date: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-add-university-news',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-university-news.component.html',
  styleUrls: ['./add-university-news.component.scss']
})
export class UniversityNewsComponent implements OnInit {
  isSidebarOpen: boolean = true;
  universityNews: NewsItem[] = [];
  newNews: NewsItem = {
    _id: null,
    newsId: '',
    title: '',
    description: '',
    date: ''
  };
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  isEditing: boolean = false;
  editingNewsId: string | null = null;
  defaultImage = 'https://dummyimage.com/150';
  todayDate: string;
  isValidImage: boolean = true; // To track if the image is valid (JPG or PNG)

  constructor(private newsService: NewsService, private http: HttpClient) {}

  ngOnInit() {
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];
    this.loadUniversityNews();
  }

  loadUniversityNews() {
    this.newsService.getUniversityNews().subscribe(response => {
      if (response.status) {
        this.universityNews = response.data.map((news: any) => ({
          ...news,
          date: news.date.split('T')[0],
          imageUrl: news?  news.imageUrl: this.defaultImage
        }));
      }
    }, error => {
      console.error('Error fetching news:', error);
    });
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
  
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        this.selectedFile = null;
        this.imagePreviewUrl = null;
        this.isValidImage = false; // Set invalid image flag
  
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
  
        this.showToast('Only JPG and PNG images are allowed.', 'error');
        return;
      }
  
      this.selectedFile = file;
      this.isValidImage = true; // Set valid image flag
  
      const reader = new FileReader();
      if (this.selectedFile) {
        reader.onload = () => {
          this.imagePreviewUrl = reader.result as string;
        };
        reader.readAsDataURL(this.selectedFile); 
      }
    }
  }

  addOrUpdateNews() {
    if (!this.newNews.title || !this.newNews.date || !this.newNews.description) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.newNews.title);
    formData.append('description', this.newNews.description || '');
    formData.append('date', this.newNews.date);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditing && this.editingNewsId) {
      this.newsService.updateUniversityNews(this.editingNewsId, formData).subscribe({
        next: () => {
          this.resetForm();
          this.loadUniversityNews();
          this.showToast('News updated successfully!', 'success');
        },
        error: (err) => {
          console.error('Error updating news:', err);
          this.showToast('Failed to update news.', 'error');
        }
      });
    } else {
      this.newsService.addUniversityNews(formData).subscribe({
        next: () => {
          this.resetForm();
          this.loadUniversityNews();
          this.showToast('News added successfully!', 'success');
        },
        error: (err) => {
          console.error('Error adding news:', err);
          this.showToast('Failed to add news.', 'error');
        }
      });
    }
  }

  editNews(news: NewsItem) {
    this.newNews = { ...news };
    this.isEditing = true;
    this.editingNewsId = news._id || null;
    this.selectedFile = null;
    this.imagePreviewUrl = news.imageUrl || null;
  
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  deleteNews(id: string | null) {
    if (!id) return; // Ensure `id` is a valid string and not null
    
    Swal.fire({
      title: 'Are you sure you want to delete this news?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.newsService.deleteUniversityNews(id).subscribe({
          next: () => {
            this.loadUniversityNews();
            this.showToast('News deleted successfully!', 'success');
          },
          error: (err) => {
            console.error('Error deleting news:', err);
            this.showToast('Failed to delete news.', 'error');
          }
        });
      }
    });
  }
  
  resetForm() {
    this.newNews = { _id: null, title: '', description: '', date: '', newsId: '' };
    this.isEditing = false;
    this.editingNewsId = null;
    this.selectedFile = null;
    this.imagePreviewUrl = null; 
    this.isValidImage = true; // Reset the image validity

    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
  cancelEdit() {
    this.newNews = {
      _id: null,
      newsId: '',
      title: '',
      description: '',
      date: '',
      imageUrl: ''
    };
    this.selectedFile = null;
    this.imagePreviewUrl = '';
    this.isEditing = false;
    this.isValidImage = true;
  
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
    
  private showToast(message: string, icon: 'success' | 'error' | 'warning' | 'info') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }
}
