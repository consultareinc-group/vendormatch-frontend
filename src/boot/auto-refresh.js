// Export an asynchronous function as a Quasar boot file
export default async () => {
  let reloadTime = 0; // Variable to store the timeout number

  // Function to handle visibility changes (when user switches tabs)
  const handleVisibilityChange = () => {
    // If the tab is now visible and reloadTime is greater than or equal to 300, reload the page
    if (document.visibilityState === "hidden") {
      // If the tab is hidden, start a timer to track how long it has been hidden
      reloadTime = 0; // Reset the timeout number
      // Start a timer that increments reloadTime every second
      // This will run every second while the tab is hidden
      setInterval(() => {
        reloadTime++
      }, 1000); // Check every second

    } else if (document.visibilityState === "visible" && reloadTime >= 300) {
      // If the tab is visible and reloadTime is greater than or equal to 300, reload the page
      window.location.reload();

    }
  };

  // Listen for tab visibility changes
  document.addEventListener("visibilitychange", handleVisibilityChange);
};
