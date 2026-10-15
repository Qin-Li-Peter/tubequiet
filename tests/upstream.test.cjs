const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync('extension/vendor/ubol-youtube.js','utf8');
function runtime(host='www.youtube.com') {
 const context=vm.createContext({Request,Response,Headers,EventTarget,setTimeout,clearTimeout,document:{readyState:"complete",location:{origin:`https://${host}`}},URL,console,location:{hostname:host,href:`https://${host}/watch?v=test`}});
 vm.runInContext('self=globalThis; window=globalThis;',context);
 vm.runInContext(source,context);
 return context;
}
test('imported runtime removes initial player ads and nested player-response fields',()=>{
 const c=runtime();
 vm.runInContext('ytInitialPlayerResponse={adSlots:[1],adPlacements:[1],playerAds:[1],videoDetails:{videoId:"keep"}}',c);
 assert.equal(c.ytInitialPlayerResponse.adSlots,undefined);
 assert.equal(c.ytInitialPlayerResponse.adPlacements,undefined);
 assert.equal(c.ytInitialPlayerResponse.playerAds,undefined);
 assert.equal(c.ytInitialPlayerResponse.videoDetails.videoId,'keep');
});
test('imported runtime disables the two targeted YouTube experiment flags',()=>{
 const c=runtime();vm.runInContext('ytcfg={data_:{EXPERIMENT_FLAGS:{all_web_enable_network_machine:true,all_web_network_machine_raw_request:true}}}',c);
 assert.equal(c.ytcfg.data_.EXPERIMENT_FLAGS.all_web_enable_network_machine,false);
 assert.equal(c.ytcfg.data_.EXPERIMENT_FLAGS.all_web_network_machine_raw_request,false);
});
test('unrelated hosts do not receive YouTube hooks',()=>{
 const c=runtime('example.com');assert.equal(c.ytInitialPlayerResponse,undefined);
 assert.equal(vm.runInContext('Object.getOwnPropertyDescriptor(globalThis,"ytInitialPlayerResponse")',c),undefined);
});
test('ad status replacement outranks blocking and is accessible only at declared resource',()=>{
 const rules=JSON.parse(fs.readFileSync('extension/rules/youtube.json'));
 const redirect=rules.find(r=>r.action.type==='redirect');
 const manifest=JSON.parse(fs.readFileSync('extension/manifest.json'));
 assert.ok(manifest.web_accessible_resources[0].matches.includes('https://www.youtube.com/*'));
 assert.ok(redirect.priority>rules.find(r=>r.condition.requestDomains?.includes('doubleclick.net')).priority);
 const c=vm.createContext({});vm.runInContext('window=globalThis',c);
 vm.runInContext(fs.readFileSync('extension'+redirect.action.redirect.extensionPath,'utf8'),c);
 assert.equal(c.google_ad_status,1);
});
