// Export an asynchronous function as a Quasar boot file
export default async () => {
  let shouldReload = false; // Flag to track if the page should reload

  // Function to handle visibility changes (when user switches tabs)
  const handleVisibilityChange = () => {
    // If the tab is now visible and an error has occurred, reload the page
    if (document.visibilityState === "visible" && shouldReload) {
      location.reload(); // Refresh the page
    }
  };

  // Listen for any JavaScript runtime errors
  window.addEventListener("error", () => {
    shouldReload = true; // Set flag to true when an error occurs
  });

  // Listen for tab visibility changes
  document.addEventListener("visibilitychange", handleVisibilityChange);
};
