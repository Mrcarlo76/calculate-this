const tools = [
  {"name": "Mortgage Calculator", "url": "mortgage.html"},
  {"name": "Mortgage Overpayment", "url": "mortgage-overpayment.html"},
  {"name": "Stamp Duty Calculator", "url": "stamp-duty.html"},
  {"name": "Loan Repayment", "url": "loan.html"},
  {"name": "LTV Calculator", "url": "ltv.html"},
  {"name": "UK Take-Home Pay", "url": "salary.html"},
  {"name": "Savings Calculator", "url": "savings.html"},
  {"name": "Savings Goal", "url": "savings-goal.html"},
  {"name": "Compound Interest", "url": "compound-interest.html"},
  {"name": "Simple Interest", "url": "simple-interest.html"},
  {"name": "Fuel Cost Calculator", "url": "fuel.html"},
  {"name": "Running Pace", "url": "pace.html"},
  {"name": "Unit Converter", "url": "unit-converter.html"},
  {"name": "Days Between Dates", "url": "days-between-dates.html"},
  {"name": "Travel Time Calculator", "url": "travel-time.html"},
  {"name": "Fuel Economy Converter", "url": "fuel-economy.html"},
  {"name": "Discount Calculator", "url": "discount.html"},
  {"name": "Area Calculator", "url": "area.html"},
  {"name": "Paint Calculator", "url": "paint.html"},
  {"name": "Flooring Calculator", "url": "flooring.html"},
  {"name": "BMI Calculator", "url": "bmi.html"},
  {"name": "Age Calculator", "url": "age.html"},
  {"name": "BMR Calculator", "url": "bmr.html"},
  {"name": "Waist-to-Height Ratio", "url": "waist-height.html"},
  {"name": "Percentage Calculator", "url": "percentage.html"},
  {"name": "Percentage Change", "url": "percentage-change.html"},
  {"name": "Average Calculator", "url": "average.html"},
  {"name": "Grade Calculator", "url": "grade.html"},
  {"name": "Ratio Calculator", "url": "ratio.html"},
  {"name": "Fraction Simplifier", "url": "fraction.html"},
  {"name": "Scientific Calculator", "url": "scientific.html"},
  {"name": "VAT Calculator", "url": "vat.html"},
  {"name": "Profit Margin", "url": "profit-margin.html"},
  {"name": "Markup Calculator", "url": "markup.html"},
  {"name": "Word Finder", "url": "word-finder.html"}
];
const input=document.getElementById("searchInput"),box=document.getElementById("suggestions");
function render(q=""){const m=tools.filter(t=>t.name.toLowerCase().includes(q.toLowerCase())).slice(0,7);if(!q||!m.length){box.hidden=true;box.innerHTML="";return}box.innerHTML=m.map(t=>`<a href="${t.url}">${t.name}</a>`).join("");box.hidden=false}
input.addEventListener("input",e=>render(e.target.value.trim()));
document.addEventListener("click",e=>{if(!e.target.closest(".search"))box.hidden=true});
document.getElementById("toolSearch").addEventListener("submit",e=>{e.preventDefault();const q=input.value.trim().toLowerCase(),hit=tools.find(t=>t.name.toLowerCase().includes(q));if(hit)location.href=hit.url;else render(input.value.trim())});