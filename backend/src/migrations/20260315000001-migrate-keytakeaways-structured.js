'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            // 1. Update The Grand Arch
            await queryInterface.sequelize.query(`
        UPDATE property_sections
        SET data = '{
          "status":         "Active / Ready to Move",
          "type":           "Residential",
          "area":           "12 Acres",
          "configuration":  "3, 4 & 5 BHK",
          "sizes":          "Upon Request",
          "towers":         "Upon Request",
          "floors":         "Upon Request",
          "totalUnits":     "320 Units",
          "clubhouse":      "Upon Request",
          "priceRange":     "Upon Request",
          "reraNo":         "RERA Registered",
          "launchDate":     "Upon Request",
          "possessionDate": "OC Ready (Select Floors)",
          "phases":         "Upon Request",
          "developer":      "DLF",
          "address":        "DLF, Gurgaon, Haryana"
        }'::jsonb,
        "updatedAt" = NOW()
        WHERE "propertyId" = (
          SELECT id FROM properties WHERE slug = 'the-grand-arch-dlf-gurgaon' LIMIT 1
        )
        AND type = 'keyTakeaways';
      `, { transaction });

            // 2. Sobha Crescent
            await queryInterface.sequelize.query(`
        DO $$
        DECLARE
          v_property_id UUID;
          v_exists BOOLEAN;
        BEGIN
          SELECT id INTO v_property_id FROM properties WHERE slug = 'sobha-crescent-sector-63a-gurgaon' LIMIT 1;
        
          IF v_property_id IS NULL THEN
            RAISE NOTICE 'Sobha Crescent property not found, skipping.';
            RETURN;
          END IF;
        
          SELECT EXISTS(
            SELECT 1 FROM property_sections
            WHERE "propertyId" = v_property_id AND type = 'keyTakeaways'
          ) INTO v_exists;
        
          IF v_exists THEN
            UPDATE property_sections
            SET data = '{
              "status":         "Pre-Launch",
              "type":           "Residential",
              "area":           "12 Acres",
              "configuration":  "3 BHK & 4 BHK",
              "sizes":          "2,200 sq.ft – 2,966 sq.ft",
              "towers":         "4 Towers",
              "floors":         "G+42 Floors",
              "totalUnits":     "~750 Units",
              "clubhouse":      "75,000 sq.ft",
              "priceRange":     "Rs.5.50 Cr – Rs.7.42 Cr",
              "reraNo":         "RERA Applied",
              "launchDate":     "April 2026",
              "possessionDate": "Dec 2030",
              "phases":         "1 Phase",
              "developer":      "Sobha Limited",
              "address":        "Sector 63A, Golf Course Extension Road, Gurgaon, Haryana 122002"
            }'::jsonb,
            "updatedAt" = NOW()
            WHERE "propertyId" = v_property_id AND type = 'keyTakeaways';
          ELSE
            INSERT INTO property_sections (id, "propertyId", type, title, "order", "isVisible", data, "createdAt", "updatedAt")
            VALUES (
              gen_random_uuid(),
              v_property_id,
              'keyTakeaways',
              'Key Takeaways',
              5,
              true,
              '{
                "status":         "Pre-Launch",
                "type":           "Residential",
                "area":           "12 Acres",
                "configuration":  "3 BHK & 4 BHK",
                "sizes":          "2,200 sq.ft – 2,966 sq.ft",
                "towers":         "4 Towers",
                "floors":         "G+42 Floors",
                "totalUnits":     "~750 Units",
                "clubhouse":      "75,000 sq.ft",
                "priceRange":     "Rs.5.50 Cr – Rs.7.42 Cr",
                "reraNo":         "RERA Applied",
                "launchDate":     "April 2026",
                "possessionDate": "Dec 2030",
                "phases":         "1 Phase",
                "developer":      "Sobha Limited",
                "address":        "Sector 63A, Golf Course Extension Road, Gurgaon, Haryana 122002"
              }'::jsonb,
              NOW(),
              NOW()
            );
          END IF;
        END $$;
      `, { transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        // Revert to typical string array layout
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.sequelize.query(`
        UPDATE property_sections
        SET data = '{
          "takeaways": [
            "Premium Location",
            "World-Class Amenities",
            "Expert Construction",
            "Investment Potential"
          ]
        }'::jsonb,
        "updatedAt" = NOW()
        WHERE type = 'keyTakeaways';
      `, { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
};
