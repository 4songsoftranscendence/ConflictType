import { useState, useEffect, useRef, useCallback } from "react";

const CONFLICTS = [
  {
    id:1,era:"20th Century",region:"Western Europe",nameA:"Valdria",nameB:"Therenos",
    briefing:"A narrow peninsula of rock, barely 7km\u00B2, juts from the southern coast of a large nation. For three centuries, it's been governed by a maritime empire across the sea \u2014 ceded by treaty after a war. The local population overwhelmingly votes to remain under foreign rule. The neighboring nation insists the territory is a colonial holdover violating its territorial integrity.",
    sideA:{label:"The Valdric Crown",claim:"The inhabitants voted 98% to stay with us. Self-determination is paramount. We've governed here 300 years under a binding treaty.",values:["self-determination","democratic-will","treaty-law"]},
    sideB:{label:"The Republic of Therenos",claim:"A colonial relic on our coast. No treaty signed under duress centuries ago overrides geography and history. Decolonization demands its return.",values:["territorial-integrity","anti-colonialism","historical-continuity"]},
    reveal:"Gibraltar \u2014 Britain vs Spain since 1713.",
    nuance:"Democratic self-determination vs anti-colonial territorial claims. Does a 98% vote override the principle that colonialism is inherently illegitimate?"
  },
  {
    id:2,era:"20th\u201321st Century",region:"South Asia",nameA:"Suryapur",nameB:"Qamaristan",
    briefing:"A mountainous valley at the junction of three nuclear powers. When colonial rulers departed, the local prince hesitated to join either new nation. Tribal fighters invaded; he signed accession documents with one nation for military aid. The other claims the population is culturally aligned with them. Decades of insurgency and a fortified line of control followed.",
    sideA:{label:"The Suryapur Union",claim:"The ruler legally acceded to us. The instrument of accession is binding under international law. Our constitution integrates this as sovereign territory.",values:["legal-precedent","constitutional-order","institutional-process"]},
    sideB:{label:"The Republic of Qamaristan",claim:"The population is overwhelmingly our faith and culture. The accession was coerced. UN resolutions called for a plebiscite never held. Let the people choose.",values:["self-determination","cultural-identity","UN-mandates"]},
    reveal:"Kashmir \u2014 India vs Pakistan since 1947.",
    nuance:"Legal instruments vs popular will. Both sides invoke 'self-determination' but define it completely differently."
  },
  {
    id:3,era:"Late 20th Century",region:"Western Europe",nameA:"Aldermark",nameB:"Eireann",
    briefing:"A province within a larger nation experienced decades of sectarian violence. One community identifies with the governing nation; the other with a neighboring country sharing their faith. The minority faced systemic discrimination. Paramilitaries on both sides carried out bombings. The government deployed soldiers, but allegations of state collusion deepened the rift.",
    sideA:{label:"The Aldermark Unionists",claim:"This province is constitutionally ours. The majority wishes to remain. We're defending against terrorism. Our identity is rooted here for centuries.",values:["democratic-majority","constitutional-order","cultural-tradition"]},
    sideB:{label:"The Eireann Nationalists",claim:"This border was drawn to guarantee a manufactured majority. We faced decades of discrimination. The partition itself was the original injustice. We seek reunification.",values:["anti-partition","civil-rights","historical-justice"]},
    reveal:"Northern Ireland \u2014 'The Troubles' (1968\u20131998).",
    nuance:"If a border was drawn specifically to create a demographic advantage, does 'majority rule' carry the same moral weight?"
  },
  {
    id:4,era:"21st Century",region:"Eastern Europe",nameA:"Voronsk",nameB:"Halychnyk",
    briefing:"A peninsula with a naval base was transferred between Soviet republics in 1954 as an administrative gesture. After the USSR collapsed, it landed in a newly independent nation. The population speaks the former empire's language. After a revolution toppled a friendly government, armed forces without insignia appeared. A referendum under military occupation returned 97% for rejoining the motherland.",
    sideA:{label:"The Voronsk Federation",claim:"These people are historically and culturally ours. The 1954 transfer was bureaucratic. The referendum reflects genuine will. We're protecting our people.",values:["ethnic-kinship","historical-claim","protection-of-diaspora"]},
    sideB:{label:"The Republic of Halychnyk",claim:"Borders can't be redrawn by military force and sham referendums. Every nation recognized these boundaries. If ethnic affinity justified annexation, no multi-ethnic state would be safe.",values:["international-law","territorial-integrity","anti-aggression"]},
    reveal:"Crimea \u2014 annexed by Russia from Ukraine in 2014.",
    nuance:"Ethnic bonds as legitimate sovereignty basis vs international borders as inviolable. Your answer reveals whether you trust the post-WWII order."
  },
  {
    id:5,era:"19th\u201320th Century",region:"East Asia",nameA:"The Crimson Republic",nameB:"Highland Sangha",
    briefing:"A vast highland plateau governed by a theocratic monarchy had an ambiguous relationship with a neighboring empire. When that empire became a revolutionary republic, it marched soldiers in. The spiritual leader fled. The new government abolished serfdom and built infrastructure \u2014 but also destroyed monasteries, suppressed religion, and relocated settlers from the lowlands.",
    sideA:{label:"The Crimson Republic",claim:"We liberated these people from feudal theocratic oppression. Serfs freed, schools built, life expectancy doubled. Our sovereignty is morally justified by progress.",values:["historical-sovereignty","social-progress","anti-feudalism"]},
    sideB:{label:"The Highland Sangha (in exile)",claim:"We were an independent civilization. The invasion destroyed our culture. Material progress at gunpoint isn't liberation. We seek autonomy.",values:["cultural-preservation","self-governance","religious-freedom"]},
    reveal:"Tibet \u2014 occupied by China in 1950.",
    nuance:"Material progress vs cultural sovereignty. If an occupier improves living standards but destroys identity \u2014 liberation or colonialism?"
  },
  {
    id:6,era:"20th Century",region:"South Atlantic",nameA:"Pelagic Commonwealth",nameB:"Rep\u00FAblica Austral",
    briefing:"Windswept islands 400 miles from one continent, 8,000 from the other. Governed by a distant power for 150 years. The few thousand inhabitants wish to remain. A military junta on the nearby continent invades, claiming the islands were stolen in the 1830s. The distant power sends a task force across the globe.",
    sideA:{label:"The Pelagic Commonwealth",claim:"Continuously settled by us. Inhabitants are our citizens who wish to remain. A dictatorship doesn't gain legitimacy by invasion.",values:["self-determination","defense-of-citizens","anti-aggression"]},
    sideB:{label:"La Rep\u00FAblica Austral",claim:"On our continental shelf, seized by colonial force. 'Settlers' are implanted \u2014 their presence doesn't legitimize theft.",values:["geographic-proximity","anti-colonialism","regional-consensus"]},
    reveal:"Falkland Islands / Malvinas \u2014 Britain vs Argentina, 1982.",
    nuance:"Can a population 'implanted' by colonialism later invoke self-determination? Does time legitimize settlement?"
  },
  {
    id:7,era:"19th\u201320th Century",region:"Western Europe",nameA:"Gallia",nameB:"Ostmark",
    briefing:"A fertile borderland changed hands four times in 75 years. After a devastating war, the victors transferred it without a plebiscite. The losers saw this as profound humiliation. A generation later, they seized it back. After the next war, it returned again. Today it's peacefully integrated, but scars persist.",
    sideA:{label:"The Republic of Gallia",claim:"This region was ours before it was taken by force. Its return corrected aggression. The population has integrated. The matter is settled.",values:["historical-restoration","cultural-integration","settled-borders"]},
    sideB:{label:"The Ostmark Federation",claim:"For much of history this was ours. It was stripped as punishment without consulting inhabitants. Using defeat to redraw borders creates resentment cycles.",values:["self-determination","anti-punitive-borders","plebiscite-rights"]},
    reveal:"Alsace-Lorraine \u2014 France vs Germany, 1871\u20131945.",
    nuance:"Should military victory determine borders? Both sides have genuine connections. Are borders expressions of power or reflections of identity?"
  },
  {
    id:8,era:"20th\u201321st Century",region:"North Africa",nameA:"Amber Kingdom",nameB:"Sahrawi Front",
    briefing:"A desert territory was colonized by a European power. When they withdrew, a neighboring kingdom marched in. An indigenous liberation movement fought back. The UN promised a referendum \u2014 never held. The kingdom has since settled hundreds of thousands of its own citizens in the territory.",
    sideA:{label:"The Amber Kingdom",claim:"Historically our domain before colonialism. We've invested heavily. The population is integrated. A referendum is no longer practical given demographics.",values:["historical-sovereignty","investment-legitimacy","stability"]},
    sideB:{label:"The Sahrawi Front",claim:"We're indigenous with UN-recognized self-determination rights. The settlers were brought to rig any vote. Our people live in refugee camps.",values:["self-determination","anti-occupation","international-law"]},
    reveal:"Western Sahara \u2014 Morocco vs Polisario Front since 1975.",
    nuance:"If a state settles enough citizens in disputed territory, does that change the moral calculus? Demographic engineering vs self-determination."
  },
  {
    id:9,era:"20th Century",region:"East Asia",nameA:"Mainland Authority",nameB:"Harbor Movement",
    briefing:"A port city leased to a colonial empire for 99 years became a global financial center with freedoms far exceeding the mainland. Sovereignty transferred under 'one country, two systems' promising 50 years of autonomy. Within two decades, the mainland tightened control \u2014 restricting elections, prosecuting dissidents, imposing security laws. Massive protests erupted.",
    sideA:{label:"The Mainland Authority",claim:"This city was always ours \u2014 the colonial period was forced by unequal treaties. Security measures address foreign-backed destabilization. Sovereignty isn't negotiable.",values:["sovereignty","anti-colonialism","national-security"]},
    sideB:{label:"The Harbor Movement",claim:"We were promised autonomy, free press, independent judiciary for 50 years. Those promises are being broken. We want the rights guaranteed to us. A promise is a promise.",values:["civil-liberties","rule-of-law","contractual-obligation"]},
    reveal:"Hong Kong \u2014 handover 1997; 2019\u20132020 protests.",
    nuance:"Sovereignty vs civil liberties. Can rights gained under colonialism be legitimate? Does breaking a promise void the sovereignty claim?"
  },
  {
    id:10,era:"20th Century",region:"Caribbean",nameA:"Northern Colossus",nameB:"Revolutionary Isle",
    briefing:"A small island ninety miles from a superpower overthrew a corrupt dictator. The new government nationalized industries and aligned with a rival superpower. The nearby superpower imposed an embargo and attempted invasion. The revolution brought healthcare and literacy but also one-party rule and political imprisonment.",
    sideA:{label:"The Northern Colossus",claim:"A hostile government aligned with our rival, ninety miles away, is unacceptable. They seized property, jail journalists. Our embargo pressures reform.",values:["national-security","property-rights","democratic-promotion"]},
    sideB:{label:"The Revolutionary Isle",claim:"We overthrew a dictator YOU propped up. We chose our own path \u2014 literacy, healthcare, sovereignty. Your embargo punishes civilians for defying you.",values:["sovereignty","anti-imperialism","social-welfare"]},
    reveal:"Cuba \u2014 U.S. embargo since 1962.",
    nuance:"Does a small nation's self-determination include choosing authoritarianism? Does a superpower's security justify decades of civilian economic pressure?"
  },
  {
    id:11,era:"16th\u201321st Century",region:"Oceania",nameA:"Settler Parliament",nameB:"Tangata Whenua",
    briefing:"Indigenous people inhabited islands for centuries before Europeans. A treaty was signed \u2014 but translations differed critically. One version ceded sovereignty; the other retained indigenous authority. Colonization proceeded. Lands confiscated, language suppressed. Today the nation debates how to honor a treaty never honored.",
    sideA:{label:"The Settler Parliament",claim:"We acknowledge wrongs and established tribunals. But full restitution is impractical. Moving forward together matters more than relitigating the past.",values:["pragmatic-reconciliation","present-rights","institutional-remedy"]},
    sideB:{label:"The Tangata Whenua",claim:"The treaty was violated from day one. Money doesn't restore language or sovereignty. Honor what your ancestors signed. Co-governance is what was promised.",values:["treaty-honor","indigenous-sovereignty","co-governance"]},
    reveal:"New Zealand / Aotearoa \u2014 Treaty of Waitangi, 1840.",
    nuance:"Do historical injustices have a statute of limitations? If a treaty was never honored, does time diminish the obligation?"
  },
  {
    id:12,era:"20th\u201321st Century",region:"South Caucasus",nameA:"Azeran Republic",nameB:"Artsavan Enclave",
    briefing:"A mountainous enclave of one ethnic group was assigned by a Soviet dictator to a different republic. When the USSR collapsed, the enclave declared independence. War followed. It existed as a de facto state for 30 years. Then the surrounding republic launched a drone offensive. The entire population \u2014 100,000+ \u2014 fled in days.",
    sideA:{label:"The Azeran Republic",claim:"Internationally recognized as ours. Illegally occupied for 30 years. We reclaimed what's legally ours.",values:["territorial-integrity","international-law","settled-borders"]},
    sideB:{label:"The Artsavan Council",claim:"We've lived in these mountains for millennia. A dictator's 1921 pen stroke doesn't erase our heritage. Our people were ethnically cleansed.",values:["self-determination","ethnic-kinship","cultural-preservation"]},
    reveal:"Nagorno-Karabakh \u2014 Azerbaijan vs Armenia; recaptured 2023.",
    nuance:"When does 'restoring territorial integrity' become ethnic cleansing? The entire indigenous population was displaced in days."
  },
  {
    id:13,era:"20th\u201321st Century",region:"Eastern Mediterranean",nameA:"Anatolian Republic",nameB:"Cypriot Union",
    briefing:"An island with two ethnic communities gained independence. Intercommunal violence erupted. One community's patron mainland attempted annexation. The other's patron invaded and occupied the northern third. The island has been divided for fifty years. The occupation is recognized by no country except the occupier.",
    sideA:{label:"The Northern Sector",claim:"We intervened to prevent genocide. Partition was the only path to safety for our community.",values:["protection-of-diaspora","ethnic-kinship","national-security"]},
    sideB:{label:"The Cypriot Government",claim:"A foreign military occupies a third of our territory. Hundreds of thousands displaced. No country recognizes this. Fifty years isn't security \u2014 it's colonization.",values:["territorial-integrity","anti-occupation","international-law"]},
    reveal:"Cyprus \u2014 divided since Turkey's 1974 invasion.",
    nuance:"Can a legitimate initial motivation (preventing genocide) justify permanent division? When does protection become occupation?"
  },
  {
    id:14,era:"21st Century",region:"Western Europe",nameA:"Central Kingdom",nameB:"Catal\u00E1n Republic",
    briefing:"A wealthy, culturally distinct region with its own language held an independence referendum \u2014 declared illegal. Police blocked voters. It passed overwhelmingly among participants. The central government arrested leaders for sedition.",
    sideA:{label:"The Central Kingdom",claim:"The constitution forbids unilateral secession. The referendum was illegal and boycotted. If every wealthy region could leave, no nation survives. Rule of law, not mob rule.",values:["constitutional-order","rule-of-law","territorial-integrity"]},
    sideB:{label:"The Catal\u00E1n Movement",claim:"We tried to vote peacefully. They sent riot police. Our leaders are political prisoners. A constitution that forbids self-determination is a cage.",values:["self-determination","democratic-will","cultural-identity"]},
    reveal:"Catalonia \u2014 2017 referendum declared illegal by Spain.",
    nuance:"Constitutional law vs popular sovereignty. If a constitution forbids secession, is self-determination illegal \u2014 or is the constitution unjust?"
  },
  {
    id:15,era:"20th\u201321st Century",region:"East Asia",nameA:"Western Archipelago",nameB:"Eastern Isle",
    briefing:"Uninhabited rocky islets between two nations. One incorporated them in 1905 during colonial expansion over the other. After liberation, the colonized nation stationed police there. The former colonizer says incorporation predated colonization. The dispute is a lightning rod for unresolved historical trauma.",
    sideA:{label:"The Western Archipelago",claim:"We incorporated these through proper legal procedure before any colonial treaty. They're not colonial spoils.",values:["legal-precedent","treaty-law","institutional-process"]},
    sideB:{label:"The Eastern Isle Republic",claim:"You 'incorporated' them the same year you colonized our entire nation. Our records go back centuries. We will never relinquish them.",values:["anti-colonialism","historical-claim","historical-justice"]},
    reveal:"Dokdo / Takeshima \u2014 South Korea vs Japan.",
    nuance:"Can legal procedures during colonial expansion be separated from colonialism? The rocks are worthless \u2014 the dispute is about unprocessed trauma."
  },
  {
    id:16,era:"20th\u201321st Century",region:"Indian Ocean",nameA:"Imperial Remnant",nameB:"Island Republic",
    briefing:"A remote archipelago was carved from a colony just before independence \u2014 as a condition of granting freedom. Inhabitants were forcibly removed for a military base. The ICJ ruled the separation illegal. The colonial power refuses to comply.",
    sideA:{label:"The Imperial Remnant",claim:"This base is critical to global security. We've offered compensation. Strategic reality must take precedence.",values:["national-security","stability","pragmatic-reconciliation"]},
    sideB:{label:"The Island Republic",claim:"You carved our territory as a condition of freedom \u2014 that's extortion. You deported our citizens. The World Court says it's illegal. Give it back.",values:["anti-colonialism","international-law","anti-displacement"]},
    reveal:"Chagos Islands \u2014 Britain/Mauritius; U.S. base Diego Garcia; ICJ ruled 2019.",
    nuance:"Can strategic necessity override a World Court ruling? One of the clearest colonial injustices still unresolved."
  },
  {
    id:17,era:"20th\u201321st Century",region:"Middle East",nameA:"Kurdan Congress",nameB:"Four Host States",
    briefing:"30\u201340 million people with their own language and culture were promised a state after WWI. Promise broken. Their homeland carved among four nations. A century of suppression, chemical weapons, and military campaigns. They carved autonomous zones, fought extremists alongside international coalitions \u2014 then were abandoned.",
    sideA:{label:"The Kurdan Congress",claim:"Largest stateless nation on earth. Promised a homeland, betrayed. We fought the extremists when no one else would. We've earned self-governance.",values:["self-determination","cultural-identity","historical-justice"]},
    sideB:{label:"The Host States",claim:"An independent Kurdan state destabilizes four nations. Our Kurdan citizens have equal rights. Autonomy movements are exploited by foreign powers.",values:["territorial-integrity","stability","sovereignty"]},
    reveal:"Kurdistan \u2014 Kurds split across Turkey, Iraq, Syria, Iran.",
    nuance:"Should the international order's commitment to existing borders outweigh the rights of 40 million people explicitly promised a homeland?"
  },
  {
    id:18,era:"21st Century",region:"Southeast Asia",nameA:"Celestial Republic",nameB:"Coastal Nations",
    briefing:"A rising power claims vast ocean stretches \u2014 islands, reefs, shipping lanes hundreds of miles from its coast. Based on 'historical usage.' An international tribunal ruled the claim baseless. The power rejected the ruling, built artificial military islands, and harasses neighboring fishermen.",
    sideA:{label:"The Celestial Republic",claim:"Our sailors navigated these waters for a thousand years. Historical maps prove it. We reject the tribunal. Our development brings regional stability.",values:["historical-sovereignty","historical-claim","stability"]},
    sideB:{label:"The Coastal Coalition",claim:"You can't claim a sea from old maps. The tribunal ruling is binding. Your artificial islands are on our shelf. This is imperial expansion with extra steps.",values:["international-law","anti-aggression","rule-of-law"]},
    reveal:"South China Sea \u2014 China's nine-dash line; rejected by The Hague, 2016.",
    nuance:"Historical usage vs modern law. When a major power ignores a binding ruling, what does 'international law' actually mean?"
  },
  {
    id:19,era:"20th\u201321st Century",region:"Eastern Europe",nameA:"Dniestrian Republic",nameB:"Moldavan State",
    briefing:"When a Soviet republic gained independence, a narrow strip along a river declared its own. The population is mixed thirds of three ethnicities. A brief war ended with 'peacekeeping' troops from the former empire \u2014 still there. The breakaway has its own government and currency but is recognized by nobody. Its economy depends on smuggling.",
    sideA:{label:"The Dniestrian Republic",claim:"We declared independence the same time they did \u2014 why is theirs legitimate? We voted overwhelmingly. We've governed ourselves 30 years.",values:["self-determination","democratic-will","ethnic-kinship"]},
    sideB:{label:"The Moldavan State",claim:"A puppet propped up by a foreign military. No country recognizes it. The 'referendum' was held under imperial guns. This is manufactured separatism for leverage.",values:["territorial-integrity","anti-aggression","sovereignty"]},
    reveal:"Transnistria \u2014 breakaway Moldova, Russian troops since 1992.",
    nuance:"Can self-determination be genuine when sustained entirely by a foreign military? If the soldiers left, would the state survive?"
  }
];

const VL={"self-determination":"Self-Determination","democratic-will":"Democratic Will","treaty-law":"Treaty Law","territorial-integrity":"Territorial Integrity","anti-colonialism":"Anti-Colonialism","historical-continuity":"Historical Continuity","legal-precedent":"Legal Precedent","constitutional-order":"Constitutional Order","institutional-process":"Institutional Process","cultural-identity":"Cultural Identity","UN-mandates":"UN Mandates","democratic-majority":"Democratic Majority","cultural-tradition":"Cultural Tradition","anti-partition":"Anti-Partition","civil-rights":"Civil Rights","historical-justice":"Historical Justice","ethnic-kinship":"Ethnic Kinship","historical-claim":"Historical Claim","protection-of-diaspora":"Protect Diaspora","international-law":"International Law","anti-aggression":"Anti-Aggression","cultural-preservation":"Cultural Preservation","self-governance":"Self-Governance","religious-freedom":"Religious Freedom","historical-sovereignty":"Historical Sovereignty","social-progress":"Social Progress","anti-feudalism":"Anti-Feudalism","defense-of-citizens":"Defense of Citizens","geographic-proximity":"Geographic Proximity","regional-consensus":"Regional Consensus","historical-restoration":"Historical Restoration","cultural-integration":"Cultural Integration","settled-borders":"Settled Borders","anti-punitive-borders":"Anti-Punitive Borders","plebiscite-rights":"Plebiscite Rights","investment-legitimacy":"Investment Legitimacy","stability":"Stability","anti-occupation":"Anti-Occupation","sovereignty":"Sovereignty","national-security":"National Security","civil-liberties":"Civil Liberties","rule-of-law":"Rule of Law","contractual-obligation":"Contractual Obligation","anti-displacement":"Anti-Displacement","property-rights":"Property Rights","democratic-promotion":"Democratic Promotion","anti-imperialism":"Anti-Imperialism","social-welfare":"Social Welfare","pragmatic-reconciliation":"Pragmatic Reconciliation","present-rights":"Present-Day Rights","institutional-remedy":"Institutional Remedy","treaty-honor":"Treaty Honor","indigenous-sovereignty":"Indigenous Sovereignty","co-governance":"Co-Governance"};

const ARCHETYPES=[
  {name:"The Constitutionalist",emoji:"\uD83D\uDCDC",tagline:"Rules exist for a reason. Even bad rules.",
    personality:"You read the fine print. \"We had an agreement\" is your kill shot. At work you thrive in structure and get quietly furious when process is ignored. In friend drama, you're the one who says \"that's not what we agreed to.\" Your dating profile should say: \"Will read the lease before signing.\"\n\nBlind spot: sometimes the rules ARE the problem.",
    color:"#4a7c59",keys:["treaty-law","legal-precedent","constitutional-order","international-law","rule-of-law","contractual-obligation","institutional-process"]},
  {name:"The Populist",emoji:"\uD83D\uDDF3",tagline:"If the people voted for it, that settles it.",
    personality:"You poll the group chat for everything \u2014 restaurant, movie, camping spot. You once ended up in a swamp because democracy spoke and you were FINE with it. At work you push for team input and side-eye top-down mandates.\n\nSuperpower: making people feel heard. Kryptonite: 51% of people can be wrong, and a vote doesn't fix that.",
    color:"#7c4a6e",keys:["self-determination","democratic-will","democratic-majority","plebiscite-rights"]},
  {name:"The Anti-Imperialist",emoji:"\u270A",tagline:"Power doesn't make right. It just writes the textbooks.",
    personality:"You can trace any problem to \"well, actually, in the 1800s...\" and you're usually right, which makes it worse. You've ruined at least one dinner party. At work your Slack contains \"I just think it's interesting that...\" followed by something devastating.\n\nGift: you see systems others are blind to. Curse: sometimes your friend just picked that restaurant for the pasta.",
    color:"#c44d3e",keys:["anti-colonialism","anti-imperialism","anti-occupation","anti-displacement","anti-partition","anti-aggression"]},
  {name:"The Culturalist",emoji:"\uD83C\uDFAD",tagline:"A people's soul isn't a line on a map.",
    personality:"You cry at weddings, know your family tree six generations back, and have STRONG opinions about whether that dish is authentic. You've quit a job because of vibes and it was the right call. You fall hard and remember the exact song playing on a first date.\n\nSuperpower: loyalty and emotional intelligence. Blind spot: \"that's who we are\" isn't always reason enough.",
    color:"#b8860b",keys:["cultural-identity","ethnic-kinship","cultural-preservation","cultural-tradition","cultural-integration","religious-freedom"]},
  {name:"The Pragmatist",emoji:"\u2696\uFE0F",tagline:"500 years ago matters less than what works tomorrow.",
    personality:"Five minutes into any argument: \"okay but what are we actually going to DO?\" You turn 90-minute meetings into 15-minute decisions. Your love language is problem-solving, which your partner either adores or finds emotionally infuriating.\n\nStrength: you ship while others debate. Weakness: efficiency isn't justice, and the pragmatic answer is sometimes just the coward's answer in a suit.",
    color:"#5a7d9a",keys:["stability","social-progress","pragmatic-reconciliation","present-rights","investment-legitimacy","national-security","settled-borders"]},
  {name:"The Restorationist",emoji:"\u2721",tagline:"A broken promise doesn't expire. It festers.",
    personality:"You remember every slight and every kindness. You've Venmo-requested someone for dinner from six months ago and felt justified. At work you're the one who says \"we told that client we'd do X\" long after everyone moved on. In relationships, you can't move forward until wrong is acknowledged \u2014 not swept, not \"agree to disagree\" \u2014 named.\n\nGift: you make the world honest. Risk: perfect justice is the enemy of a livable present.",
    color:"#8b5e3c",keys:["historical-justice","historical-restoration","treaty-honor","indigenous-sovereignty","co-governance","civil-rights"]}
];

function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}

const gold="#c8a96e",dim="#5a5345",bg="#1a1714",mono="'DM Mono',monospace",serif="'EB Garamond',Georgia,serif",disp="'Playfair Display',Georgia,serif";

async function callAI(sys,msgs){
  try{
    const r=await fetch("/.netlify/functions/chat",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({system:sys,messages:msgs})
    });
    const d=await r.json();
    return d.text||"Couldn't generate a response.";
  }catch(e){return "Connection error \u2014 try again.";}
}

// --- INTRO ---
function Intro({onStart}){
  const [v,setV]=useState(false);
  const [saved,setSaved]=useState(null);
  useEffect(()=>{
    setTimeout(()=>setV(true),100);
    try{const r=localStorage.getItem("ct-last-result");if(r)setSaved(JSON.parse(r));}catch(e){}
  },[]);
  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"1.5rem",opacity:v?1:0,transform:v?"none":"translateY(20px)",transition:"all 1s"}}>
      <div style={{fontSize:48,marginBottom:"1.5rem"}}>{"\u2694"}</div>
      <h1 style={{fontFamily:disp,fontSize:"clamp(2.4rem,7vw,4rem)",fontWeight:900,color:"#e8dcc8",textAlign:"center",letterSpacing:"-0.03em",lineHeight:1.05,marginBottom:"0.3rem"}}>ConflictType</h1>
      <p style={{fontFamily:mono,fontSize:"clamp(0.65rem,2vw,0.8rem)",color:gold,letterSpacing:"0.1em",textAlign:"center",marginBottom:"2rem"}}>Spotify Wrapped for your sense of justice</p>
      <p style={{fontFamily:serif,fontSize:"clamp(1rem,3vw,1.15rem)",color:"#8a7f70",textAlign:"center",maxWidth:460,lineHeight:1.7,marginBottom:"2.5rem"}}>Real territorial conflicts. Fictional names. Two sides. Pick one. Find out what your instincts say about you.</p>
      <div style={{display:"flex",gap:"0.8rem",flexWrap:"wrap",justifyContent:"center"}}>
        {[[6,"Quick Six",true],[12,"Full Dossier",false]].map(([n,label,filled])=>(
          <button key={n} onClick={()=>onStart(n)} style={{fontFamily:serif,fontSize:"clamp(1rem,3vw,1.1rem)",color:filled?bg:gold,background:filled?gold:"transparent",border:filled?"none":`1px solid ${gold}55`,padding:"0.9rem 2rem",cursor:"pointer",fontWeight:600,letterSpacing:"0.04em",minWidth:160,WebkitTapHighlightColor:"transparent"}}>{label}</button>
        ))}
      </div>
      {saved&&<div style={{marginTop:"2rem",padding:"0.8rem 1.2rem",border:"1px solid #3a352e",textAlign:"center"}}>
        <p style={{fontFamily:mono,fontSize:"0.6rem",color:dim,letterSpacing:"0.1em"}}>LAST RESULT</p>
        <p style={{fontFamily:disp,fontSize:"1.1rem",color:"#e8dcc8"}}>{saved.archetype}</p>
      </div>}
    </div>
  );
}

// --- CONFLICT CARD ---
function Card({conflict:c,index:idx,total,onChoice,leaving}){
  const [sel,setSel]=useState(null);
  const [locked,setLocked]=useState(false);
  const [entered,setEntered]=useState(false);
  const [hov,setHov]=useState(null);
  const [aiOpen,setAiOpen]=useState(false);
  const [aiMsgs,setAiMsgs]=useState([]);
  const [aiLoading,setAiLoading]=useState(false);
  const [userQ,setUserQ]=useState("");
  const [cache,setCache]=useState({});
  const endRef=useRef(null);

  useEffect(()=>{
    setSel(null);setLocked(false);setEntered(false);setHov(null);setAiOpen(false);setAiMsgs([]);setAiLoading(false);setCache({});
    setTimeout(()=>setEntered(true),50);
  },[c.id]);

  useEffect(()=>{
    const sys=`You are a sharp geopolitical analyst. Scenario:\n\n${c.briefing}\n\nSide A (${c.sideA.label}): ${c.sideA.claim}\nSide B (${c.sideB.label}): ${c.sideB.claim}\n\nRULES: NEVER reveal the real conflict or real names. Only use fictional names. Be conversational, insightful, under 100 words. No markdown.`;
    const prompts={"What ethical frameworks apply here?":`What ethical frameworks (utilitarian, Rawlsian, communitarian, etc.) are most relevant to this conflict? How would each judge differently?`,
      "Strongest case for each side?":`Give me the single strongest argument for each side \u2014 the one that would make even the other side pause.`,
      "What am I not considering?":`What dimension of this conflict am I probably overlooking? What would make someone who disagrees with me say "you haven't thought about..."?`};
    Object.entries(prompts).forEach(([label,q])=>{
      callAI(sys,[{role:"user",content:q}]).then(r=>setCache(prev=>({...prev,[label]:r})));
    });
  },[c.id]); // eslint-disable-line

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[aiMsgs]);

  const getSys=()=>locked
    ?`You are a sharp, slightly cheeky geopolitical analyst. Conflict: ${c.reveal}\n\n${c.briefing}\n\nSide A (${c.sideA.label}): ${c.sideA.claim}\nSide B (${c.sideB.label}): ${c.sideB.claim}\n\nUser chose: ${c[sel]?.label}\n\nUse real names now. Be insightful, psychologically perceptive, a bit playful. Under 100 words. No markdown.`
    :`You are a sharp geopolitical analyst. Scenario:\n\n${c.briefing}\n\nSide A (${c.sideA.label}): ${c.sideA.claim}\nSide B (${c.sideB.label}): ${c.sideB.claim}\n\nNEVER reveal real conflict or names. Only fictional names. Probe ethical/philosophical dimensions. Under 100 words. No markdown.`;

  const ask=async(q,fromCache)=>{
    if(fromCache&&cache[q]){
      setAiMsgs(p=>[...p,{role:"user",content:q},{role:"assistant",content:cache[q]}]);return;
    }
    if(!q?.trim())return;
    const msgs=[...aiMsgs,{role:"user",content:q}];
    setAiMsgs(msgs);setUserQ("");setAiLoading(true);
    const txt=await callAI(getSys(),msgs.map(m=>({role:m.role,content:m.content})));
    setAiMsgs([...msgs,{role:"assistant",content:txt}]);setAiLoading(false);
  };

  useEffect(()=>{
    if(!locked||!sel)return;
    const sys=`You are a sharp, slightly cheeky geopolitical analyst. Conflict: ${c.reveal}\n\n${c.briefing}\n\nUser chose: ${c[sel]?.label}\n\nUse real names. Be insightful, psychologically perceptive, playful. Under 100 words. No markdown.`;
    const postPrompts={
      "What does my choice say about me?":`I chose ${c[sel]?.label}. What does this reveal about how I think about justice, fairness, and conflict in everyday life?`,
      "Go deeper on this conflict":`Now with full context: what do most people miss about this conflict? What's the uncomfortable truth both sides avoid?`
    };
    Object.entries(postPrompts).forEach(([label,q])=>{
      callAI(sys,[{role:"user",content:q}]).then(r=>setCache(prev=>({...prev,[label]:r})));
    });
  },[locked]); // eslint-disable-line

  const prePrompts=["What ethical frameworks apply here?","Strongest case for each side?","What am I not considering?"];
  const postPrompts=["What does my choice say about me?","Go deeper on this conflict"];

  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",padding:"1.2rem",paddingTop:"clamp(1rem,3vh,2.5rem)",opacity:entered&&!leaving?1:0,transform:entered&&!leaving?"none":"translateY(24px)",transition:"all 0.6s"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",maxWidth:720,marginBottom:"1rem"}}>
        <span style={{fontFamily:mono,fontSize:"0.65rem",color:gold,letterSpacing:"0.15em"}}>CASE {idx+1}/{total}</span>
        <div style={{display:"flex",gap:3}}>{Array.from({length:total}).map((_,i)=><div key={i} style={{width:i===idx?18:6,height:3,background:i<=idx?gold:"#3a352e",borderRadius:1,transition:"all 0.3s"}}/>)}</div>
      </div>

      <div style={{display:"flex",gap:"0.5rem",marginBottom:"1.2rem"}}>
        {[c.era,c.region].map(t=><span key={t} style={{fontFamily:mono,fontSize:"0.6rem",color:"#7a6f60",border:"1px solid #3a352e",padding:"0.2rem 0.5rem"}}>{t}</span>)}
      </div>

      <div style={{maxWidth:720,width:"100%",borderLeft:`2px solid ${gold}33`,paddingLeft:"1.2rem",marginBottom:"1.5rem"}}>
        <p style={{fontFamily:mono,fontSize:"0.6rem",color:gold,letterSpacing:"0.2em",marginBottom:"0.5rem"}}>BRIEFING</p>
        <p style={{fontFamily:serif,fontSize:"clamp(1rem,3vw,1.1rem)",color:"#c8bfb0",lineHeight:1.75}}>{c.briefing}</p>
      </div>

      <div style={{maxWidth:720,width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.8rem",marginBottom:"1.2rem"}}>
        {["sideA","sideB"].map(side=>{
          const s=c[side],isSel=sel===side,isH=hov===side,isLock=locked&&isSel,otherLock=locked&&!isSel,active=!locked;
          return(<div key={side} onClick={()=>active&&setSel(side)} onMouseEnter={()=>active&&setHov(side)} onMouseLeave={()=>setHov(null)}
            style={{border:`1px solid ${isSel?gold:isH?`${gold}77`:"#3a352e"}`,background:isSel?"rgba(200,169,110,0.06)":isH?"rgba(200,169,110,0.03)":"rgba(20,18,15,0.6)",padding:"clamp(0.8rem,2vw,1.3rem)",cursor:active?"pointer":"default",transition:"all 0.25s",opacity:otherLock?0.25:1,position:"relative",transform:isH&&active?"translateY(-2px)":"none",WebkitTapHighlightColor:"transparent"}}>
            {isLock&&<div style={{position:"absolute",top:-7,right:8,background:gold,color:bg,fontFamily:mono,fontSize:"0.5rem",padding:"1px 6px",letterSpacing:"0.12em"}}>YOURS</div>}
            <h3 style={{fontFamily:mono,fontSize:"clamp(0.55rem,1.5vw,0.65rem)",color:isSel?gold:"#8a7f70",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"0.6rem"}}>{s.label}</h3>
            <p style={{fontFamily:serif,fontSize:"clamp(0.85rem,2.5vw,0.95rem)",color:"#a09580",lineHeight:1.65,fontStyle:"italic"}}>"{s.claim}"</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:"0.6rem"}}>
              {s.values.map(v=><span key={v} style={{fontFamily:mono,fontSize:"0.5rem",color:"#6a6055",border:"1px solid #252220",padding:"1px 4px"}}>{VL[v]||v}</span>)}
            </div>
          </div>);
        })}
      </div>

      {!locked&&<div style={{maxWidth:720,width:"100%"}}>
        <div style={{display:"flex",gap:"0.6rem",flexWrap:"wrap"}}>
          <button onClick={()=>{setAiOpen(!aiOpen);if(!aiOpen&&aiMsgs.length===0)ask("What ethical frameworks apply here?",true);}}
            style={{fontFamily:mono,fontSize:"0.65rem",color:gold,background:"transparent",border:`1px solid ${gold}44`,padding:"0.6rem 1.2rem",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
            {aiOpen?"HIDE":"GO DEEPER FIRST"}
          </button>
          {sel&&<button onClick={()=>setLocked(true)} style={{fontFamily:mono,fontSize:"0.7rem",color:bg,background:gold,border:"none",padding:"0.6rem 1.5rem",cursor:"pointer",fontWeight:600,letterSpacing:"0.1em",WebkitTapHighlightColor:"transparent"}}>LOCK IN</button>}
        </div>
        {!sel&&!aiOpen&&<p style={{fontFamily:mono,fontSize:"0.55rem",color:dim,marginTop:"0.5rem"}}>Select a side or explore deeper first</p>}
        {aiOpen&&<AIPanel msgs={aiMsgs} loading={aiLoading} userQ={userQ} setUserQ={setUserQ} ask={ask} prompts={prePrompts} cache={cache} endRef={endRef} label="CLASSIFIED MODE" badge="SPOILER-FREE"/>}
      </div>}

      {locked&&<div style={{maxWidth:720,width:"100%",animation:"fu 0.5s ease forwards"}}>
        <div style={{borderTop:`1px solid ${gold}33`,paddingTop:"1.2rem",marginBottom:"1.2rem"}}>
          <p style={{fontFamily:mono,fontSize:"0.6rem",color:gold,letterSpacing:"0.2em",marginBottom:"0.5rem"}}>DECLASSIFIED</p>
          <p style={{fontFamily:disp,fontSize:"clamp(1.1rem,3vw,1.3rem)",color:"#e8dcc8",lineHeight:1.4,marginBottom:"0.6rem"}}>{c.reveal}</p>
          <p style={{fontFamily:serif,fontSize:"clamp(0.9rem,2.5vw,1rem)",color:"#8a7f70",lineHeight:1.65,fontStyle:"italic"}}>{c.nuance}</p>
        </div>

        <button onClick={()=>onChoice(sel)} style={{fontFamily:mono,fontSize:"0.7rem",color:bg,background:gold,border:"none",padding:"0.7rem 1.8rem",cursor:"pointer",fontWeight:600,letterSpacing:"0.1em",marginBottom:"0.8rem",WebkitTapHighlightColor:"transparent"}}>{idx<total-1?"NEXT \u2192":"SEE MY TYPE \u2192"}</button>

        {!aiOpen&&<div style={{display:"flex",gap:"0.5rem",marginTop:"0.6rem",flexWrap:"wrap"}}>
          {postPrompts.map(p=><button key={p} onClick={()=>{setAiOpen(true);ask(p,true);}} style={{fontFamily:mono,fontSize:"0.6rem",color:"#a09580",background:"rgba(200,169,110,0.04)",border:`1px solid ${gold}33`,padding:"0.5rem 0.8rem",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>{p}</button>)}
        </div>}

        {aiOpen&&<AIPanel msgs={aiMsgs} loading={aiLoading} userQ={userQ} setUserQ={setUserQ} ask={ask} prompts={postPrompts} cache={cache} endRef={endRef} label="FULL BRIEFING"/>}
      </div>}
      <style>{`@keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes pu{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
    </div>
  );
}

function AIPanel({msgs,loading,userQ,setUserQ,ask,prompts,cache,endRef,label,badge}){
  return(
    <div style={{marginTop:"1rem",border:"1px solid #3a352e",background:"rgba(13,12,10,0.85)",padding:"1rem",animation:"fu 0.4s ease forwards"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.8rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.4rem"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:"#4caf50",animation:"pu 2s infinite"}}/>
          <span style={{fontFamily:mono,fontSize:"0.55rem",color:dim,letterSpacing:"0.12em"}}>{label}</span>
        </div>
        {badge&&<span style={{fontFamily:mono,fontSize:"0.5rem",color:"#7a5a5a",background:"rgba(122,90,90,0.12)",padding:"1px 6px"}}>{badge}</span>}
      </div>
      <div style={{maxHeight:350,overflowY:"auto",marginBottom:"0.8rem"}}>
        {msgs.map((m,i)=><div key={i} style={{marginBottom:"0.8rem",paddingLeft:m.role==="assistant"?"0.8rem":0,borderLeft:m.role==="assistant"?`2px solid ${gold}22`:"none"}}>
          <span style={{fontFamily:mono,fontSize:"0.5rem",color:m.role==="user"?"#7a9f7a":gold,letterSpacing:"0.1em",display:"block",marginBottom:"0.2rem"}}>{m.role==="user"?"YOU":"ANALYST"}</span>
          <p style={{fontFamily:serif,fontSize:"clamp(0.85rem,2.5vw,0.95rem)",color:m.role==="user"?"#a09580":"#c8bfb0",lineHeight:1.65,whiteSpace:"pre-wrap"}}>{m.content}</p>
        </div>)}
        {loading&&<p style={{fontFamily:mono,fontSize:"0.6rem",color:dim,animation:"pu 1.5s infinite"}}>Analyzing...</p>}
        <div ref={endRef}/>
      </div>
      <div style={{display:"flex",gap:"0.4rem"}}>
        <input value={userQ} onChange={e=>setUserQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask(userQ)} placeholder="Ask anything..." style={{flex:1,fontFamily:serif,fontSize:"0.9rem",color:"#c8bfb0",background:"rgba(200,169,110,0.04)",border:"1px solid #3a352e",padding:"0.6rem 0.8rem",outline:"none",borderRadius:0,WebkitAppearance:"none"}}/>
        <button onClick={()=>ask(userQ)} style={{fontFamily:mono,fontSize:"0.6rem",color:bg,background:gold,border:"none",padding:"0.6rem 1rem",cursor:"pointer"}}>ASK</button>
      </div>
      <div style={{display:"flex",gap:"0.3rem",marginTop:"0.6rem",flexWrap:"wrap"}}>
        {prompts.map(q=><button key={q} onClick={()=>ask(q,true)} style={{fontFamily:mono,fontSize:"0.55rem",color:"#7a6f60",background:"transparent",border:"1px solid #2a2520",padding:"0.2rem 0.5rem",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>{cache[q]?"\u26A1 ":""}{q}</button>)}
      </div>
    </div>
  );
}

// --- SHARE CARD ---
function ShareCard({arch,sec,topV,aCt,bCt,total}){
  const ref=useRef(null);
  const draw=useCallback(()=>{
    const cv=ref.current;if(!cv)return;const x=cv.getContext("2d");
    const W=1080,H=1350;cv.width=W;cv.height=H;
    // Rich gradient background
    const bg1=x.createLinearGradient(0,0,W,H);
    bg1.addColorStop(0,"#1a0e2e");bg1.addColorStop(0.3,"#1c1428");bg1.addColorStop(0.6,"#2a1a18");bg1.addColorStop(1,"#1a1714");
    x.fillStyle=bg1;x.fillRect(0,0,W,H);
    // Glowing orbs
    [[W*0.2,H*0.15,300,"rgba(200,130,50,0.08)"],[W*0.8,H*0.3,250,"rgba(150,100,200,0.06)"],[W*0.5,H*0.7,350,"rgba(200,169,110,0.05)"],[W*0.15,H*0.85,200,"rgba(180,80,80,0.05)"]].forEach(([cx,cy,r,c])=>{const g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,c);g.addColorStop(1,"transparent");x.fillStyle=g;x.fillRect(0,0,W,H);});
    // Sparkles
    const sparkles=[[120,100],[960,180],[80,500],[1000,650],[200,900],[880,1100],[540,130],[150,1200],[950,950],[500,1250]];
    sparkles.forEach(([sx,sy],i)=>{const sz=i%3===0?4:2;x.save();x.translate(sx,sy);x.rotate(Math.PI/4);x.fillStyle=`rgba(255,220,150,${0.3+i*0.05})`;x.fillRect(-sz,-1,sz*2,2);x.fillRect(-1,-sz,2,sz*2);x.restore();});
    // Top badge
    x.save();const badgeW=340,badgeH=44,badgeX=(W-badgeW)/2,badgeY=50;
    x.fillStyle="rgba(200,169,110,0.12)";x.beginPath();x.roundRect(badgeX,badgeY,badgeW,badgeH,22);x.fill();
    x.fillStyle="#e8c97a";x.font="600 20px sans-serif";x.textAlign="center";x.fillText("\u2694  CONFLICTTYPE  \u2694",W/2,badgeY+29);x.restore();
    // Subtitle
    x.fillStyle="rgba(200,169,110,0.5)";x.font="italic 22px Georgia";x.textAlign="center";x.fillText("Spotify Wrapped for your sense of justice",W/2,135);
    // Big emoji with glow
    const emojiY=280;
    const eg=x.createRadialGradient(W/2,emojiY-20,0,W/2,emojiY-20,120);eg.addColorStop(0,"rgba(255,200,100,0.15)");eg.addColorStop(1,"transparent");x.fillStyle=eg;x.fillRect(W/2-150,emojiY-140,300,240);
    x.font="140px serif";x.fillText(arch.emoji,W/2,emojiY+40);
    // Name with bright color
    x.fillStyle="#fff";x.font="bold 68px Georgia";x.fillText(arch.name,W/2,emojiY+130);
    // Tagline
    const tg=x.createLinearGradient(W*0.25,0,W*0.75,0);tg.addColorStop(0,"#e8c97a");tg.addColorStop(1,"#d4a054");
    x.fillStyle=tg;x.font="italic 30px Georgia";x.fillText(`"${arch.tagline}"`,W/2,emojiY+180);
    // Secondary
    if(sec){x.fillStyle="rgba(200,169,110,0.45)";x.font="22px sans-serif";x.fillText(`with shades of ${sec.emoji} ${sec.name}`,W/2,emojiY+225);}
    // Divider line
    const divY=sec?emojiY+260:emojiY+240;
    const dg=x.createLinearGradient(W*0.2,0,W*0.8,0);dg.addColorStop(0,"transparent");dg.addColorStop(0.5,"rgba(200,169,110,0.4)");dg.addColorStop(1,"transparent");
    x.strokeStyle=dg;x.lineWidth=1;x.beginPath();x.moveTo(W*0.2,divY);x.lineTo(W*0.8,divY);x.stroke();
    // Score boxes with glow
    const bY=divY+35;
    [[W*0.18,aCt,"ESTABLISHMENT","rgba(100,180,120,0.08)","#7dcea0"],[W*0.55,bCt,"CHALLENGER","rgba(200,100,80,0.08)","#e0876a"]].forEach(([bx,n,label,bgc,accent])=>{
      x.fillStyle=bgc;x.beginPath();x.roundRect(bx,bY,W*0.27,110,12);x.fill();
      x.strokeStyle=`${accent}44`;x.lineWidth=1;x.beginPath();x.roundRect(bx,bY,W*0.27,110,12);x.stroke();
      x.fillStyle="#fff";x.font="bold 56px Georgia";x.textAlign="center";x.fillText(String(n),bx+W*0.135,bY+58);
      x.fillStyle=accent;x.font="600 16px sans-serif";x.fillText(label,bx+W*0.135,bY+90);
    });
    // Value signature
    const vsY=bY+155;
    x.fillStyle="#e8c97a";x.font="600 20px sans-serif";x.textAlign="center";x.fillText("VALUE SIGNATURE",W/2,vsY);
    const bX=200,bW=W-400,bH=20,mV=topV[0]?.[1]||1;
    const barColors=["#e8c97a","#d4a054","#c4884a","#a07040","#806038"];
    topV.slice(0,5).forEach(([k,v],i)=>{
      const y=vsY+30+i*52;
      x.fillStyle="rgba(255,255,255,0.5)";x.font="500 19px sans-serif";x.textAlign="right";x.fillText(VL[k]||k,bX-18,y+15);
      x.fillStyle="rgba(255,255,255,0.06)";x.beginPath();x.roundRect(bX,y,bW,bH,10);x.fill();
      const barG=x.createLinearGradient(bX,0,bX+(v/mV)*bW,0);barG.addColorStop(0,barColors[i]||gold);barG.addColorStop(1,`${barColors[i]||gold}88`);
      x.fillStyle=barG;x.beginPath();x.roundRect(bX,y,(v/mV)*bW,bH,10);x.fill();
      x.fillStyle="rgba(255,255,255,0.3)";x.font="500 16px sans-serif";x.textAlign="left";x.fillText(String(v),bX+(v/mV)*bW+12,y+15);
    });
    // Footer
    x.textAlign="center";
    x.fillStyle="rgba(255,255,255,0.25)";x.font="500 20px sans-serif";
    x.fillText(`${total} conflicts analyzed`,W/2,H-140);
    // CTA with pill
    const ctaW=440,ctaH=52,ctaX=(W-ctaW)/2,ctaY=H-110;
    const ctaG=x.createLinearGradient(ctaX,0,ctaX+ctaW,0);ctaG.addColorStop(0,"#e8c97a");ctaG.addColorStop(1,"#d4a054");
    x.fillStyle=ctaG;x.beginPath();x.roundRect(ctaX,ctaY,ctaW,ctaH,26);x.fill();
    x.fillStyle="#1a1714";x.font="bold 22px sans-serif";x.fillText("Take yours \u2014 conflicttype.ai",W/2,ctaY+34);
    x.fillStyle="rgba(255,255,255,0.2)";x.font="16px sans-serif";x.fillText("Built with Claude",W/2,H-30);
  },[arch,sec,topV,aCt,bCt,total]);
  useEffect(()=>{draw();},[draw]);
  const dl=()=>{const l=document.createElement("a");l.download="my-conflicttype.png";l.href=ref.current.toDataURL("image/png");l.click();};
  return(<div style={{textAlign:"center"}}>
    <canvas ref={ref} style={{width:"100%",maxWidth:320,border:"1px solid #3a352e",borderRadius:6}}/>
    <div style={{marginTop:"1rem"}}>
      <button onClick={dl} style={{fontFamily:mono,fontSize:"0.65rem",color:bg,background:"linear-gradient(135deg,#e8c97a,#d4a054)",border:"none",padding:"0.7rem 2rem",cursor:"pointer",fontWeight:700,borderRadius:4,boxShadow:"0 2px 12px rgba(200,169,110,0.3)"}}>DOWNLOAD IMAGE</button>
    </div>
  </div>);
}

// --- RESULTS ---
function Results({choices,conflicts,onRestart}){
  const [v,setV]=useState(false);
  const [showShare,setShowShare]=useState(false);
  useEffect(()=>{setTimeout(()=>setV(true),100);},[]);

  const allV=[];choices.forEach(({cid,side})=>{const c=conflicts.find(x=>x.id===cid);if(c)c[side].values.forEach(v=>allV.push(v));});
  const vc={};allV.forEach(v=>{vc[v]=(vc[v]||0)+1;});
  const as=ARCHETYPES.map(a=>({...a,score:a.keys.reduce((s,k)=>s+(vc[k]||0),0)})).sort((a,b)=>b.score-a.score);
  const pri=as[0],sec=as[1]?.score>0?as[1]:null;
  const tv=Object.entries(vc).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const mx=tv[0]?.[1]||1;
  const aCt=choices.filter(c=>c.side==="sideA").length,bCt=choices.filter(c=>c.side==="sideB").length;

  useEffect(()=>{
    try{localStorage.setItem("ct-last-result",JSON.stringify({archetype:pri.name,date:new Date().toLocaleDateString()}));}catch(e){}
  },[pri]);

  const barColors=["#e8c97a","#d4a054","#c4884a","#b07848","#906838","#706030","#605028","#504020"];
  const siteUrl="https://conflicttype.netlify.app";
  const shareText=`I'm ${pri.name} on ConflictType \u2014 Spotify Wrapped for your sense of justice. Take yours:`;
  const iconBtn=(svg,onClick)=>(<button onClick={onClick} style={{width:56,height:56,borderRadius:"50%",border:"1px solid rgba(200,169,110,0.3)",background:"rgba(200,169,110,0.1)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",WebkitTapHighlightColor:"transparent"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(200,169,110,0.25)";e.currentTarget.style.transform="scale(1.1)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(200,169,110,0.1)";e.currentTarget.style.transform="scale(1)";}}><svg width="24" height="24" viewBox="0 0 24 24" fill="#e8c97a" dangerouslySetInnerHTML={{__html:svg}}/></button>);

  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",padding:"clamp(1rem,3vh,2rem) 1.2rem",opacity:v?1:0,transform:v?"none":"translateY(20px)",transition:"all 1s"}}>
      {/* === FIRST SCREEN: Hero + Share === */}
      <div style={{minHeight:"100svh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",maxWidth:560,paddingBottom:"1rem"}}>
        {/* Hero */}
        <div style={{textAlign:"center",position:"relative",marginBottom:"1.2rem"}}>
          <div style={{position:"absolute",top:"40%",left:"50%",transform:"translate(-50%,-50%)",width:250,height:250,borderRadius:"50%",background:"radial-gradient(circle,rgba(200,169,110,0.18) 0%,rgba(150,100,200,0.06) 40%,transparent 70%)",animation:"glow 3s ease-in-out infinite alternate",pointerEvents:"none"}}/>
          <p style={{fontFamily:mono,fontSize:"clamp(0.7rem,2.2vw,0.8rem)",color:gold,letterSpacing:"0.25em",marginBottom:"0.8rem",animation:"slideUp 0.6s ease forwards"}}>YOUR CONFLICTTYPE</p>
          <div style={{fontSize:"clamp(64px,18vw,88px)",marginBottom:"0.4rem",animation:"popIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275) 0.2s both",filter:"drop-shadow(0 0 30px rgba(200,169,110,0.4))"}}>{pri.emoji}</div>
          <h1 style={{fontFamily:disp,fontSize:"clamp(2.4rem,8vw,3.2rem)",color:"#fff",fontWeight:900,marginBottom:"0.3rem",animation:"slideUp 0.6s ease 0.4s both"}}>{pri.name}</h1>
          <p style={{fontFamily:serif,fontSize:"clamp(1.05rem,3.5vw,1.2rem)",color:"#e8c97a",fontStyle:"italic",animation:"slideUp 0.6s ease 0.55s both"}}>"{pri.tagline}"</p>
          {sec&&<p style={{fontFamily:mono,fontSize:"clamp(0.7rem,2.2vw,0.8rem)",color:"#a09580",marginTop:"0.4rem",animation:"slideUp 0.6s ease 0.7s both"}}>with shades of {sec.emoji} {sec.name}</p>}
        </div>

        {/* Score pills inline */}
        <div style={{display:"flex",gap:"1rem",marginBottom:"1.5rem",animation:"slideUp 0.6s ease 0.8s both"}}>
          {[[aCt,"ESTABLISHMENT","#7dcea0"],[bCt,"CHALLENGER","#e0876a"]].map(([n,l,c],i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:"0.5rem",padding:"0.5rem 1rem",border:`1px solid ${c}44`,borderRadius:24,background:`${c}11`}}>
              <span style={{fontFamily:disp,fontSize:"clamp(1.6rem,5vw,2rem)",color:"#fff",fontWeight:700}}>{n}</span>
              <span style={{fontFamily:mono,fontSize:"clamp(0.55rem,1.8vw,0.65rem)",color:c,letterSpacing:"0.08em"}}>{l}</span>
            </div>
          ))}
        </div>

        {/* Social share buttons with SVG icons */}
        <div style={{animation:"slideUp 0.6s ease 0.95s both",textAlign:"center",width:"100%"}}>
          <p style={{fontFamily:mono,fontSize:"clamp(0.65rem,2vw,0.75rem)",color:"#a09580",letterSpacing:"0.18em",marginBottom:"0.8rem"}}>SHARE YOUR TYPE</p>
          <div style={{display:"flex",gap:"0.8rem",justifyContent:"center",marginBottom:"1rem"}}>
            {iconBtn('<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',()=>window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(siteUrl)}`,"_blank"))}
            {iconBtn('<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',()=>window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}&quote=${encodeURIComponent(shareText)}`,"_blank"))}
            {iconBtn('<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',()=>window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`,"_blank"))}
            {iconBtn('<path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>',()=>window.open(`https://reddit.com/submit?url=${encodeURIComponent(siteUrl)}&title=${encodeURIComponent(shareText)}`,"_blank"))}
            {iconBtn('<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>',()=>window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${siteUrl}`)}`,"_blank"))}
          </div>
          <button onClick={()=>{navigator.clipboard?.writeText(`${shareText} ${siteUrl}`);}} style={{fontFamily:mono,fontSize:"clamp(0.65rem,2vw,0.75rem)",color:"#c8bfb0",background:"rgba(200,169,110,0.08)",border:"1px solid rgba(200,169,110,0.2)",padding:"0.6rem 1.4rem",cursor:"pointer",borderRadius:24,WebkitTapHighlightColor:"transparent",letterSpacing:"0.06em"}}>COPY LINK</button>
        </div>

        {/* Scroll hint */}
        <div style={{marginTop:"auto",paddingTop:"0.8rem",animation:"slideUp 0.6s ease 1.2s both"}}>
          <p style={{fontFamily:mono,fontSize:"0.5rem",color:"#5a5345",letterSpacing:"0.1em"}}>SCROLL FOR DETAILS</p>
          <div style={{marginTop:"0.3rem",animation:"bounce 2s ease infinite"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5a5345" strokeWidth="2"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
          </div>
        </div>
      </div>

      {/* === BELOW THE FOLD: Details === */}
      <div style={{width:"100%",maxWidth:560}}>
        {/* Personality card */}
        <div style={{marginBottom:"2.5rem",padding:"clamp(1.2rem,4vw,1.8rem)",border:"1px solid rgba(200,169,110,0.15)",background:"linear-gradient(135deg,rgba(200,169,110,0.06) 0%,rgba(200,130,50,0.03) 100%)",borderRadius:8}}>
          <p style={{fontFamily:serif,fontSize:"clamp(1.05rem,3.2vw,1.15rem)",color:"#c8bfb0",lineHeight:1.85,whiteSpace:"pre-wrap"}}>{pri.personality}</p>
        </div>

        {/* Score boxes */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"2.5rem"}}>
          {[[aCt,"ESTABLISHMENT","#7dcea0","rgba(100,180,120,0.08)"],[bCt,"CHALLENGER","#e0876a","rgba(200,100,80,0.08)"]].map(([n,l,accent,bgc],i)=>(
            <div key={i} style={{border:`1px solid ${accent}33`,padding:"clamp(1rem,3vw,1.4rem)",textAlign:"center",background:bgc,borderRadius:8}}>
              <div style={{fontFamily:disp,fontSize:"clamp(2.4rem,7vw,3rem)",color:"#fff",fontWeight:700}}>{n}</div>
              <div style={{fontFamily:mono,fontSize:"clamp(0.65rem,2vw,0.75rem)",color:accent,letterSpacing:"0.12em",fontWeight:600}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Value signature */}
        <div style={{marginBottom:"2.5rem"}}>
          <p style={{fontFamily:mono,fontSize:"clamp(0.7rem,2.2vw,0.8rem)",color:"#e8c97a",letterSpacing:"0.2em",marginBottom:"1.2rem"}}>VALUE SIGNATURE</p>
          {tv.map(([k,ct],i)=>(
            <div key={k} style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.8rem"}}>
              <span style={{fontFamily:mono,fontSize:"clamp(0.6rem,1.8vw,0.7rem)",color:"#a09580",width:"clamp(100px,30vw,140px)",textAlign:"right",flexShrink:0}}>{VL[k]||k}</span>
              <div style={{flex:1,height:10,background:"rgba(255,255,255,0.05)",borderRadius:5,overflow:"hidden"}}><div style={{height:"100%",width:`${(ct/mx)*100}%`,background:`linear-gradient(90deg,${barColors[i]||gold},${barColors[i]||gold}88)`,borderRadius:5,transition:"width 1.2s cubic-bezier(0.25,0.46,0.45,0.94)"}}/></div>
              <span style={{fontFamily:mono,fontSize:"clamp(0.65rem,2vw,0.75rem)",color:"#c8bfb0",width:20,fontWeight:600}}>{ct}</span>
            </div>
          ))}
        </div>

        {/* Archetype mix */}
        <div style={{marginBottom:"2.5rem"}}>
          <p style={{fontFamily:mono,fontSize:"clamp(0.7rem,2.2vw,0.8rem)",color:"#e8c97a",letterSpacing:"0.2em",marginBottom:"1.2rem"}}>ARCHETYPE MIX</p>
          {as.filter(a=>a.score>0).map((a,i)=>(
            <div key={a.name} style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.7rem"}}>
              <span style={{fontFamily:mono,fontSize:"clamp(0.6rem,1.8vw,0.7rem)",color:i===0?"#fff":"#a09580",width:"clamp(120px,35vw,170px)",textAlign:"right",flexShrink:0,fontWeight:i===0?600:400}}>{a.emoji} {a.name}</span>
              <div style={{flex:1,height:i===0?6:3,background:"rgba(255,255,255,0.05)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${(a.score/(pri.score||1))*100}%`,background:i===0?"linear-gradient(90deg,#e8c97a,#d4a054)":"rgba(200,169,110,0.25)",borderRadius:3,transition:"width 1s"}}/></div>
            </div>
          ))}
        </div>

        {/* Case log */}
        <div style={{marginBottom:"2.5rem",paddingTop:"1.5rem"}}>
          <p style={{fontFamily:mono,fontSize:"clamp(0.7rem,2.2vw,0.8rem)",color:"#e8c97a",letterSpacing:"0.2em",marginBottom:"1.2rem"}}>CASE LOG</p>
          {choices.map(({cid,side},i)=>{const co=conflicts.find(x=>x.id===cid);return(
            <div key={cid} style={{display:"flex",gap:"0.8rem",marginBottom:"0.7rem",padding:"clamp(0.6rem,2vw,0.8rem) clamp(0.8rem,2.5vw,1rem)",background:"rgba(200,169,110,0.03)",border:"1px solid rgba(200,169,110,0.08)",borderRadius:6}}>
              <span style={{fontFamily:mono,fontSize:"clamp(0.65rem,2vw,0.75rem)",color:"#e8c97a",fontWeight:600}}>{String(i+1).padStart(2,"0")}</span>
              <div>
                <p style={{fontFamily:serif,fontSize:"clamp(1rem,3vw,1.1rem)",color:"#e0d5c5"}}>{co.reveal.split("\u2014")[0].trim()}</p>
                <p style={{fontFamily:mono,fontSize:"clamp(0.6rem,1.8vw,0.7rem)",color:"#8a7f70",marginTop:"0.2rem"}}>{co[side].label}</p>
              </div>
            </div>
          );})}
        </div>

        {/* Download share card */}
        <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
          <p style={{fontFamily:mono,fontSize:"clamp(0.7rem,2.2vw,0.8rem)",color:"#8a7f70",letterSpacing:"0.15em",marginBottom:"1rem"}}>SAVE YOUR RESULTS</p>
          <ShareCard arch={pri} sec={sec} topV={tv} aCt={aCt} bCt={bCt} total={choices.length}/>
        </div>

        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <button onClick={onRestart} style={{fontFamily:mono,fontSize:"clamp(0.75rem,2.2vw,0.85rem)",color:"#a09580",background:"transparent",border:"1px solid rgba(200,169,110,0.2)",padding:"0.8rem 2rem",cursor:"pointer",borderRadius:6,WebkitTapHighlightColor:"transparent",letterSpacing:"0.06em"}}>RETAKE</button>
        </div>
      </div>

      <style>{`@keyframes glow{from{opacity:0.6;transform:translate(-50%,-50%) scale(0.9)}to{opacity:1;transform:translate(-50%,-50%) scale(1.15)}}@keyframes popIn{from{opacity:0;transform:scale(0.3)}to{opacity:1;transform:scale(1)}}@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}`}</style>
    </div>
  );
}

// --- APP ---
export default function App(){
  const [screen,setScreen]=useState("intro");
  const [ses,setSes]=useState([]);
  const [idx,setIdx]=useState(0);
  const [choices,setChoices]=useState([]);
  const [leaving,setLeaving]=useState(false);

  const start=(n)=>{setSes(shuffle(CONFLICTS).slice(0,n));setIdx(0);setChoices([]);setScreen("play");};
  const choose=(side)=>{
    const nc=[...choices,{cid:ses[idx].id,side}];setChoices(nc);
    if(idx<ses.length-1){setLeaving(true);setTimeout(()=>{setIdx(idx+1);setLeaving(false);},400);}
    else setScreen("results");
  };

  return(
    <div style={{minHeight:"100vh",background:bg,fontFamily:serif,WebkitFontSmoothing:"antialiased",overflowX:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet"/>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",background:"radial-gradient(ellipse at 20% 50%,rgba(200,169,110,0.03) 0%,transparent 50%),radial-gradient(ellipse at 80% 20%,rgba(200,169,110,0.02) 0%,transparent 40%)"}}/>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",backgroundImage:"linear-gradient(rgba(200,169,110,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,110,0.02) 1px,transparent 1px)",backgroundSize:"80px 80px"}}/>
      <div style={{position:"relative",zIndex:1}}>
        {screen==="intro"&&<Intro onStart={start}/>}
        {screen==="play"&&ses[idx]&&<Card key={ses[idx].id} conflict={ses[idx]} index={idx} total={ses.length} onChoice={choose} leaving={leaving}/>}
        {screen==="results"&&<Results choices={choices} conflicts={ses} onRestart={()=>setScreen("intro")}/>}
      </div>
    </div>
  );
}
