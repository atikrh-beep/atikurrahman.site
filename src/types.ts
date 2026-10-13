export interface SocialLink {
  id: string;
  name: string;
  url: string;
  isPlaceholder?: boolean;
}

export interface TechItem {
  name: string;
  category: 'Cloud & Tech' | 'Programming' | 'Core' | 'Development' | 'Systems';
  iconKey: string;
  url?: string;
  isLink?: boolean;
}

export interface ProgrammingStatItem {
  id: string;
  label: string;
  value: string;
}

export interface ProgrammingProfileItem {
  id: string;
  name: string;
  handle: string;
  profileUrl: string;
  iconKey: 'vjudge' | 'toph' | 'beecrowd';
}

export interface AchievementItem {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  details?: string;
  isOngoing?: boolean;
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: string[];
}
