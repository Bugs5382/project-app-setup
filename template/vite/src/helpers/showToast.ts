// @ts-nocheck
import { toast } from "react-toastify";
import {
  IDetailedNotification,
  INotification,
} from "../declaration/interfaces";

/**
 * Manually send toast.
 * @type INotification
 * @since 1.0.0
 * @param code
 * @param message
 * @param variant
 * @param duration
 */
const showToast: ({
  code,
  message,
  variant,
  duration,
}: INotification) => number | string = ({
  code,
  message,
  variant,
  duration,
}: INotification) => {
  const messageArg = code ? code + ": " + message : message;
  return toast(messageArg, {
    type: variant,
    position: "top-center",
    autoClose: duration ? duration : 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    pauseOnFocusLoss: false,
    theme: "colored",
  });
};

/**
 * Show Toast Pending
 * @since 1.0.0
 * @param promise
 * @param pendingMessage
 * @param successMessage
 * @param errorMessage
 */
export const showPromiseToast = async (
  promise: Promise<unknown> | (() => Promise<unknown>),
  pendingMessage: string,
  successMessage: string,
  errorMessage: string,
) => {
  await toast.promise(
    promise,
    {
      pending: pendingMessage,
      success: successMessage,
      error: errorMessage,
    },
    {
      position: "top-center",
      theme: "colored",
    },
  );
};

/**
 * SHow Toast Default
 * @since 1.0.0
 * @param code
 * @param message
 * @param variant
 * @param duration
 */
export const showToastDefault = ({
  code,
  message,
  duration,
}: IDetailedNotification) => {
  return showToast({ code, message, variant: "default", duration });
};

/**
 * SHow Toast Info
 * @since 1.0.0
 * @param code
 * @param message
 * @param variant
 * @param duration
 */
export const showToastInfo = ({
  code,
  message,
  duration,
}: IDetailedNotification) => {
  return showToast({ code, message, variant: "info", duration });
};

/**
 * SHow Toast Warning
 * @since 1.0.0
 * @param code
 * @param message
 * @param variant
 * @param duration
 */
export const showToastWarning = ({
  code,
  message,
  duration,
}: IDetailedNotification) => {
  return showToast({ code, message, variant: "warning", duration });
};

/**
 * SHow Toast Error
 * @since 1.0.0
 * @param code
 * @param message
 * @param variant
 * @param duration
 */
export const showToastError = ({
  code,
  message,
  duration,
}: IDetailedNotification) => {
  return showToast({ code, message, variant: "error", duration });
};

/**
 * SHow Toast Success
 * @since 1.0.0
 * @param code
 * @param message
 * @param variant
 * @param duration
 */
export const showToastSuccess = ({
  code,
  message,
  duration,
}: IDetailedNotification) => {
  return showToast({ code, message, variant: "success", duration });
};
