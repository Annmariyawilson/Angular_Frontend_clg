import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';
import { AdmissionsPageComponent } from './components/pages/admissions-page/admissions-page.component';
import { AlumniPageComponent } from './components/pages/alumni-page/alumni-page.component';
import { ApplicationPageComponent } from './components/pages/application-page/application-page.component';
import { CampusExperiencePageComponent } from './components/pages/campus-experience-page/campus-experience-page.component';
import { CampusInformationPageComponent } from './components/pages/campus-information-page/campus-information-page.component';
import { ContactPageComponent } from './components/pages/contact-page/contact-page.component';
import { CourseDetailsPageComponent } from './components/pages/course-details-page/course-details-page.component';
import { CoursesPageComponent } from './components/pages/courses-page/courses-page.component';
import { EventDetailsPageComponent } from './components/pages/event-details-page/event-details-page.component';
import { EventsPageComponent } from './components/pages/events-page/events-page.component';
import { FaqPageComponent } from './components/pages/faq-page/faq-page.component';
import { GalleryPageComponent } from './components/pages/gallery-page/gallery-page.component';
import { HomeDemoOneComponent } from './components/pages/home-demo-one/home-demo-one.component';
import { HomeDemoThreeComponent } from './components/pages/home-demo-three/home-demo-three.component';
import { HomeDemoTwoComponent } from './components/pages/home-demo-two/home-demo-two.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { NewsDetailsPageComponent } from './components/pages/news-details-page/news-details-page.component';
import { NewsGridPageComponent } from './components/pages/news-grid-page/news-grid-page.component';
import { NewsRightSidebarPageComponent } from './components/pages/news-right-sidebar-page/news-right-sidebar-page.component';
import { PrivacyPolicyPageComponent } from './components/pages/privacy-policy-page/privacy-policy-page.component';
import { ProfessorsPageComponent } from './components/pages/professors-page/professors-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { StudyOnlinePageComponent } from './components/pages/study-online-page/study-online-page.component';
import { TermsConditionsPageComponent } from './components/pages/terms-conditions-page/terms-conditions-page.component';
import { TuitionFeesPageComponent } from './components/pages/tuition-fees-page/tuition-fees-page.component';
import { HccmatComponent } from './hccmat/hccmat/hccmat.component';
import { RankHoldersComponent } from './components/pages/rank-holders/rank-holders.component';
import { PlacementComponent } from './components/pages/placement/placement.component';
import { authGuard } from './admin/guard/auth.guard';
import { CampusAchievementPageComponent } from './components/pages/campus-achievement-page/campus-achievement-page.component';
import { ScholarshipComponent } from './components/common/scholarship/scholarship.component';

const routes: Routes = [
    {
        path: '', component: HccmatComponent,
        children: [
            { path: '', redirectTo: '', pathMatch: 'full' },
            { path: '', component: HomeDemoThreeComponent },
            { path: 'index-3', component: HomeDemoOneComponent },
            { path: 'aboutUs', component: HomeDemoTwoComponent },
            { path: 'course-details/:courseId', component: CourseDetailsPageComponent },
            { path: 'tuition-fees', component: TuitionFeesPageComponent },
            { path: 'campus-information', component: CampusInformationPageComponent },
            { path: 'campus-experience', component: CampusExperiencePageComponent },
            { path: 'alumni', component: AlumniPageComponent },
            { path: 'study-online', component: StudyOnlinePageComponent },
            { path: 'admissions', component: AdmissionsPageComponent },
            { path: 'faq', component: FaqPageComponent },
            { path: 'gallery', component: GalleryPageComponent },
            { path: 'events', component: EventsPageComponent },
            { path: 'event-details/:eventId', component: EventDetailsPageComponent },
            { path: 'application', component: ApplicationPageComponent },
            { path: 'our-professors', component: ProfessorsPageComponent },
            { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
            { path: 'terms-conditions', component: TermsConditionsPageComponent },
            { path: 'hccmat', component: LoginPageComponent },
            { path: 'register', component: RegisterPageComponent },
            { path: 'campus-achievements', component: CampusAchievementPageComponent },
            { path: 'campus-news', component: NewsRightSidebarPageComponent },
            { path: 'news-details/:newsId', component: NewsDetailsPageComponent },
            { path: 'news-grid', component: NewsGridPageComponent},
            { path: 'contact', component: ContactPageComponent },
            { path: 'courses', component: CoursesPageComponent },
            { path: 'examinations', component: AboutPageComponent },
            { path: 'rank-holders', component: RankHoldersComponent},
            { path: 'placement', component:PlacementComponent},
            { path: 'scholarship', component:ScholarshipComponent}
        ]
    },
    {
        path: 'hccmatadmin', 
        canActivate: [authGuard],
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) 
    },
    { path: '**', component: NotFoundComponent }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }