/**
 * Helper untuk verifikasi token Cloudflare Turnstile Server-Side.
 * Mengirimkan permintaan POST ke endpoint resmi Cloudflare Turnstile siteverify:
 * POST https://challenges.cloudflare.com/turnstile/v0/siteverify
 */

export interface TurnstileVerificationResult {
  success: boolean;
  message?: string;
  errorCodes?: string[];
  challengeTs?: string;
  hostname?: string;
}

export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteIp?: string | null
): Promise<TurnstileVerificationResult> {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  if (!token || typeof token !== "string" || !token.trim()) {
    return {
      success: false,
      message: "Verifikasi keamanan (CAPTCHA) belum diselesaikan. Harap centang Turnstile terlebih dahulu.",
    };
  }

  if (!secretKey) {
    console.error(
      "[Turnstile] CLOUDFLARE_TURNSTILE_SECRET_KEY belum dikonfigurasi di environment variables (.env.local)."
    );
    return {
      success: false,
      message: "Konfigurasi server untuk Cloudflare Turnstile belum lengkap (Secret Key belum diset).",
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token.trim());
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        // Jangan cache respon verifikasi CAPTCHA
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        `[Turnstile] HTTP error from siteverify: ${response.status} ${response.statusText}`
      );
      return {
        success: false,
        message: "Gagal menghubungi server verifikasi CAPTCHA Cloudflare.",
      };
    }

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        challengeTs: data.challenge_ts,
        hostname: data.hostname,
      };
    }

    console.warn("[Turnstile] Verification failed:", data["error-codes"]);
    return {
      success: false,
      message: "Verifikasi keamanan Turnstile gagal atau token sudah kedaluwarsa. Silakan coba lagi.",
      errorCodes: data["error-codes"],
    };
  } catch (error: any) {
    console.error("[Turnstile] Error saat menghubungi Cloudflare siteverify:", error);
    return {
      success: false,
      message: "Terjadi kesalahan koneksi saat memverifikasi CAPTCHA.",
    };
  }
}

