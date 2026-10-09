/* ===== MENSAJES DE LO ALTO (gratis) + CREACIÓN DE CONTENIDO (Elevado) ===== */
CONFIG.xp.mensaje=10;CONFIG.xp.contenido=15;
TABS[3][3].push(["diario/mensajes","Mensajes de lo Alto"]);
TABS[6][3].push(["elevado/contenido","Contenido"]);
const MENSAJES=[
"Hoy no tienes que entenderlo todo. Solo da el paso que sí puedes ver.",
"Lo que pediste ya está en camino. Mantén tu energía limpia para recibirlo.",
"Estás más cerca de lo que crees. Lo que parecía retraso era preparación.",
"Suelta lo que ya cumplió su ciclo. Tus manos necesitan estar libres para lo nuevo.",
"Tu paz no es negociable. Hoy elígela, aunque el mundo haga ruido.",
"No estás empezando de cero. Estás empezando desde todo lo que ya aprendiste.",
"Confía en el proceso, pero muévete. La señal llega a quien camina.",
"Hay una versión de ti que ya lo logró. Hoy actúa como ella.",
"Lo que te hirió no define tu luz. Define tu profundidad.",
"Descansa sin culpa. Hasta la luna se retira para volver completa.",
"Tu intuición lleva días hablándote. Hoy escucha sin discutirle.",
"No todo lo que se va es pérdida. Algunas puertas se cierran para protegerte.",
"Eres merecedora antes de lograr nada. Eso no se gana, se recuerda.",
"Tu energía es sagrada. Cuida con quién y en qué la gastas.",
"Hoy una pequeña acción vale más que mil planes perfectos.",
"El universo responde a tu claridad. Sé específica con lo que quieres.",
"Lo que sientes es válido, pero no tiene que gobernarte. Respira y elige.",
"Perdónate por no saberlo antes. Hoy lo sabes, y eso basta.",
"Tu historia no terminó. Esta es solo una página difícil.",
"Cuando te elijas a ti, las personas correctas sabrán dónde encontrarte.",
"Hoy suelta la prisa. Lo que es tuyo no se pierde en el camino.",
"Tu sensibilidad no es debilidad. Es tu forma de percibir lo que otros no ven.",
"Agradece lo que ya llegó. La gratitud abre espacio para más.",
"No te encojas para que otros se sientan cómodos. Brilla con calma.",
"Hay fuerzas que te acompañan aunque no las veas. No caminas sola.",
"Cada vez que cumples contigo, tu alma lo registra. Sigue.",
"Lo que repites en silencio se vuelve tu realidad. Cuida tus palabras contigo.",
"Hoy permítete sentir alegría sin esperar a que pase algo malo.",
"La respuesta que buscas aparece cuando dejas de forzarla. Haz silencio un momento.",
"Estás en constante cambio, y eso no es inestabilidad: es evolución."];
function mensajeDe(off=0){const n=MENSAJES.length;return MENSAJES[(((dnum()-off)%n)+n)%n];}
function mensajeHoyCard(){const t=T(),op=!!lazy("mensajes",{})[t];
 return `<a class="letter ${op?"open":""}" style="--i:3" href="${href("diario/mensajes")}"><span class="env"></span><span style="flex:1"><b>${op?"Tu mensaje de lo Alto de hoy":"✨ Tienes un mensaje de lo Alto"}</b><small>${op?"Vuelve a leerlo":"Canalizado para ti · cambia cada día"}</small></span><span>${op?"→":"›"}</span></a>`;}
function mensajes(){const t=T(),M=lazy("mensajes",{}),op=!!M[t],m=mensajeDe();
 const past=[1,2,3,4,5,6].map(i=>[add(t,-i),mensajeDe(i)]).filter(([d])=>M[d]);
 return head(fdate(t),"Mensajes de lo <span class=grad>Alto</span>","Un mensaje canalizado para ti, cada día. Gratis, siempre.")+`<section style="padding-bottom:40px"><div class="wrap narrow anim">
 ${op?`<div class="tile peach" style="--i:0"><p class="eyebrow">✨ Mensaje canalizado · ${fdate(t,{day:"numeric",month:"long"})}</p><div class="paper" style="margin-top:12px;font-size:21px">${esc(m)}</div><div class="row" style="flex-wrap:wrap;margin-top:16px"><button class="btn or" data-msg="diario">Guardar en mi diario</button><button class="btn lt" data-msg="tarea">Convertirlo en intención de hoy</button></div></div>`
 :`<button class="tile peach" style="--i:0;width:100%;border:0;text-align:center;padding:48px 24px" data-msg="abrir"><div style="display:grid;place-items:center">${chispaSVG({size:96,mood:"calma",level:lvl(),live:true})}</div><p class="h-m" style="margin:14px 0 6px">Tu mensaje de hoy te espera</p><p class="muted" style="margin:0 0 16px">Respira hondo, pon la intención y ábrelo.</p><span class="btn or">Abrir mensaje · +${CONFIG.xp.mensaje} XP</span></button>`}
 ${past.length?`<div class="tile" style="--i:1;margin-top:14px"><h2 class="h-s" style="margin-bottom:8px">Mensajes anteriores</h2>${past.map(([d,x])=>`<div class="entry"><span class="tiny">${fdate(d,{weekday:"long",day:"numeric",month:"long"})}</span><p>${esc(x)}</p></div>`).join("")}</div>`:""}
 <p class="disclaimer" style="margin-top:16px">Estos mensajes son de carácter espiritual e inspiracional. No son predicciones y no sustituyen el consejo médico, psicológico, legal ni financiero.</p></div></section>`;}
function contenido(){if(!elev())return lockPage("🎬","Creación de contenido","Define tus metas de publicación, tus pilares de contenido y tu calendario. Todo conectado con tus rachas y tu XP.");
 const C=lazy("cont",{ppw:4,seg:0,segMeta:0,pilares:[],posts:[]}),t=T(),wd=weekDays(),hechas=C.posts.filter(p=>p.done&&wd.includes(p.doneAt)).length,pend=C.posts.filter(p=>!p.done).sort((a,b)=>(a.d||"9")<(b.d||"9")?-1:1),fin=C.posts.filter(p=>p.done).slice(-8).reverse();
 const sp=C.segMeta?Math.min(100,C.seg/C.segMeta*100):0;
 return head("","Creación de contenido","Tus metas, tus pilares y tu calendario en un solo lugar.",`<button class="btn" data-cont="nuevo">${IC.mas}Nueva publicación</button>`)+`<section style="padding-bottom:40px"><div class="wrap anim">
 <div class="g2" style="--i:0;margin-bottom:20px"><div class="tile"><p class="eyebrow">Meta semanal</p><div class="row" style="gap:18px;margin-top:6px">${ring("cw",hechas/C.ppw*100,96,9,`<b style="font-size:20px">${hechas}/${C.ppw}</b>`)}<div><p style="margin:0;font-weight:600">${hechas>=C.ppw?"¡Meta cumplida! 🎉":"Te faltan "+(C.ppw-hechas)}</p><p class="tiny" style="margin:4px 0 10px">publicaciones esta semana</p><button class="btn sm lt" data-cont="meta">Editar metas</button></div></div></div>
 <div class="tile"><p class="eyebrow">Meta de seguidores</p><p class="big" style="margin:6px 0 10px">${C.seg.toLocaleString("es")}<span class="muted" style="font-size:20px"> / ${C.segMeta?C.segMeta.toLocaleString("es"):"—"}</span></p>${bar("cs",sp)}</div></div>
 <div class="tile" style="--i:1;margin-bottom:20px"><h2 class="h-s">Mis pilares de contenido</h2><p class="tiny" style="margin:2px 0 12px">Los 3 o 4 temas de los que siempre hablas.</p><div class="chips" style="margin-bottom:12px">${C.pilares.map((p,i)=>`<button class="chip" data-cont="quitarPilar" data-i="${i}">${esc(p)} ✕</button>`).join("")||`<span class="tiny">Aún no defines pilares.</span>`}</div><div class="qadd"><input id="cpIn" placeholder="Ej.: Crecimiento personal"><button class="btn sm" data-cont="pilar">Agregar</button></div></div>
 <div class="tile" style="--i:2"><h2 class="h-s" style="margin-bottom:8px">Calendario de publicaciones</h2>${pend.length?pend.map(p=>`<div class="trow"><button class="tcb" data-cont="hecho" data-id="${p.id}" aria-pressed="false" aria-label="Marcar publicada"></button><div class="tt"><b>${esc(p.t)}</b><small>${[p.fmt,p.pilar,p.d?(p.d<t?"Vencida · ":"")+fdate(p.d,{weekday:"short",day:"numeric",month:"short"}):""].filter(Boolean).map(esc).join(" · ")}</small></div><div class="acts" style="opacity:1"><button class="ib" data-cont="borrar" data-id="${p.id}" aria-label="Eliminar">${IC.basura}</button></div></div>`).join(""):`<div class="empty"><span class="e">🎬</span>Planea tu primera publicación.</div>`}
 ${fin.length?`<div class="sep"></div><p class="tiny">Publicadas recientemente</p>${fin.map(p=>`<div class="trow done"><span class="tcb" aria-pressed="true"></span><div class="tt"><b>${esc(p.t)}</b></div></div>`).join("")}`:""}</div></div></section>`;}
document.addEventListener("click",e=>{const b=e.target.closest("[data-msg],[data-cont]");if(!b)return;const t=T();
 if(b.dataset.msg){const k=b.dataset.msg,M=lazy("mensajes",{});
  if(k==="abrir"){M[t]=1;xp(CONFIG.xp.mensaje,"reflexion",b,"✨ Mensaje de lo Alto");wall("✨","Abriste tu mensaje de lo Alto");logAct("mensaje","abierto",CONFIG.xp.mensaje);rerender(350);}
  if(k==="diario"){S.diary.push({type:"mensaje",title:"Mensaje de lo Alto",text:mensajeDe(),at:Date.now()});save();toast("✍️ Guardado en tu diario");}
  if(k==="tarea"){S.tasks.push({id:uid(),t:"Vivir hoy: "+mensajeDe().slice(0,90),pri:1,due:t,cat:"Personal",rep:"no",done:false});save();toast("✓ Agregado a tus tareas de hoy");}
  return;}
 const k=b.dataset.cont,C=lazy("cont",{ppw:4,seg:0,segMeta:0,pilares:[],posts:[]});
 if(k==="pilar"){const v=val("cpIn");if(v){C.pilares.push(v);rerender();}}
 if(k==="quitarPilar"){C.pilares.splice(+b.dataset.i,1);rerender();}
 if(k==="meta")overlay(`<div class="sheet"><h2>Mis metas de contenido</h2><div class="gap"></div><label class="fld"><span>Publicaciones por semana</span><select class="sel" id="cmP">${[1,2,3,4,5,6,7,10,14].map(n=>`<option ${C.ppw===n?"selected":""}>${n}</option>`).join("")}</select></label><label class="fld"><span>Seguidores actuales</span><input class="inp" id="cmS" type="number" min="0" value="${C.seg}"></label><label class="fld"><span>Meta de seguidores</span><input class="inp" id="cmM" type="number" min="0" value="${C.segMeta||""}"></label><div class="between"><button class="btn lt" data-act="cerrar">Cancelar</button><button class="btn or" data-cont="metaGuardar">Guardar</button></div></div>`);
 if(k==="metaGuardar"){C.ppw=+val("cmP")||4;C.seg=+val("cmS")||0;C.segMeta=+val("cmM")||0;cerrarOv();rerender();toast("🎯 Metas guardadas");}
 if(k==="nuevo")overlay(`<div class="sheet"><h2>Nueva publicación</h2><div class="gap"></div><label class="fld"><span>Idea o título</span><input class="inp" id="cnT" placeholder="Reel: 3 hábitos que cambiaron mi mañana"></label><div class="fld"><span>Formato</span><div class="chips" id="cnF">${["Reel","Carrusel","Historia","Post","Video largo","Email"].map((f,i)=>`<button type="button" class="chip" data-pick="${f}" aria-pressed="${i===0}">${f}</button>`).join("")}</div></div>${C.pilares.length?`<label class="fld"><span>Pilar</span><select class="sel" id="cnP"><option value="">—</option>${C.pilares.map(p=>`<option>${esc(p)}</option>`).join("")}</select></label>`:""}<label class="fld"><span>Fecha</span><select class="sel" id="cnD">${dueOpts(t)}</select></label><div class="between"><button class="btn lt" data-act="cerrar">Cancelar</button><button class="btn or" data-cont="guardar">Agregar</button></div></div>`);
 if(k==="guardar"){const v=val("cnT");if(!v){toast("Escribe la idea");return;}C.posts.push({id:uid(),t:v,fmt:picked("#cnF")||"",pilar:val("cnP"),d:val("cnD")||null,done:false});cerrarOv();rerender();toast("🎬 Publicación planeada");}
 if(k==="hecho"){const p=C.posts.find(x=>x.id===b.dataset.id);if(p){p.done=true;p.doneAt=t;xp(CONFIG.xp.contenido,"otros",b,"🎬 Publicado");if(C.posts.filter(x=>x.done&&weekDays().includes(x.doneAt)).length===C.ppw)wall("🎬","Cumpliste tu meta semanal de contenido");rerender(450);}}
 if(k==="borrar"){const id=b.dataset.id;ask("¿Eliminar esta publicación?",()=>{C.posts=C.posts.filter(x=>x.id!==id);rerender();});}
});

/* ===== CONEXIÓN AUTOMÁTICA (ya no necesitas editar render() ni hoy()) ===== */
(function(){
 const baseRender=render;
 render=function(){
  baseRender();
  const m=document.getElementById("main");if(!m)return;
  const r=route(),key=r.slice(0,2).join("/");
  if(key==="diario/mensajes"){m.innerHTML=mensajes();bind();animateViz();}
  else if(key==="elevado/contenido"){m.innerHTML=contenido();bind();animateViz();}
  else if(r[0]==="hoy"&&!document.getElementById("msgHoy")){
   const ref=document.querySelector(".hoygrid .col:last-child .tile.peach");
   if(ref)ref.insertAdjacentHTML("beforebegin",`<div id="msgHoy">${mensajeHoyCard()}</div>`);
  }
 };
})();

/* repinta con las novedades ya cargadas */
render();
