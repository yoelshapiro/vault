- [ ] parking capability architecture research ([[projects/parking-capability-architecture-research]])
	- [x] phase 0: framing doc + clarification questions
	- [x] phase 1: deep-dive sibling branches + design docs
	- [x] phase 2: literature research
	- [x] phase 3: novel solution proposals (§8, post-adversarial-review)
	- [ ] phase 4: Boris review of §8 → pick "Now" items (§8.9)
	- [ ] decide: Notion page for parking team (open Q7)
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