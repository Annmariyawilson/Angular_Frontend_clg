import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteService } from 'src/app/services/site.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-placement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './placement.component.html',
  styleUrls: ['./placement.component.scss']
})
export class PlacementComponent implements OnInit {
  placements: any[] = [];
  paginatedPlacements: any[] = [];

  // Pagination config
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 1;

  constructor(private siteService: SiteService) {}

  ngOnInit(): void {
    this.fetchPlacements();
  }

  fetchPlacements() {
    this.siteService.getPlacements().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : res?.data;
        if (Array.isArray(data)) {
          this.placements = data.map((student) => ({
            ...student,
            image: student.image
              ? `${environment.baseUrl}/${student.image}`
              : 'assets/default-placeholder.png',
          }));
          this.totalPages = Math.ceil(this.placements.length / this.itemsPerPage);
          this.updatePaginatedPlacements();
        } else {
          this.placements = [];
        }
      },
      error: (err) => {
        console.error('Error fetching placements:', err);
      }
    });
  }

  updatePaginatedPlacements(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPlacements = this.placements.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedPlacements();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
