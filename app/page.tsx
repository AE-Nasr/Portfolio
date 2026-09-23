/*
 * File: page.tsx
 * PERF BUILD:
 * - Pre-stringified JSON-LD at module evaluation time. 
 * Zero CPU cost per request on the server.
 */

import type { Metadata } from "next";
import MainClient from "./page-client";
// Server Component: reads certifications + skills + achievements,
// so the data stays at build time and never reaches the visitor's browser.
import Credentials from "./components/credentials/credentials";

export const metadata: Metadata = {
  title: "Ahmed Emad Nasr | SOC & Cybersecurity Analyst | DFIR & Malware Analysis",
  description:
    "Ahmed Emad Nasr's portfolio showcasing SOC operations, incident response, malware analysis, threat hunting, and real security case reports using Wazuh, Suricata, and ELK.",
  keywords: [
    "SOC portfolio",
    "incident response portfolio",
    "threat hunting projects",
    "malware analysis reports",
    "DFIR analyst",
    "Wazuh detection rules",
    "eJPT certified"
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ahmed Emad Nasr | SOC & Cybersecurity Analyst",
    description:
      "Real SOC/IR case reports, security projects, malware analysis, and cybersecurity training impact by Ahmed Emad Nasr.",
    url: "https://ae-nasr.github.io/Portfolio/",
    type: "website",
    images: [
      {
        url: "https://ae-nasr.github.io/Portfolio/Assets/art-gallery/Images/logo/3omda.webp",
        width: 1200,
        height: 630,
        alt: "Ahmed Emad Nasr SOC portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Emad Nasr | SOC & Incident Response Analyst",
    description:
      "Explore SOC investigations, DFIR workflows, malware analysis cases, and detection engineering.",
    images: ["https://ae-nasr.github.io/Portfolio/Assets/art-gallery/Images/logo/3omda.webp"],
  },
};

// Serialise the data once, in memory, to save the work on every render
const STRUCTURED_DATA_JSON = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": "https://ae-nasr.github.io/Portfolio/#main-profile-page",
      url: "https://ae-nasr.github.io/Portfolio/",
      name: "Ahmed Emad Nasr SOC Analyst Portfolio",
      inLanguage: "en",
    },
    {
      "@type": "Service",
      "@id": "https://ae-nasr.github.io/Portfolio/#service-soc-ir",
      name: "SOC Monitoring and Incident Response Support",
      provider: {
        "@type": "Person",
        name: "Ahmed Emad Nasr",
      },
      areaServed: "Worldwide",
      serviceType: ["SOC Monitoring", "Incident Response", "Threat Hunting", "Security Training", "Digital Forensics"],
      /* كان #Contact — القسم اتشال، والـ anchor بقى ميت. */
      url: "https://ae-nasr.github.io/Portfolio/",
    },
  ],
});

export default function Main() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: STRUCTURED_DATA_JSON }} // Use the prepared string directly
      />
      <MainClient credentials={<Credentials />} />
    </>
  );
}