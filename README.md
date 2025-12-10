🎀 MIRA — CAPTURE MOMENTS, CREATE MEMORIES
A beautiful, modern photo-booth web app for capturing and sharing life's precious moments.

Smooth UI • Stunning layouts • Aesthetic filters • Camera magic ✨

🌟 FEATURES
🎭 Stunning UI/UX

Pink & rose gradient theme

Smooth GSAP animations

Glassmorphism effects

Fully responsive design

⚡ Modern Tech Stack

React 18+

Tailwind CSS

GSAP

Lucide Icons

Clean, modular code

📧 Contact System

EmailJS integration

Real-time validation

Success & error notifications

Mobile-friendly design

🎨 Customizable

Easy theme customization

Well-structured components

Developer-friendly setup

🚀 QUICK START
Prerequisites

Node.js 16+

Basic React knowledge

EmailJS account (optional)

Installation
# Clone repository
git clone https://github.com/Priyam-265/mira.git

# Enter project
cd mira

# Install dependencies
npm install

# Start development server
npm run dev


Your app will run at:
👉 http://localhost:5173
 🎉

📁 PROJECT STRUCTURE
mira/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── components/
│   │   ├── Contact.jsx
│   │   ├── About.jsx
│   │   └── Home.jsx
│   ├── styles/
│   │   └── index.css
│   ├── App.js
│   └── index.js
├── package.json
└── README.md

⚙️ EMAILJS SETUP

Sign up at EmailJS

Create an email service

Add template variables:

{{from_name}}
{{from_email}}
{{subject}}
{{message}}


Add your keys in Contact.jsx:

// Initialize
window.emailjs.init('YOUR_PUBLIC_KEY');

// Send Email
await window.emailjs.send(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  templateParams
);

🎨 CUSTOMIZATION
Colors
background: 'linear-gradient(135deg, #fdf2f8, #fce7f3, #fbcfe8)'

Fonts
@import url('https://fonts.googleapis.com/css2?family=YourFont&display=swap');

🛠 BUILT WITH

React

Tailwind CSS

GSAP

EmailJS

Lucide Icons

🤝 CONTRIBUTING

Contributions are welcome!

Fork → Create Feature Branch → Commit → Push → Open PR

📝 LICENSE

Distributed under the MIT License.

👨‍💻 AUTHOR

Priyam
GitHub: https://github.com/Priyam-265

Email: mira.capturemoments@gmail.com

🌟 SHOW YOUR SUPPORT

If you like this project, please give it a ⭐ — it helps a lot!

💖 MADE WITH LOVE

Mira © 2025 — Crafted with passion.
