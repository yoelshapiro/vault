- [ ] parking capability architecture research ([[projects/parking-capability-architecture-research]])
	- [x] phase 0: framing doc + clarification questions
	- [x] phase 1: deep-dive sibling branches + design docs
	- [x] phase 2: literature research
	- [x] phase 3: novel solution proposals (§8, post-adversarial-review)
	- [ ] phase 4: Boris review of §8 → pick "Now" items (§8.9)
	- [ ] decide: Notion page for parking team (open Q7)
- [ ] PUDO data/pipeline bugs ([[projects/pudo-data-bug-report-2026-06-13]])
	- [x] FIX U1: clamp no longer applies on unparking_mode (landed, parking.py:786)
	- [ ] CHECK: confirm trained root (gear_fix vs no_low_steering) + re-pull default-dataset counts
	- [ ] FIX P2: tighten trip match radius ~15m + use timestamp; clamp at true stop
	- [ ] FIX P3/P4: tie ca_pudo + gear-change anchors to validated park/PUDO events
- [ ] PUDO parking.py critique v2 ([[projects/pudo-parking-py-critique-2026-06-14]])
	- [ ] CONFIRM: which datamodule actually trains (parking_bc vs pudo_bc override) — §4.1
	- [ ] FIX N1: detect forward pull-out (P/N→D) as unparking_mode + add duration gate (U1)
	- [ ] FIX N2: add min-neutral-duration gate to _compute_parking_mode (P1/U2)
	- [ ] FIX N3: guard clamp with _pre_intervention_would_fire (U1/U3 on pre-CA/CA)
	- [ ] FIX N4/N5: route-shortening clipped index + clamp speed/pose off-by-one (P2)
	- [ ] FIX M1: move `assigned |= window` inside the class gate (filters.py:104)
	- [ ] FIX M2/M4: unify approach/departure context window; clip unpudo window at next stop
	- [ ] FLAGS: apply guide (lower time_threshold_sec, fix min_duration gating, decide reconstruct_gear, small conditioning dropout) — §3
- [ ] merge main PR
	- [x] go over comments
	- [ ] investigate performance
	- [x] cherry pick
	- [ ] cherry pick with latest model + new materialization + new driving
- [ ] parking augmentations
- [ ] pre train updated augmentations request
- [ ] investigate train warnings 
      ![:warning:](https://a.slack-edge.com/production-standard-emoji-assets/16.0/apple-medium/26a0-fe0f@2x.png) **Low Unique Sample Ratio** ![:warning:](https://a.slack-edge.com/production-standard-emoji-assets/16.0/apple-medium/26a0-fe0f@2x.png)  
	Unique ratio: `94.5%` (threshold: `95%`)  
	Total samples: `640000`, Unique samples: `604644`  
	Training may be consuming duplicate data.
	
	[1:24 AM]
	
	![:warning:](https://a.slack-edge.com/production-standard-emoji-assets/16.0/apple-medium/26a0-fe0f@2x.png) **Stale Data Detected on Restart** ![:warning:](https://a.slack-edge.com/production-standard-emoji-assets/16.0/apple-medium/26a0-fe0f@2x.png)  
	Stale samples: `6` samples overlap with previous run across all ranks  
	Dataloader may not have properly resumed from checkpoint.
- [ ] classifier
	- [ ] safe unpudo
		- [ ] create videos
		- [ ] go over videos
		- [ ] split videos to smaller chunks
	- [ ] illigal
- [ ] materialization
	- [ ] fix gear
		- [x] train red sea
			- [ ] eval
			- [ ] licensing
			- [ ] exp
		- [x] train merge to main
			- [ ]  eval
			- [ ] licensing
			- [ ] exp
	- [ ] generic by zak
		- [x] implement
		- [x] go over samples
		- [ ] compare
			- [ ] fix filtering
- [ ] licensing issue
	- [ ] investigate what happened
	- [ ] look at deployment wrapper
	- [ ] look at augmentations
- [ ] eval studio - too many errors
	- [ ] PR to fix negative waypoints
- [ ] Model experiments
	- [ ] request licensing
- [ ] corpus
	- [ ] add trip id
	- [ ] add distance to destination
	- [ ] 