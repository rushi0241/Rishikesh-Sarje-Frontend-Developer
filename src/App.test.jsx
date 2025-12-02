import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App.jsx";

describe("Visual Page Hierarchy Editor", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders main title and control buttons", () => {
    render(<App />);

    expect(
      screen.getByText("Visual Page Hierarchy Editor")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /load/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /export json/i })
    ).toBeInTheDocument();
  });

  it("saves structure to localStorage when Save is clicked", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    const stored = window.localStorage.getItem("page-hierarchy-structure");
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored);
    expect(parsed).toHaveProperty("pages");
    expect(parsed).toHaveProperty("homeSections");
  });

  it("exports JSON into the side panel when Export JSON is clicked", () => {
    render(<App />);

    const textarea = screen.getByPlaceholderText("JSON will appear here");
    expect(textarea.value).toBe("");

    fireEvent.click(screen.getByRole("button", { name: /export json/i }));

    expect(textarea.value).toContain('"pages"');
    expect(textarea.value).toContain('"homeSections"');
  });
});
