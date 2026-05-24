# TODO

- [ ] Implement tighter, realistic bouquet construction in `src/components/BouquetArrangement.tsx`
- [x] Replace slot-based `ALL_SLOTS` positioning with deterministic density-driven clustered anchors in a bouquet dome

  - [x] Remove blade/tuft grass elements that violate constraints

  - [ ] Add layered, physically wrapping greenery masses (back/interleaving/front) that cradle flowers
  - [ ] Generate hidden/short stems that terminate under leaf overlaps
  - [ ] Ensure dense occupancy (no empty gaps) and natural clustering
- [ ] If needed, refine flower scaling/overlap behavior in `src/components/FlowerEmoji.tsx`
- [ ] Run tests / build / visually inspect in browser

