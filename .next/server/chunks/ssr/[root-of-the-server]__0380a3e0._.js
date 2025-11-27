module.exports=[56704,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},20635,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},32319,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},99560,(a,b,c)=>{"use strict";b.exports=a.r(11608).vendored.contexts.AppRouterContext},96249,(a,b,c)=>{"use strict";b.exports=a.r(11608).vendored.contexts.HooksClientContext},76925,(a,b,c)=>{"use strict";b.exports=a.r(11608).vendored.contexts.ServerInsertedHtml},81796,a=>{"use strict";let b=(0,a.i(50461).default)("mic",[["path",{d:"M12 19v3",key:"npa21l"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["rect",{x:"9",y:"2",width:"6",height:"13",rx:"3",key:"s6n7sd"}]]);a.s(["Mic",()=>b],81796)},40915,a=>{"use strict";a.s(["DOMAINS",0,["Frontend Engineering (React)","Backend Engineering (Node.js)","DevOps & SRE","Machine Learning Engineer","Product Management","System Design","Behavioral / HR"],"OUT_SAMPLE_RATE",0,24e3,"PCM_SAMPLE_RATE",0,16e3,"getSystemInstruction",0,(a,b,c)=>`
You are an expert technical interviewer conducting a voice-based video interview.
Your persona is "Nexus", a professional, polite, but rigorous senior engineer.

**Context:**
- Domain: ${a}
- Difficulty: ${b}
${c?`
**Candidate Resume/Background:**
"${c}"
`:""}

**Instructions:**
1. Start by briefly introducing yourself and asking the candidate to introduce themselves${c?", specifically mentioning something interesting from their resume":""}.
2. Ask one question at a time. Wait for the user to answer.
3. **IMPORTANT: BE PATIENT.** Technical interviews require thinking time. If the user pauses for 2-3 seconds, **DO NOT INTERRUPT**. Assume they are thinking. Only speak if they ask for clarification or explicitly stop speaking for a significant duration.
4. Listen carefully to the user's answer.
${c?"5. **Tailor Questions:** Use the provided resume context to ask specific questions about their past projects, roles, or listed skills. Verify their depth of knowledge on claimed expertise.":"5. If the answer is vague, ask a follow-up digging deeper."}
6. If the answer is incorrect, gently correct them or ask them to reconsider, then move on.
7. Keep your responses concise (under 3 sentences usually) to maintain a conversational flow.
8. Do not generate code blocks or long monologues. This is a spoken interview.
9. Maintain a professional tone appropriate for a ${b} level interview.
10. At the end of the session (when the user says "I'm done" or "End interview"), politely thank them and say goodbye.

**Strict Constraints:**
- **LANGUAGE: You must speak ONLY in English.** Do not switch languages even if the user does.
- You are communicating via a real-time audio stream. Speak naturally.
- **TRANSCRIPT MATCH:** Your text output must EXACTLY match what you speak. Do not include internal thoughts, reasoning, "Thinking...", or any text that is not spoken aloud.
`])},47215,(a,b,c)=>{"use strict";var d=a.r(34415);d.useState,d.useEffect,d.useLayoutEffect,d.useDebugValue,c.useSyncExternalStore=void 0!==d.useSyncExternalStore?d.useSyncExternalStore:function(a,b){return b()}},20967,(a,b,c)=>{"use strict";b.exports=a.r(47215)},22149,(a,b,c)=>{"use strict";var d=a.r(34415),e=a.r(20967),f="function"==typeof Object.is?Object.is:function(a,b){return a===b&&(0!==a||1/a==1/b)||a!=a&&b!=b},g=e.useSyncExternalStore,h=d.useRef,i=d.useEffect,j=d.useMemo,k=d.useDebugValue;c.useSyncExternalStoreWithSelector=function(a,b,c,d,e){var l=h(null);if(null===l.current){var m={hasValue:!1,value:null};l.current=m}else m=l.current;var n=g(a,(l=j(function(){function a(a){if(!i){if(i=!0,g=a,a=d(a),void 0!==e&&m.hasValue){var b=m.value;if(e(b,a))return h=b}return h=a}if(b=h,f(g,a))return b;var c=d(a);return void 0!==e&&e(b,c)?(g=a,b):(g=a,h=c)}var g,h,i=!1,j=void 0===c?null:c;return[function(){return a(b())},null===j?void 0:function(){return a(j())}]},[b,c,d,e]))[0],l[1]);return i(function(){m.hasValue=!0,m.value=n},[n]),k(n),n}},7667,(a,b,c)=>{"use strict";b.exports=a.r(22149)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0380a3e0._.js.map