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
      <section className="py-24 px-6 bg-gradient-to-b from-white to-zinc-50">
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
    <section className="py-24 px-6 bg-gradient-to-b from-white to-zinc-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">
            Properties in {location.name}
          </h2>
          <p className="text-zinc-600 text-lg max-w-3xl">
            Explore our exclusive collection of luxury residential and commercial properties
            in {location.name}. Each property is carefully selected to meet the highest
            standards of quality and lifestyle.
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              />
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-white rounded-lg shadow-sm border border-zinc-100">
          <div className="text-center">
            <div className="text-4xl font-bold text-gold mb-2">
              {properties.length}
            </div>
            <div className="text-zinc-600">
              {properties.length === 1 ? "Property" : "Properties"} Available
            </div>
          </div>

          <div className="text-center border-l border-r border-zinc-200">
            <div className="text-4xl font-bold text-gold mb-2">
              {(
                properties.reduce((sum, p) => sum + p.priceMin, 0) /
                properties.length /
                10000000
              ).toFixed(0)}
              Cr
            </div>
            <div className="text-zinc-600">Average Starting Price</div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-gold mb-2">
              {properties.filter((p) => p.propertyType === "residential").length}
            </div>
            <div className="text-zinc-600">Residential Properties</div>
          </div>
        </div>
      </div>
    </section>
  );
}
