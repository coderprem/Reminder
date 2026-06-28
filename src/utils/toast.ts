// toastService.ts
let showToastRef: ((config: ToastConfig) => void) | null = null;

export type ToastConfig = {
  message: string;
  showIcon?: boolean;
  position?: number; // distance from bottom
};

export const setToastRef = (ref: typeof showToastRef) => {
  showToastRef = ref;
};

export const showToast = (config: ToastConfig) => {
  showToastRef?.(config);
};