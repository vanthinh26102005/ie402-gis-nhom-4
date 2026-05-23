const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export function validateLogin(values: LoginFormValues): FieldErrors<keyof LoginFormValues> {
  const errors: FieldErrors<keyof LoginFormValues> = {};

  if (!values.email.trim()) {
    errors.email = "Vui lòng nhập email.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Email không hợp lệ.";
  }

  if (!values.password) {
    errors.password = "Vui lòng nhập mật khẩu.";
  } else if (values.password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
  }

  return errors;
}

export function validateRegister(
  values: RegisterFormValues,
): FieldErrors<keyof RegisterFormValues> {
  const errors: FieldErrors<keyof RegisterFormValues> = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Vui lòng nhập họ và tên.";
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = "Họ và tên phải có ít nhất 2 ký tự.";
  }

  if (!values.email.trim()) {
    errors.email = "Vui lòng nhập email.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Email không hợp lệ.";
  }

  if (!values.password) {
    errors.password = "Vui lòng nhập mật khẩu.";
  } else if (values.password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Mật khẩu xác nhận không khớp.";
  }

  return errors;
}

export function hasFieldErrors<T extends string>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
