import type PocketBase from 'pocketbase';

export const syncSuperuserAuthToPocketBase = (pb: PocketBase): boolean => {
  const raw = localStorage.getItem('__pb_superuser_auth__');
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw);
    const token = typeof parsed?.token === 'string' ? parsed.token : '';
    const model = parsed?.model;
    if (!token) return false;

    pb.authStore.save(token, model);
    return pb.authStore.isValid;
  } catch {
    return false;
  }
};
