export const providers = [{id:'demo-professional',name:'Demo Neighborhood Assessment Studio',description:'Fictional professional for testing only. No participation, credentials or service availability is claimed.',active:true}];
export const scenarios = [
 {id:'demo-oak',address:'100 Demo Oak Lane',label:'Assessment difference'},
 {id:'demo-even',address:'200 Demo Elm Lane',label:'No apparent difference'},
 {id:'demo-sparse',address:'300 Demo Pine Lane',label:'Insufficient evidence'},
 {id:'demo-period',address:'400 Demo Birch Lane',label:'Incompatible periods'},
 {id:'demo-outage',address:'500 Demo Maple Lane',label:'Source failure'},
 {id:'demo-no-provider',address:'600 Demo Cedar Lane',label:'No professional available'},
 {id:'ambiguous',address:'Demo Two Flats',label:'Ambiguous address'},
 {id:'unsupported',address:'Demo Dallas',label:'Unsupported region'}
];
export function property(id,address,assessment,area=1600,period='2025 demonstration period') {
 return {id,address,assessment,area,propertyClass:'Synthetic single-family',neighborhood:'Demo neighborhood',period,concept:'Assessed value (synthetic)',source:'Authored synthetic fixture — not CookViewer data',effectiveDate:'2025-01-01 (fictional)',fixtureDate:'2026-10-05',county:'Cook County demo'};
}
