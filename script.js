// ====== PENGATURAN — ganti sesuai kebutuhanmu ======
var ADMIN_WA = "6285363149260"; // nomor admin, format 62xxxxxxxxxx
var PRODUCTS = [
 {id:"P1",name:"Oreo Stoberi",img:"images/stoberi.webp",price:15000,tags:["Manis","Segar","Creamy"],
  desc:"Perpaduan manisnya stoberi dengan creamy Oreo yang bikin segar!",
  taste:"Manis segar dari stoberi berpadu creamy Oreo.",texture:"Creamy dengan lapisan Oreo.",
  ing:"Oreo, krim, saus stoberi. Mengandung gluten dan susu. Tanya admin untuk info alergen lengkap.",
  store:"Simpan di kulkas dan nikmati dingin.",
  faq:[["Apakah dessert ini manis?","Manis dan segar dari stoberi, diseimbangkan creamy Oreo."],["Ukurannya berapa?","Cup kecil, tapi rasanya besar!"]]},
 {id:"P2",name:"Oreo Cokelat",img:"images/cokelat.webp",price:15000,tags:["Cokelat","Renyah","Kaya rasa"],
  desc:"Rasa cokelat yang kaya dengan topping Oreo renyah!",
  taste:"Cokelat yang kaya dengan topping Oreo.",texture:"Creamy dengan topping Oreo yang renyah.",
  ing:"Oreo, krim, cokelat. Mengandung gluten, susu, dan cokelat. Tanya admin untuk info alergen lengkap.",
  store:"Simpan di kulkas dan nikmati dingin.",
  faq:[["Apakah terlalu manis?","Rasa cokelatnya kaya. Kamu bisa tulis catatan, misalnya kurangi gula."],["Topping Oreo-nya renyah?","Ya, ada Oreo renyah di atasnya."]]},
 {id:"P3",name:"Oreo Original",img:"images/original.webp",price:15000,tags:["Klasik","Creamy","Simpel"],
  desc:"Klasik, simpel, tapi tetap bikin nagih!",
  taste:"Rasa Oreo klasik yang creamy.",texture:"Lapisan krim dan remahan Oreo.",
  ing:"Oreo dan krim. Mengandung gluten dan susu. Tanya admin untuk info alergen lengkap.",
  store:"Simpan di kulkas dan nikmati dingin.",
  faq:[["Cocok untuk pemula?","Cocok! Ini varian klasik yang paling simpel."],["Bisa tambah catatan?","Bisa, isi kolom catatan saat memesan."]]},
 {id:"P4",name:"Oreo Revelvet",img:"images/revelvet.webp",price:15000,tags:["Lembut","Manis","Creamy"],
  desc:"Lembutnya red velvet dengan perpaduan Oreo yang sempurna!",
  taste:"Red velvet yang lembut berpadu Oreo.",texture:"Lembut dan creamy.",
  ing:"Oreo, krim, red velvet. Mengandung gluten, telur, dan susu. Tanya admin untuk info alergen lengkap.",
  store:"Simpan di kulkas dan nikmati dingin.",
  faq:[["Rasanya seperti apa?","Lembut ala red velvet dengan creamy Oreo."],["Berapa harganya?","Rp15.000 per cup."]]}
];
// ===================================================
var rp = function(n){return "Rp"+n.toLocaleString("id-ID")};
var $ = function(id){return document.getElementById(id)};
var cart = {}, orders = [], step = "cart", form = {}, lastOrder = null;
function load(){try{cart=JSON.parse(localStorage.getItem("cart")||"{}");orders=JSON.parse(localStorage.getItem("orders")||"[]")}catch(e){cart={};orders=[]}}
function save(){try{localStorage.setItem("cart",JSON.stringify(cart));localStorage.setItem("orders",JSON.stringify(orders))}catch(e){}}
function prod(id){return PRODUCTS.filter(function(p){return p.id===id})[0]}
function count(){return Object.keys(cart).reduce(function(s,k){return s+cart[k]},0)}
function total(){return Object.keys(cart).reduce(function(s,k){return s+cart[k]*prod(k).price},0)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}

function renderGrid(){
  $("grid").innerHTML = PRODUCTS.map(function(p){return '<article class="card"><img class="pimg" src="'+p.img+'" alt="'+p.name+'"><div class="body"><h3>'+p.name+'</h3><div class="tags">'+p.tags.map(function(t){return '<span class="tag">'+t+'</span>'}).join("")+'</div><p>'+p.desc+'</p><div class="row"><span class="price">'+rp(p.price)+'</span><button class="btn ghost" data-d="'+p.id+'">Detail</button></div><button class="btn" data-a="'+p.id+'">Tambah ke keranjang</button></div></article>'}).join("");
}
function updateCartBtn(){var n=count();$("cartBtn").textContent="Keranjang ("+n+")";$("fab").innerHTML=n?'<span>🛒 Lihat keranjang · '+n+' item</span><span>'+rp(total())+'</span>':'<span>🛒 Keranjang masih kosong</span>'}
function add(id){cart[id]=(cart[id]||0)+1;save();updateCartBtn();toast()}
function toast(){var t=$("toast");if(!t){t=document.createElement("div");t.id="toast";t.className="toast";t.setAttribute("role","status");document.body.appendChild(t)}t.textContent="Ditambahkan ke keranjang ✓";t.classList.add("on");clearTimeout(toast.h);toast.h=setTimeout(function(){t.classList.remove("on")},1400)}

function openDetail(id){
  var p=prod(id);
  $("detail").innerHTML='<button class="close" aria-label="Tutup" data-x="detail">×</button><img class="pimg" src="'+p.img+'" alt="'+p.name+'" style="margin-bottom:14px"><h2>'+p.name+'</h2><p>'+p.desc+'</p><p><b>Rasa:</b> '+p.taste+'<br><b>Tekstur:</b> '+p.texture+'<br><b>Bahan &amp; alergen:</b> '+p.ing+'<br><b>Penyimpanan:</b> '+p.store+'</p><div class="price" style="margin:8px 0">'+rp(p.price)+'</div><div class="fq">'+p.faq.map(function(f){return '<details><summary>'+f[0]+'</summary><p>'+f[1]+'</p></details>'}).join("")+'</div><div class="btns"><button class="btn" data-a="'+p.id+'">Tambah ke keranjang</button><button class="btn ghost" data-admin="1">Tanya admin</button></div>';
  $("detailOv").classList.add("open");
}
function openDrawer(s){step=s||"cart";renderDrawer();$("drawerOv").classList.add("open")}
function closeAll(){["detailOv","drawerOv"].forEach(function(i){$(i).classList.remove("open")})}
function summary(){
  return Object.keys(cart).map(function(k){var p=prod(k);return '<div class="line"><img class="mini" src="'+p.img+'" alt=""><span class="nm">'+p.name+'<br><small>'+rp(p.price)+' × '+cart[k]+'</small></span><b>'+rp(p.price*cart[k])+'</b></div>'}).join("")+'<div class="total"><span>Total</span><span>'+rp(total())+'</span></div>';
}
function renderDrawer(){
  var h='<button class="close" aria-label="Tutup" data-x="drawer">×</button>';
  if(step==="cart"){
    h+='<h2>Keranjang Saya</h2>';
    if(!count()){h+='<p>Keranjangmu masih kosong. Pilih dessert dulu, ya.</p>'}
    else{
      h+=Object.keys(cart).map(function(k){var p=prod(k);return '<div class="line"><img class="mini" src="'+p.img+'" alt=""><span class="nm">'+p.name+'<br><small>'+rp(p.price)+'</small></span><span class="qty"><button data-q="'+k+'" data-v="-1" aria-label="Kurangi">−</button><b>'+cart[k]+'</b><button data-q="'+k+'" data-v="1" aria-label="Tambah">+</button></span><button data-rm="'+k+'" aria-label="Hapus" style="color:var(--muted)">🗑</button></div>'}).join("");
      h+='<div class="total"><span>Subtotal</span><span>'+rp(total())+'</span></div><div class="btns"><button class="btn" data-s="c1">Lanjut checkout</button></div>';
    }
  }else if(step==="c1"){
    h+='<div class="stepbar">Konfirmasi 1 dari 2</div><h2>Cek keranjangmu</h2>'+summary()+'<div class="btns"><button class="btn" data-s="c2">Setuju, lanjut</button><button class="btn ghost" data-s="cart">Edit keranjang</button></div>';
  }else if(step==="c2"){
    h+='<div class="stepbar">Konfirmasi 2 dari 2</div><h2>Yakin pesan?</h2><div class="note">Dengan menekan tombol di bawah, kamu menyatakan benar-benar ingin memesan dessert ini.</div>'+summary()+'<div class="btns"><button class="btn" data-s="form">Ya, saya yakin</button><button class="btn ghost" data-s="cart">Batal</button></div>';
  }else if(step==="form"){
    var today=new Date().toISOString().slice(0,10);
    h+='<h2>Data Penerima</h2><label for="f1">Nama penerima</label><input id="f1" value="'+esc(form.name||"")+'" autocomplete="name"><label for="f2">Kelas</label><input id="f2" value="'+esc(form.cls||"")+'" placeholder="contoh: XI IPA 2"><label for="f3">Titik pengantaran</label><input id="f3" value="'+esc(form.loc||"")+'" placeholder="contoh: Kantin lantai 1"><label for="f4">Jadwal pengambilan</label><div class="two"><input id="f4" type="date" min="'+today+'" value="'+esc(form.date||"")+'" aria-label="Tanggal pengambilan"><input id="f5" type="time" value="'+esc(form.time||"")+'" aria-label="Jam pengambilan"></div><label for="f6">Catatan (opsional)</label><textarea id="f6" rows="3" placeholder="contoh: jangan terlalu manis">'+esc(form.note||"")+'</textarea><div class="err" id="err" role="alert"></div><div class="btns"><button class="btn" data-s="send">Kirim pesanan</button><button class="btn ghost" data-s="c2">Kembali</button></div>';
  }else if(step==="done"){
    h+='<h2>Pesanan tersimpan 🎉</h2><p>Nomor pesananmu <b>'+lastOrder.id+'</b>. Jika WhatsApp belum terbuka, tekan tombol di bawah untuk mengirim rincian ke admin.</p><div class="btns"><a class="btn" style="text-decoration:none" target="_blank" rel="noopener" href="'+waLink(lastOrder)+'">Kirim ke WhatsApp admin</a><button class="btn ghost" data-x="drawer">Tutup</button></div>';
  }else if(step==="orders"){
    h+='<h2>Pesanan Saya</h2>'+(orders.length?orders.slice().reverse().map(function(o){return '<div class="card" style="padding:14px;margin-bottom:12px"><b>'+o.id+'</b> — '+rp(o.total)+'<br><small>'+esc(o.name)+' · '+esc(o.cls)+' · '+esc(o.date)+'</small><br>'+o.items.map(function(i){return i.n+' ×'+i.q}).join(", ")+'</div>'}).join(""):'<p>Belum ada pesanan di perangkat ini.</p>');
  }
  $("drawer").innerHTML=h;
}
function orderText(o){
  var ts=new Date(o.at||Date.now()).toLocaleString("id-ID",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
  return "🍰 *PESANAN BARU* 🍰\n━━━━━━━━━━━━━━━\n🔖 *No. Pesanan: #"+o.id+"*\n🕒 Dipesan: "+ts+"\n\n👤 *DATA PENERIMA*\n• Nama: "+o.name+"\n• Kelas: "+o.cls+"\n• Lokasi antar: "+o.loc+"\n• Jadwal pengambilan: "+o.date+"\n\n🍮 *DETAIL PRODUK*\n"+o.items.map(function(i){return "• "+i.n+"\n   "+i.q+" x "+rp(i.p)+" = "+rp(i.p*i.q)}).join("\n")+(o.note?"\n\n📝 *CATATAN*\n"+o.note:"")+"\n\n💰 *TOTAL: "+rp(o.total)+"*\n━━━━━━━━━━━━━━━\n✅ Konfirmasi 1: Disetujui\n✅ Konfirmasi 2: Disetujui\n✅ Formulir: Lengkap\n\nTerima kasih sudah pesan di Trio Rasa! 💗";
}
function waLink(o){return "https://wa.me/"+ADMIN_WA+"?text="+encodeURIComponent(orderText(o))}
function newId(){var d=new Date(),p=function(x){return String(x).padStart(2,"0")},ch="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",id;do{var r="";for(var i=0;i<4;i++)r+=ch[Math.floor(Math.random()*ch.length)];id="TR-"+p(d.getDate())+p(d.getMonth()+1)+"-"+r}while(orders.some(function(o){return o.id===id}));return id}
function submitOrder(){
  var v=function(i){return $(i).value.trim()};
  form={name:v("f1"),cls:v("f2"),loc:v("f3"),date:v("f4"),time:v("f5"),note:v("f6")};
  if(!form.name||!form.cls||!form.loc||!form.date||!form.time){$("err").textContent="Lengkapi semua data, termasuk tanggal dan jam pengambilan.";return}
  var id=newId();
  lastOrder={id:id,at:Date.now(),name:form.name,cls:form.cls,loc:form.loc,date:new Date(form.date+"T00:00:00").toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})+", pukul "+form.time,note:form.note,total:total(),items:Object.keys(cart).map(function(k){var p=prod(k);return{n:p.name,q:cart[k],p:p.price}})};
  orders.push(lastOrder);cart={};save();updateCartBtn();step="done";renderDrawer();
  window.open(waLink(lastOrder),"_blank","noopener");
}
document.addEventListener("click",function(e){
  var t=e.target.closest("[data-d],[data-a],[data-x],[data-s],[data-q],[data-rm],[data-admin]");
  if(e.target.classList.contains("ov")){closeAll();return}
  if(!t)return;
  var d=t.dataset;
  if(d.d)openDetail(d.d);
  else if(d.a)add(d.a);
  else if(d.x)closeAll();
  else if(d.q){cart[d.q]+=+d.v;if(cart[d.q]<1)delete cart[d.q];save();updateCartBtn();renderDrawer()}
  else if(d.rm){delete cart[d.rm];save();updateCartBtn();renderDrawer()}
  else if(d.admin)window.open("https://wa.me/"+ADMIN_WA,"_blank","noopener");
  else if(d.s){
    if(d.s==="send"){submitOrder();return}
    if(d.s==="form"){form=form||{}}
    step=d.s;renderDrawer();
  }
});
document.addEventListener("keydown",function(e){if(e.key==="Escape")closeAll()});
$("cartBtn").onclick=$("fab").onclick=function(){openDrawer("cart")};
$("ordersBtn").onclick=function(){openDrawer("orders")};
$("adminLink").onclick=function(e){e.preventDefault();window.open("https://wa.me/"+ADMIN_WA,"_blank","noopener")};
window.addEventListener("scroll",function(){document.querySelector("header").classList.toggle("sc",window.scrollY>8)});
load();renderGrid();updateCartBtn();
