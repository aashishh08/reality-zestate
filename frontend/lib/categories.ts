export interface LocationCategory {
    id: string;
    name: string;
    title: string;
    subtitle: string;
    image: string;
    slug: string;
}

export const curatedCollections: LocationCategory[] = [
    {
        id: "1",
        name: "Luxury Senior Living",
        title: "LUXURY SENIOR LIVING",
        subtitle: "Curated Retirement Homes for the Well-Heeled",
        image: "/images/category-senior-living.jpg",
        slug: "luxury-senior-living"
    },
    {
        id: "2",
        name: "Villas in Himalayas",
        title: "VILLAS IN HIMALAYAS",
        subtitle: "Let the Himalayas be your playground",
        image: "/images/category-himalayas.jpg",
        slug: "villas-himalayas"
    }
];

export const cityLocations: LocationCategory[] = [
    {
        id: "3",
        name: "Delhi",
        title: "DELHI",
        subtitle: "Premium Properties in the Capital",
        image: "/images/category-delhi.jpg",
        slug: "properties-delhi"
    },
    {
        id: "4",
        name: "Gurugram",
        title: "GURUGRAM",
        subtitle: "Luxury Living in Millennium City",
        image: "/images/category-gurugram.jpg",
        slug: "properties-gurugram"
    },
    {
        id: "5",
        name: "Noida",
        title: "NOIDA",
        subtitle: "Modern Residences in NCR",
        image: "/images/category-noida.jpg",
        slug: "properties-noida"
    }
];

// For backward compatibility or general usage of collections
export const locationCategories = curatedCollections;
