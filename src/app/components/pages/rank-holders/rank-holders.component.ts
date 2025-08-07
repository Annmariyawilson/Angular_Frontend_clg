import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteService } from 'src/app/services/site.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rank-holders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rank-holders.component.html',
  styleUrl: './rank-holders.component.scss'
})
export class RankHoldersComponent implements OnInit {
  rankHolders: any[] = [];
  displayedRankHolders: any[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 1;

  constructor(private siteService: SiteService) {}

  ngOnInit(): void {
    this.fetchRankHolders();
  }

  fetchRankHolders(): void {
    this.siteService.getRankHolders().subscribe({
      next: (data: any[]) => {
        const result = data.map((rank) => ({
          ...rank,
          image: rank.image
            ? `${environment.baseUrl}/${rank.image}`
            : 'assets/default-placeholder.png',
        }));
        this.rankHolders = result;
        this.totalPages = Math.ceil(this.rankHolders.length / this.itemsPerPage);
        this.updateDisplayedRankHolders();
      },
      error: (err) => {
        console.error('Error fetching rank holders:', err);
        this.rankHolders = [];
      }
    });
  }

  updateDisplayedRankHolders(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedRankHolders = this.rankHolders.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedRankHolders();
    }
  }
}
