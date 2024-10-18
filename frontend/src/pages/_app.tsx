// Import global styles and types from Next.js
import "../styles/globals.scss"; // Importing global SCSS styles to apply them across the entire application
import type { AppProps } from "next/app"; // Importing the AppProps type from Next.js to type the props of MyApp component

// Import the SessionProvider from next-auth to handle user authentication sessions
import { SessionProvider } from "next-auth/react";

// Import the custom PopulatedNavBar component to display navigation
import PopulatedNavBar from "../components/PopulatedNavBar";

// The MyApp component is the custom App component for the Next.js application
// It wraps all other pages and components with common functionality
function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  
  // Returning the layout structure for the entire app
  // The SessionProvider provides the authentication session context to all components
  return (
    <SessionProvider session={session}>
      {/* The PopulatedNavBar is rendered at the top of every page */}
      <PopulatedNavBar />
      
      {/* Rendering the current page's component dynamically and passing its props */}
      <Component {...pageProps} />
    </SessionProvider>
  );
}

// Export the MyApp component as the default export to be used as the root component for the app
export default MyApp;
