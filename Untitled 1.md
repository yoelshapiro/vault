```
// The ./types module provides helper types for your Input events and messages.

import { Input, Message } from "./types";

  

type TimeStamp = {

sec: number;

nsec: number;

};

  

// Define the message structure for your input topic.

type ActiveModelMessage = {

timestamp: TimeStamp;

interleaved_event: number;

active_artefact_id: string;

};

  

// Define the output type for your script

type Output = {

active_model: string;

};

  

const ARTEFACT_TO_NICKNAME: Record<string, string> = {

"a5a49c37-043c-419e-b84b-0e2fa518752e": "butterfly-silver-scintillating",

"d246e07d-f2ff-441b-a8fc-4b051a565f1f": "elusive-rabbit-gray",

"e74f6dfe-d33c-439f-8c97-d3bee3ddb718": "lavender-armadillo-lively",

"6b1e274c-a5fe-4f4f-b53a-f44c8f451087": "watchful-fuchsia-wrasse",

};

  

// Subscribe to the correct topic where the full message is received

export const inputs = ["/robot/inference/interleaved_event"];

  

// Output the converted speed to a new topic

export const output = "/studio_script/active_model";

  

function convert_to_nickname(active_artefact_id: string): string {

return ARTEFACT_TO_NICKNAME[active_artefact_id] ?? active_artefact_id;

}

  

// Process the received message and return the converted speed

export default function script(

event: Input<"/robot/inference/interleaved_event">,

): Output {

// Access the speed_limit_kmh field from the route map message

const active_model = (event.message as ActiveModelMessage).active_artefact_id;

  

return {

active_model: convert_to_nickname(active_model),

};

}
```