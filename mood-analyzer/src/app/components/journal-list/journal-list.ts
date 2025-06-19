import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, DatePipe, SlicePipe } from '@angular/common';
import { JournalEntry } from '../../models/journal-entry.model';
import { JournalService } from '../../services/journal.service';

@Component({
  selector: 'app-journal-list',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, DatePipe, SlicePipe],
  templateUrl: './journal-list.html',
  styleUrl: './journal-list.scss'
})
export class JournalListComponent implements OnInit {
  journalEntries: JournalEntry[] = [];

  constructor(private journalService: JournalService) {}

  ngOnInit(): void {
    this.journalService.getAllJournalEntries().subscribe(entries => {
      this.journalEntries = entries.sort((a, b) => 
        b.date.getTime() - a.date.getTime()
      );
    });
  }

  deleteEntry(id: string): void {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      this.journalService.deleteJournalEntry(id);
    }
  }
}
