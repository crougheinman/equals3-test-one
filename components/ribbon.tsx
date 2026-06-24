// "Premium" strip hanging from the top-right corner. White on the violet header
// band for contrast, pointed tail, soft drop-shadow so it pops.
export function Ribbon() {
  return (
    <div className="absolute right-4 top-0 z-10 select-none bg-white px-2.5 pb-2.5 pt-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-700 drop-shadow-lg [clip-path:polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)]">
      Premium
    </div>
  );
}
