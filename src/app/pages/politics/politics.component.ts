import { Component } from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-politics',
  standalone: true,
  imports: [],
  templateUrl: './politics.component.html',
  styleUrl: './politics.component.css'
})
export class PoliticsComponent {
  constructor(private langService: LanguageService) {}

  t(key: string): string {
    return this.langService.t(key);
  }
}
