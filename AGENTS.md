\# CropIQ Project Context



\## Project



CropIQ is a mobile-first agricultural IoT dashboard for smart farming.



The frontend is a React + Vite application.



Repository:

https://github.com/rupessh06/CropIQ



Current deployment:

https://crop-iq-26v4.vercel.app/



\## Current Architecture



Frontend:

\- React

\- Vite

\- CSS-based responsive UI

\- PWA support

\- Vercel deployment



Current backend/API configuration:

VITE\_API\_URL=http://192.168.1.100:8000

VITE\_USE\_MOCK=false



The 192.168.1.100 address is currently a local/private network address.



\## Future Hardware Architecture



The dashboard will eventually connect to a Raspberry Pi gateway.



Expected architecture:



Raspberry Pi

&#x20;   ↓

Cloud/API backend or MQTT

&#x20;   ↓

CropIQ Dashboard on Vercel



Do NOT attempt to make the deployed Vercel frontend directly access a private 192.168.x.x Raspberry Pi address.



The Raspberry Pi integration will be implemented after the frontend deployment and UI are stable.



\## Product Vision



CropIQ is intended to be more than a static dashboard.



The system should eventually support:

\- Real-time farm monitoring

\- Soil moisture monitoring

\- Temperature/humidity monitoring

\- Crop condition monitoring

\- Irrigation control

\- Smart irrigation recommendations

\- Raspberry Pi gateway

\- LoRa/LoRaWAN field nodes

\- AI agronomy recommendations

\- Farm condition heatmaps

\- Zone-based farm monitoring

\- Sensor/node status

\- Future real hardware integration



\## UI Requirements



The application is mobile-first and should work well around:

360px–480px



It should also remain responsive on desktop.



Main navigation:

\- Home

\- Map

\- Control

\- AI Advisor

\- Pi Gateway



The UI should support:

\- Light theme

\- Dark theme

\- English

\- Assamese

\- Hindi



Language switching should translate the whole application, not only individual labels.



\## Home Page



The Home page should contain:

\- My Farm

\- Crop information

\- Farm online/offline status

\- Farm condition summary

\- Water status

\- Farm condition map



The farm condition map should eventually show:

\- Farm layout

\- Sensor nodes

\- Green node = online

\- Red node = offline/problem

\- Heatmap based on current farm conditions

\- Areas near problematic nodes should visually reflect their condition

\- Raspberry Pi gateway

\- Farm zones



\## Farm Map



Farm Map is a major component.



It should visually show:

\- Four farm zones

\- Zone A — Tomato

\- Zone B — Polyhouse

\- Zone C — Orchard

\- Zone D — Nursery

\- Sensor nodes

\- Node status

\- Raspberry Pi gateway

\- Irrigation pipes

\- Condition heatmap

\- Map layer controls

\- Map legend

\- Zone summary cards

\- Selected sensor details



The map should be an actual graphical visualization, NOT a list of zone names.



\## Farm Control



Farm Control currently contains:

\- Pump status

\- Start irrigation

\- Smart irrigation

\- Irrigation schedule

\- Add schedule

\- Edit/delete schedule



Preserve existing functionality.



\## AI Agronomy Advisor



Should contain:

\- AI Agronomy Advisor

\- Active model

\- Farm Health Index

\- Hydration status

\- Crop water deficit

\- ETo / evaporation rate

\- Disease/fungal risk

\- AI recommendations

\- Agronomy best practices



Metrics should be presented as proper dashboard cards/sections, not collapsed raw text.



\## Raspberry Pi Gateway



Should contain:

\- Raspberry Pi Gateway status

\- Edge telemetry processor / LoRaWAN concentrator

\- Sync status

\- Raspberry Pi model

\- CPU temperature

\- Memory

\- Solar input

\- Battery

\- LoRa RSSI

\- Gateway IP

\- Uptime

\- Packet count

\- Connected field nodes

\- Gateway telemetry injector

\- Quick condition presets



Future hardware integration will connect this to the real Raspberry Pi.



\## Current Major Issue



The Vercel deployment is working, but the deployed UI currently has a CSS/component styling mismatch.



Farm Control is mostly styled correctly.



Farm Map, AI Advisor, Raspberry Pi Gateway, and parts of the header have sections rendering as raw/default HTML.



Symptoms:

\- Farm Map graphical visualization missing

\- Heatmap missing

\- Sensor nodes missing visually

\- Gateway marker missing

\- Irrigation pipes missing

\- Map legend broken

\- Map layer selector rendered as plain text

\- Zone cards missing styling

\- AI Advisor metrics collapsed into plain text

\- Gateway telemetry collapsed into inline text

\- Connected field nodes section broken

\- Header branding/layout incorrect



Likely causes to investigate:

1\. JSX class names no longer match CSS

2\. CSS sections were deleted

3\. Missing stylesheet import

4\. CSS specificity/order problem

5\. Component/CSS mismatch

6\. Encoding damage

7\. Invalid CSS structure/media queries



DO NOT assume the cause. Inspect the code first.



\## Important Recent Build Issue



Vercel previously failed because these JSX files were not valid UTF-8:



src/components/MobileSlideBar.jsx

src/pages/AIAdvisorPage.jsx

src/pages/GatewayPage.jsx

src/components/FarmMap.jsx



They were converted to UTF-8.



Before changing code, check that these files remain valid UTF-8.



Also check CSS files for encoding issues.



\## Important Current Task



The immediate task is to repair the frontend styling without redesigning or removing functionality.



Inspect:

\- src/index.css

\- src/App.jsx

\- src/pages/Home.jsx

\- src/pages/FarmControlPage.jsx

\- src/pages/AIAdvisorPage.jsx

\- src/pages/GatewayPage.jsx

\- src/components/FarmMap.jsx

\- src/components/MobileSlideBar.jsx

\- all imported styles/components



Determine exactly why the deployed styling is broken.



Then repair the CSS/component mismatch.



Do NOT:

\- rewrite the entire application

\- replace working components unnecessarily

\- remove functionality

\- remove dark mode

\- remove language switching

\- change routing

\- change API architecture

\- modify Raspberry Pi logic

\- modify environment variables unless explicitly requested



Preserve the existing design language.



\## Development Workflow



Before making major changes:

1\. Inspect existing code.

2\. Identify the actual cause.

3\. Make the smallest appropriate fix.

4\. Run:



npm run build



5\. Fix build errors.

6\. Run the build again.

7\. Only after successful build, commit/push changes if requested.



Never claim a build works without actually running it.



\## Git



Main branch:

main



Repository:

rupessh06/CropIQ



Current Vercel project:

crop-iq



\## Agent Behavior



When asked to modify CropIQ:

\- inspect existing implementation first

\- preserve working functionality

\- avoid unnecessary rewrites

\- prefer fixing the root cause

\- test builds after changes

\- explain what files were changed

\- do not modify unrelated parts of the application



The user prefers using the Antigravity terminal/agent for implementation.

