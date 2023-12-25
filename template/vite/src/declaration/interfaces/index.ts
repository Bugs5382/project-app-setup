export interface INotification {
  code?: string;
  message: string;
  variant: "success" | "warning" | "error" | "default" | "info";
  duration?: number;
}

export interface IDetailedNotification {
  code?: string;
  message: string;
  duration?: number;
}