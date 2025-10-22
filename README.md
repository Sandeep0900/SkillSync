# 🎤 AI Auto Interview

A modern, AI-powered interview practice application that helps users improve their skills through automated voice-based interviews. Built with React and featuring a beautiful Gen Z-inspired UI with gradients and smooth animations.

![AI Interview App](https://img.shields.io/badge/React-18.x-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🎯 **Topic-Based Interviews** - Practice on any technical topic
- 🗣️ **Voice Recognition** - Speak your answers naturally
- 🔊 **Text-to-Speech** - Questions are read aloud automatically
- 🌍 **Multi-Language Support** - English and Hindi
- 📊 **AI-Powered Feedback** - Get detailed analysis of your answers
- 🎨 **Modern UI** - Beautiful gradients and smooth animations
- 📱 **Responsive Design** - Works on mobile and desktop
- 💬 **Modal Feedback** - View detailed feedback in elegant popups

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern browser with Web Speech API support (Chrome recommended)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-interview-app.git
cd ai-interview-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Install Tailwind CSS**
```bash
npm install -D @tailwindcss/postcss
```

4. **Configure PostCSS**

Create `postcss.config.js` in the project root:
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

5. **Update `src/index.css`**
```css
@import "tailwindcss";
```

6. **Start the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Backend Setup

This frontend requires a backend API running on `http://localhost:5000` with the following endpoints:

- `POST /generate-questions` - Generate interview questions
- `POST /analyze-answers` - Analyze and score answers

**Request/Response formats:**

```javascript
// POST /generate-questions
Request: { topic: string, language: string }
Response: { questions: string[] }

// POST /analyze-answers
Request: { questions: string[], answers: string[], language: string }
Response: { feedbacks: string[] }
```

> **Note:** Feedback strings should include scores in format "Score: X/10" for proper score extraction.

## 📁 Project Structure

```
interview_prac/
├── src/
│   ├── App.jsx           # Main application component
│   ├── index.css         # Tailwind CSS imports
│   └── main.jsx          # React entry point
├── public/
├── package.json
├── postcss.config.js     # PostCSS configuration
├── vite.config.js        # Vite configuration
└── README.md
```

## 🎨 UI Components

### Start Screen
- Topic input field
- Language selector (English/Hindi)
- Start Interview button

### Interview Screen
- Question display with progress indicators
- Real-time recording status
- Automatic question reading and answer recording

### Results Screen
- Score cards for each question
- "View Details" button for full feedback
- Modal popup with:
  - Original question
  - Your answer
  - Detailed AI feedback
- Reset button to start new interview

## 🛠️ Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Web Speech API** - Voice recognition and text-to-speech
- **Fetch API** - Backend communication

## 🎯 How It Works

1. **User enters a topic** and selects language
2. **Backend generates questions** based on the topic
3. **Questions are read aloud** using Text-to-Speech
4. **User answers verbally** using Voice Recognition
5. **Automatic progression** to next question
6. **Backend analyzes all answers** using AI
7. **Results displayed** with scores and detailed feedback

## 🌐 Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Safari (Limited speech recognition)
- ❌ Firefox (No Web Speech API support)

## 🔧 Configuration

### Change API Base URL

Update the `API_BASE` constant in `App.jsx`:
```javascript
const API_BASE = "http://your-api-url:port";
```

### Add More Languages

Extend the language selector and add language codes:
```javascript
<option value="Spanish">Spanish</option>
// In speakQuestion and recordAnswer:
utterance.lang = language === "Spanish" ? "es-ES" : "en-US";
```

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🐛 Troubleshooting

### Tailwind CSS Not Working
```bash
npm uninstall tailwindcss
npm install -D @tailwindcss/postcss
# Update postcss.config.js as shown above
```

### Speech Recognition Not Working
- Use Chrome or Edge browser
- Ensure microphone permissions are granted
- Check browser console for errors

### API Connection Failed
- Verify backend is running on correct port
- Check CORS settings on backend
- Verify API endpoints match expected format

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Your Name - [@Sandeep__20__](https://x.com/Sandeep__20__)

Project Link: [https://github.com/yourusername/ai-interview-app](https://github.com/Sandeep0900/ai-interview-app)

## 🙏 Acknowledgments

- Inspired by modern interview practice platforms
- UI design inspired by Gen Z aesthetics
- Built with ❤️ using React and Tailwind CSS

---

⭐ **Star this repo** if you find it helpful!

🐛 **Found a bug?** [Open an issue](https://github.com/Sandeep0900/SkillSync/issues)

💡 **Have suggestions?** We'd love to hear them!