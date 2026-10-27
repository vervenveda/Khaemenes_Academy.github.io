/* Archaemenes academic resolver contract v1 — read-only, public-safe.
   No learner identities, assessment keys, persistence, network, or authority changes.
   Prepared for a separately reviewed conversation-v2 integration. */
(function(global){
  "use strict";
  const entries=Object.freeze([
    Object.freeze({id:"algebra1-functions",course:"algebra-1",terms:["function","relation","input","output"],hint:"Check each input: does it have exactly one output? Different inputs may share the same output.",practice:"Create a mapping for inputs 1, 2, and 3. Decide whether repeating an input with a different output preserves the function rule.",review:"Distinguish repeated identical ordered pairs from one input with conflicting outputs."}),
    Object.freeze({id:"algebra1-slope",course:"algebra-1",terms:["slope","rate of change"],hint:"Compare changes in output against changes in input. Keep the units attached to the rate.",practice:"A seedling grows from 5 cm to 17 cm over 4 days. Explain the average growth per day.",review:"Verify the order of subtraction and distinguish a rate from a starting value."}),
    Object.freeze({id:"algebra1-inequalities",course:"algebra-1",terms:["inequality","at least","at most"],hint:"Test the boundary case and ask whether equality belongs in the allowed set.",practice:"A club admits no more than 22 attendees. Write a constraint for the attendance count.",review:"When multiplying by a negative, check whether the inequality direction was reversed."}),
    Object.freeze({id:"algebra1-quadratics",course:"algebra-1",terms:["quadratic","parabola","vertex","factoring"],hint:"Decide whether the question asks for zeros, symmetry, or a maximum or minimum before choosing a form.",practice:"For y=(x−3)²+2, describe what the expression reveals about its graph.",review:"Do not confuse the x-intercepts with the vertex, and check contextual restrictions on roots."})
  ]);
  function clean(value,limit=160){return typeof value==="string"?value.replace(/[<>\u0000-\u001f]/g,"").trim().slice(0,limit):""}
  function resolve(raw){
    if(!raw||typeof raw!=="object"||Array.isArray(raw))return null;
    const course=clean(raw.courseId||raw.course,80).toLowerCase();
    if(!/^(?:algebra[\s-]*i|algebra[\s-]*1|a1)$/.test(course))return null;
    if(raw.protected===true||raw.locked===true||raw.answerKey!=null||raw.questions!=null||raw.answers!=null)return null;
    const topic=[clean(raw.title),clean(raw.objective),clean(raw.focus),...(Array.isArray(raw.skills)?raw.skills.slice(0,8).map(x=>clean(x,60)):[])].join(" ").toLowerCase();
    if(!topic)return null;
    const item=entries.find(e=>e.terms.some(t=>topic.includes(t)));
    if(!item)return null;
    const action=clean(raw.action,30).toLowerCase();
    const kind=/^(hint|clue)$/.test(action)?"hint":/^(practice|example)$/.test(action)?"practice":/^(review|misconception)$/.test(action)?"review":null;
    if(!kind)return null;
    return Object.freeze({schema:"archaemenes-reviewed-academic-reply-v1",entryId:item.id,courseId:item.course,kind,text:item[kind],ungraded:true,authority:"guidance-only"});
  }
  global.KhaemenesArchaemenesAcademicResolverV1=Object.freeze({version:"1.0.0",resolve,entryCount:entries.length});
})(window);
