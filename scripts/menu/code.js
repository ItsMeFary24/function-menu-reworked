import { world, Player, system } from "@minecraft/server";
import { ModalFormData, ActionFormData } from "@minecraft/server-ui";
import { Database } from "../lib/Database.js";
import { enables } from "../config.js";

//** CREATED BY @NAKATAZ DONT STEAL THE CODE BITCH!!!**\\


const _0x7c9e5d=_0x27d1;(function(_0x8a1796,_0x567fac){const _0xdd5ab7=_0x27d1,_0x3de64e=_0x8a1796();while(!![]){try{const _0x170f7d=-parseInt(_0xdd5ab7(0x9d))/0x1+parseInt(_0xdd5ab7(0x91))/0x2+parseInt(_0xdd5ab7(0x99))/0x3*(-parseInt(_0xdd5ab7(0xad))/0x4)+parseInt(_0xdd5ab7(0x9e))/0x5+-parseInt(_0xdd5ab7(0xb1))/0x6+-parseInt(_0xdd5ab7(0x87))/0x7*(parseInt(_0xdd5ab7(0x8a))/0x8)+parseInt(_0xdd5ab7(0x95))/0x9;if(_0x170f7d===_0x567fac)break;else _0x3de64e['push'](_0x3de64e['shift']());}catch(_0x7dad97){_0x3de64e['push'](_0x3de64e['shift']());}}}(_0x23bd,0x6cc27));const dbRedeem=new Database('redeemDB'),dbRedeemed=new Database(_0x7c9e5d(0xb0)),dbPlayer=new Database(_0x7c9e5d(0xae));export function cmdAmountMenu(_0x20bf87){const _0x8e3319=_0x7c9e5d,_0x55844b=new ModalFormData();_0x55844b[_0x8e3319(0x96)](_0x8e3319(0x89)),_0x55844b[_0x8e3319(0xac)]('Amount\x20of\x20command\x20need\x20to\x20run\x20when\x20player\x20input\x20the\x20code:\x20',0x1,0x14,0x1),_0x55844b[_0x8e3319(0xa9)](_0x20bf87)[_0x8e3319(0xa4)](_0x59690a=>{if(_0x59690a['canceled'])return;setCode(_0x20bf87,_0x59690a['formValues'][0x0]);});}function setCode(_0x4adc95,_0x112fd2){const _0x4f70e8=_0x7c9e5d,_0x28975d=new ModalFormData();_0x28975d[_0x4f70e8(0x96)](_0x4f70e8(0x8f)),_0x28975d[_0x4f70e8(0x9c)](_0x4f70e8(0xa3),'Example:\x20nakata');for(let _0x32af39=0x1;_0x32af39<=Number(_0x112fd2);_0x32af39++){_0x28975d[_0x4f70e8(0x9c)]('',_0x4f70e8(0x86)+_0x32af39,'');}_0x28975d[_0x4f70e8(0x9c)](_0x4f70e8(0x85),_0x4f70e8(0xb3)),_0x28975d['show'](_0x4adc95)['then'](_0x24fb53=>{const _0x22e331=_0x4f70e8,_0x3bf509=_0x24fb53[_0x22e331(0xa2)][0x0],_0x903f35=[];for(let _0x2f48bf=0x1;_0x2f48bf<=Number(_0x112fd2);_0x2f48bf++){_0x903f35[_0x22e331(0xa7)](_0x24fb53[_0x22e331(0xa2)][_0x2f48bf]);}const _0x86fb86=_0x24fb53['formValues'][_0x112fd2+0x1];if(_0x3bf509['length']>0xc){_0x4adc95[_0x22e331(0x8d)](_0x22e331(0x98));return;}else{if(_0x3bf509[_0x22e331(0x8b)]<0x3){_0x4adc95[_0x22e331(0x8d)](_0x22e331(0x9a));return;}}const _0x5e64ea={'kunci':_0x3bf509,'commands':_0x903f35,'maxp':parseInt(_0x86fb86)};dbPlayer[_0x22e331(0xaa)]((_0x5610ae,_0x414c56)=>{_0x414c56['redeemed']=![],dbPlayer['delete'](_0x5610ae);}),dbRedeem[_0x22e331(0xa1)](_0x22e331(0x88),_0x5e64ea),_0x4adc95[_0x22e331(0x93)](_0x22e331(0xa0)+_0x3bf509);});}function _0x23bd(){const _0x5a6f73=['Command\x20','56ZlVPxe','redeem','Command\x20Amount\x20UI','249544CTXNJp','length','\x0a§aCurrent\x20Player:\x20§e','runCommandAsync','kunci','§cSetCode\x20-\x20§bAdmin','§eRedeemCode','124244hoyKvT','§aSucces\x20claim\x20code!','sendMessage','commands','13487886HvZdNo','title','§cFitur\x20Dinonaktifkan\x20oleh\x20administrator!','tellraw\x20@s\x20{\x22rawtext\x22:[{\x22text\x22:\x22§cCode\x20length\x20exceeds\x20the\x20maximum\x20limit\x20of\x2012\x20characters.\x22}]}','201PdQbYe','tellraw\x20@s\x20{\x22rawtext\x22:[{\x22text\x22:\x22§cCode\x20length\x20should\x20be\x20at\x20least\x203\x20characters.\x22}]}','tellraw\x20@s\x20{\x22rawtext\x22:[{\x22text\x22:\x22§aCurrent\x20Code:\x20§e','textField','148353UlRQag','2765840YidFMU','Enter\x20Code','§aSet\x20redeem\x20code\x20to\x20','set','formValues','3\x20-\x2012\x20characters','then','name','playsound\x20note.pling\x20@s','push','tellraw\x20@s\x20{\x22rawtext\x22:[{\x22text\x22:\x22§cYou\x20have\x20already\x20redeemed\x20the\x20code\x22}]}','show','forEach','§cMaximum\x20number\x20of\x20players\x20have\x20already\x20redeemed\x20the\x20code.','slider','34540uVojgB','PlayerDB','get','redeemedDB','4152138THVjLU','maxp','Example:\x2050','code','User\x20Can\x20Entry'];_0x23bd=function(){return _0x5a6f73;};return _0x23bd();}export function redeemCode(_0x4f9968){const _0x1571b9=_0x7c9e5d;if(enables[_0x1571b9(0xaf)](_0x1571b9(0x84))===0x1){_0x4f9968[_0x1571b9(0x93)](_0x1571b9(0x97));return;}else{const _0x590ff5=new ModalFormData()[_0x1571b9(0x96)](_0x1571b9(0x90))['textField']('Code',_0x1571b9(0x9f));_0x590ff5[_0x1571b9(0xa9)](_0x4f9968)[_0x1571b9(0xa4)](_0x5eccff=>{const _0x169f9f=_0x1571b9,_0x2853f6=_0x5eccff[_0x169f9f(0xa2)][0x0],_0x338c60=dbRedeem[_0x169f9f(0xaf)](_0x169f9f(0x88));if(_0x338c60&&_0x338c60[_0x169f9f(0x8e)]===_0x2853f6){const _0x474f12=_0x4f9968[_0x169f9f(0xa5)];if(!dbPlayer['has'](_0x474f12)||!dbPlayer[_0x169f9f(0xaf)](_0x474f12)['redeemed']){if(dbPlayer['length']>=_0x338c60[_0x169f9f(0xb2)]){_0x4f9968[_0x169f9f(0x93)](_0x169f9f(0xab));return;}const _0x48a096={'redeemed':!![]};dbPlayer[_0x169f9f(0xa1)](_0x474f12,_0x48a096);for(const _0x2de3e8 of _0x338c60[_0x169f9f(0x94)]){_0x4f9968[_0x169f9f(0x8d)](_0x2de3e8);}_0x4f9968[_0x169f9f(0x93)](_0x169f9f(0x92));}else _0x4f9968['runCommandAsync'](_0x169f9f(0xa8)),_0x4f9968[_0x169f9f(0x8d)](_0x169f9f(0xa6));}else _0x4f9968[_0x169f9f(0x8d)]('tellraw\x20@s\x20{\x22rawtext\x22:[{\x22text\x22:\x22§cInvalid\x20Code!\x20Maybe\x20it\x20has\x20expired\x22}]}'),_0x4f9968[_0x169f9f(0x8d)](_0x169f9f(0xa6));});}}function _0x27d1(_0x22af3d,_0x2205ae){const _0x23bd2a=_0x23bd();return _0x27d1=function(_0x27d13b,_0x136db7){_0x27d13b=_0x27d13b-0x84;let _0x5fbb45=_0x23bd2a[_0x27d13b];return _0x5fbb45;},_0x27d1(_0x22af3d,_0x2205ae);}export function forgotCode(_0x42c42b){const _0x34a412=_0x7c9e5d,_0x1de8bc=dbRedeem[_0x34a412(0xaf)](_0x34a412(0x88)),_0x5c9a4a=_0x1de8bc[_0x34a412(0x8e)];if(_0x1de8bc&&dbPlayer){const _0x2d6991=dbPlayer[_0x34a412(0x8b)];_0x42c42b[_0x34a412(0x8d)](_0x34a412(0x9b)+_0x1de8bc[_0x34a412(0x8e)]+_0x34a412(0x8c)+_0x2d6991+'/'+_0x1de8bc['maxp']+'\x22}]}');}else _0x42c42b[_0x34a412(0x8d)]('tellraw\x20@s\x20{\x22rawtext\x22:[{\x22text\x22:\x22§cNo\x20code\x20is\x20currently\x20set.\x22}]}');}