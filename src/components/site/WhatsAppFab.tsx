import { BRAND } from "@/lib/config";

const TEXT = encodeURIComponent(
  "Hola, quiero información sobre un crédito con Impulso Go.",
);

export function WhatsAppFab() {
  return (
    <a
      href={`${BRAND.whatsappUrl}&text=${TEXT}&utm_source=landing&utm_medium=fab&utm_campaign=whatsapp`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Asesor por WhatsApp"
      className="landing-fab fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full text-white"
    >
      <svg
        viewBox="0 0 32 32"
        width="28"
        height="28"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19.11 17.32c-.27-.13-1.6-.79-1.85-.88-.25-.09-.43-.13-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.13-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.41.12-.55.13-.13.27-.32.41-.48.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.28 0 1.34.98 2.64 1.12 2.82.14.18 1.94 2.96 4.7 4.15.66.28 1.18.45 1.58.58.66.21 1.27.18 1.75.11.53-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32zM16.04 5.6c-5.74 0-10.4 4.66-10.4 10.4 0 1.84.48 3.64 1.4 5.22L5.6 26.4l5.32-1.4a10.36 10.36 0 0 0 5.12 1.34h.01c5.74 0 10.4-4.66 10.4-10.4 0-2.78-1.08-5.39-3.04-7.35a10.34 10.34 0 0 0-7.37-3z" />
      </svg>
    </a>
  );
}
