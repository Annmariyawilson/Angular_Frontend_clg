import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';

interface CampusAchievement {
  achievementId: string;
  title: string;
  description: string;
  achievementType: string;
  date: Date;
  imageUrl: string;
}

@Component({
  selector: 'app-campus-achievement-page',
  templateUrl: './campus-achievement-page.component.html',
  styleUrls: ['./campus-achievement-page.component.scss']
})
export class CampusAchievementPageComponent implements OnInit {
  campusAchievements: CampusAchievement[] = [];

  constructor(private siteService: SiteService) {}

  ngOnInit(): void {
    this.getCampusAchievements();
  }

  getCampusAchievements(): void {
    this.siteService.getCampusAchievements().subscribe(
      (data) => {
        this.campusAchievements = data;
      },
      (error) => {
        console.error('Error fetching campus achievements', error);
      }
    );
  }
}
