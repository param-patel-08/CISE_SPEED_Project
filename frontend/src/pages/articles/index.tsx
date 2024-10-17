// Import React and the ArticlesView component from the components folder
import React from "react";
import ArticlesView from "../../components/articles/ArticlesView";

// Define a functional component called Articles
export default function Articles() {
  // Render the ArticlesView component
  return (
    <ArticlesView></ArticlesView>
    // Alternatively, you could use the shorthand <ArticlesView /> for self-closing tags
  );
}
