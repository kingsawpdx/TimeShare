import { formatDateTime } from "../pages/CalendarPage.jsx";

describe("formatDateTime", () => {
  test("should return correctly formatted date when isoString is valid", () => {
    const isoString = "2025-02-24T09:00:00-08:00";
    const formatted = formatDateTime(isoString);
    expect(formatted).toBe("2025-02-24 09:00");
  });

  test("should handle single digit months, days, hours, and minutes", () => {
    const isoString = "2025-02-01T01:05:00-08:00";
    const formatted = formatDateTime(isoString);
    expect(formatted).toBe("2025-02-01 01:05");
  });

  test("should correctly format when the date has zeros in front", () => {
    const isoString = "2025-12-09T09:01:00-08:00";
    const formatted = formatDateTime(isoString);
    expect(formatted).toBe("2025-12-09 09:01");
  });

  test("should return the same string if the isoString is invalid", () => {
    const isoString = "Invalid String";
    const formatted = formatDateTime(isoString);
    expect(formatted).toBe(isoString);
  });

  test("should return undefined if isoString is undefined", () => {
    const formatted = formatDateTime(undefined);
    expect(formatted).toBeUndefined();
  });
});
