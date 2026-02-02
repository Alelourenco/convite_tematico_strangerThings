"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_40px_rgba(255,0,0,0.25)] hover:bg-red-500"
    >
      Imprimir
    </button>
  );
}
