package com.group4.supplier_service.initializer;

import com.group4.supplier_service.entity.Supplier;
import com.group4.supplier_service.entity.SupplierProduct;
import com.group4.supplier_service.enums.SupplierStatus;
import com.group4.supplier_service.repository.SupplierProductRepository;
import com.group4.supplier_service.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    private final SupplierRepository supplierRepository;
    private final SupplierProductRepository supplierProductRepository;

    // Allowed regions matching UI dropdown
    private static final List<String> ALLOWED_REGIONS = Arrays.asList(
            "Asia",
            "Europe",
            "North America",
            "South America",
            "Africa",
            "Oceania"
    );

    @Override
    public void run(String... args) {
        try {
            // --- Suppliers seeding: ensure at least 10 suppliers exist ---
            long existingSuppliers = supplierRepository.count();
            int desiredSuppliers = 10;
            if (existingSuppliers < desiredSuppliers) {
                int toCreateSuppliers = desiredSuppliers - (int) existingSuppliers;
                List<Supplier> suppliersToSave = new ArrayList<>();

                // Try to load from JSON resource first
                InputStream is = getClass().getClassLoader().getResourceAsStream("data/suppliers_seed.json");
                if (is != null) {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        List<Supplier> jsonSuppliers = mapper.readValue(is, new TypeReference<>() {});
                        int assignIndex = 0;
                        for (Supplier s : jsonSuppliers) {
                            if (suppliersToSave.size() >= toCreateSuppliers) break;
                            // Ensure required createBy and some defaults
                            if (s.getCreateBy() == null) s.setCreateBy("data-init");
                            if (s.getStatus() == null) s.setStatus(SupplierStatus.PENDING);
                            if (s.getRating() == null) s.setRating(BigDecimal.ZERO);

                            // Normalize region: if missing or not allowed, assign from allowed list
                            String region = s.getRegion();
                            if (region == null || !ALLOWED_REGIONS.contains(region)) {
                                s.setRegion(ALLOWED_REGIONS.get(assignIndex % ALLOWED_REGIONS.size()));
                            }
                            assignIndex++;
                            suppliersToSave.add(s);
                        }
                        log.info("Loaded {} supplier(s) from suppliers_seed.json to seed.", suppliersToSave.size());
                    } catch (Exception e) {
                        log.warn("Failed to read suppliers_seed.json, will fallback to generated suppliers", e);
                    }
                }

                // If JSON didn't provide enough suppliers, generate remaining ones
                if (suppliersToSave.size() < toCreateSuppliers) {
                    long alreadyPlanned = suppliersToSave.size();
                    for (int i = 1; i <= (toCreateSuppliers - alreadyPlanned); i++) {
                        int idx = (int) existingSuppliers + (int) alreadyPlanned + i; // unique index for new suppliers
                        String name = "Supplier " + idx;
                        String email = "supplier" + idx + "@example.com";
                        String phone = String.format("090%07d", idx);
                        String taxCode = "TAX" + (10000 + idx);
                        String address = "123 Sample St, City " + idx;

                        // Assign region from allowed list in round-robin
                        String region = ALLOWED_REGIONS.get((idx - 1) % ALLOWED_REGIONS.size());

                        String materialType = "MaterialType" + ((idx % 4) + 1);

                        BigDecimal rating = BigDecimal.valueOf(
                                Math.round((ThreadLocalRandom.current().nextDouble(30.0, 50.0)))/10.0
                        ).setScale(2, RoundingMode.HALF_UP);

                        Supplier s = Supplier.builder()
                                .name(name)
                                .contactEmail(email)
                                .phone(phone)
                                .taxCode(taxCode)
                                .address(address)
                                .region(region)
                                .materialType(materialType)
                                .createBy("data-init")
                                .status((idx % 2) == 0 ? SupplierStatus.APPROVED : SupplierStatus.PENDING)
                                .rating(rating)
                                .build();
                        suppliersToSave.add(s);
                    }
                }

                // Save up to toCreateSuppliers (avoid duplicates causing constraint errors)
                int savedCount = 0;
                for (Supplier s : suppliersToSave) {
                    try {
                        if (!supplierRepository.existsByContactEmail(s.getContactEmail()) && !supplierRepository.existsByTaxCode(s.getTaxCode()) && !supplierRepository.existsByName(s.getName())) {
                            supplierRepository.save(s);
                            savedCount++;
                        } else {
                            log.debug("Skipping supplier because of unique constraint (email/tax/name): {}", s.getName());
                        }
                        if (savedCount >= toCreateSuppliers) break;
                    } catch (Exception ex) {
                        log.warn("Failed to save supplier {}: {}", s.getName(), ex.getMessage());
                    }
                }

                log.info("Attempted to seed up to {} Supplier records, actually saved {} (total now {}).", toCreateSuppliers, savedCount, supplierRepository.count());
            } else {
                log.info("Suppliers present: {} (>= {}), skipping supplier seeding.", existingSuppliers, desiredSuppliers);
            }

            // --- SupplierProduct seeding ---
            long existingProducts = supplierProductRepository.count();
            long desiredTotalProducts = 20;
            if (existingProducts >= desiredTotalProducts) {
                log.info("SupplierProduct already has {} entries (>= {}), skipping seeding.", existingProducts, desiredTotalProducts);
                return;
            }

            List<Supplier> suppliers = supplierRepository.findAll();
            if (suppliers.isEmpty()) {
                log.info("No suppliers found in DB; cannot seed SupplierProduct entries.");
                return;
            }

            int toCreate = (int) (desiredTotalProducts - existingProducts);
            List<SupplierProduct> batch = new ArrayList<>();

            for (int i = 1; i <= toCreate; i++) {
                Supplier supplier = suppliers.get((i - 1) % suppliers.size());
                String productId = String.format("P-%05d", 10000 + i);

                // Price in units of 100,000 (trăm ngàn).
                int multiplier = ThreadLocalRandom.current().nextInt(1, 21); // 1..20 (hundred-thousands)
                BigDecimal price = BigDecimal.valueOf(multiplier).multiply(BigDecimal.valueOf(100_000L));

                int deliveryDays = ThreadLocalRandom.current().nextInt(1, 15); // 1..14
                boolean isActive = (i % 3) != 0; // roughly 2 active : 1 inactive

                SupplierProduct sp = SupplierProduct.builder()
                        .supplier(supplier)
                        .productId(productId)
                        .price(price)
                        .deliveryDateTimes(deliveryDays)
                        .isActive(isActive)
                        .build();
                batch.add(sp);
            }

            supplierProductRepository.saveAll(batch);
            log.info("Seeded {} SupplierProduct records (total now {}).", batch.size(), supplierProductRepository.count());
        } catch (Exception ex) {
            log.error("Failed to initialize SupplierProduct data", ex);
        }
    }
}
