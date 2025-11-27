(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,89589,(e,t,n)=>{t.exports=e.r(71883)},49370,e=>{"use strict";var t=e.i(94002);let n=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,n)=>n?n.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)},r=(...e)=>e.filter((e,t,n)=>!!e&&""!==e.trim()&&n.indexOf(e)===t).join(" ").trim();var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let o=(0,t.forwardRef)(({color:e="currentColor",size:n=24,strokeWidth:o=2,absoluteStrokeWidth:s,className:a="",children:u,iconNode:c,...l},d)=>(0,t.createElement)("svg",{ref:d,...i,width:n,height:n,stroke:e,strokeWidth:s?24*Number(o)/Number(n):o,className:r("lucide",a),...!u&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0})(l)&&{"aria-hidden":"true"},...l},[...c.map(([e,n])=>(0,t.createElement)(e,n)),...Array.isArray(u)?u:[u]])),s=(e,i)=>{let s=(0,t.forwardRef)(({className:s,...a},u)=>(0,t.createElement)(o,{ref:u,iconNode:i,className:r(`lucide-${n(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...a}));return s.displayName=n(e),s};e.s(["default",()=>s],49370)},98317,e=>{"use strict";let t=(0,e.i(49370).default)("mic",[["path",{d:"M12 19v3",key:"npa21l"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["rect",{x:"9",y:"2",width:"6",height:"13",rx:"3",key:"s6n7sd"}]]);e.s(["Mic",()=>t],98317)},25044,e=>{"use strict";e.s(["DOMAINS",0,["Frontend Engineering (React)","Backend Engineering (Node.js)","DevOps & SRE","Machine Learning Engineer","Product Management","System Design","Behavioral / HR"],"OUT_SAMPLE_RATE",0,24e3,"PCM_SAMPLE_RATE",0,16e3,"getSystemInstruction",0,(e,t,n)=>`
You are an expert technical interviewer conducting a voice-based video interview.
Your persona is "Nexus", a professional, polite, but rigorous senior engineer.

**Context:**
- Domain: ${e}
- Difficulty: ${t}
${n?`
**Candidate Resume/Background:**
"${n}"
`:""}

**Instructions:**
1. Start by briefly introducing yourself and asking the candidate to introduce themselves${n?", specifically mentioning something interesting from their resume":""}.
2. Ask one question at a time. Wait for the user to answer.
3. **IMPORTANT: BE PATIENT.** Technical interviews require thinking time. If the user pauses for 2-3 seconds, **DO NOT INTERRUPT**. Assume they are thinking. Only speak if they ask for clarification or explicitly stop speaking for a significant duration.
4. Listen carefully to the user's answer.
${n?"5. **Tailor Questions:** Use the provided resume context to ask specific questions about their past projects, roles, or listed skills. Verify their depth of knowledge on claimed expertise.":"5. If the answer is vague, ask a follow-up digging deeper."}
6. If the answer is incorrect, gently correct them or ask them to reconsider, then move on.
7. Keep your responses concise (under 3 sentences usually) to maintain a conversational flow.
8. Do not generate code blocks or long monologues. This is a spoken interview.
9. Maintain a professional tone appropriate for a ${t} level interview.
10. At the end of the session (when the user says "I'm done" or "End interview"), politely thank them and say goodbye.

**Strict Constraints:**
- **LANGUAGE: You must speak ONLY in English.** Do not switch languages even if the user does.
- You are communicating via a real-time audio stream. Speak naturally.
- **TRANSCRIPT MATCH:** Your text output must EXACTLY match what you speak. Do not include internal thoughts, reasoning, "Thinking...", or any text that is not spoken aloud.
`])},59477,(e,t,n)=>{"use strict";var r=e.r(94002),i="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},o=r.useState,s=r.useEffect,a=r.useLayoutEffect,u=r.useDebugValue;function c(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!i(e,n)}catch(e){return!0}}var l="undefined"==typeof window||void 0===window.document||void 0===window.document.createElement?function(e,t){return t()}:function(e,t){var n=t(),r=o({inst:{value:n,getSnapshot:t}}),i=r[0].inst,l=r[1];return a(function(){i.value=n,i.getSnapshot=t,c(i)&&l({inst:i})},[e,n,t]),s(function(){return c(i)&&l({inst:i}),e(function(){c(i)&&l({inst:i})})},[e]),u(n),n};n.useSyncExternalStore=void 0!==r.useSyncExternalStore?r.useSyncExternalStore:l},69987,(e,t,n)=>{"use strict";t.exports=e.r(59477)},9572,(e,t,n)=>{"use strict";var r=e.r(94002),i=e.r(69987),o="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},s=i.useSyncExternalStore,a=r.useRef,u=r.useEffect,c=r.useMemo,l=r.useDebugValue;n.useSyncExternalStoreWithSelector=function(e,t,n,r,i){var d=a(null);if(null===d.current){var f={hasValue:!1,value:null};d.current=f}else f=d.current;var h=s(e,(d=c(function(){function e(e){if(!u){if(u=!0,s=e,e=r(e),void 0!==i&&f.hasValue){var t=f.value;if(i(t,e))return a=t}return a=e}if(t=a,o(s,e))return t;var n=r(e);return void 0!==i&&i(t,n)?(s=e,t):(s=e,a=n)}var s,a,u=!1,c=void 0===n?null:n;return[function(){return e(t())},null===c?void 0:function(){return e(c())}]},[t,n,r,i]))[0],d[1]);return u(function(){f.hasValue=!0,f.value=h},[h]),l(h),h}},25662,(e,t,n)=>{"use strict";t.exports=e.r(9572)}]);