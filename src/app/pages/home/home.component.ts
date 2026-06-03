import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { EventService, EventModel, ResolutionModel, CarouselSettings } from '../../services/event.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  upcomingEvents: EventModel[] = [];
  resolutions: ResolutionModel[] = [];
  selectedEvent: EventModel | null = null;
  carouselSettings: CarouselSettings = { images: [], interval: 5 };
  currentIndex = 0;
  private intervalId: any;

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

    this.eventService.getResolutions().subscribe({
      next: (res) => {
        this.resolutions = res;
      },
      error: (err) => {
        console.error('Failed to fetch resolutions on home page:', err);
      }
    });

    this.eventService.getHomeCarouselSettings().subscribe({
      next: (settings) => {
        this.carouselSettings = settings;
        this.startAutoScroll();
      },
      error: (err) => {
        console.error('Failed to load home background settings:', err);
      }
    });
  }

  ngOnDestroy() {
    this.stopAutoScroll();
  }

  startAutoScroll() {
    this.stopAutoScroll();
    if (this.carouselSettings.images && this.carouselSettings.images.length > 1) {
      this.intervalId = setInterval(() => {
        this.nextSlide();
      }, this.carouselSettings.interval * 1000);
    }
  }

  stopAutoScroll() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide() {
    if (this.carouselSettings.images && this.carouselSettings.images.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.carouselSettings.images.length;
    }
  }

  openEventModal(event: EventModel) {
    this.selectedEvent = event;
    this.eventService.toggleBodyScroll(true);
  }

  closeEventModal() {
    this.selectedEvent = null;
    this.eventService.toggleBodyScroll(false);
  }

  t(key: string): string {
    return this.langService.t(key);
  }

  get currentLang() {
    return this.langService.getLanguage();
  }
}
