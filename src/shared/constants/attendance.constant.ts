export const AttendanceStatus = {
  CHECK_IN: 'CHECK_IN',
  CHECK_OUT: 'CHECK_OUT',
} as const;

export const validAccordiate = {
  LAT: /^-?([0-8]?\d(\.\d{1,6})?|90(\.0{1,6})?)$/,
  LNG: /^-?(1[0-7]\d(\.\d{1,6})?|[0-9]?\d(\.\d{1,6})?|180(\.0{1,6})?)$/,
} as const;
