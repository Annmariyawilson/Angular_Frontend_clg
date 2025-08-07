import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SiteService } from 'src/app/services/site.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-placements',
  templateUrl: './placements.component.html',
  styleUrls: ['./placements.component.scss']
})
export class PlacementsComponent implements OnInit {
  placementSlides: OwlOptions;
  placementData: any[] = [];

  constructor(private siteService: SiteService) {}

  ngOnInit(): void {
    this.setCarouselOptions();
    this.fetchPlacements();
  }

  setCarouselOptions() {
    this.placementSlides = {
      loop: true,
      margin: 20,
      autoplay: true,
      autoplayTimeout: 2500,
      autoplayHoverPause: true,
      smartSpeed: 1000,
      dots: true,
      navText: [
        "<i class='ri-arrow-left-line'></i>",
        "<i class='ri-arrow-right-line'></i>"
      ],
      responsive: {
        0: { items: 1 },
        576: { items: 2 },
        768: { items: 3 },
        1200: { items: 4 }
      }
    };
  }

  fetchPlacements() {
    this.siteService.getPlacements().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : res?.data;
        if (Array.isArray(data)) {
          this.placementData = data.map((student) => ({
            ...student,
            image: student.imageUrl,
          }));
        } else {
          this.placementData = [];
        }
      },
      error: (err) => {
        console.error('Error fetching placements:', err);
      }
    });
  }
  }
