/* Project NINE chat interaction layer — local-only, no fake AI replies. */
(()=>{'use strict';
const log=document.getElementById('chatlog'),form=document.getElementById('chatForm'),input=document.getElementById('chatInput');
if(!log||!form||!input)return;
const style=document.createElement('style');
style.textContent=`
.chatlog{height:min(55dvh,490px);min-height:310px;scroll-behavior:smooth;overscroll-behavior:contain}
.bubble{position:relative;overflow-wrap:anywhere;white-space:pre-wrap;animation:nineBubble .24s cubic-bezier(.2,.8,.2,1) both}
.bubble.mine{transform-origin:bottom right}.bubble:not(.mine){transform-origin:bottom left}
@keyframes nineBubble{from{opacity:0;transform:translateY(12px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
.bubble .bubble-meta{display:block;font:10px system-ui,sans-serif;opacity:.6;text-align:right;margin-top:5px}
.bubble .bubble-react{display:inline-block;border-radius:14px;background:#fff9;padding:3px 7px;margin-top:6px;font-size:15px}
.bubble .bubble-actions{display:none;gap:4px;flex-wrap:wrap;margin-top:8px}
.bubble:focus-within .bubble-actions,.bubble:hover .bubble-actions,.bubble.show-actions .bubble-actions{display:flex}
.bubble-actions button,.chat-tools button{border:1px solid #fff9;border-radius:16px;background:#ffffff70;padding:5px 9px;font-size:14px}
.chat-tools{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-top:8px}
.chat-tools .sound-state{font-size:11px;opacity:.8}
.chatlog .chat-day{text-align:center;font:11px system-ui,sans-serif;opacity:.6;margin:4px}
@media(prefers-reduced-motion:reduce){.bubble{animation:none}.chatlog{scroll-behavior:auto}}
`;document.head.append(style);
const key='project-nine-chat-v2';let messages=[];try{messages=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(messages))messages=[]}catch{messages=[]}
let sound=false,audio;
function tone(){if(!sound)return;try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.setValueAtTime(620,audio.currentTime);osc.frequency.exponentialRampToValueAtTime(820,audio.currentTime+.08);gain.gain.setValueAtTime(.035,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.13);osc.connect(gain).connect(audio.destination);osc.start();osc.stop(audio.currentTime+.14)}catch{}}
function save(){try{localStorage.setItem(key,JSON.stringify(messages.slice(-300)))}catch{}}
function bubble(m){const b=document.createElement('div');b.className='bubble'+(m.mine?' mine':'');b.tabIndex=0;const txt=document.createElement('span');txt.textContent=m.text;b.append(txt);const meta=document.createElement('span');meta.className='bubble-meta';meta.textContent=new Date(m.time).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});b.append(meta);
if(m.reaction){const react=document.createElement('span');react.className='bubble-react';react.textContent=m.reaction;b.append(react)}
const actions=document.createElement('div');actions.className='bubble-actions';for(const emoji of ['💗','🌷','🥚','😂','✨']){const btn=document.createElement('button');btn.type='button';btn.textContent=emoji;btn.setAttribute('aria-label','React '+emoji);btn.onclick=()=>{m.reaction=emoji;save();render();tone()};actions.append(btn)}const copy=document.createElement('button');copy.type='button';copy.textContent='Copy';copy.onclick=()=>navigator.clipboard?.writeText(m.text);actions.append(copy);b.append(actions);b.addEventListener('click',e=>{if(e.target.closest('button'))return;b.classList.toggle('show-actions')});return b}
function render(){log.replaceChildren();const day=document.createElement('div');day.className='chat-day';day.textContent='LOCAL CHAT · THIS DEVICE ONLY';log.append(day);for(const m of messages)log.append(bubble(m));log.scrollTop=log.scrollHeight}
const tools=document.createElement('div');tools.className='chat-tools';const soundBtn=document.createElement('button');soundBtn.type='button';soundBtn.textContent='♫ Sound off';soundBtn.onclick=()=>{sound=!sound;soundBtn.textContent=sound?'♫ Sound on':'♫ Sound off';if(sound)tone()};const clearBtn=document.createElement('button');clearBtn.type='button';clearBtn.textContent='Clear local chat';clearBtn.onclick=()=>{if(confirm('Clear messages stored in this browser?')){messages=[];save();render()}};const note=document.createElement('span');note.className='sound-state';note.textContent='Tap a bubble for reactions · no AI connected';tools.append(soundBtn,clearBtn,note);form.after(tools);
form.addEventListener('submit',e=>{e.preventDefault();e.stopImmediatePropagation();const value=input.value.trim();if(!value)return;messages.push({text:value,time:Date.now(),mine:true});save();render();input.value='';tone()},true);
render();
})();