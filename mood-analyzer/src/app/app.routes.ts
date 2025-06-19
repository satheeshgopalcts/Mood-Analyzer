import { Routes } from '@angular/router';
import { JournalListComponent } from './components/journal-list/journal-list';
import { JournalFormComponent } from './components/journal-form/journal-form';
import { JournalDetailComponent } from './components/journal-detail/journal-detail';
import { MoodAnalyticsComponent } from './components/mood-analytics/mood-analytics';

export const routes: Routes = [
  { path: '', redirectTo: 'journal', pathMatch: 'full' },
  { path: 'journal', component: JournalListComponent },
  { path: 'journal/new', component: JournalFormComponent },
  { path: 'journal/:id', component: JournalDetailComponent },
  { path: 'journal/:id/edit', component: JournalFormComponent },
  { path: 'analytics', component: MoodAnalyticsComponent },
  { path: '**', redirectTo: 'journal' }
];
