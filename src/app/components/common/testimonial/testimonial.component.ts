import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiteService } from 'src/app/services/site.service';
import { HttpClientModule } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss'],
})
export class TestimonialComponent implements OnInit, AfterViewInit {

  testimonials: any[] = []; 

  constructor(private siteService: SiteService) {}

  ngOnInit(): void {
    this.fetchTestimonials();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initializeCarousel(), 500); 
  }

  fetchTestimonials(): void {
    this.siteService.getTestimonials().subscribe({
      next: (data) => {
        this.testimonials = data;
        setTimeout(() => this.initializeCarousel(), 100); 
      },
      error: (err) => console.error('Error fetching testimonials:', err),
    });
  }

  initializeCarousel(): void {
    if ($('.testimonial-carousel').length) {
      $('.testimonial-carousel').owlCarousel('destroy');
      $('.testimonial-carousel')
        .owlCarousel({
          autoplay: true,
          smartSpeed: 1000,
          margin: 25,
          loop: true,
          center: true,
          dots: false,
          nav: true,
          navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>',
          ],
          responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 3 },
          },
        })
        .on('changed.owl.carousel', function () {
          setTimeout(() => {
            $('.testimonial-item').removeClass('active');
            $('.owl-item.center .testimonial-item').addClass('active');
          }, 100);
        });
    }
  }
}
