# TuneLog

TuneLog is a web application built with Next.js that allows users to discover, rate, and discuss music. You can search for songs, albums, and artists, write reviews and journal entries, create personalized "Topsters" (your favorite album charts), and engage with a community of music lovers.
Available on https://tunelog-phi.vercel.app/

## Features

*   **Music Discovery:** Search for any song, album, or artist.
*   **Ratings & Reviews:** Rate your favorite music and write detailed reviews.
*   **Journals:** Write long-form journal entries about any music-related topic.
*   **Topsters:** Create and customize your own "Topster" charts to showcase your favorite albums.
*   **Community:** Participate in discussions and see what other users are listening to.
*   **Internationalization:** Supports multiple languages (English, Korean, Japanese).

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Headless UI](https://headlessui.dev/)
*   **Data Fetching:** [TanStack Query](https://tanstack.com/query/latest)
*   **Database ORM:** [Mongoose](https://mongoosejs.com/)
*   **State Management:** [Jotai](https://jotai.org/)
*   **Rich Text Editor:** [Tiptap](https://tiptap.dev/)
*   **Drag & Drop:** [Dnd Kit](https://dndkit.com/)
*   **Internationalization:** [i18next](https://www.i18next.com/)
*   **Component Development:** [Storybook](https://storybook.js.org/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v20 or later)
*   Yarn (or npm)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/tunelog.git
    cd tunelog
    ```

2.  **Install dependencies:**
    ```sh
    yarn install
    # or
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the necessary environment variables (e.g., database connection string, API keys).
    ```
    # .env.local
    MONGODB_URI=your_mongodb_connection_string
    NEXTAUTH_SECRET=your_nextauth_secret
    NEXTAUTH_URL=http://localhost:3002
    ```

4.  **Run the development server:**
    ```sh
    yarn dev
    # or
    npm run dev
    ```
    The application will be available at `http://localhost:3002`.

## Available Scripts

*   `yarn dev`: Runs the app in development mode.
*   `yarn build`: Builds the app for production.
*   `yarn start`: Starts a production server.
*   `yarn lint`: Lints the codebase.
*   `yarn storybook`: Runs Storybook for component development.
*   `yarn build-storybook`: Builds the Storybook static site.
