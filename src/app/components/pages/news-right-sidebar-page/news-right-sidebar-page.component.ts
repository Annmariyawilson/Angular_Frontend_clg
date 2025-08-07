import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-news-right-sidebar-page',
  templateUrl: './news-right-sidebar-page.component.html',
  styleUrls: ['./news-right-sidebar-page.component.scss']
})
export class NewsRightSidebarPageComponent implements OnInit {
  campusNews: any[] = [];
   universityNews: any[] = [];  
   loading: boolean = false;
   errorMessage: string = '';
 
   constructor(private newsService: NewsService) {}
 
   ngOnInit(): void {
     console.log('Fetching News...');
     this.fetchCampusNews();
     this.fetchUniversityNews();
   }
 
   fetchCampusNews(): void {
     this.loading = true;
     this.newsService.getCampusNews().subscribe({
       next: (response) => {
         console.log('Campus News Data:', response); 
         this.campusNews = response.status ? response.data : [];
         this.loading = false;
       },
       error: (error: HttpErrorResponse) => {
         console.error('Error fetching campus news:', error);
         this.errorMessage = 'Failed to load campus news.';
         this.loading = false;
       }
     });
   }
 
   fetchUniversityNews(): void {
    this.loading = true;
    this.newsService.getUniversityNews().subscribe({
      next: (response) => {
        console.log('University News Data:', response); 
        this.universityNews = response.status ? response.data : [];
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching university news:', error);
        this.errorMessage = 'Failed to load university news.';
        this.loading = false;
      }
    });
  }
 }
 