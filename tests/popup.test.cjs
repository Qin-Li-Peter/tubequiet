const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync('extension/popup/popup.js', 'utf8');
async function setup(sendMessage) {
  const elements = Object.fromEntries(['enabled', 'status', 'error'].map(id => [id, {checked:false, disabled:id==='enabled', hidden:id==='error', textContent:'', addEventListener(type, fn){this[type]=fn;}}]));
  await vm.runInNewContext(`(async()=>{${source}\n})()`,{document:{getElementById:id=>elements[id]},chrome:{runtime:{sendMessage}}});
  return elements;
}
test('popup waits for saved state, applies switch, and displays saved on/off state',async()=>{
 let setting=true; const elements=await setup(async message=>{if(message.type==='SET_ENABLED')setting=message.enabled;return {ok:true,enabled:setting,healthy:true};});
 assert.equal(elements.enabled.checked,true);assert.equal(elements.status.textContent,'Ads blocked');
 elements.enabled.checked=false;await elements.enabled.change();
 assert.equal(setting,false);assert.equal(elements.status.textContent,'Ads allowed');assert.equal(elements.error.hidden,true);
});
test('popup prevents further changes while saving and rolls back on failure',async()=>{
 let rejectChange;const elements=await setup(message=>message.type==='GET_STATE'?Promise.resolve({ok:true,enabled:true,healthy:true}):new Promise((_,reject)=>{rejectChange=reject;}));
 elements.enabled.checked=false;const pending=elements.enabled.change();
 assert.equal(elements.enabled.disabled,true);assert.equal(elements.status.textContent,'Applying…');
 rejectChange(Error('Could not save'));await pending;
 assert.equal(elements.enabled.checked,true);assert.equal(elements.enabled.disabled,false);assert.equal(elements.status.textContent,'Change not applied');assert.equal(elements.error.hidden,false);
});
test('popup fails closed on initial connection failure and distinguishes reload failure',async()=>{
 const offline=await setup(async()=>{throw Error('Offline');});assert.equal(offline.enabled.disabled,true);assert.equal(offline.status.textContent,'Unavailable');
 const reload=await setup(async()=>({ok:true,enabled:false,healthy:true,reloadFailed:true}));assert.equal(reload.status.textContent,'Ads allowed');assert.match(reload.error.textContent,/Reload/);
});
