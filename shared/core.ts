import { z } from 'zod';
export type Lang = 'fil' | 'en';
export type Copy = { fil: string; en: string };
export const c = (fil: string, en: string): Copy => ({ fil, en });
const copySchema = z.object({ fil: z.string().min(1).max(1200), en: z.string().min(1).max(1200) }).strict();
export const inputSchema = z.object({ text: z.string().trim().min(1).max(5000), language: z.enum(['fil', 'en']) }).strict();
export const interpretationSchema = z.object({ category: z.enum(['strong','uncertain','no_obvious']), explanation: copySchema, warningSigns: z.array(copySchema).max(6), nextSteps: z.array(copySchema).min(1).max(4), referenceIds: z.array(z.string()).max(5) }).strict();
export type Interpretation = z.infer<typeof interpretationSchema>;
export type UrlFinding = { input: string; hostname: string | null; officialDomain: string | null; signals: { severity: 'info'|'caution'|'strong'; text: Copy }[] };
export type Result = Interpretation & { mode: 'reference'|'ai'; urlFindings: UrlFinding[]; libraryVersion: string };
export const version = '2026-10-19.1';
export const independent = c('Buksan mo mismo ang opisyal na app o gamitin ang dati mong alam na numero. Huwag gamitin ang link o numero sa kahina-hinalang mensahe.','Open the official app yourself or use a number you already know. Do not use the link or number in the suspicious message.');
export const disclaimer = c('Hindi nito napapatunayan kung sino ang nagpadala o kung tunay ang mensahe. Magtiyak muna bago magbayad o magbigay ng detalye.','This does not establish who sent the message or whether it is authentic. Verify independently before paying or sharing information.');
const bdo = 'https://www.bdo.com.ph/about-bdo/learn/help-and-support/protection-and-account-security';
const gcash = 'https://help.gcash.com/hc/en-us/articles/19578518834457-How-can-I-protect-my-GCash-account';
export const institutions = [{ name:'BDO', domain:'bdo.com.ph', source:bdo }, { name:'GCash', domain:'gcash.com', source:gcash }];
export const destinations = [{ id:'bdo', name:'BDO', url:bdo, instruction:c('Buksan ang opisyal na gabay ng BDO. Piliin ang angkop na contact channel at ikaw mismo ang magpadala ng ulat.','Open BDO’s official security guidance. Choose the appropriate contact channel and submit the report yourself.') }, { id:'gcash', name:'GCash', url:'https://help.gcash.com/hc/en-us/articles/4413295284377-Report-a-scam', instruction:c('Para sa perang naipadala, sundin ang Transactions → Get Help sa GCash app. Para sa mensahe, gamitin ang Help Center sa opisyal na app. Ikaw ang magsusumite.','For money sent, follow Transactions → Get Help in the GCash app. For suspicious messages, use the Help Center in the official app. You submit the report yourself.') }].map(d=>({...d, verifiedOn:'2026-10-19',source:d.url}));
export const patterns = [
 {id:'bank', title:c('Nagpapanggap na bangko','Bank impersonation'), explanation:c('Maaaring gamitin ang babalang naka-lock ang account para hingin ang lihim na detalye.','An account-locked warning can be used to request secret information.'), source:bdo},
 {id:'ewallet', title:c('Humihingi ng OTP o PIN','Requests for an OTP or PIN'), explanation:c('Huwag ibigay ang OTP, PIN, o password sa kausap.','Do not share an OTP, PIN, or password with a sender or caller.'),source:gcash},
 {id:'telco',title:c('Agarang bayad o pagputol ng serbisyo','Urgent payment or service cutoff'),explanation:c('Suriin ang singil sa opisyal na app bago magbayad.','Check the bill in the official app before paying.'),source:gcash},
 {id:'prize',title:c('Premyong may paunang bayad','A prize requiring payment'),explanation:c('Mag-ingat sa hindi inaasahang premyong may kapalit na bayad.','Beware of unexpected prizes that require payment first.'),source:gcash},
 {id:'relative',title:c('Nagpapanggap na kamag-anak','Relative impersonation'),explanation:c('Tawagan ang dati mong naka-save na numero bago magpadala ng pera.','Call the number you already have saved before sending money.'),source:bdo},
].map(p=>({...p,verifiedOn:'2026-10-19', kind:'curated-pattern'}));
export const examples = [
 {label:c('Bangko','Bank'),text:c('BDO daw: Naka-lock ang account mo. Ibigay ang OTP sa https://bdo.com.ph.verify.example para maibalik ang access.','Claiming to be BDO: Your account is locked. Give your OTP at https://bdo.com.ph.verify.example to restore access.')},
 {label:c('E-wallet','E-wallet'),text:c('GCash daw: Ipadala ang MPIN mo ngayon para hindi masuspinde ang wallet mo.','Claiming to be GCash: Send your MPIN now to prevent suspension.')},
 {label:c('Serbisyo','Service'),text:c('Puputulin ang linya mo ngayon! Magbayad agad sa https://bayad.example.','Your phone service will be cut off today! Pay immediately at https://pay.example.')},
 {label:c('Premyo','Prize'),text:c('Nanalo ka! Magpadala muna ng processing fee para makuha ang premyo.','You won a prize! Send a processing fee first to claim it.')},
 {label:c('Kamag-anak','Relative'),text:c('Lola, bago kong numero ito. Emergency, paki-send ng pera ngayon. Huwag munang tumawag.','Grandma, this is my new number. Emergency, send money now. Please don’t call.')},
 {label:c('Kulang sa detalye','Unclear'),text:c('Mahalagang abiso tungkol sa account mo. Makipag-ugnayan para sa detalye.','Important notice about your account. Contact us for details.')},
 {label:c('Karaniwan','Everyday'),text:c('Lola, alas tres ang salu-salo sa Linggo. Dadalhin ko ang paborito mong pagkain.','Grandma, lunch is at three on Sunday. I’ll bring your favorite food.')},
];
export function inspectUrls(text: string): UrlFinding[] {
 const tokens=text.match(/(?:[a-z][a-z\d+.-]*:\/\/|www\.)[^\s<>"“”]+|\b(?:[a-z\d-]+\.)+[a-z]{2,}(?:\/[^\s<>"“”]*)?/gi)??[];
 return [...new Set(tokens.map(t=>t.replace(/[.,!?;:)\]}]+$/,'')))].slice(0,20).map(input=>{
  const signals: UrlFinding['signals']=[];
  const add=(severity:'info'|'caution'|'strong',fil:string,en:string)=>signals.push({severity,text:c(fil,en)});
  let url:URL;
  try {url=new URL(input.includes('://')?input:`https://${input}`);if(!['http:','https:'].includes(url.protocol)||!url.hostname)throw Error();}
  catch {return {input,hostname:null,officialDomain:null,signals:[{severity:'caution',text:c('Hindi mabasa ang address. Huwag itong buksan; magtiyak sa opisyal na channel.','This address could not be read. Do not open it; verify through an official channel.')}]};}
  const host=url.hostname.toLowerCase().replace(/\.$/,'');
  const official=institutions.find(i=>host===i.domain||host.endsWith(`.${i.domain}`));
  const resembles=institutions.find(i=>host.replace(/0/g,'o').replace(/[^a-z]/g,'').includes(i.name.toLowerCase()));
  const mentioned=institutions.filter(i=>text.toLowerCase().includes(i.name.toLowerCase()));
  if(url.username||url.password)add('strong','May detalye bago ang @. Ang tunay na host ay nasa kanan nito; maaaring itinatago ang pupuntahan.','Text before an @ sign can disguise a destination. The actual host is after the @ sign.');
  if(url.protocol==='http:')add('caution','HTTP ito, walang proteksiyon ng HTTPS. Hindi rin patunay ng kaligtasan ang HTTPS.','This uses HTTP without HTTPS protection. HTTPS itself would not prove safety.');
  if(['bit.ly','tinyurl.com','t.co','cutt.ly','rb.gy','goo.gl'].includes(host))add('caution','Pinaikling link ito; nakatago ang huling pupuntahan. Hindi namin ito binuksan.','This shortened link hides its final destination. We have not opened it.');
  if(host.includes('xn--'))add('caution','May international na baybay. Maaaring magkamukha ang ilang titik.','This domain uses international characters. Some letters can look alike.');
  if(official)add('info',`Tugma sa nakalistang domain ng ${official.name}. Hindi ito patunay na tunay o ligtas ang mensahe.`,`Matches a listed ${official.name} domain. This does not prove the message is authentic or safe.`);
  else if(resembles)add('strong',`Mukhang ${resembles.name}, pero hindi ito ang nakalistang opisyal na domain.`,`This resembles ${resembles.name}, but is not its listed official domain.`);
  else if(mentioned.length===1)add('caution',`Binabanggit ang ${mentioned[0].name} pero ibang domain ang link. Magtiyak nang hiwalay.`,`The message mentions ${mentioned[0].name}, but the link uses another domain. Verify independently.`);
  else add('info','Wala ito sa maliit naming listahan. Hindi iyon patunay ng panlilinlang o kaligtasan.','Not in our small domain list. That establishes neither fraud nor safety.');
  return {input,hostname:host,officialDomain:(official??resembles??(mentioned.length===1?mentioned[0]:undefined))?.domain??null,signals};
 });
}
export function analyzeReference(text:string):Result {
 const v=text.toLowerCase(), signs:Copy[]=[], ids:string[]=[];
 const secret=/\b(otp|mpin|pin|password|passcode)\b/.test(v)&&/(send|share|give|enter|provide|ibigay|ipadala|ilagay|hingi|sabihin)/.test(v)&&!/(never|do not|don't|huwag|hindi hihingi)/.test(v);
 const money=/(pera|money|payment|bayad|processing fee|transfer)/.test(v), urgent=/(urgent|immediately|hurry|now\b|ngayon|agad|emergency|locked|naka-lock|suspend|puputulin|cut off)/.test(v);
 const prize=/(nanalo|winner|won a|prize|premyo)/.test(v)&&money;
 const relative=/(lola|lolo|grandma|grandpa|anak|apo|relative)/.test(v)&&/(new number|bagong numero|bago kong numero|emergency)/.test(v)&&money;
 if(secret){signs.push(c('May paghingi ng OTP, PIN, o password. Lihim ang mga ito; huwag ibigay sa kausap.','There is a request for an OTP, PIN, or password. These are secret; do not share them.'));ids.push(/bdo|bank|bangko/.test(v)?'bank':'ewallet');}
 if(urgent)signs.push(c('May pagmamadali o banta. Maglaan muna ng oras para magtiyak.','There is urgency or a threat. Take time to verify independently.'));
 if(prize){signs.push(c('May premyo na kailangan munang bayaran. Mahalagang babala ito.','A prize requires payment first. This is a serious warning sign.'));ids.push('prize');}
 if(relative){signs.push(c('May nagpapakilalang kamag-anak mula sa bagong numero at humihingi ng pera.','Someone claiming to be a relative uses a new number and asks for money.'));ids.push('relative');}
 if(urgent&&money&&/linya|telco|service|serbisyo/.test(v))ids.push('telco');
 const urls=inspectUrls(text); signs.push(...urls.flatMap(u=>u.signals.filter(s=>s.severity==='strong').map(s=>s.text)));
 const strong=secret||prize||relative||urls.some(u=>u.signals.some(s=>s.severity==='strong'));
 const ambiguous=urgent||money||/account|notice|abiso|verify|important|mahalaga|bank|bangko|gcash|bdo/.test(v)||urls.length>0||v.length<20;
 const category=strong?'strong':ambiguous?'uncertain':'no_obvious';
 return {category,explanation:strong?c('May malinaw na babalang tugma sa aming mga sanggunian. Huminto muna bago sumunod.','There are clear warning signs matching our references. Pause before acting.'):ambiguous?c('Kulang ang impormasyon para makapagtiyak. Maaaring may lehitimong paliwanag; suriin sa hiwalay na opisyal na channel.','There is not enough information to be certain. There may be a legitimate explanation; verify through a separate official channel.'):c('Walang malinaw na babalang nakita ng limitadong pagsusuring ito. Maaari nitong hindi mapansin ang bagong paraan ng panlilinlang.','This limited check found no obvious warning signs. It may miss unfamiliar scam techniques.'),warningSigns:signs.slice(0,6),nextSteps:strong?[c('Huwag munang magbayad, magpadala ng pera, o magbigay ng OTP, PIN, at password.','Do not pay, send money, or share an OTP, PIN, or password.'),independent]:[independent],referenceIds:[...new Set(ids)],mode:'reference',urlFindings:urls,libraryVersion:version};
}
export function createReport(text:string,lang:Lang){return lang==='fil'?`DRAFT NA ULAT — HINDI PA NAIPAPADALA\n\nMensahe o paglalarawang ibinigay:\n${text}\n\nNagpadala: Hindi pa napatutunayan\nPetsa ng pangyayari: Hindi alam\nHalagang nawala: Hindi alam\n\nPakisuri. Dagdagan lamang ng mga detalyeng alam mo. Alisin ang OTP, PIN, password, at pribadong detalye bago ipadala.`:`DRAFT REPORT — NOT YET SUBMITTED\n\nMessage or description provided:\n${text}\n\nSender: Unverified\nIncident date: Unknown\nAmount lost: Unknown\n\nReview and add only facts you know. Remove OTPs, PINs, passwords, and private details before submitting.`;}
