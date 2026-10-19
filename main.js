(function(){
const $=id=>document.getElementById(id),show=(id,v)=>$(id).classList[v?'remove':'add']('hide');
const R=new THREE.WebGLRenderer({canvas:$('c'),antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(60,1,.1,600);scene.add(cam);
function resize(){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.fov=cam.aspect<1?75:60;cam.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
const D=buildDream(),RL=buildReal();scene.add(D.G,RL.G);
const girl=makeGirl(),boy=makeBoy(),hammer=makeHammer();
girl.armR.add(hammer);hammer.position.set(0,-.6,0);hammer.scale.setScalar(.55);
D.G.add(girl.g,boy.g);
const bubble=new THREE.Mesh(new THREE.SphereGeometry(2.6,32,24),new THREE.MeshPhongMaterial({color:0x9be8ff,transparent:true,opacity:.28,shininess:120}));
bubble.position.set(0,1.8,-78);D.G.add(bubble);
const zTex=canvasTex(64,64,x=>{x.font='bold 54px sans-serif';x.fillStyle='#fff';x.shadowColor='#6ef2ff';x.shadowBlur=10;x.textAlign='center';x.fillText('Z',32,50)});
const zz=[];for(let i=0;i<4;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:zTex,transparent:true}));s.userData.o=i/4;D.G.add(s);zz.push(s)}
const hTex=canvasTex(64,64,x=>{x.font='54px serif';x.textAlign='center';x.fillText('💗',32,50)});
const endTex=canvasTex(1024,300,(x,w)=>{x.font='800 96px "Trebuchet MS",sans-serif';x.textAlign='center';x.textBaseline='middle';x.shadowColor='#ff7ac8';x.shadowBlur=40;const g=x.createLinearGradient(0,60,0,240);g.addColorStop(0,'#fff');g.addColorStop(1,'#ffb3e1');x.fillStyle=g;x.fillText('GUWD MORNING SAYANGKUU:',w/2,95);x.font='800 84px "Trebuchet MS",sans-serif';x.fillText('Maafin aku semalam yaa huhu',w/2,200)});
const endTxt=new THREE.Mesh(new THREE.PlaneGeometry(7,2.05),new THREE.MeshBasicMaterial({map:endTex,transparent:true,opacity:0,depthTest:false,fog:false}));endTxt.position.set(0,.3,-7);endTxt.renderOrder=9;cam.add(endTxt);
// kamera foto + tripod (3D)
const camProp=new THREE.Group(),cm=(geo,c,p,r)=>{const m=new THREE.Mesh(geo,M(c));m.position.set(p[0],p[1],p[2]);if(r)m.rotation.set(r[0],r[1],r[2]);camProp.add(m);return m};
cm(new THREE.CylinderGeometry(.04,.04,1,8),0x333344,[0,.5,0]);
[0,2.1,4.2].forEach(a=>cm(new THREE.CylinderGeometry(.025,.025,1.2,8),0x333344,[Math.sin(a)*.3,.55,Math.cos(a)*.3],[Math.cos(a)*.3,0,-Math.sin(a)*.3]));
cm(new THREE.BoxGeometry(.6,.4,.32),0x2a1450,[0,1.2,0]);cm(new THREE.BoxGeometry(.6,.1,.33),0xff7ac8,[0,1.43,0]);
cm(new THREE.CylinderGeometry(.15,.17,.28,20),0xffffff,[0,1.2,-.28],[Math.PI/2,0,0]);cm(new THREE.CylinderGeometry(.1,.1,.3,20),0x6ef2ff,[0,1.2,-.3],[Math.PI/2,0,0]);
const led=new THREE.Mesh(new THREE.SphereGeometry(.04,8,8),new THREE.MeshBasicMaterial({color:0xff2a4a}));led.position.set(.22,1.38,-.17);camProp.add(led);
camProp.position.set(0,0,3.4);camProp.visible=false;RL.G.add(camProp);
const parts=[];
function burst(p){const cols=[0xff7ac8,0x6ef2ff,0xffe27a,0xb084ff,0xffffff];for(let i=0;i<140;i++){const m=new THREE.Mesh(new THREE.OctahedronGeometry(.18+Math.random()*.15),new THREE.MeshBasicMaterial({color:cols[i%5]}));m.position.copy(p);parts.push({m,v:rndDir().multiplyScalar(5+Math.random()*9),l:2.2,g:6});D.G.add(m)}}
function heart(p,grp){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:hTex,transparent:true}));s.position.copy(p).add(new THREE.Vector3((Math.random()-.5)*1.6,Math.random(),(Math.random()-.5)*1.6));s.scale.setScalar(.5+Math.random()*.4);parts.push({m:s,v:new THREE.Vector3((Math.random()-.5)*.6,1+Math.random(),0),l:2.5,g:0,sprite:1});grp.add(s)}
// subtitle
let subT=0;
function say(l,dur){const w=WHO[l[0]],e=$('sub');e.firstChild.textContent=w[0]+':';e.firstChild.style.color=w[1];e.lastChild.textContent=l[1];show('sub',1);clearTimeout(subT);subT=setTimeout(()=>show('sub',0),(dur||Math.max(2.2,l[1].length*.055+.9))*1000)}
// input
const keys={};let jx=0,jy=0,jumpQ=0,actQ=0;
addEventListener('keydown',e=>{if(e.repeat)return;keys[e.code]=1;if(e.code=='Space'){jumpQ=1;e.preventDefault()}if(e.code=='KeyF'||e.code=='Enter')actQ=1});
addEventListener('keyup',e=>keys[e.code]=0);
const joy=$('joy'),knob=$('knob');let jid=null;
function jmove(e){const r=joy.getBoundingClientRect(),cx=r.left+65,cy=r.top+65;let dx=e.clientX-cx,dy=e.clientY-cy;const l=Math.hypot(dx,dy),m=55;if(l>m){dx*=m/l;dy*=m/l}knob.style.transform=`translate(${dx}px,${dy}px)`;jx=dx/m;jy=dy/m}
joy.addEventListener('pointerdown',e=>{jid=e.pointerId;joy.setPointerCapture(jid);jmove(e)});
joy.addEventListener('pointermove',e=>{if(e.pointerId==jid)jmove(e)});
const jend=e=>{if(e.pointerId==jid){jid=null;jx=jy=0;knob.style.transform=''}};joy.addEventListener('pointerup',jend);joy.addEventListener('pointercancel',jend);
$('btnJump').addEventListener('pointerdown',()=>jumpQ=1);$('btnAct').addEventListener('pointerdown',()=>actQ=1);
$('bMute').onclick=()=>{AU.on=!AU.on;$('bMute').textContent=AU.on?'🔊':'🔇'};
addEventListener('pointerdown',()=>{if(phase=='intro')actQ=1});
// state
const P={x:0,y:0,z:0,vy:0,ground:true,jumps:0,cp:D.plats[0],spin:0},S={};
const look=new THREE.Vector3(),clamp=(a,l,h)=>Math.max(l,Math.min(h,a)),ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,lp=(a,b,k)=>a+(b-a)*k;
let phase='title',pt=0,ts=1,sw=-1,swung=0,clk=0,hearts=0,snapNow=0,ph0=null,wasAir=false;
const at=(t,id,fn)=>{const k=phase+id;if(pt>=t&&!S[k]){S[k]=1;fn()}},once=(k,fn)=>{if(!S[k]){S[k]=1;fn()}};
function setPhase(p){phase=p;pt=0}
function camTo(pos,lk,k,dt){const a=1-Math.exp(-dt*k);cam.position.lerp(pos,a);look.lerp(lk,a);cam.lookAt(look)}
function turn(o,a,dt){let d=a-o.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));o.rotation.y+=d*Math.min(1,dt*12)}
function pose(c,sp,air,t){const w=Math.sin(t*14)*.9*sp;c.legL.rotation.x=w;c.legR.rotation.x=-w;c.armL.rotation.x=air?-2.6:-w*.8;c.armR.rotation.x=air?-2.6:w*.8;c.armL.rotation.z=air?.5:0;c.armR.rotation.z=air?-.5:0}
function scenery(env){const d=env=='d';D.G.visible=d;RL.G.visible=!d;
  if(d){scene.background=new THREE.Color(0x24104a);scene.fog=new THREE.Fog(0x6a2a8a,40,170)}else{scene.background=new THREE.Color(0x8fd8ff);scene.fog=new THREE.Fog(0xcfeeff,60,220)}}
function setMeter(v,love){$('mfill').style.width=(v*100)+'%';$('hud').classList.toggle('love',!!love);$('mlabel').textContent=love?'LOVE ❤':'RAGE'}
function flashNow(){const f=$('flash');f.style.transition='none';f.style.opacity=1;void f.offsetWidth;f.style.transition='opacity .7s';f.style.opacity=0}
function resetGame(){scenery('d');for(const k in S)delete S[k];D.G.add(girl.g,boy.g);girl.g.scale.setScalar(1);boy.g.scale.setScalar(.8);girl.g.rotation.set(0,0,0);girl.s.rotation.set(0,0,0);
  boy.g.position.set(0,1.8,-77.1);boy.g.rotation.set(-Math.PI/2,0,0);boy.legL.rotation.x=boy.legR.rotation.x=0;boy.head.rotation.set(0,0,0);girl.head.rotation.set(0,0,0);
  [boy,girl].forEach(c=>{c.armL.rotation.set(0,0,0);c.armR.rotation.set(0,0,0)});
  D.G.add(bubble);bubble.visible=true;Object.assign(P,{x:0,y:0,z:0,vy:0,cp:D.plats[0],jumps:0});
  hammer.visible=true;camProp.visible=false;endTxt.material.opacity=0;setMeter(0,false);
  ['choice','cursor','btnAct','end','toast','sub','count','hud','joy','btnJump','hint'].forEach(i=>show(i,0));$('photo').classList.remove('show');$('flash').style.opacity=0;sw=-1;swung=0;hearts=0;RL.sky.position.y=0}
function enterPlay(){const touch=matchMedia('(pointer:coarse)').matches;show('hud',1);show('joy',touch);show('btnJump',touch);show('hint',!touch);girl.g.rotation.y=Math.PI;girl.g.position.set(0,0,0);setPhase('play');say(STORY.start)}
$('bStart').onclick=()=>{AU.init();show('title',0);show('bMute',1);girl.g.rotation.y=0;setPhase('intro')};
$('bAgain').onclick=()=>{resetGame();show('title',1);phase='title'};
function toReal(){scenery('r');RL.G.add(girl.g,boy.g);
  girl.g.position.set(1.3,0,-1.2);girl.g.rotation.set(0,-Math.PI/2,0);girl.g.scale.setScalar(1);pose(girl,0,0,0);
  boy.g.scale.setScalar(1);boy.g.rotation.set(0,0,0);boy.g.position.set(-2,.42,-4.8);boy.legL.rotation.x=boy.legR.rotation.x=-1.45;boy.head.rotation.z=.35;
  cam.position.set(5,3.2,5);look.set(-1,1.4,-3);$('flash').style.opacity=0;['btnAct','joy','btnJump','hint'].forEach(i=>show(i,0))}
function forgive(){if(phase!='choice')return;show('choice',0);show('cursor',0);setPhase('apology');boy.head.rotation.z=0}
$('bForgive').onclick=forgive;
$('bPinch').onclick=()=>{const t=$('toast');t.textContent='Cubit... eh, kasihan. Maafkan saja 😄';show('toast',1);setTimeout(()=>{show('toast',0);forgive()},900)};
function startPhoto(){ph0={b:boy.g.position.clone(),g:girl.g.position.clone(),by:boy.g.rotation.y,gy:girl.g.rotation.y,cp:cam.position.clone()};camProp.visible=true;setPhase('photo')}
function snapSave(){const src=R.domElement,w=src.width,h=src.height,s=Math.min(w,h)*.85,cv=document.createElement('canvas');cv.width=cv.height=512;
  cv.getContext('2d').drawImage(src,(w-s)/2,(h-s)/2,s,s,0,0,512,512);$('pimg').src=cv.toDataURL('image/jpeg',.9);
  const m=RL.pol[0].material;m.map=canvasTex(256,310,(x,W)=>{x.fillStyle='#fff';x.fillRect(0,0,W,310);x.drawImage(cv,16,16,W-32,W-32);x.fillStyle='#8f5bff';x.font='italic 26px cursive';x.textAlign='center';x.fillText('Kita berdua 💕',W/2,282)});m.needsUpdate=true}
resetGame();
let last=performance.now();
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;clk+=dt;pt+=dt;const sdt=dt*ts;
  D.deco.forEach(m=>{m.rotation.y+=dt*.4*m.userData.s;m.position.y+=Math.sin(clk*m.userData.s+m.userData.p)*.01});
  zz.forEach(s=>{const k=(clk*.4+s.userData.o)%1;s.position.set(1.2+k*1.2,3.8+k*2.2,-78);s.scale.setScalar(.8+k);s.material.opacity=bubble.visible?1-k:0});
  parts.forEach(p=>{p.l-=sdt;p.m.position.addScaledVector(p.v,sdt);p.v.y-=p.g*sdt;if(p.sprite)p.m.material.opacity=Math.min(1,p.l);else p.m.scale.setScalar(Math.max(.01,p.l/2.2))});
  for(let i=parts.length-1;i>=0;i--)if(parts[i].l<=0){parts[i].m.parent.remove(parts[i].m);parts.splice(i,1)}
  RL.sky.children.forEach(c=>{if(c.userData.sp)c.position.x+=c.userData.sp*dt});
  RL.pol.forEach(m=>{m.position.y+=Math.sin(clk*.8+m.userData.p)*.01;m.rotation.z=Math.sin(clk*.7+m.userData.p)*.25;m.rotation.y=Math.sin(clk*.5+m.userData.p)*.4});
  if(phase=='title'){camTo(new THREE.Vector3(Math.sin(clk*.3)*8,4,8),new THREE.Vector3(0,1.5,-6),3,dt);girl.g.position.set(0,0,0);pose(girl,0,0,clk)}
  else if(phase=='intro'){
    camTo(new THREE.Vector3(Math.sin(pt*.35)*6,2.2,Math.cos(pt*.35)*6),new THREE.Vector3(0,1.3,0),3,dt);
    pose(girl,0,0,0);girl.armL.rotation.set(-.9,0,.6);girl.armR.rotation.set(-.9,0,-.6);girl.head.rotation.z=Math.sin(pt*2)*.08;
    at(.2,'a',()=>say(STORY.intro[0],3));at(3.4,'b',()=>say(STORY.intro[1],3));at(6.6,'c',()=>say(STORY.intro[2],3.4));
    if(pt>10.2||actQ){actQ=0;show('sub',0);girl.head.rotation.z=0;enterPlay()}
  }
  else if(phase=='play'){
    let ix=jx+(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0),iz=jy+(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0);
    const L=Math.hypot(ix,iz),mag=Math.min(1,L);if(L>.05){ix/=L;iz/=L}
    const sp=9*mag;P.x+=ix*sp*dt;P.z+=iz*sp*dt;
    if(mag>.1)turn(girl.g,Math.atan2(ix,iz),dt);
    if(jumpQ){jumpQ=0;if(P.ground){P.vy=12;P.jumps=1;P.ground=false;AU.jump();once('j1',()=>say(STORY.jump,1.2))}else if(P.jumps<2){P.vy=12;P.jumps=2;P.spin=1;AU.jump2();once('j2',()=>say(STORY.dbl,1.8))}}
    P.vy-=32*dt;P.y+=P.vy*dt;
    let best=-1e9,bp=null;D.plats.forEach(p=>{if(Math.abs(P.x-p.x)<p.hw&&Math.abs(P.z-p.z)<p.hd&&p.top<=P.y+.4&&p.top>best){best=p.top;bp=p}});
    if(P.vy<=0&&bp&&P.y<=best){if(wasAir)AU.land();P.y=best;P.vy=0;P.ground=true;P.jumps=0;P.cp=bp}else if(P.y>best+.05)P.ground=false;
    wasAir=!P.ground;
    if(P.y<-6&&!S.falling){S.falling=1;AU.fall();say(STORY.fall,1.6)}
    if(P.y<-18){P.x=P.cp.x;P.z=P.cp.z;P.y=P.cp.top+.2;P.vy=0;S.falling=0;say(STORY.fall2,2.6)}
    girl.g.position.set(P.x,P.y,P.z);pose(girl,mag,!P.ground,clk);
    if(P.spin>0){P.spin-=dt*2;girl.s.rotation.x=(1-Math.max(0,P.spin))*Math.PI*2}else girl.s.rotation.x=0;
    if(P.z<-22)once('f1',()=>say(STORY.far1));if(P.z<-48)once('f2',()=>say(STORY.far2));
    setMeter(clamp(-P.z/70,0,1));
    camTo(new THREE.Vector3(P.x*.7,P.y*.6+5,P.z+9.5),new THREE.Vector3(P.x*.7,P.y*.5+1.5,P.z-5),4,dt);
    if(bp&&bp.boss&&P.ground&&P.z<-69){setPhase('strike');setMeter(1);['joy','btnJump','hint'].forEach(i=>show(i,0))}
  }
  else if(phase=='strike'){
    const tgt=new THREE.Vector3(0,0,-73);
    if(pt<1.8){const d=tgt.clone().sub(girl.g.position);d.y=0;const l=d.length();if(l>.1){girl.g.position.addScaledVector(d,Math.min(1,9*dt/l));turn(girl.g,Math.atan2(d.x,d.z),dt);pose(girl,1,0,clk)}else{pose(girl,0,0,0);turn(girl.g,Math.PI,dt)}}
    else{pose(girl,0,0,0);girl.g.rotation.y=Math.PI;girl.g.position.copy(tgt)}
    camTo(new THREE.Vector3(9,3.5,-73),new THREE.Vector3(0,2,-76),2.5,dt);
    at(.6,'arr',()=>say(STORY.arrive));
    if(pt>1.8&&sw<0){show('btnAct',1);if(actQ||pt>7){actQ=0;sw=0;ts=.35;show('btnAct',0);say(STORY.hit,3)}}
    if(sw>=0){sw+=sdt;let a;
      if(sw<.7)a=-Math.PI*ease(sw/.7);else if(sw<.95)a=-Math.PI+(Math.PI-1.35)*ease((sw-.7)/.25);else a=-1.35;
      girl.armR.rotation.x=a;camTo(new THREE.Vector3(6,3,-72),new THREE.Vector3(0,2.2,-76),2,dt);
      if(sw>=.95&&!swung){swung=1;burst(bubble.position);bubble.visible=false;ts=1;AU.smash();AU.pop();$('flash').style.transition='opacity .9s';$('flash').style.opacity=1;setPhase('burst')}}
  }
  else if(phase=='burst'){ts=1;cam.position.x+=(Math.random()-.5)*.3;cam.position.y+=(Math.random()-.5)*.3;if(pt>1.1){toReal();setPhase('wake')}}
  else if(phase=='wake'){
    camTo(new THREE.Vector3(3+Math.sin(pt*.3),3,6.5),new THREE.Vector3(-1.5,1.4,-3),2,dt);
    at(1.2,'w1',()=>{AU.wake();say(STORY.wake1,2.2)});at(3.1,'w2',()=>say(STORY.wake2,2.6));
    if(pt>1.2){const k=clamp((pt-1.2)/.6,0,1);boy.g.position.y=.42+Math.sin(k*Math.PI)*1.2;boy.head.rotation.z=.35*(1-k);boy.s.rotation.z=Math.sin(k*Math.PI*6)*.08*(1-k)}
    if(pt>5.9){setPhase('choice');say(STORY.choice,3);show('choice',1);const c=$('cursor');show('cursor',1);c.style.transition='none';c.style.left='85%';c.style.top='96%';void c.offsetWidth;c.style.transition='';
      setTimeout(()=>{if(phase!='choice')return;const r=$('bForgive').getBoundingClientRect();c.style.left=(r.left+r.width*.6)+'px';c.style.top=(r.top+r.height*.5)+'px';$('bForgive').classList.add('go')},1500);
      setTimeout(forgive,3600)}
  }
  else if(phase=='choice'){camTo(new THREE.Vector3(3,3,6.5),new THREE.Vector3(-1.5,1.4,-3),2,dt)}
  else if(phase=='apology'){
    const B=new THREE.Vector3(.1,0,-1.2),Bs=new THREE.Vector3(-2,0,-3.8),k=clamp(pt/2.2,0,1),ctr=new THREE.Vector3(.7,1.4,-1.2),K=8.2;
    at(.2,'a1',()=>say(STORY.ap1));at(3.5,'a2',()=>say(STORY.ap2));at(5.6,'a3',()=>say(STORY.ap3));at(K+1.6,'a4',()=>say(STORY.ap4));
    if(pt<2.4){boy.g.position.lerpVectors(Bs,B,ease(k));boy.g.position.y=k<1?Math.abs(Math.sin(pt*9))*.12:0;turn(boy.g,k<1?Math.atan2(B.x-boy.g.position.x,B.z-boy.g.position.z):Math.PI/2,dt);pose(boy,k<1?.8:0,0,clk)}
    else{boy.g.position.set(.1+Math.min(.12,(pt-2.4)*.1),0,-1.2);turn(boy.g,Math.PI/2,dt);
      const h=clamp((pt-2.4)/.6,0,1);[boy,girl].forEach(c=>{c.armL.rotation.set(-1.1*h,0,.5*h);c.armR.rotation.set(-1.1*h,0,-.5*h)});hammer.visible=false;
      if(pt>K){at(K,'kiss',()=>AU.kiss());boy.head.rotation.set(.15,0,.15);girl.head.rotation.set(.15,0,-.15);if(Math.random()<.5)heart(ctr.clone().setY(2.2),RL.G);if(pt>K+.4&&!hearts){hearts=1;setMeter(1,true)}}}
    const ang=ease(clamp(pt/(K+5),0,1))*Math.PI*2+.6;cam.position.set(ctr.x+Math.sin(ang)*5.2,2.4+Math.sin(pt)*.2,ctr.z+Math.cos(ang)*5.2);look.copy(ctr);cam.lookAt(look);
    if(pt>K+5)startPhoto();
  }
  else if(phase=='photo'){
    const k=ease(clamp(pt/1.4,0,1)),W=new THREE.Vector3(0,1.9,6.8),C=new THREE.Vector3(0,1.55,1.0);
    boy.g.position.set(lp(ph0.b.x,-.42,k),0,-1.2);girl.g.position.set(lp(ph0.g.x,.42,k),0,-1.2);
    boy.g.rotation.y=lp(ph0.by,0,k);girl.g.rotation.y=lp(ph0.gy,0,k);
    boy.armL.rotation.set(lp(-1.1,0,k),0,lp(.5,-2.6,k));boy.armR.rotation.set(lp(-1.1,0,k),0,lp(-.5,1.1,k));
    girl.armL.rotation.set(lp(-1.1,0,k),0,lp(.5,-1.1,k));girl.armR.rotation.set(lp(-1.1,0,k),0,lp(-.5,2.6,k));
    boy.head.rotation.set(lp(.15,0,k),0,lp(.15,-.2,k));girl.head.rotation.set(lp(.15,0,k),0,lp(-.15,.2,k));
    if(pt<2.2){const q=ease(pt/2.2);cam.position.lerpVectors(ph0.cp,W,q);look.set(lp(.7,0,q),1.4,-1.2)}
    else{const q=ease(clamp((pt-2.2)/1.5,0,1));cam.position.lerpVectors(W,C,q);look.set(0,lp(1.4,1.3,q),-1.2)}
    cam.lookAt(look);led.visible=Math.sin(clk*(pt>3.8?22:5))>0;if(pt<3&&Math.random()<.12)heart(new THREE.Vector3(0,2.2,-1.2),RL.G);
    at(.2,'p1',()=>say(STORY.ph1));at(2.6,'p2',()=>say(STORY.ph2,2));
    [[3.9,3],[4.6,2],[5.3,1]].forEach(([t,n])=>at(t,'c'+n,()=>{const c=$('count');c.textContent=n;show('count',1);c.style.animation='none';void c.offsetWidth;c.style.animation='';AU.beep()}));
    at(6,'shot',()=>{show('count',0);flashNow();AU.shutter();snapNow=1});
    at(6.7,'card',()=>{$('photo').classList.add('show');say(STORY.ph3,2.4)});at(8.4,'p4',()=>say(STORY.ph4,2));
    at(10,'out',()=>{$('photo').classList.remove('show');show('hud',0);camProp.visible=false;setPhase('outro')});
  }
  else if(phase=='outro'){
    const k=ease(clamp(pt/6.5,0,1));
    cam.position.set(0,1.55+k*60,1+k*3);look.set(0,1.3+k*70,-1.2-k*8);cam.lookAt(look);
    at(.8,'end',()=>{AU.twinkle();say(STORY.end,3.4)});
    if(pt>3.5&&pt<10){endTxt.material.opacity=Math.min(1,(pt-3.5)/1.5);endTxt.rotation.y=Math.sin(clk*1.2)*.12;endTxt.position.y=.3+Math.sin(clk*1.5)*.12}
    if(pt>9.5)endTxt.material.opacity=Math.max(0,1-(pt-9.5)/2);
    if(pt>12){setPhase('end');show('end',1)}
  }
  actQ=0;R.render(scene,cam);
  if(snapNow){snapNow=0;snapSave()}
}
requestAnimationFrame(loop);
})();
