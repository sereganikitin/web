// Валидация контактных данных в формах. Используется на клиенте
// для подсветки ошибок до отправки и на сервере как защита.

export type ContactKind = "email" | "phone" | "telegram" | "other";

export type ValidationResult = {
  ok: boolean;
  kind: ContactKind;
  /** Нормализованное значение для записи в БД (например, +7XXXXXXXXXX). */
  normalized?: string;
  /** Сообщение об ошибке для пользователя. */
  error?: string;
  /** Email домен - для серверной MX-проверки. */
  emailDomain?: string;
};

export function detectContactKind(s: string): ContactKind {
  const t = s.trim();
  if (!t) return "other";
  if (/^https?:\/\/(t\.me|telegram\.me)\/[A-Za-z0-9_]{4,}/i.test(t)) return "telegram";
  if (/^@[A-Za-z0-9_]{4,32}$/.test(t)) return "telegram";
  // single nickname без @ - только если в нём есть подчёркивания или это явно
  // ник (короткие латинские слова без точек/цифр-плюсов)
  if (/^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(t) && !t.includes(".")) return "telegram";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t)) return "email";
  if (/^[\s()+\-0-9]+$/.test(t) && (t.match(/\d/g)?.length ?? 0) >= 10) return "phone";
  return "other";
}

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function validateEmail(s: string): ValidationResult {
  const t = s.trim().toLowerCase();
  if (!EMAIL_RE.test(t)) {
    return {
      ok: false,
      kind: "email",
      error: "Неверный формат email. Пример: name@example.com",
    };
  }
  if (t.length > 254) {
    return {
      ok: false,
      kind: "email",
      error: "Email слишком длинный",
    };
  }
  const domain = t.split("@")[1];
  return { ok: true, kind: "email", normalized: t, emailDomain: domain };
}

export function validatePhone(s: string): ValidationResult {
  const digits = s.replace(/\D/g, "");
  if (digits.length === 0) {
    return { ok: false, kind: "phone", error: "Укажите телефон" };
  }
  // Российский формат: 11 цифр с 7/8 в начале, либо 10 без кода.
  if (digits.length < 10) {
    return {
      ok: false,
      kind: "phone",
      error: "В номере должно быть минимум 10 цифр",
    };
  }
  if (digits.length > 15) {
    return {
      ok: false,
      kind: "phone",
      error: "В номере слишком много цифр",
    };
  }
  let normalized = digits;
  if (digits.length === 11 && (digits.startsWith("8") || digits.startsWith("7"))) {
    normalized = "+7" + digits.slice(1);
  } else if (digits.length === 10) {
    normalized = "+7" + digits;
  } else {
    normalized = "+" + digits;
  }
  return { ok: true, kind: "phone", normalized };
}

/**
 * Форматирует ввод как +7 (XXX) XXX-XX-XX по мере набора.
 * Принимает любой ввод (с символами, без), возвращает отформатированную строку.
 */
export function formatRuPhone(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.length === 0) return "";
  // Если первая цифра 8 - заменяем на 7 (российский префикс)
  if (digits[0] === "8") digits = "7" + digits.slice(1);
  // Если первая не 7 - считаем что пользователь ввёл без кода страны
  if (digits[0] !== "7") digits = "7" + digits;
  digits = digits.slice(0, 11);

  const a = digits.slice(1, 4);
  const b = digits.slice(4, 7);
  const c = digits.slice(7, 9);
  const d = digits.slice(9, 11);

  let out = "+7";
  if (a) out += ` (${a}`;
  if (a.length === 3) out += ")";
  if (b) out += ` ${b}`;
  if (c) out += `-${c}`;
  if (d) out += `-${d}`;
  return out;
}

export function validateTelegram(s: string): ValidationResult {
  const t = s.trim();
  let nick = t;
  const urlMatch = t.match(/^https?:\/\/(?:t\.me|telegram\.me)\/([A-Za-z0-9_]{4,32})/i);
  if (urlMatch) nick = urlMatch[1];
  else if (nick.startsWith("@")) nick = nick.slice(1);

  if (!/^[A-Za-z0-9_]{4,32}$/.test(nick)) {
    return {
      ok: false,
      kind: "telegram",
      error: "Ник Telegram должен быть 4–32 символа: латиница, цифры, _",
    };
  }
  return { ok: true, kind: "telegram", normalized: "@" + nick };
}

export function validateContact(s: string): ValidationResult {
  const t = s.trim();
  if (!t) {
    return {
      ok: false,
      kind: "other",
      error: "Укажите email, телефон или Telegram",
    };
  }
  const kind = detectContactKind(t);
  switch (kind) {
    case "email":
      return validateEmail(t);
    case "phone":
      return validatePhone(t);
    case "telegram":
      return validateTelegram(t);
    default:
      return {
        ok: false,
        kind: "other",
        error: "Введите email, телефон (от 10 цифр) или Telegram-ник (@nickname)",
      };
  }
}

export function validateName(s: string): { ok: boolean; error?: string } {
  const t = s.trim();
  if (!t) return { ok: false, error: "Укажите имя" };
  if (t.length < 2) return { ok: false, error: "Имя слишком короткое" };
  if (t.length > 100) return { ok: false, error: "Имя слишком длинное" };
  // Должны быть хотя бы буквы (не только цифры/символы)
  if (!/[A-Za-zА-Яа-яЁё]/.test(t)) {
    return { ok: false, error: "Имя должно содержать буквы" };
  }
  return { ok: true };
}
