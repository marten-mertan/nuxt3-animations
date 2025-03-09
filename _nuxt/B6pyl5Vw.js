var S=Object.defineProperty;var $=(l,n,e)=>n in l?S(l,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[n]=e;var m=(l,n,e)=>$(l,typeof n!="symbol"?n+"":n,e);import{r as h,g as y,j as w,k as A,c as k,o as F,n as v,l as d,a as p,_,m as x,b as D,p as g}from"./8mN42V6P.js";function b(){const l=new Map;class n{constructor(t){m(this,"element");m(this,"spriteSheet");m(this,"frameWidth");m(this,"frameHeight");m(this,"frameCount");m(this,"frameDuration");m(this,"animationName");m(this,"onStart");m(this,"onComplete");m(this,"currentFrame",h(0));m(this,"isAnimating",h(!1));m(this,"isLooping",h(!1));m(this,"animationFrameId",null);m(this,"lastFrameTime",0);this.element=t.element,this.spriteSheet=t.spriteSheet,this.frameWidth=t.frameWidth,this.frameHeight=t.frameHeight,this.frameCount=t.frameCount,this.frameDuration=t.frameDuration,this.animationName=t.animationName,this.onStart=t.onStart||(()=>{}),this.onComplete=t.onComplete||(()=>{}),this.initStyles()}initStyles(){Object.assign(this.element.style,{width:`${this.frameWidth}px`,height:`${this.frameHeight}px`,backgroundRepeat:"no-repeat",position:"relative"})}updateFrame(){this.element.style.backgroundImage=`url(${this.spriteSheet})`,this.element.style.backgroundSize=`${this.frameWidth*this.frameCount}px ${this.frameHeight}px`;const t=-(this.currentFrame.value*this.frameWidth);this.element.style.backgroundPosition=`${t}px 0px`}animate(t){if(this.lastFrameTime||(this.lastFrameTime=t),t-this.lastFrameTime>=this.frameDuration&&(this.currentFrame.value=(this.currentFrame.value+1)%this.frameCount,this.updateFrame(),this.lastFrameTime=t,this.currentFrame.value===0&&!this.isLooping.value)){this.stop(),this.onComplete(this.animationName),this.isAnimating.value=!1;return}this.isAnimating.value&&(this.animationFrameId=requestAnimationFrame(i=>this.animate(i)))}async play(t=!1){if(!this.isAnimating.value&&(this.isAnimating.value=!0,this.isLooping.value=t,this.currentFrame.value=0,this.lastFrameTime=0,this.onStart(this.animationName),this.updateFrame(),this.animationFrameId=requestAnimationFrame(u=>this.animate(u)),!t))return new Promise(u=>{const i=()=>{this.isAnimating.value?requestAnimationFrame(i):(this.onComplete(this.animationName),u())};i()})}stop(){this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.isAnimating.value=!1,this.isLooping.value=!1}}return{addAnimation:(e,t)=>{l.set(e,new n({animationName:e,...t}))},playAnimation:async(e,t=!1)=>{const u=l.get(e);if(!u)throw new Error(`Animation ${e} not found`);await u.play(t)},stopAnimation:e=>{const t=l.get(e);t&&t.stop()}}}const W=y({__name:"spriteAnimator",props:{animations:{},positionStyle:{},isFacingRight:{type:Boolean}},setup(l,{expose:n}){const e=l,t=h(null),{addAnimation:u,playAnimation:i,stopAnimation:a}=b(),r=w(()=>({transform:`scaleX(${e.isFacingRight?-1:1})`})),s=()=>{e.animations.forEach(o=>{const f=new Image;f.src=o.spriteSheet})};return A(()=>{s(),t.value&&(e.animations.forEach(o=>{u(o.name,{element:t.value,spriteSheet:o.spriteSheet,frameWidth:o.frameWidth,frameHeight:o.frameHeight,frameCount:o.frameCount,frameDuration:o.frameDuration,onStart:f=>f!=="idle"&&a("idle"),onComplete:f=>f!=="idle"&&i("idle",!0)})}),i("idle",!0))}),n({playAnimation:i,stopAnimation:a}),(o,f)=>(F(),k("div",{class:d(o.$style.AnimationSpriteAnimator),style:v(e.positionStyle)},[p("div",{ref_key:"spriteElement",ref:t,class:d(o.$style.sprite),style:v(r.value)},null,6)],6))}}),I="_AnimationSpriteAnimator_1x9v7_7",H="_sprite_1x9v7_14",N={AnimationSpriteAnimator:I,sprite:H},L={$style:N},M=_(W,[["__cssModules",L]]);function R({initialX:l=368,initialY:n=236,gridSize:e=64,speed:t=1,boundaries:u={width:800,height:600}}={}){const i=h(l),a=h(n),r=h(!1),s=h(!1),o=w(()=>({transform:`translate(${i.value}px, ${a.value}px)`,transition:"transform 600ms linear"}));return{x:i,y:a,isFacingRight:r,isMoving:s,positionStyle:o,move:C=>{if(s.value)return null;s.value=!0;let c="";switch(C){case"w":a.value-e*t>=0&&(a.value-=e*t,c="walkUp");break;case"s":a.value+e*t<=u.height-e&&(a.value+=e*t,c="walkDown");break;case"a":i.value-e*t>=0&&(i.value-=e*t,c="walkLeft",r.value=!1);break;case"d":i.value+e*t<=u.width-e&&(i.value+=e*t,c="walkRight",r.value=!0);break;default:return s.value=!1,null}return setTimeout(()=>s.value=!1,600),{animationName:c}}}}const E=y({__name:"index",setup(l){const n=h(),e=R(),t=async i=>{var r,s;const a=e.move(i);console.log("Move result:",a),a&&(console.log("Playing animation:",a.animationName),await((r=n.value)==null?void 0:r.playAnimation(a.animationName)),console.log("Animation finished, returning to idle"),await((s=n.value)==null?void 0:s.playAnimation("idle",!0)))},u=()=>{var i,a,r,s,o;(i=n.value)==null||i.stopAnimation("walkUp"),(a=n.value)==null||a.stopAnimation("walkDown"),(r=n.value)==null||r.stopAnimation("walkLeft"),(s=n.value)==null||s.stopAnimation("walkRight"),(o=n.value)==null||o.playAnimation("idle",!0)};return A(()=>{const i={KeyW:"w",KeyA:"a",KeyS:"s",KeyD:"d"},a=r=>{const s=r.code,o=s in i?i[s]:void 0;o&&(r.preventDefault(),t(o))};window.addEventListener("keydown",a),x(()=>window.removeEventListener("keydown",a))}),(i,a)=>{const r=M;return F(),k("div",{class:d(i.$style.IndexPage)},[D(r,{ref_key:"animator",ref:n,animations:[{name:"idle",spriteSheet:"img/idle.png",frameWidth:64,frameHeight:128,frameCount:10,frameDuration:100},{name:"walkUp",spriteSheet:"img/walk.png",frameWidth:64,frameHeight:128,frameCount:6,frameDuration:100},{name:"walkDown",spriteSheet:"img/walk.png",frameWidth:64,frameHeight:128,frameCount:6,frameDuration:100},{name:"walkLeft",spriteSheet:"img/walk.png",frameWidth:64,frameHeight:128,frameCount:6,frameDuration:100},{name:"walkRight",spriteSheet:"img/walk.png",frameWidth:64,frameHeight:128,frameCount:6,frameDuration:100}],"position-style":g(e).positionStyle.value,"is-facing-right":g(e).isFacingRight.value},null,8,["position-style","is-facing-right"]),p("div",{class:d(i.$style.controls)},[p("button",{onClick:a[0]||(a[0]=s=>t("w"))}," Up "),p("button",{onClick:a[1]||(a[1]=s=>t("a"))}," Left "),p("button",{onClick:a[2]||(a[2]=s=>t("s"))}," Down "),p("button",{onClick:a[3]||(a[3]=s=>t("d"))}," Right "),p("button",{onClick:u}," Stop ")],2)],2)}}}),P="_IndexPage_13r1c_7",T="_controls_13r1c_16",K={IndexPage:P,controls:T},U={$style:K},j=_(E,[["__cssModules",U]]);export{j as default};
