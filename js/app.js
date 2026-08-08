const tools=[
{name:"Percentage Calculator",url:"percentage.html"},
{name:"VAT Calculator",url:"vat.html"},
{name:"Age Calculator",url:"age.html"},
{name:"Fuel Cost Calculator",url:"fuel.html"},
{name:"Discount Calculator",url:"discount.html"},
{name:"Mortgage Calculator",url:"mortgage.html"},
{name:"Loan Repayment Calculator",url:"loan.html"},
{name:"UK Take-Home Pay Calculator",url:"salary.html"},
{name:"Compound Interest Calculator",url:"compound-interest.html"},
{name:"BMI Calculator",url:"bmi.html"},
{name:"Unit Converter",url:"unit-converter.html"},
{name:"Days Between Dates",url:"days-between-dates.html"}
];
const input=document.getElementById("searchInput"),box=document.getElementById("suggestions");
function render(q=""){const m=tools.filter(t=>t.name.toLowerCase().includes(q.toLowerCase())).slice(0,7);if(!q||!m.length){box.hidden=true;box.innerHTML="";return}box.innerHTML=m.map(t=>`<a href="${t.url}">${t.name}</a>`).join("");box.hidden=false}
input.addEventListener("input",e=>render(e.target.value.trim()));
document.addEventListener("click",e=>{if(!e.target.closest(".search"))box.hidden=true});
document.getElementById("toolSearch").addEventListener("submit",e=>{e.preventDefault();const q=input.value.trim().toLowerCase(),hit=tools.find(t=>t.name.toLowerCase().includes(q));if(hit)location.href=hit.url;else render(input.value.trim())});