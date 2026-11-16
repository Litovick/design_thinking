export function recommend(profile,jobs){
 const text=[profile.interests,profile.experience,profile.tools,profile.certificates,profile.other].filter(Boolean).join(' ').toLowerCase();
 return jobs.map(job=>{let score=0;const reasons=[];
 const major=job.majors.find(x=>(profile.major||'').includes(x));if(major){score+=3;reasons.push(`${profile.major} 전공의 조사·학습 경험을 ${job.field} 분야로 연결할 수 있습니다.`)}
 const matches=[job.name,job.field,...job.skills,...job.tasks].filter(x=>text.includes(x.toLowerCase()));if(matches.length){score+=matches.length*2;reasons.push(`관심·경험에 입력한 ${[...new Set(matches)].join(', ')}와 연결됩니다.`)}
 const values=(profile.values||[]).filter(x=>job.conditions.includes(x));if(values.length){score+=values.length;reasons.push(`${values.join('·')} 관점에서 업무와 진입 경로를 살펴볼 만합니다.`)}
 if(profile.region&&job.regions.includes(profile.region)){score++;reasons.push(`${profile.region}의 관련 기관·공고를 탐색할 수 있습니다. 현재 채용을 보장하지 않습니다.`)}
 if(profile.work&&job.work.includes(profile.work)){score++;reasons.push(`${profile.work} 공고를 중심으로 근무 조건을 비교해 보세요.`)}
 if(!reasons.length)reasons.push('입력 정보가 적어 다양한 직무를 탐색 후보로 제안합니다. 관심·경험을 추가하면 순서가 달라집니다.');
 return {job,score,reasons};}).sort((a,b)=>b.score-a.score);
}
export function mascotState(last,now=Date.now()){const days=last?Math.max(0,Math.floor((now-last)/86400000)):0;return {days,key:days>=14?'rotten':days>=7?'wilted':days>=3?'worried':'fresh'};}
export function schedule(profile,count,now=new Date()){
 const match=/^(\d{4})-(\d{2})$/.exec(profile.graduation||'');
 const fallback=Math.max(3,(5-(Number(profile.year)||4))*6);
 const end=match?new Date(+match[1],+match[2]-1,1):new Date(now.getFullYear(),now.getMonth()+fallback,1);
 const months=Math.max(0,(end.getFullYear()-now.getFullYear())*12+end.getMonth()-now.getMonth());
 return Array.from({length:count},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth()+Math.floor(i*Math.min(months,24)/Math.max(1,count)),1);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;});
}
export function createPlan(job,profile,skills={},now=new Date()){
 const activities=job.activities.flatMap(a=>{const level=skills[a.skill]?.level||'none';return level==='experienced'?[]:(level==='learning'?[a.project,a.evidence]:[a.learn,a.project,a.evidence]).map(title=>({id:crypto.randomUUID(),title,skill:a.skill,status:'planned',result:'',link:''}));});
 const dates=schedule(profile,activities.length,now);return {jobId:job.id,skills,activities:activities.map((a,i)=>({...a,date:dates[i]}))};
}
