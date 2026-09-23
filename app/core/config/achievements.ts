/*
 * core/config/achievements.ts
 * Author: Ahmed Emad Nasr
 *
 * The "Awards & Achievements" section existed in the CV and was absent from
 * the site entirely. That is the strangest gap between the two: these
 * numbers (Top 1% on TryHackMe, 44th of 450 in a CTF, first among 250
 * trainees) are the strongest thing someone early in their career has —
 * third-party competitive evidence rather than self-description.
 *
 * Stored as data rather than JSX so it can be filtered, turned into JSON-LD
 * and read by the command palette without being repeated.
 */

export type AchievementKind = "rank" | "award" | "community";

export type Achievement = {
  id: string;
  /** The achievement itself in one line — the number first, so the eye catches it */
  title: string;
  /** The organisation or platform */
  context: string;
  kind: AchievementKind;
  /** The year, if known — leave it empty for an ongoing achievement */
  year?: number;
  /** A proof link: a profile, a results announcement, a channel page */
  proofUrl?: string;
};

export const achievements: readonly Achievement[] = [
  {
    /*
     * من الـ CV — كانت غايبة كعنصر مستقل هنا. ⚠️ الـ CV بيقول "8th of 900"،
     * والموقع في experience.ts (وصف تعليم Benha University) لسه بيقول
     * "5th out of 900" — رقمين مختلفين لنفس الإنجاز، والاتنين موجودين
     * دلوقتي على نفس صفحة الـ CV. ده تناقض محتاج قرار منك، مش حاجة ناقصة،
     * فسبته زي ما هو في experience.ts.
     */
    id: "academic-excellence",
    title: "Ranked 8th of 900",
    context: "Information Security & Digital Forensics, Benha University",
    kind: "rank",
  },
  {
    id: "thm-top-1",
    title: "Top 1% globally",
    context: "TryHackMe",
    kind: "rank",
    // proofUrl: "https://tryhackme.com/p/…",  ← add your profile; this verifies instantly
  },
  {
    id: "gdg-best-instructor",
    title: "1st place & Best Technical Instructor among 250 instructors",
    context: "Google Developer Groups",
    kind: "award",
    year: 2025,
  },
  {
    id: "depi-top-achiever",
    title: "Top Achiever, Round 4",
    context: "Digital Egypt Pioneers Initiative (DEPI)",
    kind: "award",
  },
  {
    id: "iti-ctf",
    title: "44th of 450",
    context: "ITI & CyberTalents CTF Competition",
    kind: "rank",
  },
  {
    id: "ecpc",
    title: "Top 99 of 1,500 teams",
    context: "Egyptian Collegiate Programming Contest (ECPC)",
    kind: "rank",
  },
  {
    id: "ieee-ghostec",
    title: "2nd place — C-programmed racing robot",
    context: "IEEE GHOSTEC Robotics Competition",
    kind: "award",
  },
  {
    id: "youtube",
    title: "500+ subscribers, 60,000+ views",
    context: "Cybersecurity YouTube channel",
    kind: "community",
    proofUrl: "https://www.youtube.com/@AhmedEmad-0x3omda",
  },
];
