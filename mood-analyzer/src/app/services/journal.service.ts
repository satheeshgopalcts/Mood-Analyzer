import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { JournalEntry, Mood } from '../models/journal-entry.model';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private journalEntriesKey = 'journal_entries';
  private journalEntriesSubject: BehaviorSubject<JournalEntry[]> = new BehaviorSubject<JournalEntry[]>([]);
  public journalEntries$: Observable<JournalEntry[]> = this.journalEntriesSubject.asObservable();

  constructor() {
    this.loadJournalEntries();
  }

  private loadJournalEntries(): void {
    const storedEntries = localStorage.getItem(this.journalEntriesKey);
    if (storedEntries) {
      const entries = JSON.parse(storedEntries) as JournalEntry[];
      // Convert string dates back to Date objects
      entries.forEach(entry => {
        entry.date = new Date(entry.date);
      });
      this.journalEntriesSubject.next(entries);
    }
  }

  private saveJournalEntries(entries: JournalEntry[]): void {
    localStorage.setItem(this.journalEntriesKey, JSON.stringify(entries));
    this.journalEntriesSubject.next(entries);
  }

  getAllJournalEntries(): Observable<JournalEntry[]> {
    return this.journalEntries$;
  }

  getJournalEntryById(id: string): JournalEntry | undefined {
    return this.journalEntriesSubject.value.find(entry => entry.id === id);
  }

  addJournalEntry(entry: JournalEntry): void {
    const entries = [...this.journalEntriesSubject.value, entry];
    this.saveJournalEntries(entries);
  }

  updateJournalEntry(updatedEntry: JournalEntry): void {
    const entries = this.journalEntriesSubject.value.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    );
    this.saveJournalEntries(entries);
  }

  deleteJournalEntry(id: string): void {
    const entries = this.journalEntriesSubject.value.filter(entry => entry.id !== id);
    this.saveJournalEntries(entries);
  }

  getMoodOptions(): Mood[] {
    return Object.values(Mood);
  }
}
