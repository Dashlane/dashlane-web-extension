export enum PerformanceMarker {
  POPUP_LAUNCH = "POPUP_LAUNCH",
  BUNDLE_LOADED = "BUNDLE_LOADED",
  BUNDLE_AVAILABLE = "BUNDLE_AVAILABLE",
  POPUP_INITIALISED = "POPUP_INITIALISED",
  LOGIN_CLICK = "LOGIN_CLICK",
}
interface PerformanceMeasurement {
  name: string;
  duration: number;
}
interface PerfomanceMethods {
  mark: (marker: PerformanceMarker) => void;
  measure: (message: string, marker: PerformanceMarker) => void;
  saveMeasurements: () => void;
}
const PERFORMANCE_MEASUREMENTS_STORAGE_KEY = "performanceMeasurements";
function savePerformanceMeasurements(
  measurements: PerformanceMeasurement[]
): void {
  const performanceMeasurementsString = window.localStorage.getItem(
    PERFORMANCE_MEASUREMENTS_STORAGE_KEY
  );
  const performanceMeasurementsArray: PerformanceMeasurement[][] =
    performanceMeasurementsString
      ? JSON.parse(performanceMeasurementsString)
      : [];
  performanceMeasurementsArray.push(measurements);
  window.localStorage.setItem(
    PERFORMANCE_MEASUREMENTS_STORAGE_KEY,
    JSON.stringify(performanceMeasurementsArray)
  );
}
export const performanceMethods: PerfomanceMethods = USE_PERFORMANCE_LIBRARY
  ? {
      mark: (marker: PerformanceMarker) => {
        performance.mark(marker);
      },
      measure: (message: string, marker: PerformanceMarker) => {
        if (performance.getEntriesByName(marker).length > 0) {
          performance.measure(`Popup: ${message}`, marker);
        }
      },
      saveMeasurements: () => {
        const performanceMeasurements = performance
          .getEntriesByType("measure")
          .map((entry) => ({ name: entry.name, duration: entry.duration }));
        savePerformanceMeasurements(performanceMeasurements);
      },
    }
  : {
      mark: () => {},
      measure: () => {},
      saveMeasurements: () => {},
    };
