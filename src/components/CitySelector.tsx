const cities = ["Karachi", "Lahore", "Islamabad", "Multan", "Swat"] as const;

export function CitySelector() {
  return (
    <select
      className="hidden rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm outline-none transition hover:border-neutral-300 focus:border-black focus:ring-1 focus:ring-black/10 sm:block"
      defaultValue="Karachi"
      aria-label="Select city"
    >
      {cities.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  );
}


