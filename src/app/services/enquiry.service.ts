import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";


@Injectable({ providedIn: 'root' })
export class EnquiryService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('authToken') || '{}')?.token || '';
    return new HttpHeaders({
      'hccmatjwt': token,
      'Content-Type': 'application/json'
    });
  }

  getEnquiryList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getEnquiryList`, { headers: this.getAuthHeaders() });
  }

  getEnquiryById(formId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/view-enquiry/${formId}`, { headers: this.getAuthHeaders() });
  }

  addEnquiry(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/submitForm`, data, { headers: this.getAuthHeaders() });
  }

  updateEnquiry(data: { formId: string; status: string; comment?: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateEnquiry`, data, { headers: this.getAuthHeaders() });
  }

  deleteEnquiry(formId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteEnquiry/${formId}`, { headers: this.getAuthHeaders() });
  }

  // Contact Forms
  submitContact(data: any): Observable<any> {
    console.log('Contact data:', data);
    return this.http.post(`${this.baseUrl}/submit-contact`, data);
  }

  getAllContacts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-contacts`, { headers: this.getAuthHeaders() });
  }

  getContactById(contactId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/contact/${contactId}`, { headers: this.getAuthHeaders() });
  }

  updateContactStatus(data: { contactId: string; status: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-contact`, data, { headers: this.getAuthHeaders() });
  }

  getContactFormCounts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/contact-form-counts`, { headers: this.getAuthHeaders() });
  }

  deleteContact(contactId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-contact/${contactId}`, { headers: this.getAuthHeaders() });
  }
  

}
