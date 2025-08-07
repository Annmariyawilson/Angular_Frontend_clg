import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from 'src/app/services/news.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-news-details-page',
  templateUrl: './news-details-page.component.html',
  styleUrls: ['./news-details-page.component.scss']
})
export class NewsDetailsPageComponent implements OnInit {
  newsId!: string;
  newsDetails: any;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private route: ActivatedRoute, private newsService: NewsService) {}

  ngOnInit(): void {
    this.newsId = this.route.snapshot.paramMap.get('newsId') || '';
    if (this.newsId) {
      this.fetchNewsDetails();
    }
  }

  fetchNewsDetails(): void {
    this.isLoading = true;
    this.newsService.getCampusNewsById(this.newsId).subscribe({
      next: (response) => {
        if (response.status && response.data) {
          this.newsDetails = response.data;
          this.isLoading = false;
        } else {
          this.fetchUniversityNewsDetails(); // Try University News if not found in Campus News
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching campus news details:', error);
        this.fetchUniversityNewsDetails();
      }
    });
  }

  fetchUniversityNewsDetails(): void {
    this.newsService.getUniversityNewsById(this.newsId).subscribe({
      next: (response) => {
        if (response.status && response.data) {
          this.newsDetails = response.data;
        } else {
          this.errorMessage = 'News details not found.';
        }
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching university news details:', error);
        this.errorMessage = 'Failed to load news details.';
        this.isLoading = false;
      }
    });
  }
}
