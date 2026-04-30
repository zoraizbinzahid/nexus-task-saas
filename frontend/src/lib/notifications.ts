export interface AppNotification {
  id: string;
  message: string;
  createdAt: string;
}

const KEY = "nexus_notifications";

export function addAppNotification(message: string): void {
  const current = getAppNotifications();
  const next: AppNotification[] = [
    { id: crypto.randomUUID(), message, createdAt: new Date().toISOString() },
    ...current,
  ].slice(0, 30);
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("nexus:notification:new"));
}

export function getAppNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AppNotification[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
