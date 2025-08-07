import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { provideToastr } from 'ngx-toastr';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LightgalleryModule } from 'lightgallery/angular';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';

// COMPONENT IMPORTS
import { HomeDemoOneComponent } from './components/pages/home-demo-one/home-demo-one.component';
import { HomeDemoTwoComponent } from './components/pages/home-demo-two/home-demo-two.component';
import { HomeDemoThreeComponent } from './components/pages/home-demo-three/home-demo-three.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { NewsComponent } from './components/common/news/news.component';
import { CampusExperienceComponent } from './components/common/campus-experience/campus-experience.component';
import { FindCoursesComponent } from './components/common/find-courses/find-courses.component';
import { AdmissionInformationComponent } from './components/common/admission-information/admission-information.component';
import { EventsComponent } from './components/common/events/events.component';
import { HowItWorksComponent } from './components/common/how-it-works/how-it-works.component';
import { CampusInformationComponent } from './components/common/campus-information/campus-information.component';
import { CoursesComponent } from './components/common/courses/courses.component';
import { AboutComponent } from './components/common/about/about.component';
import { HomeoneBannerComponent } from './components/pages/home-demo-one/homeone-banner/homeone-banner.component';
import { TopHeaderComponent } from './components/common/top-header/top-header.component';
import { HometwoBannerComponent } from './components/pages/home-demo-two/hometwo-banner/hometwo-banner.component';
import { FunfactsComponent } from './components/common/funfacts/funfacts.component';
import { ProfessorsComponent } from './components/common/professors/professors.component';
import { CtaComponent } from './components/common/cta/cta.component';
import { TuitionCostsComponent } from './components/common/tuition-costs/tuition-costs.component';
import { HomethreeBannerComponent } from './components/pages/home-demo-three/homethree-banner/homethree-banner.component';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';
import { CoursesPageComponent } from './components/pages/courses-page/courses-page.component';
import { CourseDetailsPageComponent } from './components/pages/course-details-page/course-details-page.component';
import { TuitionFeesPageComponent } from './components/pages/tuition-fees-page/tuition-fees-page.component';
import { EventsPageComponent } from './components/pages/events-page/events-page.component';
import { EventDetailsPageComponent } from './components/pages/event-details-page/event-details-page.component';
import { ApplicationPageComponent } from './components/pages/application-page/application-page.component';
import { ProfessorsPageComponent } from './components/pages/professors-page/professors-page.component';
import { ContactPageComponent } from './components/pages/contact-page/contact-page.component';
import { PrivacyPolicyPageComponent } from './components/pages/privacy-policy-page/privacy-policy-page.component';
import { TermsConditionsPageComponent } from './components/pages/terms-conditions-page/terms-conditions-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { CampusInformationPageComponent } from './components/pages/campus-information-page/campus-information-page.component';
import { CampusExperiencePageComponent } from './components/pages/campus-experience-page/campus-experience-page.component';
import { AlumniPageComponent } from './components/pages/alumni-page/alumni-page.component';
import { StudyOnlinePageComponent } from './components/pages/study-online-page/study-online-page.component';
import { AdmissionsPageComponent } from './components/pages/admissions-page/admissions-page.component';
import { FaqPageComponent } from './components/pages/faq-page/faq-page.component';
import { GalleryPageComponent } from './components/pages/gallery-page/gallery-page.component';
import { NewsGridPageComponent } from './components/pages/news-grid-page/news-grid-page.component';
import { NewsRightSidebarPageComponent } from './components/pages/news-right-sidebar-page/news-right-sidebar-page.component';
import { NewsDetailsPageComponent } from './components/pages/news-details-page/news-details-page.component';
import { WidgetSidebarComponent } from './components/common/widget-sidebar/widget-sidebar.component';
import { HccmatComponent } from './hccmat/hccmat/hccmat.component';
import { TestimonialComponent } from './components/common/testimonial/testimonial.component';
import { PlacementsComponent } from './components/common/placements/placements.component';
import { CampusAchievementPageComponent } from './components/pages/campus-achievement-page/campus-achievement-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeDemoOneComponent,
    HomeDemoTwoComponent,
    HomeDemoThreeComponent,
    NavbarComponent,
    FooterComponent,
    NewsComponent,
    CampusExperienceComponent,
    FindCoursesComponent,
    AdmissionInformationComponent,
    EventsComponent,
    HowItWorksComponent,
    CampusInformationComponent,
    CoursesComponent,
    AboutComponent,
    HomeoneBannerComponent,
    TopHeaderComponent,
    HometwoBannerComponent,
    FunfactsComponent,
    ProfessorsComponent,
    CtaComponent,
    TuitionCostsComponent,
    HomethreeBannerComponent,
    NotFoundComponent,
    AboutPageComponent,
    CoursesPageComponent,
    CourseDetailsPageComponent,
    TuitionFeesPageComponent,
    EventsPageComponent,
    EventDetailsPageComponent,
    ApplicationPageComponent,
    ProfessorsPageComponent,
    ContactPageComponent,
    PrivacyPolicyPageComponent,
    TermsConditionsPageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    CampusInformationPageComponent,
    CampusExperiencePageComponent,
    AlumniPageComponent,
    StudyOnlinePageComponent,
    AdmissionsPageComponent,
    FaqPageComponent,
    GalleryPageComponent,
    NewsGridPageComponent,
    NewsRightSidebarPageComponent,
    NewsDetailsPageComponent,
    WidgetSidebarComponent,
    HccmatComponent,
    PlacementsComponent,
    CampusAchievementPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CarouselModule,
    NgxScrollTopModule,
    BrowserAnimationsModule,
    LightgalleryModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TestimonialComponent,
    NgSelectModule
],
  providers: [
    provideToastr()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
