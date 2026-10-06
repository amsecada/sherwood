import {scenarios,providers,property} from './fixtures.js';
export function resolveAddress(address) {
 if(typeof address!=='string'||!address.trim()||address.length>200) return {state:'invalid',message:'Enter a sample address of at most 200 characters.'};
 const match=scenarios.find(s=>s.address.toLowerCase()===address.trim().toLowerCase());
 if(!match) return {state:'unresolved',message:'This demo only resolves the listed fictional sample addresses.'};
 if(match.id==='unsupported') return {state:'unsupported',message:'Only Cook County is in scope. This sample represents an unsupported region.'};
 if(match.id==='ambiguous') return {state:'ambiguous',candidates:[{id:'demo-oak',address:'100 Demo Oak Lane — Unit A'},{id:'demo-even',address:'200 Demo Elm Lane — Unit B'}]};
 return {state:'resolved',parcelId:match.id};
}
export function compareParcel(id) {
 const scenario=scenarios.find(s=>s.id===id);
 if(!scenario||['ambiguous','unsupported'].includes(id)) return {state:'unresolved',message:'No synthetic parcel matches this selection.'};
 const subject=property(id,scenario.address,id==='demo-even'?30000:36000);
 const base={subject,methodVersion:'demo-1-unreviewed',templateVersion:'demo-1',limitation:'Demonstration rules have not been expert reviewed. Synthetic evidence cannot support a real assessment decision.',providers:[],excluded:[]};
 if(id==='demo-outage') return {...base,state:'source-failure',message:'Simulated source failure. No evidence was retrieved; no conclusion can be drawn.'};
 if(id==='demo-sparse'||id==='demo-period') return {...base,state:'insufficient',message:'There is not enough compatible evidence to explain a difference.',excluded:[{address:'Synthetic candidate',reason:id==='demo-period'?'Incompatible assessment period':'Required building size is missing'}]};
 const comps=[property('comp-1','102 Demo Oak Lane',28000,1550),property('comp-2','104 Demo Oak Lane',30000,1650),property('comp-3','106 Demo Oak Lane',32000,1600)].map(p=>({...p,inclusionReason:'Synthetic matching class, neighborhood and period; building size within 5%.'}));
 const difference=subject.assessment-30000;
 return {...base,state:'available',comparables:comps,median:30000,difference,interpretation:difference===0?'no-apparent-difference':'displayed-difference',providers:id==='demo-no-provider'?[]:structuredClone(providers),explanation:difference===0?'The synthetic subject equals the median of these three synthetic assessments. No apparent difference in this example does not establish that a real assessment is correct.':'The synthetic subject is $6,000 above the median of these three synthetic assessments. This displayed difference is not proof of overassessment. Other characteristics may explain a difference; no savings or appeal result is predicted.'};
}
