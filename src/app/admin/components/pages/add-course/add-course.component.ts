import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SiteService } from 'src/app/services/site.service';
import Swal from 'sweetalert2';

interface Module {
  name: string;
  syllabus: string;
}

interface Course {
  id?: string;
  courseName: string;
  description: string;
  duration: string;
  eligibility: string;
  courseType: string;
  image?: string | File;
  modules: Module[];
  feeStructure: string;
  careerOpportunities: string;
}

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {
  imageSelected = false;
  isSidebarOpen = true;
  isEditMode = false;
  courseId = '';
  imagePreview: string | null = null;

  course: Course = {
    courseName: '',
    description: '',
    duration: '',
    eligibility: '',
    courseType: '',
    image: '',
    modules: [{ name: '', syllabus: '' }],
    feeStructure: '',
    careerOpportunities: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private siteService: SiteService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['editMode'] === 'true' && params['courseId']) {
        this.isEditMode = true;
        this.courseId = params['courseId'];
        this.getCourseById(this.courseId);
      }
    });
  }

  addModule(): void {
    this.course.modules.push({ name: '', syllabus: '' });
  }

  hasInvalidModules(): boolean {
    return this.course.modules.some(mod => !mod.name.trim() || !mod.syllabus.trim());
  }

  removeModule(index: number): void {
    if (this.course.modules.length > 1) {
      this.course.modules.splice(index, 1);
    } else {
      this.showToast('At least one module is required.', 'warning');
    }
  }

  getCourseById(courseId: string): void {
    this.siteService.getCourseById(courseId).subscribe(
      (course: any) => {
        if (course) {
          const fetchedModules = (course.modules && Array.isArray(course.modules) && course.modules.length > 0)
            ? course.modules.map((m: any) => ({ name: m.name || '', syllabus: m.syllabus || '' }))
            : [{ name: '', syllabus: '' }];

          this.course = {
            courseName: course.courseName || '',
            description: course.description || '',
            duration: course.duration || '',
            eligibility: course.eligibility || '',
            courseType: course.courseType || '',
            image: course.imageUrl || '',
            modules: fetchedModules,
            feeStructure: course.feeStructure || '',
            careerOpportunities: course.careerOpportunities || ''
          };
          this.imagePreview = course.imageUrl || null;
          this.imageSelected = !!this.imagePreview;
        }
      },
      error => this.handleError(error, 'Failed to fetch course details.')
    );
  }

  goBack(): void {
    this.router.navigate(['/hccmatadmin/all-courses']);
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
        this.showToast('Only JPG and PNG images are allowed.', 'error');
        this.imageSelected = false;
        return;
      }
      this.imagePreview = URL.createObjectURL(file);
      this.course.image = file;
      this.imageSelected = true;
    } else {
      this.imageSelected = false;
      this.imagePreview = null;
      this.course.image = '';
    }
  }

  addCourse(): void {
    if (!this.validateForm()) return;
    const formData = this.prepareFormData();
    this.siteService.addCourse(formData).subscribe(
      () => {
        Swal.fire('Success', 'Course added successfully!', 'success');
        this.resetForm();
        this.goBack();
      },
      err => this.handleError(err, 'Failed to add course.')
    );
  }

  private resetForm(): void {
    this.course = {
      courseName: '',
      description: '',
      duration: '',
      eligibility: '',
      courseType: '',
      image: '',
      modules: [{ name: '', syllabus: '' }],
      feeStructure: '',
      careerOpportunities: ''
    };
    this.imageSelected = false;
    this.imagePreview = null;
  }

  updateCourse(): void {
    if (!this.courseId.trim()) {
      this.showToast('Error: Course ID is missing.', 'error');
      return;
    }
    if (!this.validateForm()) return;
    const formData = this.prepareFormData();
    this.siteService.updateCourse(this.courseId, formData).subscribe(
      () => {
        this.showToast('Course updated successfully!', 'success');
        this.goBack();
      },
      error => this.handleError(error, 'Failed to update course.')
    );
  }

  private prepareFormData(): FormData {
    const formData = new FormData();
    formData.append('courseName', this.course.courseName);
    formData.append('description', this.course.description);
    formData.append('duration', this.course.duration);
    formData.append('eligibility', this.course.eligibility);
    formData.append('courseType', this.course.courseType);
    formData.append('feeStructure', this.course.feeStructure);
    formData.append('careerOpportunities', this.course.careerOpportunities);

    this.course.modules.forEach((mod, index) => {
      formData.append(`modules[${index}].name`, mod.name);
      formData.append(`modules[${index}].syllabus`, mod.syllabus);
    });

    if (this.course.image instanceof File) {
      formData.append('image', this.course.image);
    } else if (typeof this.course.image === 'string' && this.course.image.trim() !== '') {
      formData.append('existingImage', this.course.image);
    }

    return formData;
  }

  private validateForm(): boolean {
    if (!this.course.courseName.trim() ||
      !this.course.description.trim() ||
      !this.course.duration.trim() ||
      !this.course.eligibility.trim() ||
      !this.course.courseType.trim() ||
      !this.course.feeStructure.trim() ||
      !this.course.careerOpportunities.trim() ||
      this.hasInvalidModules()) {
      this.showToast('Please fill in all required fields correctly.', 'warning');
      return false;
    }
    if (!this.imageSelected && !this.isEditMode) {
      this.showToast('Please select a course image.', 'warning');
      return false;
    }
    return true;
  }

  private showToast(message: string, icon: 'success' | 'error' | 'warning'): void {
    Swal.fire({ toast: true, position: 'top-end', icon, title: message, showConfirmButton: false, timer: 3000 });
  }

  private handleError(error: any, fallbackMessage: string): void {
    const message = error?.error?.message || fallbackMessage;
    this.showToast(message, 'error');
  }
}
