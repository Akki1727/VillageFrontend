import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { EventService, CarouselSettings } from '../../services/event.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit, OnDestroy {
  carouselSettings: CarouselSettings = { images: [], interval: 3 };
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
  }

  closeImageModal() {
    this.selectedImage = null;
    this.startAutoScroll(); // Resume slide auto-scroll
  }

  t(key: string): string {
    return this.langService.t(key);
  }
}
