- [ ] parking capability architecture research ([[projects/parking-capability-architecture-research]])
	- [x] phase 0: framing doc + clarification questions
	- [x] phase 1: deep-dive sibling branches + design docs
	- [x] phase 2: literature research
	- [x] phase 3: novel solution proposals (§8, post-adversarial-review)
	- [ ] phase 4: Boris review of §8 → pick "Now" items (§8.9)
	- [ ] decide: Notion page for parking team (open Q7)
- [ ] PUDO data/pipeline bugs ([[projects/pudo-data-bug-report-2026-06-13]])
	- [ ] CHECK: dump POLICY_GEAR/SPEED/WAYPOINTS for unparking samples around clamp_policy_at_first_neutral (U1)
	- [ ] CHECK: plot get_gear over confirmed robotaxi drop-offs — does it hit gear==0? (P1)
	- [ ] CHECK: confirm trained root (gear_fix vs no_low_steering) + re-pull default-dataset counts
	- [ ] FIX U1: don't clamp on unparking_mode; couple gear-forward aug with motion-forward
	- [ ] FIX U2: wire failed_to_unpudo + non-zero unsafe weight
	- [ ] FIX P1: speed-based stop detection (not gear==0)
	- [ ] FIX P2: tighten trip match radius ~15m + use timestamp; clamp at true stop
	- [ ] FIX P3/P4: tie ca_pudo + gear-change anchors to validated park/PUDO events
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
		- [x] create videos
		- [x] go over videos
		- [ ] split videos to smaller chunks
	- [ ] illigal
- [ ] materialization
	- [x] fix gear
		- [x] train red sea
			- [x] eval
			- [x] licensing
			- [x] exp
		- [x] train merge to main
			- [x]  eval
			- [x] licensing
			- [x] exp
	- [x] generic by zak
		- [x] implement
		- [x] go over samples
		- [x] compare
			- [x] fix filtering
	- [ ] unpudo compare to notebook
	- [ ] parking evaluation
	- [ ] Add Jack's classes
- [x] licensing issue
	- [x] investigate what happened
	- [x] look at deployment wrapper
	- [x] look at augmentations
- [ ] eval studio - too many errors
	- [ ] PR to fix negative waypoints
- [ ] Model experiments
	- [ ] request licensing
- [ ] corpus
	- [ ] add trip id
	- [ ] add distance to destination
