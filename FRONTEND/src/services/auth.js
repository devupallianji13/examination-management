const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

async function handleResponse(res) {
  const txt = await res.text();
  try { return JSON.parse(txt); } catch { return { message: txt || res.statusText }; }
}

export async function login({ roll, password }) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roll, password }),
  });
  if (!res.ok) throw await handleResponse(res);
  return await handleResponse(res);
}

export async function register({ roll, email, password, otp }) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roll, email, password, otp }),
  });
  if (!res.ok) throw await handleResponse(res);
  return await handleResponse(res);
}

export async function forgotPassword({ rollOrEmail }) {
  const res = await fetch(`${API_BASE}/api/auth/forgot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rollOrEmail }),
  });
  if (!res.ok) throw await handleResponse(res);
  return await handleResponse(res);
}

export async function sendOtp({ roll, email }) {
  const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roll, email }),
  });
  if (!res.ok) throw await handleResponse(res);
  return await handleResponse(res);
}

export async function verifyOtp({ roll, otp }) {
  const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roll, otp }),
  });
  if (!res.ok) throw await handleResponse(res);
  return await handleResponse(res);
}

export async function resetPassword({ email, otp, new_password }) {
  const res = await fetch(`${API_BASE}/api/auth/worker/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, new_password }),
  });
  if (!res.ok) throw await handleResponse(res);
  return await handleResponse(res);
}

export default { login, register, forgotPassword, sendOtp, verifyOtp, resetPassword };
