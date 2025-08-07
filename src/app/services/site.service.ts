import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { BoardMember } from '../admin/components/pages/add-board/add-board.component';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SiteService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('authToken') || '{}')?.token || '';
    return new HttpHeaders({ hccmatjwt: token });
  }

  // Courses
  getCourses(): Observable<any[]> {
    return this.http.get<{ status: boolean; data: any[] }>(`${this.baseUrl}/getCourses`).pipe(
      map(res => res.data || []),
      catchError(this.handleError)
    );
  }

  getCourseById(id: string): Observable<any> {
    return this.http.get<{ status: boolean; data: any }>(`${this.baseUrl}/getCourseById/${id}`).pipe(
      map(res => res.data),
      catchError(this.handleError)
    );
  }

  addCourse(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/addCourse`, formData, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateCourse(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateCourse/${id}`, formData, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteCourse/${id}`, { headers: this.getAuthHeaders() });
  }

    // Faculties
  getFaculty(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getFaculty`);
  }

  addFaculty(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/addFaculty`, formData, { headers: this.getAuthHeaders() });
  }

  updateFaculty(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateFaculty/${id}`, formData, { headers: this.getAuthHeaders() });
  }

  deleteFaculty(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteFaculty/${id}`, { headers: this.getAuthHeaders() });
  }


  // Board Members
  getBoardMembers(type?: string): Observable<{ status: boolean; data: BoardMember[] }> {
    let url = `${this.baseUrl}/getBoardMembers`;
    if (type) url += `?type=${type}`;
    return this.http.get<{ status: boolean; data: BoardMember[] }>(url, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  addBoardMember(formData: FormData): Observable<any> {
    console.log("form data",formData)
    return this.http.post(`${this.baseUrl}/addBoardMember`, formData, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateBoardMember(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateBoardMember/${id}`, formData, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteBoardMember(id: string): Observable<any> {
    return this.http.delete<{ status: boolean; message: string }>(`${this.baseUrl}/deleteBoardMember/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(res => {
        if (!res.status) throw new Error(res.message);
        return res;
      }),
      catchError(this.handleError)
    );
  }

  // Placements
  getPlacements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getPlacement`);
  }

  addPlacement(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/addPlacement`, formData, { headers: this.getAuthHeaders() });
  }

  updatePlacement(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/updatePlacement/${id}`, formData, { headers: this.getAuthHeaders() });
  }

  deletePlacement(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deletePlacement/${id}`, { headers: this.getAuthHeaders() });
  }

  // Rank Holders
  getRankHolders(): Observable<any[]> {
    return this.http.get<{ status: boolean; data: any[] }>(`${this.baseUrl}/getRankHolders`).pipe(
      map(res => res.data || []),
      catchError(this.handleError)
    );
  }

  addRankHolder(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/addRankHolder`, formData, { headers: this.getAuthHeaders() });
  }

  updateRankHolder(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateRankHolder/${id}`, formData, { headers: this.getAuthHeaders() });
  }

  deleteRankHolder(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteRankHolder/${id}`, { headers: this.getAuthHeaders() });
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }

  // Campus Achievements
  getCampusAchievements(): Observable<any[]> {
    return this.http.get<{ status: boolean; data: any[] }>(`${this.baseUrl}/getCampusAchievements`).pipe(
      map(res => res.data || []),
      catchError(this.handleError)
    );
  }

  getCampusAchievementById(id: string): Observable<any> {
    return this.http.get<{ status: boolean; data: any }>(`${this.baseUrl}/getCampusAchievementById/${id}`).pipe(
      map(res => res.data),
      catchError(this.handleError)
    );
  }

  addCampusAchievement(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/addCampusAchievement`, formData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateCampusAchievement(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateCampusAchievement/${id}`, formData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteCampusAchievement(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteCampusAchievement/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(res => {
        if (!res || (res as any).status === false) {
          throw new Error((res as any).message || 'Failed to delete');
        }
        return res;
      }),
      catchError(this.handleError)
    );
  }

    // Testimonials
    getTestimonials(): Observable<any[]> {
      return this.http.get<{ status: boolean; data: any[] }>(`${this.baseUrl}/getTestimonials`).pipe(
        map(res => res.data || []),
        catchError(this.handleError)
      );
    }

    addTestimonial(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/addTestimonial`, formData, { headers: this.getAuthHeaders() });
    }

    deleteTestimonial(testimonialId: string): Observable<any> {
      return this.http.delete<{ status: boolean; message: string }>(
        `${this.baseUrl}/deleteTestimonial/${testimonialId}`,
        { headers: this.getAuthHeaders() }
      ).pipe(
        map(res => {
          if (!res.status) throw new Error(res.message || 'Failed to delete testimonial');
          return res;
        }),
        catchError(this.handleError)
      );
    }
    }

