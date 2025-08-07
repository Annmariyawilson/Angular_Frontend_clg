import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { TeamManagementComponent } from './components/pages/team-management/team-management.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { RankHoldersComponent } from './components/pages/rank-holders/rank-holders.component';
import { PlacementsComponent } from './components/pages/placements/placements.component';
import { authGuard } from './guard/auth.guard';
import { CampusAchivmentsComponent } from './components/pages/campus-achivments/campus-achivments.component';
import { AddtestimonialComponent } from './components/pages/add-testimonial/add-testimonial.component';

const adminRoutes: Routes = [
    {
        path: '', component: AdminHomeComponent,
       
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },

            { path: 'add-events', component: AddEventsComponent },

            { path: 'all-events', component: AlleventsComponent },

            { path: 'updateevents/:eventId', component: UpdateEventsComponent },

            { path: 'all-applications', component: AllapplicationsComponent },
            { path: 'details/:formId', component: DetailsComponent },

            { path: 'all-faculty', component: AllFacultyComponent },
            { path: 'contact-form', component: ContactFormsComponent },

            { path: 'all-courses', component: AllCoursesComponent },
            { path: 'add-course', component: AddCourseComponent },

            { path: 'add-campus-news', component: CampusNewsComponent },
            { path: 'add-university-news', component: UniversityNewsComponent },

            { path: 'placements', component: PlacementsComponent },
            { path: 'rank-holders', component: RankHoldersComponent },

            { path: 'add-board', component: AddBoardComponent },
            { path: 'team-management', component: TeamManagementComponent },

            { path: 'add-testimonial', component: AddtestimonialComponent},

            {path : 'campus-achivments', component: CampusAchivmentsComponent},
            { path: '**', component: NotFoundComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(adminRoutes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
