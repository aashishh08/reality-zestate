/**
 * Seed data for Locations, Developers, Categories, and Properties
 */

import { randomUUID } from 'crypto';

export async function up(queryInterface, Sequelize) {
  // 1. Create India location (Country)
  const indiaId = randomUUID();
  await queryInterface.bulkInsert('locations', [{
    id: indiaId,
    name: 'India',
    slug: 'india',
    type: 'country',
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }]);

  // 2. Create States
  const states = [
    { name: 'Delhi', slug: 'delhi', parentId: indiaId },
    { name: 'Maharashtra', slug: 'maharashtra', parentId: indiaId },
    { name: 'Haryana', slug: 'haryana', parentId: indiaId },
    { name: 'Karnataka', slug: 'karnataka', parentId: indiaId },
  ];

  const stateIds = {};
  for (const state of states) {
    const id = randomUUID();
    await queryInterface.bulkInsert('locations', [{
      id,
      name: state.name,
      slug: state.slug,
      type: 'state',
      parentId: state.parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
    stateIds[state.slug] = id;
  }

  // 3. Create Cities
  const cities = [
    { name: 'New Delhi', slug: 'new-delhi', parentId: stateIds['delhi'] },
    { name: 'Gurgaon', slug: 'gurgaon', parentId: stateIds['haryana'] },
    { name: 'Noida', slug: 'noida', parentId: stateIds['haryana'] },
    { name: 'Mumbai', slug: 'mumbai', parentId: stateIds['maharashtra'] },
    { name: 'Bangalore', slug: 'bangalore', parentId: stateIds['karnataka'] },
    { name: 'Pune', slug: 'pune', parentId: stateIds['maharashtra'] },
  ];

  const cityIds = {};
  for (const city of cities) {
    const id = randomUUID();
    await queryInterface.bulkInsert('locations', [{
      id,
      name: city.name,
      slug: city.slug,
      type: 'city',
      parentId: city.parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
    cityIds[city.slug] = id;
  }

  // 4. Create Developers
  const developers = [
    { name: 'DLF', slug: 'dlf', logo: null },
    { name: 'Emaar', slug: 'emaar', logo: null },
    { name: 'Godrej', slug: 'godrej', logo: null },
    { name: 'Lodha', slug: 'lodha', logo: null },
    { name: 'Mahindra Lifespace', slug: 'mahindra-lifespace', logo: null },
  ];

  const developerIds = {};
  for (const developer of developers) {
    const id = randomUUID();
    await queryInterface.bulkInsert('developers', [{
      id,
      name: developer.name,
      slug: developer.slug,
      logo: developer.logo,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
    developerIds[developer.slug] = id;
  }

  // 5. Create Categories
  const categories = [
    { name: 'Luxury', slug: 'luxury', propertyType: 'residential', parentId: null },
    { name: 'Affordable', slug: 'affordable', propertyType: 'residential', parentId: null },
    { name: 'Commercial', slug: 'commercial', propertyType: 'commercial', parentId: null },
    { name: 'Senior Living', slug: 'senior-living', propertyType: 'residential', parentId: null },
  ];

  const categoryIds = {};
  for (const category of categories) {
    const id = randomUUID();
    await queryInterface.bulkInsert('categories', [{
      id,
      name: category.name,
      slug: category.slug,
      propertyType: category.propertyType,
      parentId: category.parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
    categoryIds[category.slug] = id;
  }

  // 6. Create Properties
  const properties = [
    {
      slug: 'dlf-prime-gurgaon',
      title: 'DLF Prime',
      propertyType: 'residential',
      developerId: developerIds['dlf'],
      locationId: cityIds['gurgaon'],
      priceMin: 10000000,
      priceMax: 50000000,
      isPublished: true,
    },
    {
      slug: 'emaar-elements-delhi',
      title: 'Emaar Elements',
      propertyType: 'residential',
      developerId: developerIds['emaar'],
      locationId: cityIds['new-delhi'],
      priceMin: 15000000,
      priceMax: 75000000,
      isPublished: true,
    },
    {
      slug: 'godrej-aqua-mumbai',
      title: 'Godrej Aqua',
      propertyType: 'residential',
      developerId: developerIds['godrej'],
      locationId: cityIds['mumbai'],
      priceMin: 20000000,
      priceMax: 100000000,
      isPublished: true,
    },
    {
      slug: 'lodha-park-mumbai',
      title: 'Lodha Park',
      propertyType: 'residential',
      developerId: developerIds['lodha'],
      locationId: cityIds['mumbai'],
      priceMin: 18000000,
      priceMax: 85000000,
      isPublished: true,
    },
    {
      slug: 'mahindra-origins-pune',
      title: 'Mahindra Origins',
      propertyType: 'residential',
      developerId: developerIds['mahindra-lifespace'],
      locationId: cityIds['pune'],
      priceMin: 8000000,
      priceMax: 35000000,
      isPublished: true,
    },
    {
      slug: 'dlf-cyber-hub-gurgaon',
      title: 'DLF Cyber Hub',
      propertyType: 'commercial',
      developerId: developerIds['dlf'],
      locationId: cityIds['gurgaon'],
      priceMin: 50000000,
      priceMax: 200000000,
      isPublished: true,
    },
  ];

  for (const property of properties) {
    await queryInterface.bulkInsert('properties', [{
      id: randomUUID(),
      slug: property.slug,
      title: property.title,
      propertyType: property.propertyType,
      developerId: property.developerId,
      locationId: property.locationId,
      status: 'active',
      priceMin: property.priceMin,
      priceMax: property.priceMax,
      isPublished: property.isPublished,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  }
}

export async function down(queryInterface) {
  // Delete in reverse order of creation
  await queryInterface.bulkDelete('properties', {}, {});
  await queryInterface.bulkDelete('categories', {}, {});
  await queryInterface.bulkDelete('developers', {}, {});
  await queryInterface.bulkDelete('locations', {}, {});
}
