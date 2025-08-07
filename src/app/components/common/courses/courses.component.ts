import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SiteService } from 'src/app/services/site.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  facultyDepartments: any[] = [];
  facultyList: any;
  boardMembers: any[] = [];

  constructor(private siteService: SiteService, public router: Router) {}

  coursesCarouselOptions: OwlOptions;
  boardCarouselOptions: OwlOptions;
  facultyCarouselOptions: OwlOptions;

  activeFaculty: number | null = null;

  ngOnInit(): void {
    this.fetchBoardMembers();
    this.fetchFacultyData();
    this.setCarouselOptions();
  }

  toggleFaculty(index: number) {
    this.activeFaculty = this.activeFaculty === index ? null : index;
  }

  fetchFacultyData() {
    this.siteService.getFaculty().subscribe({
      next: (response) => {
        this.facultyList = response.data || [];
        this.groupFacultyByDepartment(this.facultyList);
      },
      error: () => {}
    });
  }

  groupFacultyByDepartment(facultyList: any[]) {
    const departmentMap: { [key: string]: any } = {};

    facultyList.forEach((faculty) => {
      if (!departmentMap[faculty.department]) {
        departmentMap[faculty.department] = {
          name: faculty.department,
          facultyMembers: [],
        };
      }

      departmentMap[faculty.department].facultyMembers.push({
        name: faculty.name,
        jobTitle: faculty.jobTitle,
        contact: faculty?.contact || 'N/A',
        image: faculty?.imageUrl
      });
    });

    this.facultyDepartments = Object.values(departmentMap);
  }

  setDefaultImage(event: any) {
    event.target.src = 'assets/images/dummy-imgs/default-img.jpg';
  }

  fetchBoardMembers() {
    this.siteService.getBoardMembers('Board Member').subscribe({
      next: (response) => {
        if (response.status) {
          this.boardMembers = (response.data || []).map(member => ({
            ...member,
            imageUrl: member.image
              ? `${member.imageUrl}`
              : 'assets/images/user3.jpg'
          }));
        }
      },
      error: () => {}
    });
  }

  setCarouselOptions() {
    this.coursesCarouselOptions = {
      nav: true,
      loop: true,
      margin: 30,
      dots: false,
      autoplay: this.router.url === '/',
      autoplayTimeout: 2100,
      autoplayHoverPause: true,
      smartSpeed: 1000,
      navText: [
        "<i class='ri-arrow-left-line'></i>",
        "<i class='ri-arrow-right-line'></i>"
      ],
      responsive: {
        0: { items: 1 },
        515: { items: 2 },
        768: { items: 2 },
        935: { items: 3 },
        1200: { items: 4 }
      }
    };

    this.boardCarouselOptions = {
      nav: true,
      loop: true,
      margin: 30,
      dots: false,
      autoplay: this.router.url === '/aboutUs',
      autoplayTimeout: 2100,
      autoplayHoverPause: true,
      smartSpeed: 1000,
      navText: [
        "<i class='ri-arrow-left-line'></i>",
        "<i class='ri-arrow-right-line'></i>"
      ],
      responsive: {
        0: { items: 1 },
        515: { items: 2 },
        768: { items: 2 },
        935: { items: 3 },
        1200: { items: 4 }
      }
    };

    this.facultyCarouselOptions = {
      loop: true,
      margin: 5,
      autoplay: true,
      autoplayTimeout: 2000,
      autoplayHoverPause: true,
      smartSpeed: 1200,
      dots: true,
      nav: false,
      responsive: {
        0: { items: 1 },
        515: { items: 2 },
        768: { items: 2 },
        935: { items: 3 },
        1200: { items: 4 }
      }
    };
  }
}
