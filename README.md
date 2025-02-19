# Telegram-Style Portfolio Website

A modern, interactive portfolio website with a Telegram-like chat interface. Built with HTML, CSS, and vanilla JavaScript.

![Portfolio Preview](preview.png)

## Features

### 📱 Chat Interface

- Telegram-inspired design
- Real-time typing indicators
- Message history
- Dark/Light theme toggle
- Interactive command system

### 🤖 Bot Commands

- `/help` - Display available commands
- `/skills` - View technical & soft skills
- `/projects` - Browse portfolio projects
- `/services` - View services & pricing
- `/contact` - Get contact information
- `/location` - View location on map
- `/resume` - Download CV
- `/clear` - Clear chat history

### 💼 Project Showcase

- Visual project cards
- Live preview links
- Source code access
- Project technology tags
- Loading state handling

### 🛠️ Services Section

- Professional services listing
- Pricing information
- Service descriptions
- Direct contact integration

### 📍 Location Features

- Interactive Google Maps
- Click-to-navigate functionality
- Location information

### 📱 Contact Options

- Email integration
- WhatsApp direct message
- Phone call functionality
- Social media links
- Professional network connections

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Google Maps API
- MongoDB (for message storage)
- Node.js backend
- Vercel deployment

## Setup & Installation

1. Clone the repository:

```bash
git clone https://github.com/Ocdeed/telegram-portfolio-V2.git
cd telegram-portfolio-V2
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

- Copy `.env.example` to `.env`
- Add your API keys and configuration

4. Start the development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## Environment Variables

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
JWT_SECRET=your_secret_key
GOOGLE_MAPS_API_KEY=your_maps_api_key
```

## Project Structure

```
telegram-portfolio-V2/
├── assets/
│   └── Octavian_Resume.pdf
├── server/
│   ├── models/
│   │   ├── Message.js
│   │   └── Inquiry.js
│   └── server.js
├── styles.css
├── script.js
├── index.html
├── vercel.json
├── .env
└── README.md
```

## Deployment

This project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with:

```bash
vercel --prod
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## Contact

Your Name - [ocdeed76@gmail.com](mailto:ocdeed76@gmail.com)

Project Link: [https://github.com/Ocdeed/telegram-portfolio-V2](https://github.com/Ocdeed/telegram-portfolio-V2)
