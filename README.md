🎀 Mira – Capture Moments, Create Memories

A beautiful, modern photo-booth web app for capturing and sharing life's precious moments.
Smooth UI • Stunning layouts • Aesthetic filters • Camera magic ✨

🌟 Features
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

Real-time form validation

Success & error notifications

Mobile-friendly contact form

🎨 Customizable

Easy theme customization

Well-structured components

Developer-friendly setup

🚀 Quick Start
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
http://localhost:5173
 🎉

📁 Project Structure
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

⚙️ EmailJS Setup

Sign up at EmailJS

Create an email service

Create a template using these variables:

{{from_name}}
{{from_email}}
{{subject}}
{{message}}


Add your keys inside Contact.jsx:

// Initialize
window.emailjs.init('YOUR_PUBLIC_KEY');

// Send
await window.emailjs.send(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  templateParams
);

🎨 Customization
Colors

Modify gradients anywhere:

background: 'linear-gradient(135deg, #fdf2f8, #fce7f3, #fbcfe8)'

Fonts

Replace Google Fonts:

@import url('https://fonts.googleapis.com/css2?family=YourFont&display=swap');

🛠 Built With

React

Tailwind CSS

GSAP

EmailJS

Lucide Icons

🤝 Contributing

Contributions are always welcome!

Fork → Create Feature Branch → Commit → Push → Open PR

📝 License

Distributed under the MIT License.

👨‍💻 Author

Priyam
GitHub: https://github.com/Priyam-265

Email: mira.capturemoments@gmail.com

🌟 Show Your Support

If you like this project, give it a ⭐ — it helps a lot!

💖 Made with love 

Mira © 2025 — Crafted with passion.
