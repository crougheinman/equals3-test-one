// Violet "Premium" strip hanging from the top-right corner of a card, with a
// pointed tail and a soft shadow so it pops off the card.
export function Ribbon() {
  return (
    <div className="absolute -top-1 right-4 z-10 select-none bg-violet-600 px-2.5 pb-2.5 pt-1.5 text-[10px] font-bold uppercase tracking-wider text-white drop-shadow-lg [clip-path:polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)]">
      Premium
    </div>
  );
}
