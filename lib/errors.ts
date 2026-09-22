import { NextResponse } from "next/server";

export const StatusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ErrorMessages = {
  // Auth
  EMAIL_PASSWORD_REQUIRED: "Email and password are required",
  NAME_EMAIL_PASSWORD_REQUIRED: "Name, email, and password are required",
  INVALID_CREDENTIALS: "Invalid email or password",
  NO_TOKEN: "No token provided",
  INVALID_TOKEN: "Invalid token",
  USER_NOT_FOUND: "User not found",
  EMAIL_EXISTS: "User with this email already exists",
  EMAIL_IN_USE: "Email already in use",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters",

  // Orders
  ORDER_ID_STATUS_REQUIRED: "Order ID and status are required",
  INVALID_STATUS: "Invalid status",
  ORDER_NOT_FOUND: "Order not found",
  NO_ITEMS_IN_ORDER: "No items in order",
  ADDRESS_PHONE_REQUIRED: "Address and phone are required",
  PRODUCT_NOT_FOUND: "Product not found",
  INSUFFICIENT_STOCK: "Insufficient stock",

  // Reservations
  SLOT_ID_REQUIRED: "Slot ID is required",
  SLOT_NOT_FOUND: "Slot not found",
  SLOT_NOT_AVAILABLE: "Slot is not available",
  SLOT_HAS_PENDING_RESERVATION: "Slot already has a pending reservation",
  RESERVATION_ID_ACTION_REQUIRED: "Reservation ID and action are required",
  INVALID_RESERVATION_ACTION: "Action must be 'approve' or 'reject'",
  RESERVATION_NOT_FOUND: "Reservation not found",
  RESERVATION_NOT_PENDING: "Reservation is not pending",

  // Products
  ALL_FIELDS_REQUIRED: "All fields are required",
  ID_REQUIRED: "ID is required",

  // Venues
  NAME_ADDRESS_REQUIRED: "Name and address are required",

  // Slots
  TIME_COURT_REQUIRED: "Time and court are required",

  // User
  NAME_EMAIL_REQUIRED: "Name and email are required",
  CURRENT_NEW_PASSWORD_REQUIRED: "Current and new password are required",
  CURRENT_PASSWORD_INCORRECT: "Current password is incorrect",

  // Generic
  UNAUTHORIZED: "Unauthorized",
  INTERNAL_SERVER_ERROR: "Internal server error",
} as const;

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
