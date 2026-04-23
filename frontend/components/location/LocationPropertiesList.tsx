"use client";

import { Property, Location } from "@/lib";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { transformListingPropertyToProject } from "@/lib/property-transformer";

interface LocationPropertiesListProps {
  location: Location;
  properties: Property[];
}

export function LocationPropertiesList({
  location,
  properties,
}: LocationPropertiesListProps) {
  if (!properties || properties.length === 0) {
    return (
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-zinc-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-black mb-4">
            No Properties Available
          </h2>
          <p className="text-zinc-600 text-lg">
            We don't have any properties available in {location.name} at this moment.
            Please check back soon!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-zinc-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-black mb-4">
            Properties in {location.name}
          </h2>
          <p className="text-zinc-600 text-base sm:text-lg max-w-3xl">
            Explore our exclusive collection of luxury residential and commercial properties
            in {location.name}. Each property is carefully selected to meet the highest
            standards of quality and lifestyle.
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {properties.map((property, index) => {
            const base = transformListingPropertyToProject(property);
            return (
              <PropertyCard
                key={property.id}
                project={{
                  ...base,
                  location: property.Location?.name || location.name || base.location,
                }}
                index={index}
                imageSizes="(max-width: 1024px) 50vw, 33vw"
              />
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-10 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-0 p-5 sm:p-8 bg-white rounded-lg shadow-sm border border-zinc-100 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
          <div className="text-center py-6 md:py-0 md:px-4">
            <div className="text-3xl sm:text-4xl font-bold text-gold mb-2">
              {properties.length}
            </div>
            <div className="text-zinc-600 text-sm sm:text-base">
              {properties.length === 1 ? "Property" : "Properties"} Available
            </div>
          </div>

          <div className="text-center py-6 md:py-0 md:px-4">
            <div className="text-3xl sm:text-4xl font-bold text-gold mb-2">
              {(
                properties.reduce((sum, p) => sum + p.priceMin, 0) /
                properties.length /
                10000000
              ).toFixed(0)}
              Cr
            </div>
            <div className="text-zinc-600 text-sm sm:text-base">Average Starting Price</div>
          </div>

          <div className="text-center py-6 md:py-0 md:px-4">
            <div className="text-3xl sm:text-4xl font-bold text-gold mb-2">
              {properties.filter((p) => p.propertyType === "residential").length}
            </div>
            <div className="text-zinc-600 text-sm sm:text-base">Residential Properties</div>
          </div>
        </div>
      </div>
    </section>
  );
}
