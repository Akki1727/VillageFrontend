import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { EventService, StaffModel } from '../../services/event.service';

@Component({
  selector: 'app-politics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './politics.component.html',
  styleUrl: './politics.component.css'
})
export class PoliticsComponent implements OnInit {
  staffList: StaffModel[] = [];
  selectedMember: StaffModel | null = null;

  constructor(
    private langService: LanguageService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.eventService.getStaff().subscribe(data => {
      // Show only active staff members
      this.staffList = data.filter(member => member.status !== 'inactive');
    });
  }

  openMemberModal(member: StaffModel) {
    this.selectedMember = member;
  }

  closeMemberModal() {
    this.selectedMember = null;
  }

  t(key: string): string {
    return this.langService.t(key);
  }
}
