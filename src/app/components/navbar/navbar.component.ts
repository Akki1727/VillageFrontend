import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LanguageService, LanguageType } from '../../services/language.service';
import { EventService } from '../../services/event.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  isLoggedIn = false;

  constructor(
    private langService: LanguageService,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit() {
    this.eventService.isLoggedIn$.subscribe(state => {
      this.isLoggedIn = state;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  get currentLang(): LanguageType {
    return this.langService.getLanguage();
  }

  changeLanguage(lang: LanguageType) {
    this.langService.setLanguage(lang);
  }

  logout() {
    this.eventService.setLoginState(false);
    this.router.navigate(['/']);
    this.isMenuOpen = false;
  }

  t(key: string): string {
    return this.langService.t(key);
  }
}
