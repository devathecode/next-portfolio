import { CONTACT_EMAIL, LINKEDIN_URL, RESUME_PDF, SITE_URL } from "./site";

/**
 * Public facts about Devanshu, in one place. Structured data (JSON-LD), the
 * home FAQ and /llms.txt all read from here, so search engines and AI
 * assistants get the same answers. Keep it to what is safe to publish.
 */
export const PROFILE = {
  name: "Devanshu Verma",
  alternateName: "Devanshu Kumar Verma",
  jobTitle: "Frontend Developer",
  headline: "React & Next.js Frontend Developer",
  summary:
    "Frontend developer in Noida, India with 5+ years building fast, production web apps in React, Next.js and TypeScript. Open to freelance projects and full-time roles.",
  image: `${SITE_URL}/images/LInkedin_heashot.png`,
  email: CONTACT_EMAIL,
  location: { city: "Noida", region: "Uttar Pradesh", country: "India", countryCode: "IN" },
  remote: true,
  yearsExperience: "5+",
  appsShipped: "10+",
  openTo: ["Full-time frontend roles", "Freelance projects"],
  sameAs: [LINKEDIN_URL],
  languages: ["English", "Hindi"],
  skills: {
    Frontend: ["React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Angular", "Vue.js"],
    "State and data": ["Redux Toolkit", "TanStack Query", "Context API", "REST", "GraphQL"],
    "Performance and architecture": ["Performance tuning", "Component architecture", "Design systems", "Webpack"],
    Practice: ["Agile/Scrum", "CI/CD", "Code reviews", "Testing", "Figma handoff"],
  } as Record<string, string[]>,
  experience: [
    {
      company: "Xcentium",
      role: "Frontend Developer",
      period: "Oct 2024 to present",
      location: "Remote (Irvine, California, US)",
      summary: "Builds accessible, high-performance UIs from design, with lazy loading and caching work to speed up client sites.",
    },
    {
      company: "Gojoko Tech",
      role: "Software Engineer UI",
      period: "Nov 2022 to Sep 2024",
      location: "Noida, India",
      summary: "Led frontend work on several React and TypeScript single-page products, with Redux Toolkit state and REST and GraphQL APIs.",
    },
    {
      company: "Applore Tech",
      role: "Angular Developer",
      period: "Sep 2022 to Nov 2022",
      location: "Noida, India",
      summary: "Built web apps with Angular and Tailwind CSS on tight timelines.",
    },
    {
      company: "Knoldus Inc",
      role: "Software Consultant, UI",
      period: "Jul 2021 to Sep 2022",
      location: "Noida, India",
      summary: "Delivered 15+ microsites and 4 large portals in React, Next.js and Vue, including GSAP and WebGL work.",
    },
  ],
  education: {
    degree: "B.Tech, Information Technology",
    school: "KIET Group of Institutions, Ghaziabad",
    years: "2017 to 2021",
  },
} as const;

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Who is Devanshu Verma?",
    a: "Devanshu Verma is a frontend developer based in Noida, India, with 5+ years of experience building production web apps in React, Next.js and TypeScript. Devanshu has shipped 10+ apps, from marketing sites to large single-page products, and is open to remote work.",
  },
  {
    q: "What does Devanshu Verma specialise in?",
    a: "Fast, accessible frontends for web apps: React and Next.js applications, reusable component libraries, state management with Redux Toolkit and TanStack Query, REST and GraphQL integration, and performance tuning. Devanshu also works with Angular and Vue.",
  },
  {
    q: "Is Devanshu Verma available for hire?",
    a: `Yes. Devanshu is open to full-time frontend roles and freelance projects, working remotely from India. Use the contact form on devanshuverma.in or email ${CONTACT_EMAIL}.`,
  },
  {
    q: "What kind of freelance work does Devanshu take on?",
    a: "Client websites, web apps and utility tools, usually built with Next.js and React: new builds, redesigns, performance fixes, and frontend work alongside an existing product team.",
  },
  {
    q: "How much experience does Devanshu Verma have?",
    a: "5+ years of professional frontend work since 2021, at Knoldus, Gojoko Tech and Xcentium, after a B.Tech in Information Technology from KIET Group of Institutions.",
  },
];

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Short reference to the Person node, for author/publisher fields. */
export const personRef = { "@type": "Person", "@id": PERSON_ID, name: PROFILE.name, url: SITE_URL } as const;

/** Site-wide graph: who Devanshu is and what this website is. */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: PROFILE.name,
        alternateName: PROFILE.alternateName,
        givenName: "Devanshu",
        familyName: "Verma",
        url: SITE_URL,
        image: PROFILE.image,
        email: `mailto:${PROFILE.email}`,
        jobTitle: PROFILE.jobTitle,
        description: PROFILE.summary,
        address: {
          "@type": "PostalAddress",
          addressLocality: PROFILE.location.city,
          addressRegion: PROFILE.location.region,
          addressCountry: PROFILE.location.countryCode,
        },
        worksFor: { "@type": "Organization", name: PROFILE.experience[0].company },
        alumniOf: { "@type": "CollegeOrUniversity", name: PROFILE.education.school },
        hasOccupation: {
          "@type": "Occupation",
          name: PROFILE.jobTitle,
          occupationLocation: { "@type": "Country", name: PROFILE.location.country },
          skills: Object.values(PROFILE.skills).flat().join(", "),
        },
        knowsAbout: [...PROFILE.skills.Frontend, ...PROFILE.skills["State and data"], "Web performance", "Accessibility"],
        knowsLanguage: PROFILE.languages,
        sameAs: PROFILE.sameAs,
        subjectOf: { "@type": "DigitalDocument", name: "Résumé", url: `${SITE_URL}${RESUME_PDF}` },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: PROFILE.name,
        url: SITE_URL,
        description: PROFILE.summary,
        inLanguage: "en",
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
      },
    ],
  };
}

/** Home page: a ProfilePage about Devanshu, plus the visible FAQ. */
export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profile`,
        url: SITE_URL,
        name: `${PROFILE.name} | ${PROFILE.headline}`,
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@id": PERSON_ID },
        inLanguage: "en",
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: FAQ.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };
}

/** Serialise JSON-LD for a <script> tag; escapes "<" so content can't close the tag. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
