const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function setup() {
  const source = fs.readFileSync('extension/background.js', 'utf8').replace(/^import .*;$/m, '');
  let listener, enabled, registered = false, rules = true, fail = false;
  const chrome = {
    runtime: { id: 'test', getURL: p => `chrome-extension://test/${p}`, getManifest: () => ({version:'0.1.0'}),
      onInstalled: {addListener(){}}, onStartup:{addListener(){}}, onMessage:{addListener(fn){listener=fn;}} },
    storage:{local:{get:async()=>({enabled}),set:async v=>{enabled=v.enabled;}}},
    scripting:{getRegisteredContentScripts:async()=>registered?[{id:'page'}]:[], registerContentScripts:async()=>{registered=true;},
      updateContentScripts:async()=>{},unregisterContentScripts:async()=>{registered=false;}},
    declarativeNetRequest:{getEnabledRulesets:async()=>rules?['ads']:[],updateEnabledRulesets:async v=>{
      if(fail){fail=false;throw Error('simulated failure');} rules=v.enableRulesetIds.length>0;
    }}, action:{setBadgeText:async()=>{},setBadgeBackgroundColor:async()=>{}}
  };
  vm.runInNewContext(source,{chrome,console,SCRIPT:{id:'page'},RULESET:'ads',RULE_REVISION:'test'});
  const sender={id:'test',url:'chrome-extension://test/popup/popup.html'};
  return {send:message=>new Promise(resolve=>listener(message,sender,resolve)),listener,sender,
    failNext(){fail=true;},snapshot:()=>({enabled,registered,rules})};
}
test('background repairs configuration, pauses, resumes and reports actual state', async()=>{
 const app=setup(); assert.equal((await app.send({type:'GET_STATE'})).healthy,true);
 let state=await app.send({type:'SET_ENABLED',enabled:false}); assert.equal(state.enabled,false);assert.equal(state.healthy,true);
 assert.deepEqual(app.snapshot(),{enabled:false,registered:false,rules:false});
 state=await app.send({type:'SET_ENABLED',enabled:true}); assert.equal(state.healthy,true);
 assert.deepEqual(app.snapshot(),{enabled:true,registered:true,rules:true});
});
test('configuration failure rolls back without saving the failed preference',async()=>{
 const app=setup();await app.send({type:'GET_STATE'}); app.failNext();
 assert.equal((await app.send({type:'SET_ENABLED',enabled:false})).ok,false);
 assert.equal((await app.send({type:'GET_STATE'})).enabled,true);
 assert.equal(app.snapshot().registered,true); assert.equal(app.snapshot().rules,true);
});
test('rapid requests serialize and the final user preference wins',async()=>{
 const app=setup(); await Promise.all([app.send({type:'SET_ENABLED',enabled:false}),app.send({type:'SET_ENABLED',enabled:true}),app.send({type:'SET_ENABLED',enabled:false})]);
 assert.deepEqual(app.snapshot(),{enabled:false,registered:false,rules:false});
});
test('webpage, content script, malformed and foreign extension messages are rejected',()=>{
 const app=setup();const reply=()=>assert.fail('unexpected reply');
 for(const sender of [{id:'other',url:app.sender.url},{id:'test',url:'https://www.youtube.com/watch?v=test'},{id:'test'}])
 assert.equal(app.listener({type:'SET_ENABLED',enabled:false},sender,reply),false);
 assert.equal(app.listener({type:'SET_ENABLED',enabled:'false'},app.sender,reply),false);
 assert.equal(app.listener({type:'UNKNOWN'},app.sender,reply),false);
});
