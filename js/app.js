const tools=[
{name:"Percentage Calculator",url:"percentage.html"},
{name:"VAT Calculator",url:"vat.html"},
{name:"Age Calculator",url:"age.html"},
{name:"Discount Calculator",url:"discount.html"},
{name:"Fuel Cost Calculator",url:"fuel.html"}
];

const input=document.getElementById("searchInput");
const box=document.getElementById("suggestions");

function render(q=""){
  const matches=tools.filter(t=>t.name.toLowerCase().includes(q.toLowerCase())).slice(0,5);
  if(!q||!matches.length){box.hidden=true;box.innerHTML="";return;}
  box.innerHTML=matches.map(t=>`<a href="${t.url}">${t.name}</a>`).join("");
  box.hidden=false;
}

input.addEventListener("input",e=>render(e.target.value.trim()));
document.addEventListener("click",e=>{if(!e.target.closest(".search"))box.hidden=true;});

document.getElementById("toolSearch").addEventListener("submit",e=>{
  e.preventDefault();
  const q=input.value.trim().toLowerCase();
  const hit=tools.find(t=>t.name.toLowerCase().includes(q));
  if(hit&&hit.url!=="#")location.href=hit.url;
  else render(input.value.trim());
});