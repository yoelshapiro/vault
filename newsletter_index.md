# WayveCode Newsletter Index

Think of this as an internal newsletter series: short, practical issues that explain **how our projects actually work**--the moving parts, the real tradeoffs, and the gotchas we only learn by shipping.

## Table of Contents
1. [Newsletter: Teaching parking models the difference between PARK and PUDO (stopping_mode)](newsletters/newsletter_parking-stopping-mode-dilc.md)
2. [Newsletter: Aligning parking maneuver sampling with real-world behavior (Zak classifiers)](newsletters/newsletter_parking-maneuver-filters.md)
3. [Newsletter: Triggering parking at end-of-route without retraining (wrapper route-end)](newsletters/newsletter_route-end-parking-trigger.md)
4. [Newsletter: Interleaving baseline + parking/PUDA models in the deployment wrapper](newsletters/newsletter_interleaving-models-in-parking-deployment-wrapper.md)
5. [Newsletter: Building an end-to-end inference visualization tool (new vis tool)](newsletters/newsletter_inference-visualization-tool.md)
6. [Newsletter: Route map signal thresholds (near-end-of-route)](newsletters/newsletter_route-map-signal-thresholds.md)
7. [Newsletter: PUDO update to January driving release 2026.5.4](newsletters/newsletter_pudo-update-january-driving-release-2026-5-4.md)
8. [Newsletter: Naive parking stopping_mode heuristic (PUDO=0, PARK=1)](newsletters/newsletter_parking-stopping-mode-naive-heuristic.md)
9. [Newsletter: Moving PUDO, park, UNPUDO, and unparking into generic materialisation](newsletters/newsletter_generic-parking-pudo-materialisation.md)

## How to Use This Newsletter Series
- Each issue is a standalone `newsletter_[topic].md` file.
- All newsletters live in the vault under `~/git/vault/newsletters/`.
- Issues focus on **plain language** explanations, the **actual code paths**, and **lessons learned**.
- When you add a new newsletter, link it here and keep the ordering intentional.
