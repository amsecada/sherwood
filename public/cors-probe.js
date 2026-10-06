document.getElementById('run').onclick = async () => {
 const output = document.getElementById('result'); output.textContent = 'Reading CookViewer directly…';
 const url = new URL('https://gis.cookcountyil.gov/traditional/rest/services/CookViewer3Parcels/MapServer/0/query');
 url.search = new URLSearchParams({f:'json',where:"PIN14 = '01011000250000'",outFields:'PIN14,street_address,CURRENTVALUE_TOTAL',returnGeometry:'false',resultRecordCount:'1'});
 try {
  const response = await fetch(url, {mode:'cors',credentials:'omit',signal:AbortSignal.timeout(15000)});
  const data = await response.json();
  if (!response.ok || data.error || !data.features?.length) throw new Error(JSON.stringify(data.error || response.status));
  output.textContent = JSON.stringify({result:'PASS',responseType:response.type,status:response.status,record:data.features[0].attributes},null,2);
 } catch(error) { output.textContent = 'FAIL: ' + error.message; }
};
