import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnDestroy {

  private countdownSubscription: Subscription;
  public countdown: { days: number, hours: number, minutes: number, seconds: number };
  public upcomingEvents: any[] = [];
  public todayEvents: any[] = [];
  public upcomingEvent: any;
  public targetDate: Date;

  constructor(
    public router: Router,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.loadEvents();
  }

  ngOnDestroy() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  private loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (res) => {  
        const now = new Date();
  
        // Filter today's events
        this.todayEvents = res.data?.filter((e: any) => {
          const eventDate = new Date(e.eventDate);
          return eventDate.toDateString() === now.toDateString(); // Events on the current day
        }) || [];
  
        // Filter future events
        let filteredEvents = res.data?.filter((e: any) => {
          const eventDate = new Date(e.eventDate);
          return eventDate.getTime() > now.getTime(); // Only future events
        }) || [];
  
        // Sort by event date
        filteredEvents.sort((a: any, b: any) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  
        // Take only the first 3 upcoming events
        this.upcomingEvents = filteredEvents.slice(0, 3);
  
        // Start countdown for the first event
        if (this.upcomingEvents.length > 0) {
          this.upcomingEvent = this.upcomingEvents[0];
          this.targetDate = new Date(this.upcomingEvent.eventDate);
          this.startCountdown();
        }
      },
      error: (err) => {
        console.error('Error loading events:', err);
      }
    });
  }
  

  private startCountdown(): void {
    this.calculateCountdown();
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.calculateCountdown();
    });
  }

  private calculateCountdown(): void {
    const now = new Date();
    const difference = this.targetDate.getTime() - now.getTime();

    if (difference > 0) {
      this.countdown = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    } else {
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      if (this.countdownSubscription) {
        this.countdownSubscription.unsubscribe();
      }
    }
  }
}
