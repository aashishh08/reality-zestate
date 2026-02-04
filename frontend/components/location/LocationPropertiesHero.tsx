"use client";

interface LocationPropertiesHeroProps {
  locationName: string;
  propertyCount: number;
  backgroundImage: string;
}

export function LocationPropertiesHero({
  locationName,
  propertyCount,
  backgroundImage,
}: LocationPropertiesHeroProps) {
  return (
    <section className="relative h-[400px] bg-cover bg-center overflow-hidden">
      {/* Background with overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">
            {locationName}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-2">
            Premium Properties & Luxury Residences
          </p>
          <p className="text-lg text-gold">
            {propertyCount} {propertyCount === 1 ? "Property" : "Properties"} Available
          </p>
        </div>
      </div>
    </section>
  );
}
