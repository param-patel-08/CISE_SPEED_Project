// ArticleSearch.test.js
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios"; // Import axios to mock it
import ArticleSearch from "./ArticleSearch"; // Your component

// Mock axios
jest.mock("axios");
const mockedAxios = axios;

describe("ArticleSearch", () => {
  it("displays 'Loading...' initially", async () => {
    // Mock axios to return a valid response later
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        _id: "123",
        JournalName: "Journal of Software Engineering",
        Authors: ["John Doe", "Jane Smith"],
        PubYear: 2023,
      },
    });

    // Render the component
    render(<ArticleSearch />);

    // Expect the loading message to be displayed first
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for the article data to be displayed
    await waitFor(() => {
      expect(screen.getByText("Journal of Software Engineering")).toBeInTheDocument();
    });
  });

  it("displays 'No article found' when no article is returned", async () => {
    // Mock axios.get to resolve with null (no article)
    mockedAxios.get.mockResolvedValueOnce({ data: null });

    // Render the component
    render(<ArticleSearch />);

    // Wait for the 'No article found' message
    await waitFor(() => {
      expect(screen.getByText("No article found")).toBeInTheDocument();
    });
  });
});
