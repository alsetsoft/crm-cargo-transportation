import type { Enums } from "@/lib/supabase/types";

export type OrderStatus = Enums<"order_status">;
export type ClientStatus = Enums<"client_status">;
export type DriverStatus = Enums<"driver_status">;
export type VehicleStatus = Enums<"vehicle_status">;
export type PaymentForm = Enums<"payment_form">;
export type PaymentStatus = Enums<"payment_status">;
export type RouteStatus = Enums<"route_status">;

export type BadgeTone = "success" | "warning" | "info" | "destructive" | "secondary" | "default";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Нове",
  in_progress: "В процесі",
  completed: "Завершено",
  cancelled: "Скасовано",
};

export const ORDER_STATUS_TONES: Record<OrderStatus, BadgeTone> = {
  new: "info",
  in_progress: "warning",
  completed: "success",
  cancelled: "secondary",
};

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  active: "Активний",
  inactive: "Неактивний",
  awaiting_payment: "Очікує оплату",
};

export const CLIENT_STATUS_TONES: Record<ClientStatus, BadgeTone> = {
  active: "success",
  inactive: "secondary",
  awaiting_payment: "warning",
};

export const DRIVER_STATUS_LABELS: Record<DriverStatus, string> = {
  on_trip: "В рейсі",
  available: "Доступний",
  unavailable: "Не доступний",
};

export const DRIVER_STATUS_TONES: Record<DriverStatus, BadgeTone> = {
  on_trip: "info",
  available: "success",
  unavailable: "secondary",
};

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  on_trip: "В рейсі",
  service: "Сервіс",
  available: "Доступний",
};

export const VEHICLE_STATUS_TONES: Record<VehicleStatus, BadgeTone> = {
  on_trip: "info",
  service: "warning",
  available: "success",
};

export const ROUTE_STATUS_LABELS: Record<RouteStatus, string> = {
  active: "Активний",
  archived: "Архів",
};

export const ROUTE_STATUS_TONES: Record<RouteStatus, BadgeTone> = {
  active: "success",
  archived: "secondary",
};

export const PAYMENT_FORM_LABELS: Record<PaymentForm, string> = {
  cash: "Готівка",
  bank_transfer: "Безготівка",
  card: "Картка",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Не оплачено",
  partial: "Частково",
  paid: "Оплачено",
};

export const PAYMENT_STATUS_TONES: Record<PaymentStatus, BadgeTone> = {
  unpaid: "destructive",
  partial: "warning",
  paid: "success",
};
