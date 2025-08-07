import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-professors',
  templateUrl: './professors.component.html',
  styleUrls: ['./professors.component.scss']
})
export class ProfessorsComponent implements OnInit {
  visionaries: any[] = [];
member: any;

  constructor(private siteService: SiteService) {}

  ngOnInit(): void {
    this.getAllBoardMembers();
  }
  
  getAllBoardMembers(): void {
    this.siteService.getBoardMembers('Visionary').subscribe({
      next: (res) => {
        this.visionaries = (res.data || []).map(member => ({
          ...member,
          image: member.imageUrl || 'assets/images/default-avatar.png',
        }));
        
      },
      error: (err) => {
        console.error('Error fetching visionary members:', err);
        this.visionaries = [];
      }
    });
  }
  }  