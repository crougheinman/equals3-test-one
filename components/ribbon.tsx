// Hanging red "Premium" ribbon — pinned to the top-right of a card, hangs down
// with a swallowtail (notched) tail.
export function Ribbon() {
  return (
    <div className="absolute -top-2 right-6 z-10 select-none">
      {/* little hanger knob */}
      <div className="mx-auto h-2 w-2 rounded-full bg-red-700 shadow-sm" />
      <div className="-mt-1 bg-red-600 px-3 pb-4 pt-2 text-[11px] font-bold uppercase tracking-wider text-white shadow-md [clip-path:polygon(0_0,100%_0,100%_100%,50%_76%,0_100%)]">
        Premium
      </div>
    </div>
  );
}
