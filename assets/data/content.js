/**
 * content.js — All non-project page content in one place.
 *
 * Edit this file to update personal info, skills, and interests
 * without touching any HTML.
 */

const CONTENT = {

  /* ── Personal ─────────────────────────────────────────── */
  name:    "Amit Karanth Gurpur",
  role:    "ECE Graduate Student & Software Engineer",
  tagline: "Think. Build. Make it work.",
  photo:   "assets/images/profile/photo.jpg",     // TODO: add your photo

  /* ── Contact ──────────────────────────────────────────── */
  contact: {
    email:    "gurpuramit@gmail.com",
    linkedin: "https://www.linkedin.com/in/amit-karanth",
    github:   "https://github.com/amitkaranth",
    qrCode:   "assets/images/qr/linkedin-qr.png", // update filename if different
  },

  /* ── Resume ───────────────────────────────────────────── */
  resumeUrl: "https://drive.google.com/file/d/1Q8MLtyIKH0At7_UQgUVkIZDsyZTnFDAL/preview?usp=sharing",   // TODO: add your resume PDF or external link

  /* ── Skills ───────────────────────────────────────────── */
  //
  // ORGANISATION:
  //   skills[]      → shown as icon chips on the Home page (tools/languages with logos)
  //   mlTechniques  → used as badge tags in project cards (no logos, concept-level)
  //
  // Icon files should be SVGs placed in assets/images/skills/
  // Great source: https://devicons.github.io  (right-click → Save As)
  //
  skills: [
    // ── Languages ─────────────────────────────────────────
    { name: "Python",  icon: "assets/images/skills/python.svg",  category: "Languages" },
    { name: "C",       icon: "assets/images/skills/c.svg",       category: "Languages" },
    { name: "C++",     icon: "assets/images/skills/cpp.svg",     category: "Languages" },
    { name: "Java",    icon: "assets/images/skills/java.svg",    category: "Languages" },
    { name: "MATLAB",  icon: "assets/images/skills/matlab.svg",  category: "Languages" },

    // ── Frameworks & Tools ────────────────────────────────
    { name: "ROS2",    icon: "assets/images/skills/ros.svg",     category: "Tools" },
    { name: "Docker",  icon: "assets/images/skills/docker.svg",  category: "Tools" },
    { name: "Airflow", icon: "assets/images/skills/airflow.svg", category: "Tools" },
    { name: "OpenCL",  icon: "assets/images/skills/opencl.svg",  category: "Tools" },
    { name: "OpenGL",  icon: "assets/images/skills/opengl.svg",  category: "Tools" },
    { name: "Git",     icon: "assets/images/skills/git.svg",     category: "Tools" },

    // ── Platforms ─────────────────────────────────────────
    { name: "Linux",          icon: "assets/images/skills/linux.svg",   category: "Platforms" },
    { name: "Android Studio", icon: "assets/images/skills/android.svg", category: "Platforms" },
  ],

  //
  // ML techniques — used as tags on project cards, not shown as icon chips.
  // Reference these strings in your PROJECTS tags array.
  //
  mlTechniques: [
    "CNN", "Classical ML", "LLM", "LSTM", "U-Net", "SLAM",
  ],

  /* ── Interests page ───────────────────────────────────── */
  interests: {

    // Short vision statement shown in the large quote block
    visionStatement: `I'm building systems that reduce real-world friction—making complexity feel simple and effortless. Machine learning meets systems thinking to create solutions that are powerful and actually usable.`,

    // Technical interests — each with an emoji icon, title, and body
    technical: [
      {
        icon:  "⚙️",
        title: "Image-Signal Processing",
        body:  "Extracting meaningful information from raw data is a challenge. I'm fascinated by how we can use algorithms to enhance, interpret, and make sense of complex signals, whether it's images, sensor data, or something else entirely.",
      },
      {
        icon:  "🤖",
        title: "ML & AI Systems",
        body:  "Building intelligent systems that learn and adapt. I'm particularly interested in how ML can be applied to real-world problems, from computer vision to natural language processing, and how we can make these systems more efficient and accessible.",
      },
      {
        icon:  "☁️",
        title: "Systems & Automation",
        body:  "Automating complex workflows so that systems can operate without constant human intervention. I enjoy creating solutions that reduce friction and make technology work seamlessly in the background.",
      },
    ],

    // Personal / non-technical interests
    personal: [
      {
        body:  "Outside of engineering, I'm drawn to understanding how things work at a deeper level: systems, patterns, and decisions. I enjoy simplifying complexity, whether in code or in everyday life.",
      },
    ],

    // How you combine both worlds — a paragraph or two
    synthesis: `
      My technical work is driven by the same idea that shapes how I think outside of it: reducing complexity to something simple and usable. Whether it's building ML systems or automating workflows, I focus on creating solutions that remove friction and make a real difference in how people interact with technology.
    `,
  },
};

if (typeof module !== "undefined") module.exports = CONTENT;
