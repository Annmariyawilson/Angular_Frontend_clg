import { Component, OnInit } from '@angular/core';
import { NewsService } from 'src/app/services/news.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-news-grid-page',
  templateUrl: './news-grid-page.component.html',
  styleUrls: ['./news-grid-page.component.scss']
})
export class NewsGridPageComponent implements OnInit {
  campusNews: any[] = [];
  universityNews: any[] = [];
  combinedNews: any[] = [];
  currentNews: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  
  currentPage: number = 1;  // Current page
  itemsPerPage: number = 6; // Number of items per page
  totalPages: number = 1;   // Total pages
  pageNumbers: number[] = [];  // Page numbers array

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.fetchCampusNews();
    this.fetchUniversityNews();
  }

  fetchCampusNews(): void {
    this.loading = true;
    this.newsService.getCampusNews().subscribe({
      next: (response) => {
        this.campusNews = response.status ? response.data : [];
        this.combineNews();
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = 'Failed to load campus news.';
        this.loading = false;
      }
    });
  }

  fetchUniversityNews(): void {
    this.loading = true;
    this.newsService.getUniversityNews().subscribe({
      next: (response) => {
        this.universityNews = response.status ? response.data : [];
        this.combineNews();
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = 'Failed to load university news.';
        this.loading = false;
      }
    });
  }

  combineNews(): void {
    this.combinedNews = [...this.campusNews, ...this.universityNews];
    this.totalPages = Math.ceil(this.combinedNews.length / this.itemsPerPage);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.changePage(this.currentPage);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.currentNews = this.combinedNews.slice(startIndex, startIndex + this.itemsPerPage);
  }
}
