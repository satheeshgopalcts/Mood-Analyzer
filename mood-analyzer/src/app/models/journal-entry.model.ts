export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  date: Date;
}

export enum Mood {
  HAPPY = 'Happy',
  SAD = 'Sad',
  ANGRY = 'Angry',
  ANXIOUS = 'Anxious',
  CALM = 'Calm',
  EXCITED = 'Excited',
  NEUTRAL = 'Neutral',
}
