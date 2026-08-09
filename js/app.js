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
,{name:"Word Finder",url:"word-finder.html"},{name:"Savings Calculator",url:"savings.html"},{name:"Tip Calculator",url:"tip.html"},{name:"Running Pace Calculator",url:"pace.html"},{name:"Percentage Change Calculator",url:"percentage-change.html"},{name:"Loan-to-Value (LTV) Calculator",url:"ltv.html"},{name:"Stamp Duty Calculator",url:"stamp-duty.html"},{name:"Mortgage Overpayment Calculator",url:"mortgage-overpayment.html"},{name:"Savings Goal Calculator",url:"savings-goal.html"},{name:"Simple Interest Calculator",url:"simple-interest.html"},{name:"Profit Margin Calculator",url:"profit-margin.html"},{name:"Markup Calculator",url:"markup.html"},{name:"Hourly Rate to Salary Calculator",url:"hourly-salary.html"},{name:"Break-Even Calculator",url:"break-even.html"},{name:"Area Calculator",url:"area.html"},{name:"Paint Calculator",url:"paint.html"},{name:"Flooring Calculator",url:"flooring.html"},{name:"Travel Time Calculator",url:"travel-time.html"},{name:"Fuel Economy Converter",url:"fuel-economy.html"},{name:"BMR Calculator",url:"bmr.html"},{name:"Waist-to-Height Ratio Calculator",url:"waist-height.html"},{name:"Average Calculator",url:"average.html"},{name:"Grade Calculator",url:"grade.html"},{name:"Ratio Calculator",url:"ratio.html"},{name:"Fraction Simplifier",url:"fraction.html"},{name:"Scientific Calculator",url:"scientific.html"}];
const input=document.getElementById("searchInput"),box=document.getElementById("suggestions");
function render(q=""){const m=tools.filter(t=>t.name.toLowerCase().includes(q.toLowerCase())).slice(0,7);if(!q||!m.length){box.hidden=true;box.innerHTML="";return}box.innerHTML=m.map(t=>`<a href="${t.url}">${t.name}</a>`).join("");box.hidden=false}
input.addEventListener("input",e=>render(e.target.value.trim()));
document.addEventListener("click",e=>{if(!e.target.closest(".search"))box.hidden=true});
document.getElementById("toolSearch").addEventListener("submit",e=>{e.preventDefault();const q=input.value.trim().toLowerCase(),hit=tools.find(t=>t.name.toLowerCase().includes(q));if(hit)location.href=hit.url;else render(input.value.trim())});