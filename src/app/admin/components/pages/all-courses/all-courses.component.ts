import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SiteService } from 'src/app/services/site.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.scss']
})
export class AllCoursesComponent implements OnInit {
  imagePreview: string | null = null;
  isSidebarOpen: boolean = true;
  isToggling: boolean = false;
  courseList: any[] = [];
  searchTerm: string = ''; 
  constructor(private router: Router, private siteService: SiteService) {}

  ngOnInit() {
    this.fetchCourses();
  }

  goBack() {
    this.router.navigate(['/hccmatadmin']);
  }

  toggleSidebar() {
    if (this.isToggling) return;
    this.isToggling = true;
    this.isSidebarOpen = !this.isSidebarOpen;
    setTimeout(() => (this.isToggling = false), 250);
  }

  fetchCourses() {
    this.siteService.getCourses().subscribe({
      next: (courses: any[]) => {
        this.courseList = courses.map(course => ({
          ...course,
          imageUrl: course.imageUrl || 'assets/default-course.png'
        }));
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
        this.showToast('Failed to fetch courses.', 'error');
      }
    });
  }

  filterCourses() {
    // Filter courses based on the search term in all columns
    this.siteService.getCourses().subscribe({
      next: (courses: any[]) => {
        this.courseList = courses.filter(course =>
          Object.values(course).some((value: any) => 
            value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
          )
        );
      },
      error: (error) => {
        console.error('Error filtering courses:', error);
      }
    });
  }
  
  editCourse(courseId: string) {
    this.router.navigate(['/hccmatadmin/add-course'], {
      queryParams: { editMode: 'true', courseId: courseId }
    });
  }

  deleteCourse(courseId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.siteService.deleteCourse(courseId).subscribe({
          next: () => {
            this.showToast('Course deleted successfully!', 'success');
            this.fetchCourses(); // Refresh without reloading
          },
          error: (error) => {
            console.error('Error deleting course:', error);
            this.showToast('Failed to delete course.', 'error');
          }
        });
      }
    });
  }

  navigateToAddCourse() {
    this.router.navigate(['/hccmatadmin/add-course']);
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
