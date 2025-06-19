import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { JournalEntry, Mood } from '../../models/journal-entry.model';
import { JournalService } from '../../services/journal.service';

@Component({
  selector: 'app-journal-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, RouterLink],
  templateUrl: './journal-form.html',
  styleUrl: './journal-form.scss'
})
export class JournalFormComponent implements OnInit {
  journalForm!: FormGroup;
  moodOptions: Mood[] = [];
  isEditMode = false;
  entryId: string | null = null;
  showSuccessMessage = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private journalService: JournalService
  ) {}

  ngOnInit(): void {
    this.moodOptions = this.journalService.getMoodOptions();
    
    this.initForm();
    
    this.entryId = this.route.snapshot.paramMap.get('id');
    if (this.entryId) {
      this.isEditMode = true;
      const entry = this.journalService.getJournalEntryById(this.entryId);
      if (entry) {
        this.journalForm.patchValue({
          title: entry.title,
          content: entry.content,
          mood: entry.mood
        });
      } else {
        this.router.navigate(['/journal']);
      }
    }
  }

  initForm(): void {
    this.journalForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      mood: [Mood.NEUTRAL, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.journalForm.valid) {
      const formValue = this.journalForm.value;
      
      const journalEntry: JournalEntry = {
        id: this.isEditMode && this.entryId ? this.entryId : uuidv4(),
        title: formValue.title,
        content: formValue.content,
        mood: formValue.mood,
        date: new Date()
      };

      if (this.isEditMode && this.entryId) {
        this.journalService.updateJournalEntry(journalEntry);
      } else {
        this.journalService.addJournalEntry(journalEntry);
      }

      this.showSuccessMessage = true;
      setTimeout(() => {
        this.showSuccessMessage = false;
        this.router.navigate(['/journal']);
      }, 2000);
    }
  }
}
