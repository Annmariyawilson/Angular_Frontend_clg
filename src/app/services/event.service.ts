import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class EventService {
  private baseUrl = environment.baseUrl;
  private eventsSubject = new BehaviorSubject<any[]>([]);
  public events$ = this.eventsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Set events into BehaviorSubject
  setEvents(events: any[]): void {
    this.eventsSubject.next(events);
  }

  // Fetch event count for dashboard
  getEventCount(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getEventCount`).pipe(
      catchError(err => {
        console.error('Error fetching event count:', err);
        return throwError(() => new Error(err.message || 'Error fetching event count'));
      })
    );
  }

  // Fetch all events and update subject
  getEvents(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getEvents`).pipe(
      tap(res => {
        if (res?.status && res?.data) {
          this.setEvents(res.data);
        }
      }),
      catchError(err => {
        console.error('Error fetching events:', err);
        return throwError(() => new Error(err.message || 'Error fetching events'));
      })
    );
  }

  // Fetch a single event by ID
  getEventById(eventId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getEventById/${eventId}`).pipe(
      catchError(err => {
        console.error('Error fetching event by ID:', err);
        return throwError(() => new Error(err.message || 'Error fetching event'));
      })
    );
  }

  // Create a new event
  createEvent(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-Event`, formData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(res => console.log('Event created successfully:', res)),
      catchError(err => {
        console.error('Error creating event:', err);
        return throwError(() => new Error(err.message || 'Error creating event'));
      })
    );
  }

  // Update existing event
  updateEvent(eventId: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateEvent/${eventId}`, updatedData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(res => console.log('Event updated:', res)),
      catchError(err => {
        console.error('Error updating event:', err);
        return throwError(() => new Error(err.message || 'Error updating event'));
      })
    );
  }

  // Delete an event
  deleteEvent(eventId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteEvent/${eventId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => console.log(`Event ${eventId} deleted successfully.`)),
      catchError(err => {
        console.error('Error deleting event:', err);
        return throwError(() => new Error(err.message || 'Error deleting event'));
      })
    );
  }

  // Get auth headers with token
  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('authToken') || '{}')?.token || '';
    return new HttpHeaders({ hccmatjwt: token });
  }
}