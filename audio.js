// Efek suara & musik dibuat langsung dengan WebAudio (tanpa file mp3)
// Ganti nama/lokasi file mp3 di sini (taruh file di folder assets/)
const MP3_KISS='kiss.ogg';
const AU={c:null,on:true,
init(){if(this.c){if(this.c.state=='suspended')this.c.resume();return}try{this.c=new(window.AudioContext||window.webkitAudioContext)();this.m=this.c.createGain();this.m.gain.value=.55;this.m.connect(this.c.destination)}catch(e){}},
t(f,s,d,ty,v,f2){if(!this.c||!this.on)return;const c=this.c,o=c.createOscillator(),g=c.createGain(),n=c.currentTime+s;o.type=ty||'sine';o.frequency.setValueAtTime(f,n);if(f2)o.frequency.exponentialRampToValueAtTime(f2,n+d);g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime(v||.2,n+.012);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g);g.connect(this.m);o.start(n);o.stop(n+d+.05)},
n(s,d,f1,f2,v){if(!this.c||!this.on)return;const c=this.c,n=c.currentTime+s,len=Math.max(1,c.sampleRate*d|0),b=c.createBuffer(1,len,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<len;i++)a[i]=Math.random()*2-1;const src=c.createBufferSource();src.buffer=b;const f=c.createBiquadFilter();f.type='bandpass';f.Q.value=3;f.frequency.setValueAtTime(f1,n);f.frequency.exponentialRampToValueAtTime(f2,n+d);const g=c.createGain();g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.001,n+d);src.connect(f);f.connect(g);g.connect(this.m);src.start(n)},
jump(){this.t(300,0,.18,'square',.07,700)},jump2(){this.t(520,0,.22,'triangle',.14,1200);this.t(780,.08,.2,'sine',.08,1500)},
land(){this.n(0,.07,400,120,.12)},fall(){this.t(900,0,.9,'sine',.12,120)},
smash(){this.n(0,.5,900,60,.6);this.t(130,0,.45,'sine',.6,40)},
pop(){[1046,1318,1568,2093,2637].forEach((f,i)=>this.t(f,i*.06,.6,'sine',.12))},
wake(){this.t(200,0,.35,'sawtooth',.08,700);this.t(700,.3,.15,'square',.06)},
beep(){this.t(880,0,.14,'square',.08)},shutter(){this.n(0,.05,4500,2000,.5);this.n(.08,.06,2800,900,.4)},
mp3(src,fallback){if(!this.on)return;const a=new Audio(src);a.volume=.9;const p=a.play();if(p&&p.catch)p.catch(()=>{if(fallback)fallback()})},
kiss(){this.mp3(MP3_KISS,()=>this.kissSynth())}, // pakai mp3; kalau file tidak ada -> suara buatan kode
kissSynth(){ // "mwah" dua kecupan + musik kotak musik manis
  this.n(0,.08,1900,500,.4);this.t(720,0,.1,'sine',.22,340);
  this.n(.2,.06,1700,600,.22);this.t(660,.2,.08,'sine',.14,330);
  [784,988,1175,1568,1319,1568,1760,2349].forEach((f,i)=>{this.t(f,.5+i*.16,.7,'triangle',.11);this.t(f*2,.5+i*.16,.5,'sine',.04)});
  [262,330,392,523].forEach(f=>this.t(f,.45,3.4,'sine',.06))},
twinkle(){[1568,1760,2093,2637,3136].forEach((f,i)=>this.t(f,i*.14,.9,'sine',.1))}};