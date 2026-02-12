export function AnnouncementBar() {
  return (
    <div className="border-b border-neutral-200 bg-black text-xs text-white">
      <div className="mx-auto container flex flex-col gap-1 px-4 py-2.5 text-center sm:flex-row sm:items-center sm:justify-center sm:gap-6">
        <p className="tracking-wide">
          <span className="font-semibold">Free Shipping</span> on orders over
          Rs.3999
        </p>
        <span className="hidden text-neutral-400 sm:inline">|</span>
        <p className="tracking-wide">14 Days Return Policy</p>
        <span className="hidden text-neutral-400 sm:inline">|</span>
        <p className="tracking-wide">
          Get <span className="font-semibold">10% Off</span> on your first
          order
        </p>
      </div>
    </div>
  );
}


