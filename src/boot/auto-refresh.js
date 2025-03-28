// Export an asynchronous function as a Quasar boot file
export default async () => {
  let reloadTime = 0; // Variable to store the timeout number
  setInterval(() => {
    reloadTime++
  }, 1000); // Check every second

  // Function to handle visibility changes (when user switches tabs)
  const handleVisibilityChange = () => {
    // If the tab is now visible and reloadTime , reload the page
    if (document.visibilityState === "visible" && reloadTime >= 300) {
      location.reload(); // Refresh the page
    }
  };

  // Listen for tab visibility changes
  document.addEventListener("visibilitychange", handleVisibilityChange);
};
