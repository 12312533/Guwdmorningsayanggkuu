function mkLights(grp,sky,gnd,sun,sc,pos){
  grp.add(new THREE.HemisphereLight(sky,gnd,.9));
  const d=new THREE.DirectionalLight(sun,sc);d.position.set(pos[0],pos[1],pos[2]);grp.add(d);
}
function buildDream(){
  const G=new THREE.Group(),plats=[];
  mkLights(G,0xffb0ff,0x4a2a9a,0xffd0ff,1.1,[-5,10,8]);
  const pl=new THREE.PointLight(0x6ef2ff,1.2,60);pl.position.set(0,6,-30);G.add(pl);
  // bintang & bulan
  const sg=new THREE.BufferGeometry(),sa=[];for(let i=0;i<900;i++){const v=rndDir().multiplyScalar(180);if(v.y<-20)v.y=-v.y;sa.push(v.x,v.y,v.z)}
  sg.setAttribute('position',new THREE.Float32BufferAttribute(sa,3));
  G.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:.9,fog:false})));
  const moon=new THREE.Mesh(new THREE.SphereGeometry(16,32,24),new THREE.MeshBasicMaterial({color:0xffc2ee,fog:false}));moon.position.set(-60,55,-150);G.add(moon);
  // pulau awal
  const island=(x,z,r,y)=>{const m=new THREE.Group();m.position.set(x,y||0,z);
    const top=new THREE.Mesh(new THREE.CylinderGeometry(r,r*.9,.8,32),M(0xff9be0));top.position.y=-.4;m.add(top);
    const rock=new THREE.Mesh(new THREE.ConeGeometry(r*.9,r*1.4,8),M(0x6a3cc0));rock.rotation.x=Math.PI;rock.position.y=-1.5-r*.7;m.add(rock);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(r*.95,.08,8,48),new THREE.MeshBasicMaterial({color:0x6ef2ff}));ring.rotation.x=Math.PI/2;ring.position.y=.02;m.add(ring);G.add(m);return m};
  island(0,0,5,0);plats.push({x:0,z:0,hw:5,hd:5,top:0});
  island(0,-78,11,0);plats.push({x:0,z:-78,hw:10,hd:10,top:0,boss:1});
  // platform rintangan = ikon digital raksasa
  for(let i=1;i<=9;i++){
    const x=(i%2?1:-1)*(i%3)*1.6,z=-5-i*6.5,y=((i*37)%5-2)*.35,k=i%3,m=new THREE.Group();m.position.set(x,y,z);
    if(k==0){ // tombol UI
      const b=new THREE.Mesh(new THREE.CylinderGeometry(1.9,1.9,.7,28),M(0x6ef2ff));b.position.y=-.35;m.add(b);
      const t=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.5,.15,28),new THREE.MeshBasicMaterial({color:0xffffff}));t.position.y=.05;m.add(t);
    }else if(k==1){ // wireframe
      const b=new THREE.Mesh(new THREE.BoxGeometry(3.8,.7,3.8),M(0xb084ff));b.position.y=-.35;m.add(b);
      const e=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(3.8,3.8,3.8)),new THREE.LineBasicMaterial({color:0x6ef2ff}));e.position.y=-1.5;m.add(e);
    }else{ // jam weker terbang
      const b=new THREE.Mesh(new THREE.CylinderGeometry(1.9,1.9,.7,32),M(0xffe27a));b.position.y=-.35;m.add(b);
      const hd=new THREE.Mesh(new THREE.BoxGeometry(.12,.05,1.2),M(0x2a1450));hd.position.set(0,.05,-.5);m.add(hd);
      const hd2=hd.clone();hd2.rotation.y=1.3;hd2.scale.z=.7;hd2.position.set(.35,.05,-.1);m.add(hd2);
      [-1,1].forEach(s=>{const bell=new THREE.Mesh(new THREE.SphereGeometry(.5,12,8,0,Math.PI*2,0,Math.PI/2),M(0xff7ac8));bell.position.set(s*1.2,.0,1.3);bell.rotation.z=s*.4;m.add(bell)});
    }
    G.add(m);plats.push({x,z,hw:1.9,hd:1.9,top:y});
  }
  // dekor melayang
  const deco=[];
  for(let i=0;i<26;i++){
    const t=i%3,col=[0xff7ac8,0x6ef2ff,0xffe27a][t],geo=[new THREE.BoxGeometry(2,2,2),new THREE.TorusGeometry(1.2,.35,10,24),new THREE.OctahedronGeometry(1.4)][t];
    const m=new THREE.Mesh(geo,t==0?new THREE.MeshBasicMaterial({color:col,wireframe:true}):M(col));
    const side=i%2?1:-1;m.position.set(side*(12+Math.random()*22),Math.random()*24-6,-Math.random()*95);m.userData.s=Math.random()*2+1;m.userData.p=Math.random()*6;G.add(m);deco.push(m);
  }
  for(let i=0;i<8;i++){ // jam weker besar melayang
    const c=new THREE.Group(),r=2.2;c.add(new THREE.Mesh(new THREE.TorusGeometry(r,.35,12,32),M(0xff7ac8)));
    const f=new THREE.Mesh(new THREE.CircleGeometry(r,32),M(0xfff4c2));f.position.z=.05;c.add(f);
    [-1,1].forEach(s=>{const b=new THREE.Mesh(new THREE.SphereGeometry(.6,12,8),M(0x6ef2ff));b.position.set(s*1.6,2.1,0);c.add(b)});
    c.position.set((i%2?1:-1)*(9+Math.random()*6),4+Math.random()*10,-8-i*11);c.userData.s=1;c.userData.p=i;G.add(c);deco.push(c);
  }
  return{G,plats,deco};
}
function buildReal(){
  const G=new THREE.Group();
  mkLights(G,0xfff0d0,0xc08a5a,0xffb35a,1.6,[10,6,6]);
  const bx=(w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);G.add(m);return m};
  bx(16,.5,13,0xe0b080,0,-.25,-1);bx(7,.05,5,0xff9bb8,1,.03,-1.5);
  bx(16,8,.4,0xfff0dc,0,4,-7);bx(.4,8,13,0xffe6cc,-8,4,-1);
  const win=bx(5,3.4,.1,0xffe9a8,3.2,4,-6.75);win.material=new THREE.MeshBasicMaterial({color:0xfff2b8});
  bx(5.4,.25,.25,0xffffff,3.2,5.8,-6.7);bx(5.4,.25,.25,0xffffff,3.2,2.2,-6.7);
  // sofa
  bx(5,.8,1.9,0xff8fa8,-2,.4,-4.8);bx(5,1.5,.5,0xff7a98,-2,1.3,-5.55);bx(.5,1.2,1.9,0xff7a98,-4.5,.8,-4.8);bx(.5,1.2,1.9,0xff7a98,.5,.8,-4.8);
  bx(1,.6,1,0xffffff,-3.4,1.1,-5);
  // meja, lampu, tanaman, bingkai
  bx(2,.15,1.2,0xc08a5a,3,.7,-3);[-.8,.8].forEach(x=>bx(.15,.7,.15,0x8a5a3a,3+x,.35,-3));
  bx(.1,2.6,.1,0x555555,6.2,1.3,-5);const lamp=new THREE.Mesh(new THREE.ConeGeometry(.6,.8,16,1,true),M(0xfff0a0,{side:2}));lamp.position.set(6.2,2.9,-5);G.add(lamp);
  const pot=new THREE.Mesh(new THREE.CylinderGeometry(.4,.3,.6,12),M(0xd96a4a));pot.position.set(-6.5,.3,-5.5);G.add(pot);
  for(let i=0;i<6;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(.4,10,8),M(0x5fd08a));l.scale.y=1.6;l.position.set(-6.5+Math.cos(i)*.35,1.2+i*.05,-5.5+Math.sin(i)*.35);l.rotation.z=Math.cos(i)*.5;G.add(l)}
  [[-4,4.8],[-1.5,4.5]].forEach(([x,y],i)=>bx(1.4,1.1,.1,[0xff9be0,0x9bd8ff][i],x,y,-6.75));
  // langit: awan & polaroid
  const sky=new THREE.Group();G.add(sky);
  const cloud=()=>{const c=new THREE.Group();for(let i=0;i<7;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(1,14,10),new THREE.MeshLambertMaterial({color:0xffffff}));const r=1.6+Math.random()*1.6;s.scale.setScalar(r);s.position.set((i-3)*1.7,Math.sin(i*1.7)*.8,Math.random());c.add(s)}return c};
  for(let i=0;i<34;i++){const c=cloud();c.position.set((Math.random()-.5)*90,14+Math.random()*70,-8-Math.random()*45);c.scale.setScalar(.9+Math.random()*1.4);c.userData.sp=.3+Math.random()*.5;sky.add(c)}
  const sun=new THREE.Mesh(new THREE.SphereGeometry(7,24,16),new THREE.MeshBasicMaterial({color:0xfff3a0,fog:false}));sun.position.set(35,70,-90);sky.add(sun);
  const em=['🍰','😴','💕','🔨','🌙','🎮'],bg=['#ffd6e8','#d6e8ff','#ffe9b8','#e0d6ff','#d6fff0','#ffd6d6'],pol=[];
  for(let i=0;i<6;i++){
    const tex=canvasTex(256,310,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle=bg[i];x.fillRect(16,16,w-32,w-32);x.font='120px serif';x.textAlign='center';x.textBaseline='middle';x.fillText(em[i],w/2,w/2);x.fillStyle='#8f5bff';x.font='italic 26px cursive';x.fillText(['Kue pertamamu','Tidur nyenyak','Cinta','Hukuman manis','Malam itu','Main bareng'][i],w/2,h-28)});
    const m=new THREE.Mesh(new THREE.PlaneGeometry(2.6,3.15),new THREE.MeshBasicMaterial({map:tex,side:2}));
    m.position.set((i%2?1:-1)*(2.5+Math.random()*3.5),20+i*7,-2-Math.random()*5);m.userData.p=i;sky.add(m);pol.push(m);
  }
  return{G,sky,pol};
}
