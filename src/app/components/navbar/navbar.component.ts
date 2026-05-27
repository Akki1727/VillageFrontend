import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
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


  logout() {
    this.eventService.setLoginState(false);
    this.router.navigate(['/']);
    this.isMenuOpen = false;
  }

  t(key: string): string {
    return this.langService.t(key);
  }
}
