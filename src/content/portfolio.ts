/**
 * Your portfolio's source of truth.
 * Edit these objects to change content without touching the layouts.
 * The projects array controls order, filters, case studies and sitemap entries.
 * Omit githubUrl if a repository isn't public; the card links to your profile.
 * Add liveUrl only when a working deployment is ready.
 */
export type Project = {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  year: string;
  eyebrow: string;
  summary: string;
  description: string;
  stack: string[];
  githubUrl?: string;
  liveUrl?: string;
  visual: "review" | "tracker" | "chat";
  /** Optional real screenshot. Put the image in public/ and use /filename.webp. */
  image?: { src: string; alt: string };
  accent: "mint" | "peach" | "lavender";
  role: string;
  problem: string;
  solution: string;
  features: { title: string; description: string }[];
  flow: string[];
  takeaway: string;
};

export const profile = {
  name: "Shishir Jha",
  firstName: "Shishir",
  initials: "sj",
  role: "Software Engineer",
  currentCompany: "Promact Infotech",
  location: "India",
  email: "shishir230501@gmail.com",
  github: "https://github.com/shishir2305",
  githubRepositories: "https://github.com/shishir2305?tab=repositories",
  leetcode: "https://leetcode.com/u/shishir230501/",
  linkedin: "https://www.linkedin.com/in/shishirjha230501/",
  description:
    "Software engineer building thoughtful AI experiences, web applications, and mobile products. Explore Shishir Jha's selected projects and engineering work.",
  introduction:
    "I build AI experiences, web applications, and mobile products—with a focus on making complex things feel simple.",
  education: {
    degree: "B.Tech, Computer Science & Engineering",
    institution: "Om Dayal Group of Institutions",
    years: "2020 — 2024",
    grade: "9.10 CGPA",
  },
};

export const projects: Project[] = [
  {
    slug: "devlens",
    title: "DevLens",
    shortTitle: "AI-assisted code reviews, connected to GitHub.",
    category: "AI & tooling",
    year: "2026",
    eyebrow: "AI code review platform",
    summary:
      "AI-assisted code reviews with GitHub integration, background workflows, and subscription billing.",
    description:
      "An AI code reviewer platform that connects to GitHub, detects bugs, and suggests code improvements—with authentication and subscription management built in.",
    stack: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Inngest",
      "Octokit",
      "Better Auth",
    ],
    githubUrl: "https://github.com/shishir2305/devlens-pr-reviewer",
    visual: "review",
    accent: "mint",
    role: "Full-stack development",
    problem:
      "Code review asks developers to switch between understanding a change and spotting the details that could cause trouble. I wanted to explore how AI could provide another useful layer of feedback in that workflow.",
    solution:
      "I built DevLens to connect with GitHub repositories, review code for potential bugs, and suggest improvements. The platform also includes secure GitHub sign-in and pricing and billing features for subscription access.",
    features: [
      {
        title: "Connect with GitHub",
        description:
          "GitHub authentication through Better Auth connects users with their repositories, while Octokit provides the GitHub integration.",
      },
      {
        title: "Put AI to work",
        description:
          "AI analysis detects potential bugs and suggests ways to improve code. Inngest supports the platform’s background workflows.",
      },
      {
        title: "Build beyond the demo",
        description:
          "PostgreSQL-backed persistence and subscription management bring the surrounding product experience together.",
      },
    ],
    flow: ["GitHub", "Review workflow", "AI analysis", "Code feedback"],
    takeaway:
      "A useful AI feature is part of a larger product. Authentication, repository access, background work, and billing all matter to the experience around the review.",
  },
  {
    slug: "price-tracker",
    title: "Price Tracker",
    shortTitle: "Automated price monitoring and email alerts.",
    category: "Web apps",
    year: "2025",
    eyebrow: "E-commerce automation",
    summary:
      "Track product prices and receive an email when an item drops below your target.",
    description:
      "An e-commerce price tracker and alert system built with Python, Django, and Beautiful Soup. It monitors product information and sends email alerts when a price drops below a chosen threshold.",
    stack: ["Python", "Django", "Beautiful Soup", "Email alerts"],
    visual: "tracker",
    accent: "peach",
    role: "Development & automation",
    problem:
      "Checking the same product page over and over is a small but repetitive chore. A useful price drop can be easy to miss when there’s no way to ask for an update.",
    solution:
      "I built a tool that tracks products from e-commerce websites and sends an email when the price falls below a selected threshold. It gathers the product name, price, rating, and availability with Beautiful Soup, with Django providing the application foundation.",
    features: [
      {
        title: "Collect the details",
        description:
          "Extract product names, prices, ratings, and availability from e-commerce pages using Beautiful Soup.",
      },
      {
        title: "Watch a target price",
        description:
          "Compare the tracked price against a chosen threshold so the tool can identify a relevant price drop.",
      },
      {
        title: "Send a timely nudge",
        description:
          "Email alerts let users know when the price drops below the threshold, saving another manual check.",
      },
    ],
    flow: ["Product page", "Extract details", "Check threshold", "Email alert"],
    takeaway:
      "Some of the most useful software does one small job consistently. This project applies web development and scraping to a familiar everyday task.",
  },
  {
    slug: "live-chatroom",
    title: "Live Chatroom",
    shortTitle: "Real-time conversations with Flask and Socket.IO.",
    category: "Web apps",
    year: "2020",
    eyebrow: "Real-time conversations",
    summary:
      "Create or join a room and chat in real time, powered by Flask and Socket.IO.",
    description:
      "A real-time chatroom application built with Python, Flask, and Flask-SocketIO, with straightforward room creation and joining.",
    stack: ["Python", "Flask", "Flask-SocketIO"],
    githubUrl: "https://github.com/shishir2305/live-chatroom-app",
    visual: "chat",
    accent: "lavender",
    role: "Web application development",
    problem:
      "A conversation should feel immediate. I wanted to build a shared space where people could create or join a room and talk without refreshing a page.",
    solution:
      "I built a real-time chatroom with Flask and Flask-SocketIO. The application lets users create new rooms and join existing ones, with live communication at the centre of the experience.",
    features: [
      {
        title: "Make a space",
        description:
          "Create a new chatroom to give a conversation its own shared space.",
      },
      {
        title: "Join the conversation",
        description:
          "Join an existing room through a straightforward entry flow.",
      },
      {
        title: "Keep it real-time",
        description:
          "Flask-SocketIO powers live communication between people in a chatroom.",
      },
    ],
    flow: ["Create or join", "Connect", "Send a message", "Live conversation"],
    takeaway:
      "An early exploration of real-time applications that brought together Python, web interfaces, and socket-based communication.",
  },
];

export const experience = [
  {
    company: "Promact Infotech",
    role: "Software Engineer I",
    period: "Aug 2024 — Present",
    location: "Vadodara, India",
    current: true,
    highlights: [
      "Built a personalised AI assistant and integrated text and image generation into a collaborative canvas.",
      "Developed Community and Smart Projects modules for discussions, document sharing, and AI-powered insights.",
      "Implemented Firebase push notifications in React Native, increasing app engagement by 20%.",
    ],
    stack: ["React", "React Native", "TypeScript", "Zustand", "Firebase"],
  },
  {
    company: "Promact Infotech",
    role: "Software Engineer Intern",
    period: "Jan — Apr 2024",
    location: "Vadodara, India",
    current: false,
    highlights: [
      "Built a customer success platform proof of concept to improve visibility for stakeholders.",
      "Developed a custom iOS keyboard using Swift and React Native based on client requirements.",
    ],
    stack: ["Swift", "React Native", "TypeScript", "Firebase"],
  },
  {
    company: "Nrxen IT Technologies",
    role: "SDE Intern",
    period: "Dec 2022 — Aug 2023",
    location: "Kolkata, India",
    current: false,
    highlights: [
      "Developed Appsmith interfaces for a mobility management system and automated vehicle route reversals, reducing manual reversals by 90%.",
      "Integrated Redis into existing microservices, reducing response time by 15%.",
    ],
    stack: ["Node.js", "Express", "Redis", "PostgreSQL", "MQTT"],
  },
];

export const skills = [
  {
    title: "Frontend & mobile",
    items: ["React", "Next.js", "React Native", "TypeScript", "Zustand"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express", "Python", "Flask", "REST APIs"],
  },
  {
    title: "Data & infrastructure",
    items: ["PostgreSQL", "MongoDB", "Redis", "Firebase", "Docker", "AWS S3"],
  },
  { title: "Development tools", items: ["Git", "Claude Code", "Cursor"] },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
