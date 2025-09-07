# Gemini Bulk Image Editor

An AI-powered web application that uses the Google Gemini API to apply consistent, creative edits to multiple images simultaneously based on a single natural language prompt.

![Gemini Bulk Image Editor Screenshot](https://storage.googleapis.com/aistudio-project-images/2e9a2249-5f25-4c62-bb44-672ceb5860d5.png)

## ✨ Core Features

*   **Batch Processing**: Upload multiple images and apply the same edit to all of them with a single click.
*   **AI-Powered Creativity**: Leverage the power of the `gemini-2.5-flash-image-preview` model to perform complex edits using simple text instructions. Go beyond filters—add objects, change backgrounds, or transform images into entirely new art styles.
*   **Interactive Comparison**: Each result features an intuitive before-and-after slider, making it easy to see the impact of your prompt.
*   **Full User Control**: Start the editing queue and stop it at any time. The process can be resumed later without losing progress.
*   **Download Options**: Download individual edited images or save them all at once with the "Download All" button.
*   **Robust & Responsive UI**: A clean, modern interface built with Tailwind CSS that works seamlessly on all screen sizes.
*   **Smart Error Handling**: The app processes images sequentially to respect API rate limits and displays clear, user-friendly error messages if an image fails.

---

## 🚀 How It Works

1.  **Upload Images**: Click the upload area to select multiple image files from your device.
2.  **Write an Instruction**: In the text box, describe the edit you want to apply (e.g., "Add a pirate hat to each person," "Make it look like a vintage photograph," or "Change the season to winter").
3.  **Apply Edits**: Click the "Apply Edits" button to start the processing queue. You can watch the progress in real-time.
4.  **Review & Download**: Use the slider on each image card to compare the original with the edited version. Download the images you like individually or all at once.

---

## 🛠️ Technology Stack

*   **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **AI Model**: [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash-image-preview`)

---

## ⚙️ Local Setup & Configuration

### Prerequisites

*   Node.js and npm (or a compatible package manager).
*   A valid Google Gemini API key.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/gemini-bulk-image-editor.git
    cd gemini-bulk-image-editor
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    The application requires your Gemini API key to be available as an environment variable named `API_KEY`.

    You can set this in your shell before running the application:
    ```bash
    export API_KEY="YOUR_GEMINI_API_KEY"
    ```
    *Note: The application code is already configured to read this variable via `process.env.API_KEY`.*

4.  **Run the development server:**
    ```bash
    npm run start
    ```
    The application will be available at `http://localhost:3000`.

---

## 📂 Project Structure

The project is organized with a focus on clarity and maintainability:

```
src/
├── components/       # Reusable React components (Header, Uploader, Cards, Icons)
│   ├── icons/        # SVG icon components
│   ├── Header.tsx
│   ├── ImageResultCard.tsx
│   └── ...
├── services/         # Modules for external API interactions
│   └── geminiService.ts # Logic for communicating with the Gemini API
├── types/            # TypeScript type definitions and interfaces
│   └── index.ts
├── utils/            # Helper functions (e.g., file-to-base64 conversion)
│   └── fileUtils.ts
├── App.tsx           # Main application component with state management
└── index.tsx         # Application entry point
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/gemini-bulk-image-editor/issues) if you want to contribute.

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
