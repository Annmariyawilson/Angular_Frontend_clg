import { Component, OnInit } from '@angular/core';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  public allNews: any[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.fetchAllNews();
  }

  private fetchAllNews(): void {
    const campusNews$ = this.newsService.getCampusNews();
    const universityNews$ = this.newsService.getUniversityNews();

    // Combine both calls
    campusNews$.subscribe({
      next: (campusRes) => {
        universityNews$.subscribe({
          next: (univRes) => {
            const combined = [...campusRes.data, ...univRes.data];

            // Sort all news by date descending and take top 3
            this.allNews = combined
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 3);
          },
          error: (err) => console.error('University news error:', err)
        });
      },
      error: (err) => console.error('Campus news error:', err)
    });
  }
}
