"use server";

import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";

export async function login(formData) {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    redirect("/admin/login?error=" + encodeURIComponent("Email dan password wajib diisi."));
  }

  let errorMessage = null;

  try {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      errorMessage =
        error.message === "Invalid login credentials"
          ? "Email atau password salah."
          : error.message;
    }
  } catch (err) {
    errorMessage = err.message || "Gagal menghubungi server database.";
  }

  if (errorMessage) {
    redirect("/admin/login?error=" + encodeURIComponent(errorMessage));
  }

  redirect("/admin");
}

export async function keluar() {
  try {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  } catch {
    // Abaikan jika sesi sudah tidak aktif
  }

  redirect("/admin/login");
}

export const logout = keluar;

export async function gantiPassword(prevStateOrFormData, maybeFormData) {
  const formData = maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData;
  const isUseActionState = maybeFormData instanceof FormData;

  let user = null;
  let supabase = null;
  try {
    supabase = await createSessionClient();
    const result = await supabase.auth.getUser();
    user = result.data?.user;
  } catch {
    // Gagal mendapatkan sesi
  }

  if (!user) {
    redirect("/admin/login");
  }

  const passwordBaru = formData?.get?.("password_baru")?.toString() || "";
  const konfirmasiPassword = formData?.get?.("konfirmasi_password")?.toString() || "";

  if (!passwordBaru || !konfirmasiPassword) {
    const msg = "Password baru dan konfirmasi wajib diisi.";
    if (!isUseActionState) {
      redirect("/admin/password?error=" + encodeURIComponent(msg));
    }
    return { error: msg };
  }

  if (passwordBaru.length < 8) {
    const msg = "Password baru minimal 8 karakter.";
    if (!isUseActionState) {
      redirect("/admin/password?error=" + encodeURIComponent(msg));
    }
    return { error: msg };
  }

  if (passwordBaru !== konfirmasiPassword) {
    const msg = "Konfirmasi password tidak sesuai.";
    if (!isUseActionState) {
      redirect("/admin/password?error=" + encodeURIComponent(msg));
    }
    return { error: msg };
  }

  let errorMessage = null;
  try {
    const { error } = await supabase.auth.updateUser({
      password: passwordBaru,
    });
    if (error) {
      errorMessage = error.message || "Gagal mengubah password.";
    }
  } catch (err) {
    errorMessage = err.message || "Terjadi kesalahan saat mengubah password.";
  }

  if (errorMessage) {
    if (!isUseActionState) {
      redirect("/admin/password?error=" + encodeURIComponent(errorMessage));
    }
    return { error: errorMessage };
  }

  const successMsg = "Password berhasil diubah.";
  if (!isUseActionState) {
    redirect("/admin/password?sukses=" + encodeURIComponent(successMsg));
  }
  return { sukses: successMsg };
}

export const ubahPassword = gantiPassword;
