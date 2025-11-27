module.exports=[93695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},22734,(a,b,c)=>{b.exports=a.x("fs",()=>require("fs"))},88947,(a,b,c)=>{b.exports=a.x("stream",()=>require("stream"))},6461,(a,b,c)=>{b.exports=a.x("zlib",()=>require("zlib"))},4848,a=>{"use strict";let b=(0,a.i(84703).default)("mic",[["path",{d:"M12 19v3",key:"npa21l"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["rect",{x:"9",y:"2",width:"6",height:"13",rx:"3",key:"s6n7sd"}]]);a.s(["Mic",()=>b],4848)},80104,a=>a.a(async(b,c)=>{try{let b=await a.y("@google/genai");a.n(b),c()}catch(a){c(a)}},!0),88738,a=>a.a(async(b,c)=>{try{var d,e=a.i(80104),f=b([e]);[e]=f.then?(await f)():f;var g=((d={}).JUNIOR="Junior",d.MID="Mid-Level",d.SENIOR="Senior",d.PRINCIPAL="Principal",d);e.Type.OBJECT,e.Type.NUMBER,e.Type.NUMBER,e.Type.NUMBER,e.Type.NUMBER,e.Type.ARRAY,e.Type.STRING,e.Type.ARRAY,e.Type.STRING,e.Type.STRING,a.s(["Difficulty",()=>g]),c()}catch(a){c(a)}},!1),17523,a=>a.a(async(b,c)=>{try{a.i(8171);var d=a.i(27669),e=a.i(88738),f=b([e]);[e]=f.then?(await f)():f;let g={config:{domain:"",difficulty:e.Difficulty.MID,candidateName:"",resumeText:""},setConfig:()=>{},transcript:[],addTranscriptItem:()=>{},analytics:null,setAnalytics:()=>{},resetInterview:()=>{}},h=(0,d.createContext)(g);a.s(["useInterview",0,()=>(0,d.useContext)(h)]),c()}catch(a){c(a)}},!1),80942,a=>{"use strict";a.s(["DOMAINS",0,["Frontend Engineering (React)","Backend Engineering (Node.js)","DevOps & SRE","Machine Learning Engineer","Product Management","System Design","Behavioral / HR"],"OUT_SAMPLE_RATE",0,24e3,"PCM_SAMPLE_RATE",0,16e3,"getSystemInstruction",0,(a,b,c)=>`
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
`])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__a9b3339b._.js.map