/*
  NOXEN STORE SETTINGS
  Replace whatsappNumber with the NOXEN business WhatsApp number.
  Sri Lanka format: 94XXXXXXXXX (no +, spaces or leading zero).

  PRODUCT COLOUR PHOTOS:
  Add real product photos to images/products/ using the filenames in
  COLOR_PHOTO_GUIDE.txt. Until a colour photo is added, the original product
  photo remains visible. This avoids showing unrelated or fake product photos.
*/
const STORE = {
  brand: "NOXEN",
  whatsappNumber: "947XXXXXXXX",
  currency: "LKR",
  deliveryArea: "Sri Lanka"
};

const products = [
  {id:1,name:"CORE OVERSIZED TEE",category:"tops",tag:"BESTSELLER",price:4900,description:"A relaxed everyday silhouette with a clean finish. Made to become part of your regular rotation.",image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=88",colors:[{name:"Black",hex:"#171717",image:"images/products/core-tee-black.jpg"},{name:"White",hex:"#f2f0e9",image:"images/products/core-tee-white.jpg"},{name:"Grey",hex:"#858585",image:"images/products/core-tee-grey.jpg"}]},
  {id:2,name:"NOXEN HEAVY TEE",category:"tops",tag:"NEW DROP",price:5900,description:"A structured tee with a confident shape and minimal branding. Easy to style, built for repeat wear.",image:"https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1000&q=88",colors:[{name:"Black",hex:"#171717",image:"images/products/heavy-tee-black.jpg"},{name:"White",hex:"#f2f0e9",image:"images/products/heavy-tee-white.jpg"},{name:"Stone",hex:"#b7ad9d",image:"images/products/heavy-tee-stone.jpg"}]},
  {id:3,name:"STUDIO HOODIE",category:"tops",tag:"ESSENTIAL",price:8900,description:"A comfortable layer for slower days and late nights. Designed with a simple, versatile profile.",image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=88",colors:[{name:"Black",hex:"#171717",image:"images/products/hoodie-black.jpg"},{name:"Ash Grey",hex:"#aaa9a5",image:"images/products/hoodie-ash-grey.jpg"},{name:"Navy",hex:"#202d43",image:"images/products/hoodie-navy.jpg"}]},
  {id:4,name:"UTILITY TROUSER",category:"bottoms",tag:"",price:7900,description:"A practical everyday trouser with a relaxed fit and understated utility-inspired details.",image:"https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=1000&q=88",colors:[{name:"Black",hex:"#171717",image:"images/products/trouser-black.jpg"},{name:"Olive",hex:"#62664b",image:"images/products/trouser-olive.jpg"},{name:"Stone",hex:"#b7ad9d",image:"images/products/trouser-stone.jpg"}]},
  {id:5,name:"RELAXED SHORT",category:"bottoms",tag:"NEW",price:5500,description:"An easy warm-weather essential with a relaxed cut and clean, minimal styling.",image:"https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=1000&q=88",colors:[{name:"Black",hex:"#171717",image:"images/products/short-black.jpg"},{name:"Grey",hex:"#858585",image:"images/products/short-grey.jpg"},{name:"Olive",hex:"#62664b",image:"images/products/short-olive.jpg"}]},
  {id:6,name:"EVERYDAY CAP",category:"accessories",tag:"",price:3500,description:"A simple finishing piece for everyday wear. Minimal shape, maximum versatility.",image:"https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=88",colors:[{name:"Black",hex:"#171717",image:"images/products/cap-black.jpg"},{name:"Cream",hex:"#e9dfc9",image:"images/products/cap-cream.jpg"},{name:"Navy",hex:"#202d43",image:"images/products/cap-navy.jpg"}]}
];

let cart=[];
let activeFilter="all";
let selectedSize="M";
let selectedColor=null;
let currentProduct=null;
let searchTerm="";
const $=id=>document.getElementById(id);
const money=amount=>"LKR "+amount.toLocaleString("en-LK");
const itemCount=()=>cart.reduce((sum,item)=>sum+item.qty,0);
const cartTotal=()=>cart.reduce((sum,item)=>sum+item.price*item.qty,0);
const colorFor=(product,name)=>product.colors.find(c=>c.name===name)||product.colors[0];

function showToast(message){
  const toast=$("toast");toast.textContent=message;toast.classList.add("show");
  clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2400);
}
function imageWithFallback(img,src,fallback){
  img.onerror=()=>{img.onerror=null;img.src=fallback;};
  img.src=src||fallback;
}
function swatchesHTML(product,selected,scope){
  return product.colors.map(color=>`<button class="color-swatch ${color.name===selected?"selected":""}" type="button" data-color="${color.name}" data-product="${product.id}" data-scope="${scope}" aria-label="${color.name}" title="${color.name}" aria-pressed="${color.name===selected}" style="--swatch:${color.hex}"></button>`).join("");
}
function renderProducts(){
  let list=products.filter(p=>(activeFilter==="all"||p.category===activeFilter)&&(`${p.name} ${p.category}`.toLowerCase().includes(searchTerm)));
  const sort=$("sort").value;
  if(sort==="low")list.sort((a,b)=>a.price-b.price);
  if(sort==="high")list.sort((a,b)=>b.price-a.price);
  $("result-count").textContent=String(list.length).padStart(2,"0")+" PIECES";
  $("products").innerHTML=list.length?list.map(p=>{
    const chosen=p.colors[0];
    return `<article class="product-card" data-card="${p.id}">
      <div class="product-visual"><img data-card-image="${p.id}" src="${p.image}" alt="${p.name} - ${chosen.name}" loading="lazy">
        ${p.tag?`<span class="product-tag">${p.tag}</span>`:""}
        <button class="view-btn" data-view="${p.id}" type="button">VIEW DETAILS ↗</button>
      </div>
      <div class="product-info"><div><p class="product-name">${p.name}</p><span class="product-category">${p.category.toUpperCase()}</span></div><span class="product-price">${money(p.price)}</span></div>
      <div class="card-colours"><span>COLOUR: <b data-card-colour-label="${p.id}">${chosen.name.toUpperCase()}</b></span><div class="color-options compact">${swatchesHTML(p,chosen.name,"card")}</div></div>
    </article>`;
  }).join(""):`<p class="empty">No pieces found. Try another search.</p>`;
}
renderProducts();

$("filters").addEventListener("click",e=>{
  const btn=e.target.closest("[data-filter]");if(!btn)return;
  activeFilter=btn.dataset.filter;
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===btn));
  renderProducts();
});
$("sort").addEventListener("change",renderProducts);
$("products").addEventListener("click",e=>{
  const swatch=e.target.closest('[data-scope="card"]');
  if(swatch){
    const product=products.find(p=>p.id===Number(swatch.dataset.product));
    if(!product)return;
    const color=colorFor(product,swatch.dataset.color);
    const img=document.querySelector(`[data-card-image="${product.id}"]`);
    if(img)imageWithFallback(img,color.image,product.image);
    const label=document.querySelector(`[data-card-colour-label="${product.id}"]`);
    if(label)label.textContent=color.name.toUpperCase();
    const card=swatch.closest(".product-card");
    card.querySelectorAll('[data-scope="card"]').forEach(b=>{const active=b===swatch;b.classList.toggle("selected",active);b.setAttribute("aria-pressed",String(active));});
    return;
  }
  const view=e.target.closest("[data-view]");if(view)openProduct(Number(view.dataset.view));
});
$("search-toggle").addEventListener("click",()=>{$("search-bar").classList.toggle("show");$("search-input").focus();});
$("search-close").addEventListener("click",()=>{$("search-input").value="";searchTerm="";$("search-bar").classList.remove("show");renderProducts();});
$("search-input").addEventListener("input",e=>{searchTerm=e.target.value.trim().toLowerCase();renderProducts();});

function openLayer(id){$(id).classList.add("open");$(id).setAttribute("aria-hidden","false");document.body.classList.add("lock");}
function closeLayer(id){$(id).classList.remove("open");$(id).setAttribute("aria-hidden","true");if(!document.querySelector(".modal-layer.open,.drawer-layer.open"))document.body.classList.remove("lock");}
function updateDetailColour(){
  if(!currentProduct||!selectedColor)return;
  const img=$("detail-image");
  img.classList.remove("image-changing");void img.offsetWidth;img.classList.add("image-changing");
  imageWithFallback(img,selectedColor.image,currentProduct.image);
  img.alt=`${currentProduct.name} - ${selectedColor.name}`;
  $("selected-colour").textContent=selectedColor.name.toUpperCase();
  $("detail-colors").innerHTML=swatchesHTML(currentProduct,selectedColor.name,"detail");
}
function openProduct(id){
  currentProduct=products.find(p=>p.id===id);if(!currentProduct)return;
  selectedSize="M";selectedColor=currentProduct.colors[0];
  $("detail-name").textContent=currentProduct.name;
  $("detail-price").textContent=money(currentProduct.price);
  $("detail-description").textContent=currentProduct.description;
  updateDetailColour();
  document.querySelectorAll("[data-size]").forEach(b=>b.classList.toggle("chosen",b.dataset.size==="M"));
  openLayer("product-layer");
}
document.querySelectorAll("[data-close-product]").forEach(el=>el.addEventListener("click",()=>closeLayer("product-layer")));
$("detail-colors").addEventListener("click",e=>{
  const btn=e.target.closest('[data-scope="detail"]');if(!btn||!currentProduct)return;
  selectedColor=colorFor(currentProduct,btn.dataset.color);updateDetailColour();
});
$("size-options").addEventListener("click",e=>{
  const btn=e.target.closest("[data-size]");if(!btn)return;
  selectedSize=btn.dataset.size;document.querySelectorAll("[data-size]").forEach(b=>b.classList.toggle("chosen",b===btn));
});
$("add-bag").addEventListener("click",()=>{
  if(!currentProduct||!selectedColor)return;
  const found=cart.find(i=>i.id===currentProduct.id&&i.size===selectedSize&&i.color===selectedColor.name);
  if(found)found.qty++;
  else cart.push({...currentProduct,size:selectedSize,color:selectedColor.name,variantImage:selectedColor.image,qty:1});
  renderCart();closeLayer("product-layer");showToast("Added to your bag.");
});

function renderCart(){
  $("bag-count").textContent=itemCount();$("drawer-count").textContent=itemCount();
  $("subtotal").textContent=money(cartTotal());$("order-total").textContent=money(cartTotal());
  $("bag-items").innerHTML=cart.length?cart.map((item,index)=>`
    <div class="bag-line"><img src="${item.variantImage||item.image}" onerror="this.onerror=null;this.src='${item.image}'" alt="${item.name}"><div><h3>${item.name}</h3><p>COLOUR: ${item.color} · SIZE: ${item.size}</p><p>${money(item.price)}</p>
      <div class="qty-control"><button data-qty="-1" data-index="${index}" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="1" data-index="${index}" aria-label="Increase quantity">+</button></div>
    </div><button class="remove" data-remove="${index}">REMOVE</button></div>`).join(""):`<div class="empty">Your bag is waiting for something good.</div>`;
}
$("bag-items").addEventListener("click",e=>{
  const qty=e.target.closest("[data-qty]"),remove=e.target.closest("[data-remove]");
  if(qty){const item=cart[Number(qty.dataset.index)];item.qty+=Number(qty.dataset.qty);if(item.qty<=0)cart.splice(Number(qty.dataset.index),1);renderCart();}
  if(remove){cart.splice(Number(remove.dataset.remove),1);renderCart();}
});
function openBag(){renderCart();openLayer("drawer-layer");}
$("bag-open").addEventListener("click",openBag);
["drawer-close","drawer-x"].forEach(id=>$(id).addEventListener("click",()=>closeLayer("drawer-layer")));
$("order-open").addEventListener("click",()=>{
  if(!cart.length){showToast("Your bag is empty.");return;}
  $("order-total").textContent=money(cartTotal());closeLayer("drawer-layer");openLayer("order-layer");
});
document.querySelectorAll("[data-close-order]").forEach(el=>el.addEventListener("click",()=>closeLayer("order-layer")));
function validWhatsAppNumber(){return /^94\d{9}$/.test(STORE.whatsappNumber);}
$("order-form").addEventListener("submit",e=>{
  e.preventDefault();
  if(!cart.length){showToast("Your bag is empty.");closeLayer("order-layer");return;}
  if(!validWhatsAppNumber()){showToast("Please add the real NOXEN WhatsApp number in script.js first.");return;}
  const name=$("customer-name").value.trim();
  const phone=$("customer-phone").value.trim();
  const district=$("customer-district").value;
  const address=$("customer-address").value.trim();
  const note=$("customer-note").value.trim();
  const lines=cart.map((item,i)=>`${i+1}. ${item.name}\n   Colour: ${item.color} | Size: ${item.size} | Qty: ${item.qty} | ${money(item.price*item.qty)}`);
  const message=[`Hello ${STORE.brand}! I'd like to place an order.`,"","*ORDER DETAILS*",...lines,"",`*ITEM TOTAL: ${money(cartTotal())}*`,"(Delivery fee to be confirmed by NOXEN)","","*CUSTOMER DETAILS*",`Name: ${name}`,`Phone: ${phone}`,`District: ${district}`,`Delivery address: ${address}`,note?`Note: ${note}`:"","","Please confirm availability, delivery fee and payment options. Thank you!"].filter(Boolean).join("\n");
  window.open(`https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");
  showToast("Your order message is ready in WhatsApp.");
});
$("contact-whatsapp").addEventListener("click",e=>{
  if(!validWhatsAppNumber()){e.preventDefault();showToast("Add the real NOXEN WhatsApp number in script.js first.");return;}
  e.currentTarget.href=`https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent("Hello NOXEN! I'd like to ask about your collection.")}`;
});
$("menu-btn").addEventListener("click",()=>$("nav").classList.toggle("show"));
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>$("nav").classList.remove("show")));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeLayer("product-layer");closeLayer("order-layer");closeLayer("drawer-layer");}});
renderCart();

// A small, respectful reveal animation. It is disabled for reduced-motion users.
if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&"IntersectionObserver" in window){
  const revealTargets=document.querySelectorAll(".section-top,.product-card,.feature-content,.about-copy,.service-row>div,.contact .eyebrow,.contact h2");
  revealTargets.forEach(el=>el.classList.add("reveal-ready"));
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("revealed");revealObserver.unobserve(entry.target);}
  }),{threshold:.12});
  revealTargets.forEach(el=>revealObserver.observe(el));
}
