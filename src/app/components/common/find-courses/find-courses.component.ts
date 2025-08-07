import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SiteService } from 'src/app/services/site.service';// Adjust path as needed

@Component({
  selector: 'app-find-courses',
  templateUrl: './find-courses.component.html',
  styleUrls: ['./find-courses.component.scss']
})
export class FindCoursesComponent implements OnInit {
  rankHolderSlides: OwlOptions;
  rankHolders: any[] = [];
rank: any;

  constructor(private siteService: SiteService) {}

  ngOnInit(): void {
    this.setCarouselOptions();
    this.fetchRankHolders(); 
  }

  setCarouselOptions() {
    this.rankHolderSlides = {
      loop: true,
      margin: 20,
      autoplay: true,
      autoplayTimeout: 2000,
      autoplayHoverPause: false,
      smartSpeed: 1000,
      dots: true,
      nav: false,
      responsive: {
        0: { items: 1 },
        576: { items: 2 },
        768: { items: 4 },
        1200: { items: 5 }
      }
    };
  }

  fetchRankHolders() {
    this.siteService.getRankHolders().subscribe({
      next: (data) => {
        this.rankHolders = data;
      },
      error: (err) => {
        console.error('Error fetching rank holders:', err);
      }
    });
  }
}
