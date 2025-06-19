import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JournalService } from '../../services/journal.service';
import { JournalEntry, Mood } from '../../models/journal-entry.model';
import { ChartConfiguration, ChartData, ChartType, Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'app-mood-analytics',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, RouterLink],
  templateUrl: './mood-analytics.html',
  styleUrl: './mood-analytics.scss'
})
export class MoodAnalyticsComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // Journal entries data
  journalEntries: JournalEntry[] = [];
  
  // Time periods for analysis
  selectedTimePeriod: string = 'week';
  timePeriods: string[] = ['week', 'month', 'year', 'all'];
  
  // Chart configurations
  public moodDistributionData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ 
      data: [], 
      backgroundColor: []
    }]
  };

  public moodTrendData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Mood Trend',
      fill: false,
      tension: 0.5,
      borderColor: '#3f51b5',
      pointBackgroundColor: '#3f51b5'
    }]
  };

  public moodDistributionOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Mood Distribution'
      }
    }
  };

  public moodTrendOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Mood Trend Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 6,
        ticks: {
          stepSize: 1,
          callback: (value) => {
            const moodValues = Object.values(Mood);
            return moodValues[value as number] || '';
          }
        }
      }
    }
  };

  public doughnutChartType: ChartType = 'doughnut';
  public lineChartType: ChartType = 'line';

  // Mood color mapping
  moodColorMap = {
    'Happy': '#4caf50', // Green
    'Sad': '#2196f3',   // Blue
    'Angry': '#f44336', // Red
    'Anxious': '#ff9800', // Orange
    'Calm': '#00bcd4',  // Cyan
    'Excited': '#9c27b0', // Purple
    'Neutral': '#9e9e9e' // Grey
  };

  private journalSubscription: Subscription | null = null;
  
  constructor(private journalService: JournalService) { }

  ngOnInit(): void {
    this.journalSubscription = this.journalService.getAllJournalEntries().subscribe(entries => {
      this.journalEntries = entries.sort((a, b) => a.date.getTime() - b.date.getTime());
      this.updateCharts();
    });
  }

  ngOnDestroy(): void {
    if (this.journalSubscription) {
      this.journalSubscription.unsubscribe();
    }
  }

  updateCharts(): void {
    const filteredEntries = this.filterEntriesByTimePeriod(this.selectedTimePeriod);
    this.updateMoodDistributionChart(filteredEntries);
    this.updateMoodTrendChart(filteredEntries);
  }

  onTimePeriodChange(period: string): void {
    this.selectedTimePeriod = period;
    this.updateCharts();
  }

  filterEntriesByTimePeriod(period: string): JournalEntry[] {
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (period) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
      default:
        return [...this.journalEntries];
    }
    
    return this.journalEntries.filter(entry => entry.date >= cutoffDate);
  }

  updateMoodDistributionChart(entries: JournalEntry[]): void {
    // Count occurrences of each mood
    const moodCounts: { [key: string]: number } = {};
    const moodLabels: string[] = [];
    const moodData: number[] = [];
    const moodColors: string[] = [];
    
    // Initialize counts for all moods
    Object.values(Mood).forEach(mood => {
      moodCounts[mood] = 0;
    });
    
    // Count entries
    entries.forEach(entry => {
      moodCounts[entry.mood]++;
    });
    
    // Prepare chart data (only include moods that have entries)
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > 0) {
        moodLabels.push(mood);
        moodData.push(count);
        moodColors.push(this.moodColorMap[mood as keyof typeof this.moodColorMap]);
      }
    });
    
    this.moodDistributionData = {
      labels: moodLabels,
      datasets: [{
        data: moodData,
        backgroundColor: moodColors
      }]
    };
    
    if (this.chart) {
      this.chart.update();
    }
  }

  updateMoodTrendChart(entries: JournalEntry[]): void {
    if (entries.length === 0) {
      this.moodTrendData = {
        labels: [],
        datasets: [{
          data: [],
          label: 'Mood Trend',
          fill: false,
          tension: 0.5,
          borderColor: '#3f51b5',
          pointBackgroundColor: '#3f51b5'
        }]
      };
      return;
    }
    
    // Convert moods to numeric values for the trend line
    // Using index in the Mood enum
    const moodValues = Object.values(Mood);
    const labels: string[] = [];
    const data: number[] = [];
    
    entries.forEach(entry => {
      const date = new Date(entry.date);
      let dateStr = '';
      
      // Format date based on time period
      switch (this.selectedTimePeriod) {
        case 'week':
          dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
          break;
        case 'month':
          dateStr = date.toLocaleDateString('en-US', { day: '2-digit' });
          break;
        case 'year':
          dateStr = date.toLocaleDateString('en-US', { month: 'short' });
          break;
        case 'all':
          dateStr = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
          break;
        default:
          dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      }
      
      const moodIndex = moodValues.indexOf(entry.mood);
      
      labels.push(dateStr);
      data.push(moodIndex);
    });
    
    this.moodTrendData = {
      labels: labels,
      datasets: [{
        data: data,
        label: 'Mood Trend',
        fill: false,
        tension: 0.5,
        borderColor: '#3f51b5',
        pointBackgroundColor: '#3f51b5'
      }]
    };
    
    if (this.chart) {
      this.chart.update();
    }
  }

  getMoodTrendAnalysis(): string {
    if (this.journalEntries.length < 3) {
      return 'Add more entries to see mood trend analysis.';
    }
    
    // Get the most recent entries for analysis
    const recentEntries = [...this.journalEntries]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
    
    // Find the most common mood
    const moodCounts: { [key: string]: number } = {};
    recentEntries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    let dominantMood = '';
    let maxCount = 0;
    
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        dominantMood = mood;
        maxCount = count;
      }
    });
    
    const filteredEntries = this.filterEntriesByTimePeriod(this.selectedTimePeriod);
    
    if (filteredEntries.length < 3) {
      return `Your dominant mood recently has been "${dominantMood}".`;
    }
    
    // Check for mood improvement or decline
    const sortedEntries = [...filteredEntries].sort((a, b) => a.date.getTime() - b.date.getTime());
    const firstHalf = sortedEntries.slice(0, Math.floor(sortedEntries.length / 2));
    const secondHalf = sortedEntries.slice(Math.floor(sortedEntries.length / 2));
    
    const moodValues = Object.values(Mood);
    const positiveIndices = [moodValues.indexOf(Mood.HAPPY), moodValues.indexOf(Mood.CALM), moodValues.indexOf(Mood.EXCITED)];
    
    const firstHalfPositive = firstHalf.filter(entry => positiveIndices.includes(moodValues.indexOf(entry.mood))).length;
    const secondHalfPositive = secondHalf.filter(entry => positiveIndices.includes(moodValues.indexOf(entry.mood))).length;
    
    const firstHalfRatio = firstHalfPositive / firstHalf.length;
    const secondHalfRatio = secondHalfPositive / secondHalf.length;
    
    if (secondHalfRatio > firstHalfRatio + 0.2) {
      return `Your mood appears to be improving! Your dominant mood recently has been "${dominantMood}".`;
    } else if (firstHalfRatio > secondHalfRatio + 0.2) {
      return `Your mood appears to be declining. Your dominant mood recently has been "${dominantMood}".`;
    } else {
      return `Your mood has been relatively stable. Your dominant mood recently has been "${dominantMood}".`;
    }
  }
  
  getMostFrequentMood(): string {
    const filteredEntries = this.filterEntriesByTimePeriod(this.selectedTimePeriod);
    
    if (filteredEntries.length === 0) {
      return 'N/A';
    }
    
    const moodCounts: { [key: string]: number } = {};
    
    filteredEntries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    let dominantMood = '';
    let maxCount = 0;
    
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        dominantMood = mood;
        maxCount = count;
      }
    });
    
    return dominantMood;
  }
  
  getMoodConsistency(): number {
    const filteredEntries = this.filterEntriesByTimePeriod(this.selectedTimePeriod);
    
    if (filteredEntries.length < 3) {
      return 0;
    }
    
    const moodCounts: { [key: string]: number } = {};
    let totalEntries = filteredEntries.length;
    
    filteredEntries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    let dominantMood = '';
    let maxCount = 0;
    
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        dominantMood = mood;
        maxCount = count;
      }
    });
    
    return Math.round((maxCount / totalEntries) * 100);
  }
}
