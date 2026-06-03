import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { EventService, CarouselSettings, StatisticModel } from '../../services/event.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit, OnDestroy {
  carouselSettings: CarouselSettings = { images: [], interval: 3 };
  statistics: StatisticModel[] = [];
  currentIndex = 0;
  selectedImage: string | null = null;
  private intervalId: any;

  constructor(
    private langService: LanguageService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.eventService.getCarouselSettings().subscribe({
      next: (settings) => {
        this.carouselSettings = settings;
        this.startAutoScroll();
      },
      error: (err) => {
        console.error('Failed to load carousel settings:', err);
      }
    });

    this.eventService.getStatistics().subscribe({
      next: (data) => {
        this.statistics = data;
      },
      error: (err) => {
        console.error('Failed to load statistics on about page:', err);
      }
    });
  }

  ngOnDestroy() {
    this.stopAutoScroll();
  }

  startAutoScroll() {
    this.stopAutoScroll();
    // Do not start auto-scroll if the image lightbox is currently open!
    if (this.selectedImage) return;
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

  prevSlide() {
    if (this.carouselSettings.images && this.carouselSettings.images.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.carouselSettings.images.length) % this.carouselSettings.images.length;
    }
  }

  goToSlide(idx: number) {
    this.currentIndex = idx;
    this.startAutoScroll(); // Reset auto-scroll interval timer
  }

  openImageModal(imgUrl: string) {
    this.selectedImage = imgUrl;
    this.stopAutoScroll(); // Pause slide auto-scroll when previewing
    this.eventService.toggleBodyScroll(true);
  }

  closeImageModal() {
    this.selectedImage = null;
    this.startAutoScroll(); // Resume slide auto-scroll
    this.eventService.toggleBodyScroll(false);
  }

  formatStatValue(value: number, title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('established') || lowerTitle.includes('year') || (value >= 1000 && value <= 2100)) {
      return value.toString();
    }
    return new Intl.NumberFormat().format(value);
  }

  t(key: string): string {
    return this.langService.t(key);
  }
}
