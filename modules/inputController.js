/**
 * Manages all UI interactions and input controls
 */
export class InputController {
  /**
   * Creates a new InputController
   * @param {import("./audioController").AudioController} audioController - Audio controller instance
   * @param {import("./densityController").DensityController} densityController - Density controller instance
   * @param {import("./deviceOrientationController").DeviceOrientationController} orientationController - Device orientation controller instance
   * @param {boolean} nascondiInterfaccia - Whether to hide the interface and auto-start
   */
  constructor(
    audioController,
    densityController,
    orientationController,
    nascondiInterfaccia = false
  ) {
    this.audioController = audioController;
    this.densityController = densityController;
    this.orientationController = orientationController;
    this.nascondiInterfaccia = nascondiInterfaccia;
    this.initialized = false;
  }

  /**
   * Initialize the controller by setting up all event listeners
   */
  init() {
    if (this.initialized) return;

    this.setupStartButton();
    this.setupSensitivityButtons();
    this.setupDensityButtons();

    // Auto-start if nascondiInterfaccia is true
    if (this.nascondiInterfaccia) {
      this.hideIntroElements();

      // Request device orientation permission and start audio
      this.orientationController.requestPermission().then((granted) => {
        // Initialize orientation controller only after permission is granted
        if (granted) this.orientationController.init();
        // Start audio regardless of orientation permission
        this.audioController.start();
      });
    }

    this.initialized = true;
  }

  /**
   * Set up the start button functionality
   */
  setupStartButton() {
    const startButton = document.getElementById("start");
    if (!startButton) return;

    startButton.addEventListener("click", () => {
      this.hideIntroElements();

      // Request device orientation permission and start audio
      this.orientationController.requestPermission().then((granted) => {
        // Initialize orientation controller only after permission is granted
        if (granted) this.orientationController.init();
        // Start audio regardless of orientation permission
        this.audioController.start();
      });
    });
  }

  /**
   * Hide intro elements when the app starts
   */
  hideIntroElements() {
    const introElement = document.getElementById("intro");
    if (introElement) introElement.style.display = "none";

    document.querySelectorAll(".control-button").forEach((button) => {
      // @ts-ignore - Element.style is not recognized by TypeScript
      if (button) button.style.opacity = "0";
    });

    document
      .querySelectorAll(".control-description-container")
      .forEach((description) => {
        // @ts-ignore - Element.style is not recognized by TypeScript
        if (description) description.style.display = "none";
      });
  }

  /**
   * Set up sensitivity control buttons
   */
  setupSensitivityButtons() {
    // Decrease sensitivity
    const decreaseSensitivityButton = document.getElementById(
      "decrease-sensitivity"
    );
    if (decreaseSensitivityButton) {
      decreaseSensitivityButton.addEventListener("click", () => {
        this.audioController.decreaseSensitivity();
      });
    }

    // Increase sensitivity
    const increaseSensitivityButton = document.getElementById(
      "increase-sensitivity"
    );
    if (increaseSensitivityButton) {
      increaseSensitivityButton.addEventListener("click", () => {
        this.audioController.increaseSensitivity();
      });
    }

    // Reset sensitivity
    const resetSensitivityButton = document.getElementById("reset-sensitivity");
    if (resetSensitivityButton) {
      resetSensitivityButton.addEventListener("click", () => {
        this.audioController.resetSensitivity();
      });
    }
  }

  /**
   * Set up density control buttons
   */
  setupDensityButtons() {
    // Decrease density
    const decreaseDensityButton = document.getElementById("decrease-density");
    if (decreaseDensityButton) {
      decreaseDensityButton.addEventListener("click", () => {
        this.densityController.decreaseDensity();
      });
    }

    // Increase density
    const increaseDensityButton = document.getElementById("increase-density");
    if (increaseDensityButton) {
      increaseDensityButton.addEventListener("click", () => {
        this.densityController.increaseDensity();
      });
    }

    // Reset density
    const resetDensityButton = document.getElementById("reset-density");
    if (resetDensityButton) {
      resetDensityButton.addEventListener("click", () => {
        this.densityController.resetDensity();
      });
    }
  }
}
