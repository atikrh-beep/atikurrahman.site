import { 
  SocialLink, 
  TechItem, 
  AchievementItem, 
  SkillCategory, 
  ProgrammingStatItem, 
  ProgrammingProfileItem 
} from '../types.ts';

import defaultProfilePic from '../assets/images/WhatsApp Image 2026-09-28 at 00.01.36.jpeg';
import fallbackProfilePic from '../assets/images/atikur_photo.jpg';

// ==========================================
// 1. EDITABLE PROFILE & IDENTITY CONFIGURATION
// ==========================================

// Your exact unedited personal photo (and fallbacks)
export const PROFILE_IMAGE_URL = defaultProfilePic;
export const PROFILE_IMAGE_FALLBACK = fallbackProfilePic;

// Website identity: exactly "atikurrahman.site" with "k"
export const SITE_IDENTITY = 'atikurrahman.site';
export const FULL_NAME = 'Atikur Rahman';
export const HERO_HEADLINE = 'Exploring Computer Science, Problem Solving, AI & Innovative Technology';

// University subtle identity
export const UNIVERSITY_NAME = 'Daffodil International University';
export const UNIVERSITY_DEPARTMENT = 'Computer Science and Engineering';

// ==========================================
// 2. EDITABLE EXTERNAL URLs & PLATFORMS
// ==========================================

// Social links in required order: Instagram → GitHub → LinkedIn → Facebook → WhatsApp
export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://instagram.com/', // Replace with your Instagram profile URL
    isPlaceholder: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/atikrh-beep',
    isPlaceholder: false,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://bd.linkedin.com/in/md-atikur-rahman-4874aa299',
    isPlaceholder: false,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://facebook.com/', // Replace with your Facebook profile URL
    isPlaceholder: true,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    url: 'https://wa.me/', // Replace with your WhatsApp link (e.g. https://wa.me/8801...)
    isPlaceholder: true,
  },
];

// Ecosystem Platforms
export const BIGCROWD_URL = 'https://bigcrowd.io/';
export const TOPH_URL = 'https://toph.co/u/Atikrh99';
export const AWS_URL = 'https://aws.amazon.com/';

// Private Discord invite URL
export const DISCORD_INVITE_URL = 'https://discord.gg/8f4KMqXag';

// ==========================================
// 3. EDITABLE PROGRAMMING DATA
// ==========================================

export const PROGRAMMING_DESCRIPTION =
  'Solving algorithmic challenges, participating in timed contests, and mastering data structures.';

// Minimal horizontal statistics
export const PROGRAMMING_STATS: ProgrammingStatItem[] = [
  {
    id: 'problems-solved',
    label: 'Problems Solved',
    value: '120',
  },
  {
    id: 'contests-participated',
    label: 'Contests Participated',
    value: '4',
  },
  {
    id: 'platforms',
    label: 'Platforms',
    value: '3',
  },
];

// Exactly three programming-platform profiles: VJudge, Toph, Beecrowd
export const PROGRAMMING_PROFILES: ProgrammingProfileItem[] = [
  {
    id: 'vjudge',
    name: 'VJudge',
    handle: 'Atikrh99',
    profileUrl: 'https://vjudge.net/user/Atikrh99',
    iconKey: 'vjudge',
  },
  {
    id: 'toph',
    name: 'Toph',
    handle: 'Atikrh99',
    profileUrl: 'https://toph.co/u/Atikrh99',
    iconKey: 'toph',
  },
  {
    id: 'beecrowd',
    name: 'Beecrowd',
    handle: '1183507',
    profileUrl: 'https://judge.beecrowd.com/en/profile/1183507',
    iconKey: 'beecrowd',
  },
];

// ==========================================
// 4. ABOUT CONTENT
// ==========================================
export const ABOUT_TEXT =
  "I'm a Computer Science and Engineering student who enjoys exploring technology, solving programming problems, and turning ideas into practical projects. My interests continue to grow across algorithms, AI, programming, and emerging technologies.";

// ==========================================
// 5. FLOATING TECHNOLOGY & ANIMATED TICKER
// ==========================================
export const TECH_ROW_TOP: TechItem[] = [
  { name: 'Amazon AWS', category: 'Cloud & Tech', iconKey: 'aws', url: AWS_URL, isLink: true },
  { name: 'C', category: 'Programming', iconKey: 'c' },
  { name: 'Data Structures', category: 'Core', iconKey: 'datastructures' },
  { name: 'BigCrowd', category: 'Cloud & Tech', iconKey: 'bigcrowd', url: BIGCROWD_URL, isLink: true },
  { name: 'Java', category: 'Programming', iconKey: 'java' },
  { name: 'GitHub', category: 'Development', iconKey: 'github', url: 'https://github.com/atikrh-beep', isLink: true },
  { name: 'APIs', category: 'Systems', iconKey: 'api' },
  { name: 'VS Code', category: 'Development', iconKey: 'vscode' },
];

export const TECH_ROW_BOTTOM: TechItem[] = [
  { name: 'Toph', category: 'Cloud & Tech', iconKey: 'top', url: TOPH_URL, isLink: true },
  { name: 'C++', category: 'Programming', iconKey: 'cpp' },
  { name: 'Algorithms', category: 'Core', iconKey: 'algorithms' },
  { name: 'Arduino', category: 'Development', iconKey: 'arduino' },
  { name: 'OOP', category: 'Core', iconKey: 'oop' },
  { name: 'Telegram Bot Dev', category: 'Systems', iconKey: 'telegram' },
  { name: 'Replit', category: 'Development', iconKey: 'replit' },
];

// ==========================================
// 6. ACHIEVEMENTS
// ==========================================
export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'pps-contest',
    title: 'Finalist — Programming & Problem-Solving Contest (PPS)',
    subtitle: 'Final Round',
    period: 'Summer 2025',
    details: 'Qualified for the final round demonstrating algorithmic thinking, speed, and analytical debugging under timed contest conditions.'
  },
  {
    id: 'uta-contest',
    title: 'Finalist — Unlock the Algorithm (UTA)',
    subtitle: 'Final Round',
    period: 'Summer 2026',
    details: 'Advanced to the final stage of the algorithm competition, solving complex combinatorial and algorithmic challenges.'
  },
  {
    id: 'iot-workshop',
    title: 'Embedded IoT Systems & IoT Hardware Workshop',
    subtitle: 'Technical Hands-on Labs',
    period: '2024 – Present',
    details: 'Microcontroller architecture, circuit design, sensor interfacing, and hardware-software communication protocols.'
  },
  {
    id: 'ads-excellence',
    title: 'Algorithm & Data Structure Excellence',
    subtitle: 'Continuous Pursuit',
    period: 'Continuous Development',
    details: 'Continuous learning and development in algorithms and data structures through competitive problem solving and systems implementation.'
  },
  {
    id: 'ai-hackathon',
    title: 'AI Hackathon — DIU CPC Club',
    subtitle: 'Collaborative Innovation Sprint',
    period: 'Ongoing',
    isOngoing: true,
    details: 'Collaborating on automated intelligence prototypes and practical solutions under DIU CPC Club mentorship.'
  },
  {
    id: 'diu-cpc-member',
    title: 'General Member — DIU CPC Club',
    subtitle: 'Computer Programming Club',
    period: 'Active Member',
    details: 'Participating in university-wide programming camps, algorithm seminars, and problem-solving workshops.'
  }
];

// ==========================================
// 7. SKILLS
// ==========================================
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Programming Languages',
    description: 'Core syntax, pointers, memory allocation, and compilation.',
    skills: ['C', 'C++', 'Java']
  },
  {
    title: 'Core Computer Science',
    description: 'Algorithmic efficiency, linked structures, and object design.',
    skills: ['Data Structures', 'Algorithms', 'Object-Oriented Programming']
  },
  {
    title: 'Development Tools & Platforms',
    description: 'Version control, environments, and embedded prototyping hardware.',
    skills: ['GitHub', 'VS Code', 'Replit', 'Arduino']
  },
  {
    title: 'Systems & Integrations',
    description: 'External protocol bridges, bots, and modern cloud infrastructure.',
    skills: ['APIs', 'Telegram Bot Development', 'Amazon AWS']
  }
];
