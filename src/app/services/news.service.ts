import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  // Generate Authorization Headers
  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('authToken') || '{}')?.token || '';
    return new HttpHeaders({ hccmatjwt: token });
  }

  /** ----------------------------
   *  Campus News API Endpoints
   *  ---------------------------- */

  getCampusNews(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getCampusNews`, {
      headers: this.getAuthHeaders()
    });
  }

  getCampusNewsById(newsId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getCampusNewsById/${newsId}`, {
      headers: this.getAuthHeaders()
    });
  }

  addCampusNews(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/addCampusNews`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  updateCampusNews(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateCampusNews/${id}`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  deleteCampusNews(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteCampusNews/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  /** -------------------------------
   *  University News API Endpoints
   *  ------------------------------- */

  getUniversityNews(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getUniversityNews`, {
      headers: this.getAuthHeaders()
    });
  }

  getUniversityNewsById(newsId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getUniversityNewsById/${newsId}`, {
      headers: this.getAuthHeaders()
    });
  }

  addUniversityNews(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/addUniversityNews`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  updateUniversityNews(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateUniversityNews/${id}`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUniversityNews(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteUniversityNews/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}