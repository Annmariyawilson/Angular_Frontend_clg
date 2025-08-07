import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-courses-page',
  templateUrl: './courses-page.component.html',
  styleUrls: ['./courses-page.component.scss']
})
export class CoursesPageComponent implements OnInit {
  courses: any[] = [];
  courseType: string = '';
  subtitle: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;
  displayedCourses: any[] = [];

  constructor(private siteService: SiteService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.courseType = params['courseType'] || '';
      this.setSubtitle(this.courseType);
      this.resetPagination();  
      this.getCourses(); 
    });
  }

  setSubtitle(courseType: string): void {
    switch (courseType) {
      case 'UG':
        this.subtitle = 'Undergraduate Courses (UG)';
        break;
      case 'PG':
        this.subtitle = 'Postgraduate Courses (PG)';
        break;
      case 'Add on course':
        this.subtitle = 'Add On Courses';
        break;
      default:
        this.subtitle = 'All Courses';
    }
  }

  getCourses(): void {
    this.siteService.getCourses().subscribe(
      (data) => {
        // Filter courses based on courseType
        if (this.courseType) {
          this.courses = data.filter(course => course.courseType === this.courseType);
        } else {
          this.courses = data;
        }
        this.calculatePagination(); 
  
        this.currentPage = 1;
  
        this.calculatePagination();
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  resetPagination(): void {
    this.currentPage = 1;
    this.totalPages = 1;
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.courses.length / this.itemsPerPage);
    this.updateDisplayedCourses();
  }

  updateDisplayedCourses(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedCourses = this.courses.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedCourses();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  }
