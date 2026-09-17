
const menuBtn=document.querySelector(".menu-btn");
const navLinks=document.querySelector(".nav-links");
if(menuBtn&&navLinks){
  menuBtn.addEventListener("click",()=>navLinks.classList.toggle("open"));
}
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>navLinks?.classList.remove("open")));
document.querySelectorAll(".year").forEach(e=>e.textContent=new Date().getFullYear());

const modal=document.getElementById("orderModal");
const modalTitle=document.getElementById("orderModalTitle");
const modalLabel=document.getElementById("selectedLabel");
const modalText=document.getElementById("selectedPackText");

function openOrder(title,label,text){
  if(!modal)return;
  modalTitle.textContent=title;
  modalLabel.textContent=label;
  modalText.textContent=text;
  modal.classList.add("open");
  document.body.classList.add("modal-open");
}
function closeOrder(){
  if(!modal)return;
  modal.classList.remove("open");
  document.body.classList.remove("modal-open");
}
document.querySelectorAll("[data-close-modal]").forEach(x=>x.addEventListener("click",closeOrder));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeOrder()});

const prices=[[80,35],[240,100],[500,160],[1000,320],[1500,480],[2000,630],[4000,1260],[6000,1860],[8000,2480],[10000,3100]];
const pc=document.getElementById("priceCards");
if(pc){
  prices.forEach(([r,b])=>{
    const el=document.createElement("article");
    el.className="price-card";
    el.innerHTML=`<div class="amount">${r.toLocaleString()} <small>Robux</small></div>
      <div class="price">${b.toLocaleString()} ฿</div>
      <button class="pack-order-btn">สั่งแพ็กนี้</button>`;
    el.querySelector("button").addEventListener("click",()=>openOrder("SPECIAL PACK","แพ็กที่เลือก",`${r.toLocaleString()} Robux • ${b.toLocaleString()} ฿`));
    pc.appendChild(el);
  });
}
document.querySelectorAll("[data-gamepass]").forEach(btn=>{
  btn.addEventListener("click",()=>openOrder("GAMEPASS","รายการที่เลือก",btn.dataset.gamepass));
});


// ---------- Store status (Thailand time) ----------
// Open daily 10:00 until 02:00 the next day.
// Therefore the shop is OPEN when the Thailand hour is >= 10 OR < 2.
function updateStoreStatus(){
  const now = new Date();

  const timeParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(now);

  const values = {};
  timeParts.forEach(p => values[p.type] = p.value);

  const hour = Number(values.hour);
  const isOpen = hour >= 10 || hour < 2;

  const text = document.getElementById("storeStatusText");
  const dot = document.getElementById("storeStatusDot");
  const clock = document.getElementById("storeClock");

  if (text && dot){
    text.textContent = isOpen ? "🟢 ร้านเปิดอยู่" : "🔴 ร้านปิดอยู่";
    text.classList.toggle("open", isOpen);
    text.classList.toggle("closed", !isOpen);
    dot.classList.toggle("open", isOpen);
    dot.classList.toggle("closed", !isOpen);
  }

  if (clock){
    clock.textContent = `${values.hour}:${values.minute}:${values.second}`;
  }
}

updateStoreStatus();
setInterval(updateStoreStatus, 1000);

/* ================= DUAL MUSIC PLAYER : SoundCloud + YouTube =================
รองรับสองระบบในเพลงเดียว:
- sc: ลิงก์ SoundCloud
- yt: ลิงก์ YouTube
- src: ไฟล์เสียงตรง เช่น MP3/OGG/WAV/M4A

ลำดับ Auto:
1) src ถ้ามี
2) SoundCloud ถ้ามี
3) YouTube ถ้ามี

ถ้าแหล่งหนึ่งเล่นไม่ได้ ระบบจะลองอีกแหล่งให้อัตโนมัติ

ตัวอย่าง:
{
  title:'ชื่อเพลง',
  sub:'ศิลปิน',
  sc:'https://soundcloud.com/...',
  yt:'https://youtu.be/...',
  cover:'auto'
}
================================================================ */
const TRACKS = [
  {
    title:'Amor Na Praia (SLOWED + REVERB)',
    sub:'Felax',
    sc:'https://soundcloud.com/an1ps/amor-na-praia-super-slowed',
    yt:'https://youtu.be/UhJiV8CQ-kA',
    cover:'auto'
  },
  {
    title:'LUZ ROJA (Slowed)',
    sub:'bxkq',
    sc:'https://soundcloud.com/crestalacultura/luz-roja-slowed-2',
    yt:'https://youtu.be/UIuBtl4rz0E',
    cover:'auto'
  },
  {
    title:'MENTE MA (Slowed)',
    sub:'SUKA.',
    sc:'https://soundcloud.com/orionmood/nakama-mc-staff-mente-ma',
    yt:'https://youtu.be/daNqcK-COww',
    cover:'auto'
  },
  {
    title:'MONTAGEM PEGADORA (Slowed)',
    sub:'SUKA.',
    sc:'https://soundcloud.com/rubikdice/montagem-pegadora-slowed',
    yt:'https://youtu.be/6mWJ4FfNAYI',
    cover:'auto'
  },
  {
    title:'MONTAGEM XONADA',
    sub:'MAFIA',
    sc:'https://soundcloud.com/djjavi26-music/sets/montagem-xonada',
    yt:'https://youtu.be/sC2b43vxJbQ',
    cover:'auto'
  },
  {
    title:'NEXT! (Brazilian Phonk)',
    sub:'ncts',
    sc:'https://soundcloud.com/nctsmusic/next-original-mix',
    yt:'https://youtu.be/3U9AK5Sfyqw',
    cover:'auto'
  },
  {
    title:'NO BATIDÃO (Extended)',
    sub:'SUKA.',
    sc:'https://soundcloud.com/zxkai-music/no-batidao',
    yt:'https://youtu.be/YXxdETZ9npU',
    cover:'auto'
  }
];

function parseYT(input){
  if(!input) return '';
  const u = String(input).trim();

  if(/^[A-Za-z0-9_-]{11}$/.test(u)) return u;

  try{
    const url = new URL(u);
    const host = url.hostname.replace(/^www\./,'').toLowerCase();

    if(host === 'youtu.be'){
      const id = url.pathname.split('/').filter(Boolean)[0] || '';
      if(/^[A-Za-z0-9_-]{11}$/.test(id)) return id;
    }

    if(host.endsWith('youtube.com')){
      const v = url.searchParams.get('v');
      if(v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;

      const parts = url.pathname.split('/').filter(Boolean);
      if(['shorts','embed','live'].includes(parts[0]) && /^[A-Za-z0-9_-]{11}$/.test(parts[1] || '')){
        return parts[1];
      }
    }
  }catch(e){}

  const m = u.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : '';
}

TRACKS.forEach(t=>{
  if((!t.cover || t.cover === 'auto') && t.yt){
    const id = parseYT(t.yt);
    if(id) t.cover = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  }
});

const Player = (()=>{
  let idx = 0;
  let engine = 'sc';          // sc | yt | audio
  let preferredSource = 'sc';
  let playing = false;
  let duration = 0;
  let position = 0;
  let progressTimer = null;

  // Fallback guard so we do not loop SC -> YT -> SC forever.
  let triedSC = false;
  let triedYT = false;

  const $ = id=>document.getElementById(id);
  const cur = ()=>TRACKS[idx];

  const fmtSec = sec=>{
    sec = Math.max(0, Math.floor(Number(sec)||0));
    return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
  };

  const fmtMs = ms=>fmtSec((Number(ms)||0)/1000);

  /* ------------------------- shared UI ------------------------- */
  function setState(text){
    if($('musicState')) $('musicState').textContent = text;
    if($('musicMessage')) $('musicMessage').textContent = text;
  }

  function setSourceButtons(){
    $('musicSourceSC')?.classList.toggle('active', engine === 'sc');
    $('musicSourceYT')?.classList.toggle('active', engine === 'yt');
  }

  function renderButtons(){
    const list = $('musicMiniList');
    if(!list) return;
    list.innerHTML = '';

    TRACKS.forEach((t,i)=>{
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = String(i+1).padStart(2,'0');
      b.title = `${t.title}${t.sub ? ' • '+t.sub : ''}`;
      b.classList.toggle('active', i === idx);
      b.addEventListener('click',()=>select(i,true));
      list.appendChild(b);
    });
  }

  function updateMeta(){
    const t = cur();
    if(!t) return;

    if($('musicTitle')) $('musicTitle').textContent = t.title || 'ไม่มีชื่อเพลง';
    if($('musicArtist')) $('musicArtist').textContent = t.sub || '';
    if($('musicTrackNo')){
      $('musicTrackNo').textContent =
        `เพลง ${String(idx+1).padStart(2,'0')} / ${String(TRACKS.length).padStart(2,'0')}`;
    }

    if($('musicCover')){
      $('musicCover').src = t.cover && t.cover !== 'auto' ? t.cover : 'assets/logo.png';
    }

    const srcLink = $('musicSourceLink');
    if(srcLink){
      if(engine === 'sc' && t.sc){
        srcLink.href = t.sc;
        srcLink.textContent = 'SoundCloud ↗';
        srcLink.style.display = '';
      }else if(engine === 'yt' && t.yt){
        srcLink.href = t.yt;
        srcLink.textContent = 'YouTube ↗';
        srcLink.style.display = '';
      }else{
        srcLink.style.display = 'none';
      }
    }

    renderButtons();
    setSourceButtons();
  }

  function resetProgress(){
    duration = 0;
    position = 0;
    if($('musicProgress')) $('musicProgress').value = 0;
    if($('musicCurrentTime')) $('musicCurrentTime').textContent = '0:00';
    if($('musicDuration')) $('musicDuration').textContent = '0:00';
  }

  function updatePlayButton(){
    if($('musicPlay')) $('musicPlay').textContent = playing ? '⏸' : '▶';
  }

  /* ------------------------- direct audio ------------------------- */
  const audio = new Audio();
  audio.preload = 'metadata';

  audio.addEventListener('loadedmetadata',()=>{
    duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    if($('musicDuration')) $('musicDuration').textContent = fmtSec(duration);
  });

  audio.addEventListener('timeupdate',()=>{
    position = audio.currentTime || 0;
    if($('musicCurrentTime')) $('musicCurrentTime').textContent = fmtSec(position);
    if(duration > 0 && $('musicProgress') && !$('musicProgress').matches(':active')){
      $('musicProgress').value = Math.round((position/duration)*1000);
    }
  });

  audio.addEventListener('play',()=>{
    playing = true;
    updatePlayButton();
    setState('กำลังเล่น');
  });

  audio.addEventListener('pause',()=>{
    if(audio.ended) return;
    playing = false;
    updatePlayButton();
  });

  audio.addEventListener('ended',next);

  audio.addEventListener('error',()=>{
    setState('ไฟล์เสียงเปิดไม่ได้ • กำลังลองแหล่งอื่น');
    fallbackSource();
  });

  /* ------------------------- SoundCloud ------------------------- */
  let scWidget = null;
  let scReady = false;

  function initSC(){
    const iframe = $('scHost');
    if(!iframe || !window.SC || !SC.Widget) return;

    scWidget = SC.Widget(iframe);

    scWidget.bind(SC.Widget.Events.READY,()=>{
      scReady = true;
      try{ scWidget.setVolume(Number($('musicVolume')?.value || 35)); }catch(e){}
    });

    scWidget.bind(SC.Widget.Events.PLAY,()=>{
      if(engine !== 'sc') return;
      playing = true;
      updatePlayButton();
      setState('กำลังเล่น • SoundCloud');

      try{
        scWidget.getCurrentSound(sound=>{
          if(!sound) return;

          if(sound.artwork_url && $('musicCover')){
            $('musicCover').src = sound.artwork_url.replace('-large.','-t500x500.');
          }

          if(sound.duration){
            duration = sound.duration;
            if($('musicDuration')) $('musicDuration').textContent = fmtMs(duration);
          }
        });
      }catch(e){}
    });

    scWidget.bind(SC.Widget.Events.PAUSE,()=>{
      if(engine !== 'sc') return;
      playing = false;
      updatePlayButton();
    });

    scWidget.bind(SC.Widget.Events.FINISH,()=>{
      if(engine !== 'sc') return;
      next();
    });

    if(SC.Widget.Events.ERROR){
      scWidget.bind(SC.Widget.Events.ERROR,()=>{
        if(engine !== 'sc') return;
        triedSC = true;
        setState('SoundCloud เล่นไม่ได้ • กำลังลอง YouTube');
        fallbackSource();
      });
    }
  }

  function loadSC(autoplay){
    const t = cur();
    if(!t?.sc || !scWidget){
      triedSC = true;
      fallbackSource();
      return;
    }

    engine = 'sc';
    setSourceButtons();
    updateMeta();
    resetProgress();
    setState('กำลังโหลด SoundCloud...');

    try{
      scWidget.load(t.sc,{
        auto_play: autoplay,
        hide_related:true,
        show_comments:false,
        show_user:false,
        show_reposts:false,
        show_teaser:false,
        visual:false,
        callback:function(){
          try{
            scWidget.setVolume(Number($('musicVolume')?.value || 35));
            scWidget.getCurrentSound(sound=>{
              if(!sound) return;
              if(sound.artwork_url && $('musicCover')){
                $('musicCover').src = sound.artwork_url.replace('-large.','-t500x500.');
              }
              if(sound.duration){
                duration = sound.duration;
                if($('musicDuration')) $('musicDuration').textContent = fmtMs(duration);
              }
            });
          }catch(e){}

          if(!autoplay) setState('พร้อมเล่น • SoundCloud');
        }
      });
    }catch(e){
      triedSC = true;
      fallbackSource();
    }
  }

  /* ------------------------- YouTube ------------------------- */
  let ytPlayer = null;
  let ytReady = false;
  let ytQueue = [];
  let ytInitStarted = false;

  function initYT(){
    if(ytInitStarted) return;
    ytInitStarted = true;

    const createYT = ()=>{
      ytPlayer = new YT.Player('ytHost',{
        width:'1',
        height:'1',
        videoId:'',
        playerVars:{playsinline:1,controls:0,rel:0,modestbranding:1},
        events:{
          onReady:function(){
            ytReady = true;
            try{ ytPlayer.setVolume(Number($('musicVolume')?.value || 35)); }catch(e){}
            const q = ytQueue.splice(0);
            q.forEach(fn=>{try{fn();}catch(e){}});
          },

          onStateChange:function(e){
            if(engine !== 'yt') return;

            if(e.data === YT.PlayerState.PLAYING){
              playing = true;
              updatePlayButton();
              setState('กำลังเล่น • YouTube');

              try{
                duration = ytPlayer.getDuration() || 0;
                if($('musicDuration')) $('musicDuration').textContent = fmtSec(duration);
              }catch(e){}
            }
            else if(e.data === YT.PlayerState.PAUSED){
              playing = false;
              updatePlayButton();
            }
            else if(e.data === YT.PlayerState.ENDED){
              next();
            }
          },

          onError:function(e){
            if(engine !== 'yt') return;
            triedYT = true;

            if(e?.data === 101 || e?.data === 150){
              setState('YouTube ปิด Embed • ลอง SoundCloud แทน');
            }else{
              setState('YouTube เล่นไม่ได้ • ลอง SoundCloud แทน');
            }

            fallbackSource();
          }
        }
      });
    };

    if(window.YT && window.YT.Player){
      createYT();
    }else{
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function(){
        if(typeof prev === 'function'){
          try{ prev(); }catch(e){}
        }
        createYT();
      };
    }
  }

  function withYT(cb){
    if(ytReady && ytPlayer){
      cb();
      return;
    }
    ytQueue.push(cb);
    initYT();
  }

  function loadYT(autoplay){
    const t = cur();
    const id = parseYT(t?.yt);

    if(!id){
      triedYT = true;
      fallbackSource();
      return;
    }

    engine = 'yt';
    setSourceButtons();
    updateMeta();
    resetProgress();
    setState('กำลังโหลด YouTube...');

    withYT(()=>{
      try{
        if(autoplay) ytPlayer.loadVideoById(id);
        else{
          ytPlayer.cueVideoById(id);
          setState('พร้อมเล่น • YouTube');
        }
      }catch(e){
        triedYT = true;
        fallbackSource();
      }
    });
  }

  /* ------------------------- switching / fallback ------------------------- */
  function stopAll(){
    try{ audio.pause(); }catch(e){}
    try{ if(scWidget) scWidget.pause(); }catch(e){}
    try{ if(ytReady && ytPlayer) ytPlayer.pauseVideo(); }catch(e){}
    playing = false;
    updatePlayButton();
  }

  function fallbackSource(){
    const t = cur();
    stopAll();

    // If SoundCloud failed, try YouTube.
    if(!triedYT && t?.yt){
      triedYT = true;
      loadYT(true);
      return;
    }

    // If YouTube failed, try SoundCloud.
    if(!triedSC && t?.sc){
      triedSC = true;
      loadSC(true);
      return;
    }

    setState('เพลงนี้เล่นในเว็บไม่ได้ทั้ง 2 แหล่ง');
    const ext = $('musicOpenExternal');
    if(ext){
      ext.style.display = '';
      ext.href = t?.sc || t?.yt || '#';
      ext.textContent = t?.sc ? 'เปิดใน SoundCloud ↗' : 'เปิดใน YouTube ↗';
    }
  }

  function prepare(autoplay=false){
    const t = cur();
    if(!t) return;

    stopAll();
    triedSC = false;
    triedYT = false;
    updateMeta();
    resetProgress();

    const ext = $('musicOpenExternal');
    if(ext) ext.style.display = 'none';

    // Direct file gets first priority.
    if(t.src){
      engine = 'audio';
      audio.src = t.src;
      audio.currentTime = 0;
      audio.volume = Number($('musicVolume')?.value || 35)/100;
      setState('พร้อมเล่น • ไฟล์เสียง');

      if(autoplay){
        audio.play().catch(()=>{
          setState('เบราว์เซอร์บล็อก Auto Play • กด ▶');
        });
      }
      return;
    }

    // Respect user's selected source when both exist.
    if(preferredSource === 'yt' && t.yt){
      loadYT(autoplay);
      return;
    }

    if(preferredSource === 'sc' && t.sc){
      loadSC(autoplay);
      return;
    }

    if(t.sc) loadSC(autoplay);
    else if(t.yt) loadYT(autoplay);
    else setState('เพลงนี้ไม่มีแหล่งเสียง');
  }

  function select(i,autoplay=true){
    idx = (i + TRACKS.length) % TRACKS.length;
    prepare(autoplay);
  }

  function playPause(){
    if(engine === 'audio'){
      if(audio.paused) audio.play();
      else audio.pause();
      return;
    }

    if(engine === 'sc'){
      if(!scWidget) return;
      try{
        if(playing) scWidget.pause();
        else scWidget.play();
      }catch(e){}
      return;
    }

    if(engine === 'yt'){
      withYT(()=>{
        try{
          if(ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) ytPlayer.pauseVideo();
          else ytPlayer.playVideo();
        }catch(e){}
      });
    }
  }

  function next(){
    select(idx+1,true);
  }

  function prev(){
    select(idx-1,true);
  }

  function refreshProgress(){
    if(engine === 'audio'){
      position = audio.currentTime || 0;
      duration = Number.isFinite(audio.duration) ? audio.duration : duration;

      if($('musicCurrentTime')) $('musicCurrentTime').textContent = fmtSec(position);
      if($('musicDuration')) $('musicDuration').textContent = fmtSec(duration);

      if(duration > 0 && $('musicProgress') && !$('musicProgress').matches(':active')){
        $('musicProgress').value = Math.round((position/duration)*1000);
      }
      return;
    }

    if(engine === 'sc' && scWidget){
      try{
        scWidget.getPosition(pos=>{
          position = Number(pos)||0;
          if($('musicCurrentTime')) $('musicCurrentTime').textContent = fmtMs(position);
          if(duration > 0 && $('musicProgress') && !$('musicProgress').matches(':active')){
            $('musicProgress').value = Math.round((position/duration)*1000);
          }
        });

        scWidget.getDuration(dur=>{
          duration = Number(dur)||duration;
          if($('musicDuration')) $('musicDuration').textContent = fmtMs(duration);
        });
      }catch(e){}
      return;
    }

    if(engine === 'yt' && ytReady && ytPlayer){
      try{
        position = ytPlayer.getCurrentTime() || 0;
        duration = ytPlayer.getDuration() || duration;

        if($('musicCurrentTime')) $('musicCurrentTime').textContent = fmtSec(position);
        if($('musicDuration')) $('musicDuration').textContent = fmtSec(duration);

        if(duration > 0 && $('musicProgress') && !$('musicProgress').matches(':active')){
          $('musicProgress').value = Math.round((position/duration)*1000);
        }
      }catch(e){}
    }
  }

  function seek(ratio){
    ratio = Math.max(0,Math.min(1,Number(ratio)||0));

    if(engine === 'audio'){
      const d = audio.duration || 0;
      if(d>0) audio.currentTime = ratio*d;
      return;
    }

    if(engine === 'sc' && scWidget && duration>0){
      try{ scWidget.seekTo(Math.round(duration*ratio)); }catch(e){}
      return;
    }

    if(engine === 'yt' && ytReady){
      try{
        const d = ytPlayer.getDuration() || 0;
        if(d>0) ytPlayer.seekTo(ratio*d,true);
      }catch(e){}
    }
  }

  function setVolume(v){
    v = Math.max(0,Math.min(100,Number(v)||0));
    audio.volume = v/100;

    try{ if(scWidget) scWidget.setVolume(v); }catch(e){}
    try{ if(ytReady && ytPlayer) ytPlayer.setVolume(v); }catch(e){}
  }

  function toggleMute(btn){
    const v = Number($('musicVolume')?.value || 35);

    if(engine === 'audio'){
      audio.muted = !audio.muted;
      btn.textContent = audio.muted ? '🔇' : '🔊';
      return;
    }

    if(engine === 'sc' && scWidget){
      const nowMuted = btn.textContent === '🔇';
      try{ scWidget.setVolume(nowMuted ? v : 0); }catch(e){}
      btn.textContent = nowMuted ? '🔊' : '🔇';
      return;
    }

    if(engine === 'yt' && ytReady){
      try{
        if(ytPlayer.isMuted()){
          ytPlayer.unMute();
          btn.textContent = '🔊';
        }else{
          ytPlayer.mute();
          btn.textContent = '🔇';
        }
      }catch(e){}
    }
  }

  function switchSource(source){
    preferredSource = source;
    const t = cur();

    if(source === 'sc' && t?.sc){
      stopAll();
      triedSC = triedYT = false;
      loadSC(false);
    }else if(source === 'yt' && t?.yt){
      stopAll();
      triedSC = triedYT = false;
      loadYT(false);
    }else{
      setState(source === 'sc' ? 'เพลงนี้ไม่มี SoundCloud' : 'เพลงนี้ไม่มี YouTube');
    }
  }

  function init(){
    const shell = $('musicPlayerWidget');
    if(!shell) return;

    initSC();
    initYT();

    $('musicPlayerClose')?.addEventListener('click',()=>shell.classList.add('collapsed'));
    $('musicPlayerToggle')?.addEventListener('click',()=>shell.classList.remove('collapsed'));

    $('musicPlay')?.addEventListener('click',playPause);
    $('musicPrev')?.addEventListener('click',prev);
    $('musicNext')?.addEventListener('click',next);

    $('musicMute')?.addEventListener('click',function(){toggleMute(this);});
    $('musicVolume')?.addEventListener('input',function(){setVolume(this.value);});
    $('musicProgress')?.addEventListener('input',function(){seek(Number(this.value)/1000);});

    $('musicSourceSC')?.addEventListener('click',()=>switchSource('sc'));
    $('musicSourceYT')?.addEventListener('click',()=>switchSource('yt'));

    updateMeta();
    prepare(false);
    progressTimer = setInterval(refreshProgress,500);
  }

  return {init,select,next,prev,playPause,switchSource,parseYT};
})();

document.addEventListener('DOMContentLoaded',Player.init);


// ---------- Admin page status sync ----------
(function(){
  function updateAdminPage(){
    const adminStatus = document.getElementById("adminStatusTitle");
    const adminTime = document.getElementById("adminThaiTime");
    if(!adminStatus && !adminTime) return;

    const parts = new Intl.DateTimeFormat("en-GB",{
      timeZone:"Asia/Bangkok",
      hour:"2-digit",
      minute:"2-digit",
      second:"2-digit",
      hour12:false
    }).formatToParts(new Date());

    const v = {};
    parts.forEach(p=>v[p.type]=p.value);
    const hour = Number(v.hour);
    const open = hour >= 10 || hour < 2;

    if(adminStatus){
      adminStatus.textContent = open ? "🟢 ร้านเปิดอยู่" : "🔴 ร้านปิดอยู่";
      adminStatus.style.color = open ? "#72f0a5" : "#ff7a82";
    }
    if(adminTime){
      adminTime.textContent = `${v.hour}:${v.minute}:${v.second}`;
    }
  }

  updateAdminPage();
  setInterval(updateAdminPage,1000);
})();
