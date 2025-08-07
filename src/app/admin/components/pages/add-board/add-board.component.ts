import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SiteService } from 'src/app/services/site.service';
import { AdminHeaderComponent } from "../../admin-header/admin-header.component";
import { SideNavbarComponent } from "../../side-navbar/side-navbar.component";   

export interface BoardMember {
imageUrl: any;
  _id?: string;
  name: string;
  position: string;
  image?: string;
}

@Component({
  selector: 'app-add-board',
  standalone: true,
  imports: [CommonModule, FormsModule],  
  templateUrl: './add-board.component.html',
  styleUrl: './add-board.component.scss'
})

export class AddBoardComponent implements OnInit {
  isSidebarOpen: boolean = true;
  isToggling: boolean = false;
  members: BoardMember[] = [];
  newMember: BoardMember = { name: '', position: '', imageUrl: '' };
  selectedFile: File | null = null;
  isEditing: boolean = false;
  editingMemberId: string | null = null;
  defaultImage = 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg';

  constructor(private siteService: SiteService, private http: HttpClient) {}

  ngOnInit() {
    this.loadBoardMembers();
  }

  loadBoardMembers() {
    this.siteService.getBoardMembers().subscribe(response => {
      if (response && response.status) {
        this.members = response.data.map(member => ({
          ...member,
          imageUrl: member.image ? `http://localhost:7223/${member.image}` : this.defaultImage
        }));
      } else {
        this.members = [];
      }
    });
  }
  
  // ✅ Handle File Selection
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newMember.imageUrl = e.target.result;
      };
      if (this.selectedFile) {
        reader.readAsDataURL(this.selectedFile);
      }
          }
  }

  addOrUpdateMember() {
    if (!this.newMember.name || !this.newMember.position) return;

    const formData = new FormData();
    formData.append('name', this.newMember.name);
    formData.append('position', this.newMember.position);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditing && this.editingMemberId) {
      this.siteService.updateBoardMember(this.editingMemberId, formData).subscribe(response => {
        if (response.status) {
          this.loadBoardMembers();
          this.resetForm();
        }
      });
    } else {

      this.siteService.addBoardMember(formData).subscribe(response => {
        if (response.status) {
          this.loadBoardMembers();
          this.resetForm();
        }
      });
    }
  }

  editMember(member: BoardMember) {
    this.newMember = { ...member };
    this.isEditing = true;
    this.editingMemberId = member._id || null;
  }

  deleteMember(id?: string) {
    if (!id) return; 
    this.siteService.deleteBoardMember(id).subscribe(response => {
      if (response.status) {
        this.loadBoardMembers();
      }
    });
  }
  
  resetForm() {
    this.newMember = { name: '', position: '', imageUrl: this.defaultImage };
    this.isEditing = false;
    this.editingMemberId = null;
    this.selectedFile = null;
  }

  toggleSidebar() {
    if (this.isToggling) return;
    this.isToggling = true;
    this.isSidebarOpen = !this.isSidebarOpen;
    setTimeout(() => { this.isToggling = false; }, 300);
  }
}
