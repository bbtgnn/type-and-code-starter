// Function to set up device orientation capture
function setupOrientationCapture(callback) {
  // Check if library is loaded via global variable
  const checkLibrary = () => {
    // The library should be available on window when loaded via CDN
    // @ts-ignore - This is injected by the CDN
    if (window.DetectDeviceOrientation) {
      startOrientationTracking();
    } else {
      console.warn("DetectDeviceOrientation library not loaded yet");
      setTimeout(checkLibrary, 500);
    }
  };

  // Function to set up orientation tracking once library is available
  const startOrientationTracking = () => {
    try {
      // Access the library from the global scope
      // @ts-ignore - This is injected by the CDN
      const detectDeviceOrientation = new window.DetectDeviceOrientation();

      // Initialize with callback
      detectDeviceOrientation.init((orientation) => {
        const beta = orientation.beta || 0; // front-to-back tilt
        const gamma = orientation.gamma || 0; // left-to-right tilt
        const alpha = orientation.alpha || 0; // compass direction

        callback(beta, gamma, alpha);
      });

      // Add permission request button for iOS Safari (required)
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.bottom = "10px";
      container.style.right = "10px";
      container.style.zIndex = "1000";

      const permissionBtn = document.createElement("button");
      permissionBtn.textContent = "Allow Orientation";
      permissionBtn.style.padding = "8px";
      permissionBtn.style.backgroundColor = "deeppink";
      permissionBtn.style.color = "white";
      permissionBtn.style.border = "none";
      permissionBtn.style.borderRadius = "4px";

      permissionBtn.addEventListener("click", () => {
        // Request permission (necessary for iOS)
        detectDeviceOrientation.requestDeviceOrientationPermission();
        // Remove button after click
        container.remove();
      });

      container.appendChild(permissionBtn);
      document.body.appendChild(container);
    } catch (error) {
      console.error("Error setting up orientation detection:", error);
    }
  };

  // Start the process
  checkLibrary();
}
