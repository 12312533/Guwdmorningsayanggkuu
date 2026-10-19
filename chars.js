// Karakter 3D dibuat dari geometri (tanpa file model) -> bisa jalan offline
const M=(c,o)=>new THREE.MeshToonMaterial(Object.assign({color:c},o||{}));
function makeChar(o){
  const g=new THREE.Group(),s=new THREE.Group();g.add(s);
  const sp=new THREE.SphereGeometry(1,24,16);
  const mk=(geo,col,p,par,sc)=>{const m=new THREE.Mesh(geo,M(col));m.position.set(p[0],p[1],p[2]);if(sc)m.scale.set(sc[0],sc[1],sc[2]);(par||s).add(m);return m};
  mk(new THREE.CylinderGeometry(.35,o.girl?.5:.42,.8,18),o.top,[0,.95,0]);
  if(o.girl)mk(new THREE.CylinderGeometry(.3,.75,.45,20),o.bottom,[0,.55,0]);
  const head=new THREE.Group();head.position.y=1.65;s.add(head);
  mk(sp,o.skin,[0,0,0],head,[.58,.55,.55]);
  mk(sp,o.hair,[0,.08,-.08],head,[.63,.6,.6]);
  mk(sp,o.hair,[0,.3,.05],head,[.6,.28,.58]);
  if(o.girl)[-1,1].forEach(x=>mk(sp,o.hair,[x*.62,-.1,-.1],head,[.2,.4,.2]));
  mk(sp,0xd9506a,[0,-.2,.52],head,[.1,.04,.03]);
  [-1,1].forEach(x=>{mk(sp,0x2a1450,[x*.2,-.02,.5],head,[.07,.1,.05]);mk(sp,0xff9db8,[x*.33,-.17,.46],head,[.1,.06,.03]);});
  const arm=x=>{const p=new THREE.Group();p.position.set(x*.5,1.3,0);s.add(p);mk(new THREE.CylinderGeometry(.09,.09,.6,10),o.top,[0,-.3,0],p);mk(sp,o.skin,[0,-.65,0],p,[.11,.11,.11]);return p};
  const leg=x=>{const p=new THREE.Group();p.position.set(x*.17,.5,0);s.add(p);mk(new THREE.CylinderGeometry(.1,.1,.5,10),o.legs||o.skin,[0,-.25,0],p);mk(sp,o.shoe,[0,-.52,.05],p,[.14,.1,.2]);return p};
  return{g,s,head,armL:arm(-1),armR:arm(1),legL:leg(-1),legR:leg(1)};
}
const makeGirl=()=>makeChar({girl:1,skin:0xffd9c4,hair:0x7a3cff,top:0xff7ac8,bottom:0xffd6f0,shoe:0xffffff});
const makeBoy=()=>makeChar({skin:0xffd0b5,hair:0x3a2a22,top:0x5aa8ff,legs:0x33406e,shoe:0xffffff});
function makeHammer(){
  const h=new THREE.Group(),c=(a,b,l,col,p,r)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(a,b,l,16),M(col));m.position.set(p[0],p[1],p[2]);if(r)m.rotation.z=r;h.add(m);return m};
  c(.09,.09,2,0xffe27a,[0,-1,0]);
  c(.5,.5,1.5,0xff7ac8,[0,-2.1,0],Math.PI/2);
  [-1,1].forEach(x=>c(.56,.56,.25,0xffe27a,[x*.8,-2.1,0],Math.PI/2));
  const st=new THREE.Mesh(new THREE.SphereGeometry(.14,10,8),M(0xffffff));st.position.set(0,0,0);h.add(st);
  return h;
}
function canvasTex(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return new THREE.CanvasTexture(c)}

// Three.js r128 belum punya Vector3.randomDirection, jadi dibuat sendiri
function rndDir(){const u=Math.random()*2-1,a=Math.random()*Math.PI*2,r=Math.sqrt(1-u*u);return new THREE.Vector3(r*Math.cos(a),u,r*Math.sin(a))}
