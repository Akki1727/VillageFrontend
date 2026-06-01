import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { EventService, EventModel } from '../../services/event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  events: EventModel[] = [];
  selectedEvent: EventModel | null = null;

  constructor(
    private langService: LanguageService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.eventService.getEvents().subscribe(data => {
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;
      
      this.events = data.filter(e => e.status !== 'inactive' && e.event_date < todayStr);
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
