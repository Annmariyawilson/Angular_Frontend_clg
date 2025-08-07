import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AddEventsComponent } from './components/pages/add-events/add-events.component';
import { AlleventsComponent } from './components/pages/all-events/all-events.component';
import { UpdateEventsComponent } from './components/pages/updateevents/updateevents.component';
import { AllapplicationsComponent } from './components/pages/all-applications/all-applications.component';
import { NotFoundComponent } from '../components/common/not-found/not-found.component';
import { DetailsComponent } from './components/pages/details/details.component';
import { AllFacultyComponent } from './components/pages/all-faculty/all-faculty.component';
import { ContactFormsComponent } from './components/pages/contact-forms/contact-forms.component';
import { AllCoursesComponent } from './components/pages/all-courses/all-courses.component';
import { AddCourseComponent } from './components/pages/add-course/add-course.component';
import { CampusNewsComponent } from './components/pages/add-campus-news/add-campus-news.component';
import { UniversityNewsComponent } from './components/pages/add-university-news/add-university-news.component';
import { AddBoardComponent } from './components/pages/add-board/add-board.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SideNavbarComponent } from './components/side-navbar/side-navbar.component';
import { RankHoldersComponent } from './components/pages/rank-holders/rank-holders.component';
import { PlacementsComponent } from './components/pages/placements/placements.component';
import { AddtestimonialComponent } from './components/pages/add-testimonial/add-testimonial.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        AdminRoutingModule,
        AdminHomeComponent,
        DashboardComponent,
        SideNavbarComponent,
        AddEventsComponent,
        AlleventsComponent,
        UpdateEventsComponent,
        AllapplicationsComponent,
        DetailsComponent,
        AllFacultyComponent,
        ContactFormsComponent,
        AllCoursesComponent,
        AddCourseComponent,
        CampusNewsComponent,
        UniversityNewsComponent,
        AddBoardComponent,
        PlacementsComponent,
        RankHoldersComponent,
        AddtestimonialComponent
    ],
})
export class AdminModule {}
