import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, DatePipe } from '@angular/common';
import { JournalEntry } from '../../models/journal-entry.model';
import { JournalService } from '../../services/journal.service';

@Component({
  selector: 'app-journal-detail',
  standalone: true,
  imports: [RouterLink, NgIf, DatePipe],
  templateUrl: './journal-detail.html',
  styleUrl: './journal-detail.scss'
})
export class JournalDetailComponent implements OnInit {
  journalEntry: JournalEntry | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private journalService: JournalService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.journalEntry = this.journalService.getJournalEntryById(id);
      if (!this.journalEntry) {
        this.router.navigate(['/journal']);
      }
    }
  }

  deleteEntry(): void {
    if (this.journalEntry && confirm('Are you sure you want to delete this journal entry?')) {
      this.journalService.deleteJournalEntry(this.journalEntry.id);
      this.router.navigate(['/journal']);
    }
  }
}
