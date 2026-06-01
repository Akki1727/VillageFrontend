import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { EventService, EventModel } from '../../services/event.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  upcomingEvents: EventModel[] = [];
  selectedEvent: EventModel | null = null;

  constructor(
    private langService: LanguageService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        // Filter active upcoming events (status != inactive, and date >= todayStr)
        this.upcomingEvents = data.filter(e => e.status !== 'inactive' && e.event_date >= todayStr);
      },
      error: (err) => {
        console.error('Failed to fetch events on home page:', err);
      }
    });
  }

  openEventModal(event: EventModel) {
    this.selectedEvent = event;
  }

  closeEventModal() {
    this.selectedEvent = null;
  }

  t(key: string): string {
    return this.langService.t(key);
  }

  get currentLang() {
    return this.langService.getLanguage();
  }
}
