import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

// ── CONSTANTS ─────────────────────────────────────────────────────────
const ADMIN_USER = {
  id: "rob",
  name: "Rob Broekman",
  email: "rob@deaanbouwexpert.nl",
  password: "101080",
  role: "admin",
  company: "De Aanbouw Expert",
  approved: true,
};

const COLUMNS = [
  "Graafwerk","Staal","Constructie berekening","Steen-strips / Metselwerk","Kozijn","Lichtstraat",
  "Heiwerk","Fundering","Electra","Verwarming","Dakbedekking","Hijsen",
  "Tegelwerk","Stucwerk","Loodgieter","Container","Steigers","Trap","Extra"
];

const STATUS_META = {
  "Besteld":     { bg:"#E8F5E9", text:"#2E7D32", border:"#A5D6A7" },
  "Geleverd":    { bg:"#E3F2FD", text:"#1565C0", border:"#90CAF9" },
  "Gereed":      { bg:"#F3E5F5", text:"#6A1B9A", border:"#CE93D8" },
  "Plannen!":    { bg:"#FFF9C4", text:"#F57F17", border:"#FFF176" },
  "Aangevraagd": { bg:"#FFF3E0", text:"#E65100", border:"#FFCC80" },
  "Doet klant":  { bg:"#F5F5F5", text:"#616161", border:"#BDBDBD" },
  "×":           { bg:"#FFEBEE", text:"#B71C1C", border:"#EF9A9A" },
  "":            { bg:"transparent", text:"#9E9E9E", border:"#E0E0E0" },
};

const STATUS_OPTIONS = ["","Besteld","Geleverd","Gereed","Plannen!","Aangevraagd","Doet klant","×"];

const PROJECT_TYPES = [
  { label:"Aanbouw",    bg:"#E3F2FD", text:"#1565C0", border:"#90CAF9"  },
  { label:"Dakopbouw",  bg:"#F3E5F5", text:"#6A1B9A", border:"#CE93D8"  },
  { label:"Dakkapel",   bg:"#E8F5E9", text:"#2E7D32", border:"#A5D6A7"  },
  { label:"Renovatie",  bg:"#FFF3E0", text:"#E65100", border:"#FFCC80"  },
];


const MEDEWERKERS = [
  "Billy","Bob","Anel","Hicham","Jan","Johnny","Mike","Nick","Pim","Thierry",
  "Woddy","Jakob","Alec","Aniel","Daan","Dejem","Jair","Kian","Naval",
  "Richard","Martin 2","Nick 2","Ali",
];
const DEFAULT_PROJECTS = [
  // ── JANUARI ──
  { id:1,  name:"Rijsbes 5 Den Haag",               date:"5-01-2026",  duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:2,  name:"Wittenburgerweg 36 Wassenaar",      date:"5-01-2026",  duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Fundering", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:3,  name:"Waldeck Pyrmontlaan 11 Rijswijk",   date:"5-01-2026",  duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:4,  name:"Bergsemaas 18 Pijnacker",           date:"12-01-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:5,  name:"Oude Middenweg 50 Den Haag",        date:"19-01-2026", duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dak Uitbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  { id:6,  name:"Albert Schweitzerlaan 167 Den Haag",date:"26-01-2026", duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dakopbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  // ── FEBRUARI ──
  { id:7,  name:"Hof van Delftstraat 29 Den Hoorn",  date:"2-02-2026",  duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:8,  name:"Oostmeerlaan 138 Berkel en Rodenrijs",date:"3-02-2026",duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:9,  name:"Brielsemeer 22 Zoetermeer",         date:"9-02-2026",  duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:10, name:"Brielsemeer 24 Zoetermeer",         date:"9-02-2026",  duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:11, name:"Olgaland 17 Den Haag",              date:"9-02-2026",  duur:"", weken:"1", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dakkapel", type:"Dakkapel", statuses:Array(19).fill("") },
  { id:12, name:"Mahatma Gandhisingel 70 Zoetermeer",date:"23-02-2026", duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dak Uitbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  // ── MAART ──
  { id:13, name:"Herderslaan 74 Den Haag",           date:"3-03-2026",  duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dakuitbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  { id:14, name:"Pinaskade 60 Zoetermeer (Dakkapel)", date:"9-03-2026", duur:"", weken:"1", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dakkapel", type:"Dakkapel", statuses:Array(19).fill("") },
  { id:15, name:"Pinaskade 60 Zoetermeer (Aanbouw)", date:"9-03-2026",  duur:"", weken:"1", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Dakkapel", statuses:Array(19).fill("") },
  { id:16, name:"Wittenburgerweg 36 Wassenaar (Aanbouw)",date:"9-03-2026",duur:"",leider:"",collega:"",oplevering:"",statuses:Array(19).fill("") },
  { id:17, name:"Troubadourlaan 480 Hoogvliet",      date:"23-03-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:18, name:"Klarinetstraat 26 Rijswijk",        date:"30-03-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  // ── APRIL ──
  { id:19, name:"Linzenakker 27 Schiedam",           date:"1-04-2026",  duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:20, name:"Anna Ruyschstraat 32 Zoetermeer",   date:"13-04-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouwserre", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:21, name:"Zeedistel 5 Nootdorp",              date:"20-04-2026", duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dakuitbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  { id:22, name:"Laakkade 377 Den Haag",             date:"28-04-2026", duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dakopbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  { id:23, name:"Handelskade 81 Nieuwegein",         date:"29-04-2026", duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dakopbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  // ── MEI ──
  { id:24, name:"Soesterbergstraat 160 Den Haag",    date:"4-05-2026",  duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:25, name:"Porfier 6 Zoetermeer",              date:"4-05-2026",  duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:26, name:"Groentelaan 9 Wateringen",          date:"11-05-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:27, name:"Laan van Overvest 1 Delft",         date:"18-05-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:28, name:"Vroonhoevelaan 49 Den Haag",        date:"18-05-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  // ── JUNI ──
  { id:29, name:"Theeroos 55 Rotterdam",             date:"8-06-2026",  duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:30, name:"Achter Porfier 6 Zoetermeer",       date:"15-06-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:31, name:"Lingestraat 153 Berkel en Rodenrijs",date:"15-06-2026",duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dak Uitbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  { id:32, name:"Marter 34 Hellevoetsluis",          date:"22-06-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:33, name:"Bizet 10 Naaldwijk",                date:"22-06-2026", duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dakopbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  { id:34, name:"Cyclaamtuin 25 Pijnacker",          date:"23-06-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:35, name:"Lobelialaan 22 Den Haag",           date:"25-06-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:87, name:"Stephensonstraat 46 Den Haag", date:"29-06-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Serre", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:36, name:"Van der Helmstraat 16 Rotterdam",   date:"29-06-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  // ── JULI ──
  { id:37, name:"Oosterschelde 204 Zoetermeer",      date:"1-07-2026",  duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dak Uitbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  { id:38, name:"Mozartlaan 42 Leidschendam",        date:"6-07-2026",  duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:39, name:"Watersnip 12 Berkel en Rodenrijs",  date:"6-07-2026",  duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:40, name:"Truus Wijsmullerstraat 32 Pijnacker",date:"7-07-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:41, name:"Hoflandendreef 153 Delft",          date:"13-07-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:42, name:"Vrouwenrecht 4 Pijnacker",          date:"20-07-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:43, name:"Ertsstraat 44 Rotterdam",           date:"22-06-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  // ── AUGUSTUS ──
  { id:44, name:"Munthof 12 Voorhout",               date:"24-08-2026", duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dakuitbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  { id:45, name:"Watervliet 87 Hoofddorp",           date:"25-08-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:46, name:"Anjelier 4 Rijswijk",               date:"31-08-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:47, name:"Burg Knappertlaan 231B Schiedam",   date:"31-08-2026", duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dubbele Dakopbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  // ── SEPTEMBER ──
  { id:48, name:"Pearl Bucklaan 17 Den Haag",        date:"7-09-2026",  duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:49, name:"Louis d'Orlaan 1 Berkel en Rodenrijs",date:"14-09-2026",duur:"",leider:"",collega:"",oplevering:"",statuses:Array(19).fill("") },
  { id:50, name:"Stuyvesantplein 4 Den Haag",        date:"14-09-2026", duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  { id:51, name:"Spiegelkarpersingel 2 Den Haag",    date:"21-09-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:52, name:"Veluwemeerplantsoen 50 Berkel en Rodenrijs",date:"22-09-2026",duur:"",leider:"",collega:"",oplevering:"",statuses:Array(19).fill("") },
  { id:53, name:"Cypresgroen 43 Zoetermeer",         date:"21-09-2026", duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  { id:54, name:"Waldeck Pyrmontstraat 5 Zoetermeer",date:"9-09-2026",  duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dakuitbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  { id:55, name:"Waldeck Pyrmontstraat 7 Zoetermeer",date:"9-09-2026",  duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dakuitbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  { id:56, name:"Breitnerlaan 126 Den Haag",         date:"14-09-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  // ── OKTOBER ──
  { id:57, name:"Bromelia 2 Nootdorp",               date:"5-10-2026",  duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:58, name:"Gagelplein 62 Den Haag",            date:"6-10-2026",  duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dak Uitbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  { id:59, name:"Lamoen 53 Brielle",                 date:"12-10-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:60, name:"Tjaliehof 11 Capelle aan den IJssel",date:"19-10-2026",duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:61, name:"S vd Oyeweg 80 Delfgauw",           date:"20-10-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  // ── NOVEMBER ──
  { id:62, name:"Hoge Hilleweg 21 Burgh-Haamstede",  date:"16-11-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:63, name:"Veeneklaaslaan 11 Voorschoten",     date:"17-11-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:64, name:"Kamvaren 37 Den Haag",              date:"23-11-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Renovatie", type:"Renovatie", statuses:Array(19).fill("") },
  { id:65, name:"Anjelier 13 Rijswijk",              date:"30-11-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  // ── DECEMBER ──
  { id:66, name:"Wijnberg 21 Zoetermeer",            date:"28-09-2026", duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dak Uitbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  { id:67, name:"Wijnberg 22 Zoetermeer",            date:"28-09-2026", duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dak Uitbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  { id:68, name:"Wieldraaier 4 Delfgauw",            date:"26-05-2026", duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dak Uitbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  // ── WHITEBOARD MEI-JUNI 2026 (bestaande projecten) ──
  { id:75, name:"Serjanbeek 100", date:"4-05-2026", duur:"", weken:"4", leider:"Rob", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:["Geleverd", "Geleverd", "Meergagrijs", "Geleverd", "Besteld", "", "Besteld", "Gereed", "", "Aangevraagd", "Gereed", "×", "Plannen!", "", "Plannen!", "Geleverd", "×", "×"] },
  { id:76, name:"Bizet 22-06", date:"22-06-2026", duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dakopbouw", type:"Dakopbouw", statuses:["Besteld", "Geleverd", "Geleverd", "Aangevraagd", "×", "×", "×", "×", "Aangevraagd", "", "Plannen!", "Plannen!", "", "Plannen!", "Plannen!", "Plannen!", "", "Aangevraagd"] },
  { id:77, name:"Lingestraat 15J", date:"15-06-2026", duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dak Uitbouw", type:"Dakopbouw", statuses:["", "Geleverd", "Besteld", "Herje Bruik", "×", "×", "", "×", "Doet klant", "×", "26-6", "19-6", "Week29", "15 Jun", "15 Jun", "Eben Stetzer", "×", ""] },
  { id:78, name:"Marterstraat 23-06", date:"23-06-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:["×", "×", "Zandsteen", "Aangevraagd", "Plannen!", "×", "Besteld", "Plannen!", "Doet klant", "Aangevraagd", "Plannen!", "×", "×", "×", "Plannen!", "×", "Plannen!", "Plannen!"] },
  { id:79, name:"Cyclaamstraat 23-06", date:"23-06-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:["Plannen!", "Aangevraagd", "Plannen!", "Besteld", "Plannen!", "×", "Besteld", "Plannen!", "Plannen!", "Aangevraagd", "Plannen!", "×", "×", "Plannen!", "Plannen!", "Plannen!", "×", "×"] },
  { id:80, name:"Robeliaklaan 25-06", date:"25-06-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:["×", "×", "Geleverd", "Geleverd", "Herje Bruik", "Geleverd", "Herje Druik", "Herje Druik", "Plannen!", "×", "×", "Plannen!", "", "×", "×", "×", "×", "Plannen!"] },
  { id:81, name:"v.d.Helmstraat 16", date:"29-06-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:["Besteld", "Geleverd", "Besteld", "Herje Dalik", "Plannen!", "Besteld", "Besteld", "Plannen!", "×", "×", "Plannen!", "×", "Plannen!", "Plannen!", "Plannen!", "×", "×", "×"] },
  { id:82, name:"Pontfien 6", date:"4-05-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:["Besteld", "Geleverd", "Geleverd", "Besteld", "19-05", "Geleverd", "Gereed", "Geleverd", "10-17", "Doet klant", "Plannen!", "Plannen!", "×", "×", "Plannen!", "alleen fundering", "×", "×"] },
  { id:83, name:"Greente baan 9", date:"11-05-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:["Besteld", "Aangevraagd", "Besteld", "Besteld", "Gereed", "Geleverd", "Gereed", "Geleverd", "5-6", "×", "12-06", "29-00", "×", "×", "Plannen!", "Geleverd", "×", "×"] },
  { id:84, name:"Nobeliarlaan 29", date:"25-06-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:["×", "×", "Geleverd", "Geleverd", "Plannen!", "Geleverd", "×", "Plannen!", "??", "×", "×", "Plannen!", "??", "×", "Plannen!", "×", "×", "×"] },
  { id:85, name:"Lean van Overvlost 1", date:"18-05-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:["Besteld", "Geleverd", "Besteld", "Geleverd", "Besteld", "Geleverd", "Gereed", "Geleverd", "5-6", "×", "×", "Plannen!", "Alleen 8-189", "Gereed", "Geleverd", "×", "×", "×"] },
  { id:86, name:"Thereoos 25-06", date:"25-06-2026", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:["Controle", "Geleverd", "Metsel", "Geleverd", "Besteld", "×", "08-06", "Besteld", "Aangevraagd", "Plannen!", "Plannen!", "Plannen!", "×", "20-6", "Geleverd", "×", "8-6", "×"] },
  // ── 2027 ──
  { id:69, name:"Hoekerkade 47 Zoetermeer",          date:"1-02-2027",  duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dubbele Dakopbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  { id:70, name:"Vroonhoevelaan 49 Den Haag (Herstart)",date:"1-02-2027",duur:"",leider:"",collega:"",oplevering:"",statuses:Array(19).fill("") },
  { id:71, name:"Laan van Eik en Duinen 137 Den Haag",date:"1-03-2027", duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:72, name:"Hemelsblauw 28 Zoetermeer",         date:"22-03-2027", duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Dakopbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
  { id:73, name:"Sweelinckplein 77 Den Haag",        date:"1-06-2027",  duur:"", weken:"4", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Aanbouw", type:"Aanbouw", statuses:Array(19).fill("") },
  { id:74, name:"Goudenregenstraat 19 Den Haag",     date:"1-06-2027",  duur:"", weken:"8", leider:"", collega:"", oplevering:"", einddatum:"", afgerond:false, typeLabel:"Opbouw", type:"Dakopbouw", statuses:Array(19).fill("") },
];

const YEAR_MONTHS = ["Jan","Feb","Mrt","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec"];

// ── SUPABASE CONFIG ───────────────────────────────────────────────────
const SUPABASE_URL = "https://xrdkrdytrkppurvwgiwq.supabase.co";
const SUPABASE_KEY = "sb_publishable_MLXLvx-gbBJFRnhv36yeIg_QRy14TxE";

async function sbFetch(path, method="GET", body=null) {
  const opts = {
    method,
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + SUPABASE_KEY,
      "Content-Type": "application/json",
      "Prefer": method === "POST" ? "resolution=merge-duplicates" : ""
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(SUPABASE_URL + path, opts);
  if (!r.ok) return null;
  try { return await r.json(); } catch { return null; }
}

// ── STORAGE HELPERS ───────────────────────────────────────────────────
async function loadData(key, fallback) {
  try {
    const rows = await sbFetch(`/rest/v1/appdata?key=eq.${encodeURIComponent(key)}&select=value`);
    if (rows && rows.length > 0) return JSON.parse(rows[0].value);
    return fallback;
  } catch { return fallback; }
}

async function saveData(key, value) {
  try {
    const result = await sbFetch("/rest/v1/appdata", "POST", {
      key,
      value: JSON.stringify(value),
      updated_at: new Date().toISOString()
    });
    return result !== null;
  } catch (e) {
    console.error("saveData error:", e);
    return false;
  }
}

// ── TINY COMPONENTS ───────────────────────────────────────────────────
function Chip({ value }) {
  const key = STATUS_OPTIONS.find(k => k && value?.startsWith(k)) || "";
  const m = STATUS_META[key] || STATUS_META[""];
  return (
    <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:4,
      fontSize:11, fontWeight:600, background:m.bg, color:m.text, border:`1px solid ${m.border}`,
      wordBreak:"break-word", whiteSpace:"normal" }}>
      {value || "—"}
    </span>
  );
}

function Input({ label, type="text", value, onChange, placeholder, style={} }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label style={{ display:"block", fontSize:12, fontWeight:600,
        color:"#546E7A", marginBottom:4 }}>{label}</label>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width:"100%", boxSizing:"border-box", padding:"9px 12px",
          borderRadius:6, border:"1px solid #CFD8DC", fontSize:13, outline:"none", ...style }} />
    </div>
  );
}

function Btn({ children, onClick, variant="primary", style={} }) {
  const base = { padding:"9px 18px", borderRadius:6, border:"none", fontWeight:700,
    fontSize:13, cursor:"pointer", transition:"opacity .15s", ...style };
  const variants = {
    primary: { background:"#E65100", color:"#fff" },
    ghost:   { background:"transparent", border:"1px solid #90A4AE", color:"#546E7A" },
    danger:  { background:"#FFEBEE", color:"#B71C1C", border:"1px solid #EF9A9A" },
    success: { background:"#E8F5E9", color:"#2E7D32", border:"1px solid #A5D6A7" },
  };
  return <button style={{...base,...variants[variant]}} onClick={onClick}>{children}</button>;
}

// ── LOGIN / REGISTER ──────────────────────────────────────────────────
function AuthScreen({ onLogin, users, setUsers }) {
  const [mode,  setMode]  = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [name,  setName]  = useState("");
  const [pass2, setPass2] = useState("");
  const [err,   setErr]   = useState("");
  const [ok,    setOk]    = useState("");

  function doLogin() {
    setErr("");
    if (email === ADMIN_USER.email && pass === ADMIN_USER.password) {
      onLogin(ADMIN_USER); return;
    }
    const u = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    if (!u) { setErr("E-mail of wachtwoord klopt niet."); return; }
    if (!u.approved) { setErr("Je account wacht nog op goedkeuring door Rob Broekman."); return; }
    onLogin(u);
  }

  async function doRegister() {
    setErr("");
    if (!name.trim() || !email.trim() || !pass.trim()) { setErr("Vul alle velden in."); return; }
    if (pass !== pass2) { setErr("Wachtwoorden komen niet overeen."); return; }
    if (pass.length < 6) { setErr("Wachtwoord moet minimaal 6 tekens zijn."); return; }
    if (email.toLowerCase() === ADMIN_USER.email) { setErr("Dit e-mailadres is al in gebruik."); return; }
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      setErr("Dit e-mailadres is al geregistreerd."); return;
    }
    const newUser = {
      id: Date.now().toString(), name: name.trim(),
      email: email.trim().toLowerCase(), password: pass,
      role: "user", approved: false,
      registeredAt: new Date().toLocaleDateString("nl-NL"),
    };
    const updated = [...users, newUser];
    setUsers(updated);
    await saveData("bouw_users", updated);
    setOk("Account aangemaakt! Rob Broekman moet je eerst goedkeuren voor je kunt inloggen.");
    setMode("login"); setName(""); setEmail(""); setPass(""); setPass2("");
  }

  return (
    <div style={{ minHeight:"100vh", background:"#1C2B3A",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Inter',system-ui,sans-serif" }}>
      <div style={{ background:"#fff", borderRadius:12, padding:"40px 44px",
        width:360, boxShadow:"0 24px 64px rgba(0,0,0,.4)" }}>
        {/* logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
          <div style={{ background:"#E65100", borderRadius:8, width:40, height:40,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:20 }}>🏗️</div>
          <div>
            <div style={{ fontWeight:800, fontSize:17, color:"#1C2B3A" }}>De Aanbouw Expert</div>
            <div style={{ fontSize:11, color:"#90A4AE" }}>Project beheer platform</div>
          </div>
        </div>

        {/* tabs */}
        <div style={{ display:"flex", background:"#F5F7FA", borderRadius:8,
          padding:3, marginBottom:22 }}>
          {["login","register"].map(m => (
            <button key={m} onClick={()=>{ setMode(m); setErr(""); setOk(""); }}
              style={{ flex:1, padding:"7px 0", border:"none", borderRadius:6, fontSize:12,
                fontWeight:mode===m?700:500, cursor:"pointer",
                background:mode===m?"#fff":"transparent",
                color:mode===m?"#E65100":"#78909C",
                boxShadow:mode===m?"0 1px 4px rgba(0,0,0,.12)":"none" }}>
              {m==="login" ? "Inloggen" : "Account aanmaken"}
            </button>
          ))}
        </div>

        {ok && <div style={{ background:"#E8F5E9", color:"#2E7D32", borderRadius:6,
          padding:"8px 12px", fontSize:12, marginBottom:12 }}>{ok}</div>}
        {err && <div style={{ background:"#FFEBEE", color:"#C62828", borderRadius:6,
          padding:"8px 12px", fontSize:12, marginBottom:12 }}>{err}</div>}

        {mode === "login" ? (
          <>
            <Input label="E-mailadres" type="email" value={email} onChange={setEmail} placeholder="naam@bedrijf.nl" />
            <Input label="Wachtwoord" type="password" value={pass} onChange={setPass} placeholder="••••••••" />
            <Btn style={{ width:"100%", padding:"11px" }} onClick={doLogin}>Inloggen</Btn>
            <div style={{ textAlign:"center", marginTop:12 }}>
              <button onClick={async()=>{
                if (!email.trim()) { setErr("Vul eerst je e-mailadres in."); return; }
                const u = users.find(u => u.email.toLowerCase()===email.toLowerCase());
                if (!u && email.toLowerCase()!==ADMIN_USER.email) {
                  setErr("Dit e-mailadres is niet bekend."); return;
                }
                // Send reset email via mailto
                const resetCode = Math.random().toString(36).slice(2,8).toUpperCase();
                const subject = encodeURIComponent("BouwPlanning - Wachtwoord reset verzoek");
                const body = encodeURIComponent(
                  `Hallo Rob,\n\n${email} vraagt een nieuw wachtwoord aan.\n\nReset code: ${resetCode}\n\nGa naar de app en stel een nieuw wachtwoord in voor deze gebruiker.\n\nBouwPlanning - De Aanbouw Expert`
                );
                window.open(`mailto:rob@deaanbouwexpert.nl?subject=${subject}&body=${body}`);
                setOk("Er wordt een e-mail geopend naar Rob Broekman. Hij stelt een nieuw wachtwoord voor je in.");
              }}
                style={{ background:"none", border:"none", cursor:"pointer",
                  fontSize:12, color:"#1565C0", textDecoration:"underline" }}>
                Wachtwoord vergeten?
              </button>
            </div>
          </>
        ) : (
          <>
            <Input label="Volledige naam" value={name} onChange={setName} placeholder="Jan de Vries" />
            <Input label="E-mailadres" type="email" value={email} onChange={setEmail} placeholder="naam@bedrijf.nl" />
            <Input label="Wachtwoord" type="password" value={pass} onChange={setPass} placeholder="Minimaal 6 tekens" />
            <Input label="Herhaal wachtwoord" type="password" value={pass2} onChange={setPass2} placeholder="••••••••" />
            <Btn style={{ width:"100%", padding:"11px" }} onClick={doRegister}>Account aanmaken</Btn>
            <div style={{ fontSize:11, color:"#90A4AE", textAlign:"center", marginTop:10 }}>
              Na registratie keurt Rob Broekman je account goed.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── ADMIN PANEL ───────────────────────────────────────────────────────
function AdminPanel({ users, setUsers }) {
  async function approve(id) {
    const updated = users.map(u => u.id===id ? {...u, approved:true} : u);
    setUsers(updated);
    await saveData("bouw_users", updated);
  }
  async function reject(id) {
    if (!window.confirm("Weet je zeker dat je dit account wil verwijderen?")) return;
    const updated = users.filter(u => u.id!==id);
    setUsers(updated);
    await saveData("bouw_users", updated);
  }

  const pending  = users.filter(u => !u.approved);
  const approved = users.filter(u => u.approved);

  return (
    <div style={{ maxWidth:700 }}>

      {/* ── SECTIE 1: WACHT OP GOEDKEURING ── */}
      <div style={{ background: pending.length>0 ? "#FFFDE7" : "#F5F5F5",
        border: `2px solid ${pending.length>0 ? "#FFD600" : "#E0E0E0"}`,
        borderRadius:12, padding:"20px 24px", marginBottom:24 }}>

        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom: pending.length>0 ? 16 : 0 }}>
          <div style={{ fontSize:22 }}>{pending.length>0 ? "🔔" : "🔕"}</div>
          <div>
            <div style={{ fontWeight:800, fontSize:15, color:"#1C2B3A" }}>
              Nieuwe aanmeldingen — wacht op jouw goedkeuring
            </div>
            <div style={{ fontSize:12, color:"#78909C", marginTop:2 }}>
              {pending.length>0
                ? `${pending.length} persoon${pending.length>1?"en":""} heeft een account aangemaakt en wacht op toegang.`
                : "Er zijn op dit moment geen nieuwe aanmeldingen."}
            </div>
          </div>
        </div>

        {pending.map(u => (
          <div key={u.id} style={{
            background:"#fff", border:"2px solid #FFD600",
            borderRadius:10, padding:"14px 16px", marginBottom:10,
            display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
            {/* avatar */}
            <div style={{ width:44, height:44, borderRadius:"50%",
              background:"#E65100", color:"#fff", display:"flex",
              alignItems:"center", justifyContent:"center",
              fontWeight:800, fontSize:17, flexShrink:0 }}>
              {u.name.charAt(0).toUpperCase()}
            </div>
            {/* info */}
            <div style={{ flex:1, minWidth:160 }}>
              <div style={{ fontWeight:700, fontSize:14, color:"#1C2B3A" }}>{u.name}</div>
              <div style={{ fontSize:12, color:"#546E7A" }}>{u.email}</div>
              <div style={{ fontSize:11, color:"#90A4AE", marginTop:2 }}>Aangemeld op {u.registeredAt}</div>
            </div>
            {/* actions */}
            <div style={{ display:"flex", gap:8, flexShrink:0 }}>
              <button onClick={()=>approve(u.id)} style={{
                background:"#2E7D32", color:"#fff", border:"none",
                borderRadius:8, padding:"10px 20px", fontWeight:700,
                fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                ✓ Goedkeuren
              </button>
              <button onClick={()=>reject(u.id)} style={{
                background:"#fff", color:"#B71C1C",
                border:"2px solid #EF9A9A", borderRadius:8,
                padding:"10px 16px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                ✕ Weigeren
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── SECTIE 2: ACTIEVE ACCOUNTS ── */}
      <div style={{ background:"#fff", border:"1px solid #DDE3E9",
        borderRadius:12, padding:"20px 24px" }}>

        <div style={{ fontWeight:800, fontSize:15, color:"#1C2B3A", marginBottom:16,
          display:"flex", alignItems:"center", gap:8 }}>
          <span>✅</span> Actieve accounts ({approved.length + 1})
        </div>

        {/* Rob — admin */}
        <div style={{ display:"flex", alignItems:"center", gap:12,
          background:"#E3F2FD", border:"1px solid #90CAF9",
          borderRadius:10, padding:"12px 16px", marginBottom:8 }}>
          <div style={{ width:44, height:44, borderRadius:"50%",
            background:"#E65100", color:"#fff", display:"flex",
            alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:17 }}>R</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:14, color:"#1C2B3A" }}>Rob Broekman</div>
            <div style={{ fontSize:12, color:"#546E7A" }}>rob@deaanbouwexpert.nl</div>
          </div>
          <span style={{ background:"#E65100", color:"#fff", borderRadius:6,
            padding:"3px 10px", fontSize:11, fontWeight:700 }}>ADMIN</span>
        </div>

        {approved.length === 0 && (
          <div style={{ fontSize:13, color:"#90A4AE", fontStyle:"italic", padding:"8px 0" }}>
            Nog geen andere medewerkers goedgekeurd.
          </div>
        )}

        {approved.map(u => (
          <div key={u.id} style={{ display:"flex", alignItems:"center", gap:12,
            background:"#FAFBFC", border:"1px solid #E0E0E0",
            borderRadius:10, padding:"12px 16px", marginBottom:8 }}>
            <div style={{ width:44, height:44, borderRadius:"50%",
              background:"#546E7A", color:"#fff", display:"flex",
              alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:17 }}>
              {u.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14, color:"#1C2B3A" }}>{u.name}</div>
              <div style={{ fontSize:12, color:"#546E7A" }}>{u.email}</div>
              <div style={{ fontSize:11, color:"#90A4AE", marginTop:2 }}>Aangemeld op {u.registeredAt}</div>
            </div>
            <span style={{ background:"#E8F5E9", color:"#2E7D32", borderRadius:6,
              padding:"3px 10px", fontSize:11, fontWeight:700, marginRight:8 }}>MEDEWERKER</span>
            <button onClick={()=>reject(u.id)} style={{
              background:"#fff", color:"#B71C1C", border:"1px solid #EF9A9A",
              borderRadius:6, padding:"6px 12px", fontWeight:600,
              fontSize:12, cursor:"pointer" }}>Verwijderen</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MINI CALENDAR PICKER ─────────────────────────────────────────────
function MiniCalendar({ value, onChange }) {
  const today = new Date();

  function parseVal(v) {
    if (!v) return null;
    const m = v.match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{4})$/);
    if (m) return new Date(parseInt(m[3]), parseInt(m[2])-1, parseInt(m[1]));
    return null;
  }
  function fmtVal(d) {
    return `${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;
  }

  const selected = parseVal(value);
  const [viewYear,  setViewYear]  = useState(selected ? selected.getFullYear()  : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected ? selected.getMonth()     : today.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  // Shift so Monday is first
  const offset = (firstWeekday + 6) % 7;

  const dayNames = ["Ma","Di","Wo","Do","Vr","Za","Zo"];

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y=>y-1); }
    else setViewMonth(m=>m-1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y=>y+1); }
    else setViewMonth(m=>m+1);
  }

  function selectDay(d) {
    const date = new Date(viewYear, viewMonth, d);
    onChange(fmtVal(date));
  }

  // Build grid cells
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const isSelected = d => selected && selected.getFullYear()===viewYear && selected.getMonth()===viewMonth && selected.getDate()===d;
  const isToday2   = d => today.getFullYear()===viewYear && today.getMonth()===viewMonth && today.getDate()===d;
  const isWeekend  = (idx) => idx % 7 >= 5; // Sa=5, Su=6 (Mon-first)

  return (
    <div style={{ background:"#fff", borderRadius:8, border:"1px solid #DDE3E9",
      padding:"8px", userSelect:"none", width:220 }}>
      {/* month nav */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
        <button onClick={prevMonth}
          style={{ background:"none", border:"none", cursor:"pointer", fontSize:14,
            color:"#546E7A", padding:"2px 6px", borderRadius:4, fontWeight:700 }}>◀</button>
        <span style={{ fontWeight:800, fontSize:12, color:"#1C2B3A" }}>
          {YEAR_MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth}
          style={{ background:"none", border:"none", cursor:"pointer", fontSize:14,
            color:"#546E7A", padding:"2px 6px", borderRadius:4, fontWeight:700 }}>▶</button>
      </div>
      {/* weekday headers */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:1, marginBottom:3 }}>
        {dayNames.map(d => (
          <div key={d} style={{ textAlign:"center", fontSize:9, fontWeight:700,
            color: d==="Za"||d==="Zo" ? "#BDBDBD" : "#90A4AE", padding:"2px 0" }}>{d}</div>
        ))}
      </div>
      {/* day grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:1 }}>
        {cells.map((d, idx) => {
          if (!d) return <div key={idx}/>;
          const sel  = isSelected(d);
          const tod  = isToday2(d);
          const wknd = isWeekend(idx);
          return (
            <div key={idx} onClick={()=>selectDay(d)}
              style={{ textAlign:"center", padding:"4px 0", borderRadius:4,
                fontSize:11, fontWeight: sel||tod ? 800 : 400,
                cursor:"pointer",
                background: sel ? "#E65100" : (tod ? "#FFF3E0" : "transparent"),
                color: sel ? "#fff" : (tod ? "#E65100" : (wknd ? "#BDBDBD" : "#1C2B3A")),
                border: tod && !sel ? "1px solid #FFAB76" : "1px solid transparent" }}
              onMouseEnter={e=>{ if(!sel) e.currentTarget.style.background="#F5F7FA"; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=sel?"#E65100":(tod?"#FFF3E0":"transparent"); }}>
              {d}
            </div>
          );
        })}
      </div>
      {/* clear button */}
      {value && (
        <div style={{ marginTop:6, textAlign:"center" }}>
          <button onClick={()=>onChange("")}
            style={{ background:"none", border:"none", cursor:"pointer",
              fontSize:10, color:"#90A4AE", textDecoration:"underline" }}>
            Datum wissen
          </button>
        </div>
      )}
    </div>
  );
}

// ── MEDEWERKER SELECT ─────────────────────────────────────────────────
function MedewerkerSelect({ label, value, onChange, border="1px solid #90CAF9" }) {
  const [custom, setCustom] = useState(!MEDEWERKERS.includes(value) && value !== "");
  const [customVal, setCustomVal] = useState(!MEDEWERKERS.includes(value) ? value : "");

  function handleSelect(e) {
    const v = e.target.value;
    if (v === "__custom__") { setCustom(true); onChange(customVal); }
    else { setCustom(false); onChange(v); }
  }

  return (
    <div>
      <label style={{ fontSize:11, fontWeight:600, color:"#546E7A", display:"block", marginBottom:3 }}>{label}</label>
      <select
        value={custom ? "__custom__" : (value || "")}
        onChange={handleSelect}
        style={{ fontSize:11, padding:"5px 7px", borderRadius:4, border, width:"100%", background:"#fff", color:"#1C2B3A" }}>
        <option value="">— Kies naam —</option>
        {MEDEWERKERS.map(n => <option key={n} value={n}>{n}</option>)}
        <option value="__custom__">✏️ Andere naam...</option>
      </select>
      {custom && (
        <input
          autoFocus
          value={customVal}
          onChange={e=>{ setCustomVal(e.target.value); onChange(e.target.value); }}
          placeholder="Typ naam..."
          style={{ marginTop:4, fontSize:11, padding:"5px 7px", borderRadius:4, border, width:"100%", outline:"none", boxSizing:"border-box" }}
        />
      )}
    </div>
  );
}

// ── DATUM PICKER FIELD ────────────────────────────────────────────────
function DatumPicker({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const [calPos, setCalPos] = useState({ top:0, left:0 });

  function openCal() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const calH = 270;
      const calW = 228;
      // Always prefer above, fall back to below if not enough space
      const spaceAbove = r.top;
      const spaceBelow = window.innerHeight - r.bottom;
      const top = spaceAbove >= calH
        ? (r.top - calH - 4 + window.scrollY)
        : spaceBelow >= calH
          ? (r.bottom + 4 + window.scrollY)
          : (r.top - calH - 4 + window.scrollY);
      // Keep within horizontal bounds
      const left = Math.min(r.left + window.scrollX, window.innerWidth - calW - 8 + window.scrollX);
      setCalPos({ top, left: Math.max(4, left) });
    }
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function handle(e) {
      if (!e.target.closest("[data-datepicker]")) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const portalTarget = typeof document !== "undefined" ? document.body : null;

  return (
    <div data-datepicker="1" style={{ position:"relative" }}>
      {label && <label style={{ fontSize:11, fontWeight:600, color:"#546E7A", display:"block", marginBottom:3 }}>{label}</label>}
      <div ref={btnRef}
        style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 9px", borderRadius:5,
          border: open ? "1px solid #E65100" : "1px solid #CFD8DC",
          background:"#fff", fontSize:12, minWidth:130 }}>
        <span style={{ cursor:"pointer", flex:1, display:"flex", alignItems:"center", gap:6,
          color: value ? "#1C2B3A" : "#90A4AE" }}
          onClick={openCal}>
          <span>📅</span>
          <span>{value || "Kies datum"}</span>
        </span>
        {value
          ? <button onClick={e=>{ e.stopPropagation(); onChange(""); setOpen(false); }}
              title="Datum wissen"
              style={{ background:"none", border:"none", cursor:"pointer", color:"#90A4AE",
                fontSize:15, lineHeight:1, padding:"0 2px", flexShrink:0 }}>×</button>
          : <span style={{ color:"#BDBDBD", fontSize:11, cursor:"pointer" }} onClick={openCal}>▼</span>
        }
      </div>
      {open && portalTarget && ReactDOM.createPortal(
        <div data-datepicker="1"
          style={{ position:"fixed", top:calPos.top, left:calPos.left, zIndex:9999,
            boxShadow:"0 8px 32px rgba(0,0,0,.22)", borderRadius:8 }}
          onMouseDown={e=>e.stopPropagation()}>
          <MiniCalendar value={value} onChange={v=>{ onChange(v); setOpen(false); }} />
        </div>,
        portalTarget
      )}
    </div>
  );
}

// ── ONDERDEEL HELPERS (top-level zo React ze niet opnieuw aanmaakt) ──
function OndRow({ col, aan, onToggle, actief, children }) {
  const hasChildren = !!children;
  return (
    <div style={{ border:"1px solid #E0E0E0", borderRadius:5, margin:2,
      background: aan?"#EBF5FF":"#FAFAFA",
      gridColumn: aan ? "1 / -1" : "auto" }}>
      <div onClick={onToggle}
        style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 8px",
          cursor:"pointer", userSelect:"none" }}>
        <div style={{ width:18, height:18, borderRadius:3, flexShrink:0,
          background: aan?"#1565C0":"#fff", border: aan?"2px solid #1565C0":"2px solid #BDBDBD",
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"#fff", fontSize:11, fontWeight:900 }}>{aan?"✓":""}</div>
        <span style={{ fontSize:11, fontWeight: aan?600:400, color: aan?"#1C2B3A":"#90A4AE",
          flex:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{col}</span>
        <span style={{ fontSize:9, fontWeight:700, flexShrink:0,
          color: aan?"#fff":"#BDBDBD", background: aan?"#1565C0":"#E0E0E0",
          padding:"1px 6px", borderRadius:20 }}>{aan?"AAN":"UIT"}</span>
      </div>
      {aan && children && (
        <div style={{ padding:"6px 10px 10px 10px", display:"flex", flexDirection:"column", gap:6,
          background:"#F0F7FF", borderTop:"1px solid #DDEEFF", gridColumn:"1 / -1" }}>
          {children}
        </div>
      )}
    </div>
  );
}
function OField({ label, k, placeholder, type="text", unit, ond, ondSet }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      {label && <span style={{ fontSize:11, color:"#546E7A", minWidth:70, flexShrink:0 }}>{label}</span>}
      <input type={type} value={ond[k]||""}
        onChange={e=>ondSet(k,e.target.value)}
        placeholder={placeholder}
        style={{ flex:1, fontSize:11, padding:"4px 7px", borderRadius:4, minWidth:0,
          border:"1px solid #CFD8DC", outline:"none", background:"#fff", color:"#1C2B3A",
          boxSizing:"border-box" }} />
      {unit && <span style={{ fontSize:10, color:"#90A4AE", flexShrink:0 }}>{unit}</span>}
    </div>
  );
}
function OSelect({ label, k, options, ond, ondSet }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      {label && <span style={{ fontSize:11, color:"#546E7A", minWidth:70, flexShrink:0 }}>{label}</span>}
      <select value={ond[k]||""} onChange={e=>ondSet(k,e.target.value)}
        style={{ flex:1, fontSize:11, padding:"4px 7px", borderRadius:4,
          border:"1px solid #CFD8DC", background:"#fff", color:"#1C2B3A", minWidth:0 }}>
        <option value="">— kies —</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
function ONote({ k, ond, ondSet }) {
  return (
    <input type="text" value={ond[k]||""} onChange={e=>ondSet(k,e.target.value)}
      placeholder="Notitie..."
      style={{ fontSize:12, padding:"5px 8px", borderRadius:5, border:"1px solid #90CAF9",
        outline:"none", width:"100%", boxSizing:"border-box",
        color:"#1C2B3A", background:"#fff" }} />
  );
}

// ── PDF WERKBON GENERATOR ────────────────────────────────────────────
function drukWerkbon(p) {
  const ond = p.ond || {};
  const actief = p.actief || {};

  function rij(label, waarde) {
    if (!waarde) return "";
    return `<tr><td style="padding:5px 10px;font-weight:600;color:#546E7A;width:180px;vertical-align:top;font-size:12px">${label}</td><td style="padding:5px 10px;font-size:12px;color:#1C2B3A">${waarde}</td></tr>`;
  }

  function sectie(titel, rijen) {
    const inhoud = rijen.filter(Boolean).join("");
    if (!inhoud) return "";
    return `
      <div style="margin-bottom:18px;page-break-inside:avoid">
        <div style="background:#1C2B3A;color:#fff;padding:7px 12px;font-size:13px;font-weight:700;border-radius:4px 4px 0 0">${titel}</div>
        <table style="width:100%;border-collapse:collapse;border:1px solid #DDE3E9;border-top:none;border-radius:0 0 4px 4px;background:#fff">
          ${inhoud}
        </table>
      </div>`;
  }

  const kolommen = COLUMNS.filter(k => actief[k] !== false);

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>Werkbon – ${p.name}</title>
<style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 24px; color: #1C2B3A; }
  @media print { body { padding: 0; } .no-print { display:none; } }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .header { background: #1C2B3A; color: #fff; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px; display:flex; justify-content:space-between; align-items:flex-start; }
  .logo { font-size: 22px; font-weight: 900; color: #FF6D00; }
  tr:nth-child(even) td { background: #F8FAFB; }
</style>
</head><body>

<div class="no-print" style="margin-bottom:16px">
  <button onclick="window.print()" style="background:#E65100;color:#fff;border:none;padding:10px 24px;border-radius:6px;font-size:14px;font-weight:700;cursor:pointer">🖨️ Afdrukken / Opslaan als PDF</button>
  <button onclick="window.close()" style="margin-left:10px;background:#F5F7FA;color:#546E7A;border:1px solid #DDE3E9;padding:10px 20px;border-radius:6px;font-size:14px;cursor:pointer">✕ Sluiten</button>
</div>

<div class="header">
  <div>
    <div class="logo">De Aanbouw Expert</div>
    <h1>${p.name}</h1>
    <div style="font-size:13px;opacity:.85;margin-top:4px">
      Type: ${p.type||"—"} &nbsp;|&nbsp; Startdatum: ${p.date||"—"} &nbsp;|&nbsp; Weken: ${p.weken||"—"}
    </div>
  </div>
  <div style="text-align:right;font-size:12px;opacity:.75">
    Werkbon gegenereerd: ${new Date().toLocaleDateString("nl-NL")}<br>
    ${p.leider ? "Projectleider: " + p.leider : ""}${p.collega ? " &amp; " + p.collega : ""}
  </div>
</div>

${kolommen.includes("Graafwerk") ? sectie("🚜 Graafwerk", [
  rij("Ja / Nee", ond.graaf_jn),
  rij("Grond afvoeren", ond.graaf_afvoer),
  rij("Hoeveelheid grond", ond.graaf_m3 ? ond.graaf_m3 + " m³" : ""),
  rij("Tuintegels opnemen", ond.graaf_tegels),
  rij("Schutting weghalen", ond.graaf_schutting),
  rij("Notitie", ond.graaf_notitie),
]) : ""}

${kolommen.includes("Staal") ? sectie("⚙️ Staal", [
  rij("Ja / Nee", ond.staal_jn),
  rij("Achtergevel verwijderen", ond.staal_achtergevel),
  rij("Binnenmuur dragend", ond.staal_binnen_dragend),
  rij("Buitenmuur dragend", ond.staal_buiten_dragend),
  rij("Notitie", ond.staal_notitie),
]) : ""}

${kolommen.includes("Constructie berekening") ? sectie("📐 Constructie berekening", [
  rij("Ja / Nee", ond.constructie_jn),
  rij("Notitie", ond.constructie_notitie),
]) : ""}

${kolommen.includes("Steen-strips / Metselwerk") ? sectie("🧱 Steen-strips / Metselwerk", [
  rij("Ja / Nee", ond.steen_jn),
  rij("Type", ond.steen_type),
  rij("Oppervlakte", ond.steen_m2 ? ond.steen_m2 + " m²" : ""),
  rij("Steencode", ond.steen_code),
  rij("Notitie", ond.steen_notitie),
]) : ""}

${kolommen.includes("Kozijn") ? sectie("🪟 Kozijn", [
  rij("Ja / Nee", ond.kozijn_jn),
  rij("Materiaal", ond.kozijn_materiaal),
  rij("Kleurcode binnen", ond.kozijn_kleur_binnen),
  rij("Kleurcode buiten", ond.kozijn_kleur_buiten),
  rij("Aantal kozijnen", ond.kozijn_aantal ? ond.kozijn_aantal + " stuks" : ""),
  rij("Buitenmaten", ond.kozijn_maten),
  rij("Notitie", ond.kozijn_notitie),
]) : ""}

${kolommen.includes("Lichtstraat") ? sectie("💡 Lichtstraat", [
  rij("Ja / Nee", ond.licht_jn),
  rij("Maat", ond.lichtstraat_maat),
  rij("Notitie", ond.lichtstraat_notitie),
]) : ""}

${kolommen.includes("Heiwerk") ? sectie("🔨 Heiwerk", [
  rij("Ja / Nee", ond.hei_jn),
  rij("Aantal palen", ond.hei_palen ? ond.hei_palen + " palen" : ""),
  rij("Diepte palen", ond.hei_diepte ? ond.hei_diepte + " meter" : ""),
  rij("Toegang via", ond.hei_toegang),
  rij("Breedte tuinhek", ond.hei_hek_breedte ? ond.hei_hek_breedte + " cm" : ""),
  rij("Breedte doorgang", ond.hei_doorgang_breedte ? ond.hei_doorgang_breedte + " cm" : ""),
  rij("Notitie", ond.hei_notitie),
]) : ""}

${kolommen.includes("Fundering") ? sectie("🏛️ Fundering", [
  rij("Ja / Nee", ond.fund_jn),
  rij("Type", ond.fund_type),
  rij("Beton bestellen", ond.fund_beton ? ond.fund_beton + " m³" : ""),
  rij("Notitie", ond.fund_notitie),
]) : ""}

${kolommen.includes("Electra") ? sectie("⚡ Electra", [
  rij("Ja / Nee", ond.electra_jn),
  rij("Stopcontacten", ond.el_stopcontacten ? ond.el_stopcontacten + " stuks" : ""),
  rij("Spotjes binnen", ond.el_spotjes_binnen ? ond.el_spotjes_binnen + " stuks" : ""),
  rij("Spotjes buiten", ond.el_spotjes_buiten ? ond.el_spotjes_buiten + " stuks" : ""),
  rij("Lichtpunten binnen", ond.el_licht_binnen ? ond.el_licht_binnen + " stuks" : ""),
  rij("Lichtpunten buiten", ond.el_licht_buiten ? ond.el_licht_buiten + " stuks" : ""),
  rij("Stroom zonnescherm", ond.el_zonnescherm),
  rij("Nieuwe meterkast", ond.el_meterkast),
  rij("Zonnepanelen", ond.el_zonnepanelen),
  rij("Notitie", ond.electra_notitie),
]) : ""}

${kolommen.includes("Verwarming") ? sectie("🌡️ Verwarming", [
  rij("Ja / Nee", ond.verw_jn),
  rij("Type", ond.verw_type),
  rij("Aantal radiatoren", ond.verw_radiator_aantal ? ond.verw_radiator_aantal + " stuks" : ""),
  rij("Oppervlakte vloerverwarming", ond.verw_m2 ? ond.verw_m2 + " m²" : ""),
  rij("Notitie", ond.verw_notitie),
]) : ""}

${kolommen.includes("Dakbedekking") ? sectie("🏠 Dakbedekking", [
  rij("Ja / Nee", ond.dak_jn),
  rij("Type", ond.dak_type),
  rij("Notitie", ond.dak_notitie),
]) : ""}

${kolommen.includes("Hijsen") ? sectie("🏗️ Hijsen", [
  rij("Ja / Nee", ond.hijsen_jn),
  rij("Notitie", ond.hijsen_notitie),
]) : ""}

${kolommen.includes("Tegelwerk") ? sectie("🔲 Tegelwerk", [
  rij("Ja / Nee", ond.tegel_jn),
  rij("Oppervlakte", ond.tegel_m2 ? ond.tegel_m2 + " m²" : ""),
  rij("Notitie", ond.tegel_notitie),
]) : ""}

${kolommen.includes("Stucwerk") ? sectie("🪣 Stucwerk", [
  rij("Ja / Nee", ond.stuc_jn),
  rij("Oppervlakte", ond.stuc_m2 ? ond.stuc_m2 + " m²" : ""),
  rij("Notitie", ond.stuc_notitie),
]) : ""}

${kolommen.includes("Loodgieter") ? sectie("🔧 Loodgieter", [
  rij("Ja / Nee", ond.lood_jn),
  rij("Buitenkraan", ond.lood_buitenkraan),
  rij("Notitie", ond.lood_notitie),
]) : ""}

${kolommen.includes("Container") ? sectie("📦 Container", [
  rij("Ja / Nee", ond.cont_jn),
  rij("Aantal", ond.cont_aantal ? ond.cont_aantal + " stuks" : ""),
  rij("Notitie", ond.cont_notitie),
]) : ""}

${kolommen.includes("Steigers") ? sectie("🏗️ Steigers", [
  rij("Ja / Nee", ond.steigers_jn),
  rij("Notitie", ond.steigers_notitie),
]) : ""}

${kolommen.includes("Trap") ? sectie("🪜 Trap", [
  rij("Ja / Nee", ond.trap_jn),
  rij("Notitie", ond.trap_notitie),
]) : ""}

${kolommen.includes("Extra") ? sectie("➕ Extra", [
  rij("Ja / Nee", ond.extra_jn),
  rij("Notitie", ond.extra_notitie),
]) : ""}

${p.klantNaam ? sectie("👤 Klantgegevens", [
  rij("Naam", p.klantNaam),
  rij("Telefoon", p.klantTel),
]) : ""}

</body></html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
}

// ── TEAM EDIT INLINE (in ProjectRow) ─────────────────────────────────
function TeamEditInline({ p, onSave, onClose }) {
  const [naam,        setNaam]       = useState(p.name||"");
  const [leider,      setLeider]     = useState(p.leider||"");
  const [collega,     setCollega]    = useState(p.collega||"");
  const [weken,       setWeken]      = useState(String(p.weken||"4"));
  const [startdatum,  setStartdatum] = useState(p.date||"");
  const [type,        setType]       = useState(p.type||"");
  const [ingemeten,   setIngemeten]  = useState(p.ingemeten||false);
  const [_ingemetenDatum] = useState(""); // removed
  const [actief,      setActief]     = useState(p.actief || COLUMNS.reduce((a,c)=>({...a,[c]:true}),{}));
  const [ond,         setOnd]        = useState(p.ond || {});
  function ondSet(key, val) { setOnd(o => ({...o, [key]: val})); }
  const [klantNaam,   setKlantNaam]  = useState(p.klantNaam||"");
  const [klantTel,    setKlantTel]   = useState(p.klantTel||"");
  const [tab,         setTab]        = useState("algemeen");
  const [saving,      setSaving]     = useState(false);
  const [saved,       setSaved]      = useState(false);

  function berekenEind() {
    if (!startdatum) return null;
    const m = startdatum.match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{4})$/);
    if (!m) return null;
    const d = new Date(+m[3], +m[2]-1, +m[1]);
    d.setDate(d.getDate() + (parseInt(weken)||4) * 7);
    return `${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;
  }
  const einddatum = berekenEind();

  async function save() {
    setSaving(true);
    await onSave({ name: naam, leider, collega, weken, date: startdatum, type,
      ingemeten, actief, ond, klantNaam, klantTel });
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  }

  const tabStyle = (t) => ({
    flex:1, padding:"6px 4px", border:"none", borderRadius:"5px 5px 0 0",
    fontWeight: tab===t ? 700 : 500, fontSize:11, cursor:"pointer",
    background: tab===t ? "#fff" : "#E3F0FB",
    color: tab===t ? "#E65100" : "#546E7A",
    borderBottom: tab===t ? "2px solid #E65100" : "2px solid transparent",
  });

  const sectionLabel = (txt) => (
    <div style={{ fontSize:10, fontWeight:700, color:"#90A4AE", textTransform:"uppercase",
      letterSpacing:.6, margin:"10px 0 5px" }}>{txt}</div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column",
      background:"#fff", borderRadius:10, border:"2px solid #90CAF9",
      boxShadow:"0 8px 40px rgba(0,0,0,.25)", width:580,
      maxHeight:"88vh", overflow:"hidden" }}>

      {/* Tabs */}
      <div style={{ display:"flex", background:"#E3F0FB", borderRadius:"10px 10px 0 0", padding:"4px 4px 0", flexShrink:0 }}>
        {[["algemeen","📋 Algemeen"],["onderdelen","🔩 Onderdelen"],["klant","👤 Klant"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={tabStyle(k)}>{l}</button>
        ))}
      </div>

      <div style={{ padding:"14px", display:"flex", flexDirection:"column", gap:8,
        overflowY: tab==="onderdelen" ? "hidden" : "auto", flex:1 }}>

        {/* ── TAB: ALGEMEEN ── */}
        {tab==="algemeen" && <>
          {sectionLabel("Projectnaam")}
          <input value={naam} onChange={e=>setNaam(e.target.value)}
            style={{ fontSize:12, padding:"6px 8px", borderRadius:5, border:"1px solid #CFD8DC",
              outline:"none", fontWeight:700, width:"100%", boxSizing:"border-box" }} />

          {sectionLabel("Planning")}
          <DatumPicker label="📅 Startdatum" value={startdatum} onChange={setStartdatum} />
          <div>
            <label style={{ fontSize:11, fontWeight:600, color:"#546E7A", display:"block", marginBottom:3 }}>⏱ Weken werk</label>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <input type="number" min="1" max="52" value={weken} onChange={e=>setWeken(e.target.value)}
                style={{ fontSize:12, padding:"5px 8px", borderRadius:4, border:"2px solid #90CAF9",
                  width:65, outline:"none", fontWeight:700, textAlign:"center" }} />
              <span style={{ fontSize:11, color:"#90A4AE" }}>weken</span>
            </div>
            {einddatum && (
              <div style={{ marginTop:5, display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ fontSize:10, color:"#546E7A" }}>🚚 Oplevering:</span>
                <span style={{ fontSize:11, background:"#E8F5E9", color:"#2E7D32",
                  border:"1px solid #A5D6A7", borderRadius:4, padding:"2px 8px", fontWeight:700 }}>
                  {einddatum}
                </span>
              </div>
            )}
          </div>

          {sectionLabel("Inmeten")}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button onClick={()=>setIngemeten(v=>!v)}
              style={{ width:22, height:22, borderRadius:4, border: ingemeten?"none":"2px solid #BDBDBD",
                background: ingemeten?"#2E7D32":"#fff", cursor:"pointer", display:"flex",
                alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13, fontWeight:900, flexShrink:0 }}>
              {ingemeten?"✓":""}
            </button>
            <span style={{ fontSize:12, color:"#1C2B3A", fontWeight:600 }}>
              {ingemeten ? "Ingemeten ✓" : "Nog niet ingemeten"}
            </span>
          </div>


          {sectionLabel("Team")}
          <MedewerkerSelect label="👷 Projectleider" value={leider} onChange={setLeider} />
          <MedewerkerSelect label="👷 Collega" value={collega} onChange={setCollega} />

          {sectionLabel("Type")}
          <select value={type} onChange={e=>setType(e.target.value)}
            style={{ fontSize:11, padding:"5px 7px", borderRadius:4, border:"1px solid #CE93D8",
              width:"100%", background:"#fff" }}>
            <option value="">— Type project —</option>
            {PROJECT_TYPES.map(t=><option key={t.label} value={t.label}>{t.label}</option>)}
          </select>
        </>}

        {/* ── TAB: ONDERDELEN ── */}
        {tab==="onderdelen" && <>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, overflowY:"auto", flex:1,
            height:"calc(88vh - 120px)", alignContent:"start" }}>

            <>
                <OndRow col="Graafwerk" aan={actief["Graafwerk"]!==false} onToggle={()=>setActief(a=>({...a,["Graafwerk"]:!(actief["Graafwerk"]!==false)}))}>
                  <OSelect label="Ja / Nee" k="graaf_jn" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <OSelect label="Grond afvoeren" k="graaf_afvoer" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  {(ond["graaf_afvoer"]||"") === "Ja" && (
                    <OField label="Hoeveelheid" k="graaf_m3" placeholder="bv. 12" type="number" unit="m³" ond={ond} ondSet={ondSet} />
                  )}
                  <OSelect label="Tuintegels opnemen" k="graaf_tegels" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <OSelect label="Schutting weghalen" k="graaf_schutting" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <ONote k="graaf_notitie" ond={ond} ondSet={ondSet} />
                </OndRow>

                <OndRow col="Staal" aan={actief["Staal"]!==false} onToggle={()=>setActief(a=>({...a,["Staal"]:!(actief["Staal"]!==false)}))}>
                  <OSelect label="Achtergevel verwijderen" k="staal_achtergevel" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <OSelect label="Binnenmuur dragend" k="staal_binnen_dragend" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <OSelect label="Buitenmuur dragend" k="staal_buiten_dragend" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <OSelect label="Ja / Nee" k="staal_jn" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <ONote k="staal_notitie" ond={ond} ondSet={ondSet} />
                </OndRow>

                <OndRow col="Constructie berekening" aan={actief["Constructie berekening"]!==false} onToggle={()=>setActief(a=>({...a,["Constructie berekening"]:!(actief["Constructie berekening"]!==false)}))}>
                  <OSelect label="Ja / Nee" k="constructie_jn" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <ONote k="constructie_notitie" ond={ond} ondSet={ondSet} />
                </OndRow>

                <OndRow col="Steen-strips / Metselwerk" aan={actief["Steen-strips / Metselwerk"]!==false} onToggle={()=>setActief(a=>({...a,["Steen-strips / Metselwerk"]:!(actief["Steen-strips / Metselwerk"]!==false)}))}>
                  <OSelect label="Ja / Nee" k="steen_jn" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <OSelect label="Keuze" k="steen_type" options={["Steen-strips","Metselwerk"]} ond={ond} ondSet={ondSet} />
                  <OField label="Oppervlakte" k="steen_m2" placeholder="bv. 24" type="number" unit="m²" ond={ond} ondSet={ondSet} />
                  <OField label="Steencode" k="steen_code" placeholder="bv. WF-8203" ond={ond} ondSet={ondSet} />
                  <ONote k="steen_notitie" ond={ond} ondSet={ondSet} />
                </OndRow>

                <OndRow col="Kozijn" aan={actief["Kozijn"]!==false} onToggle={()=>setActief(a=>({...a,["Kozijn"]:!(actief["Kozijn"]!==false)}))}>
                  <OSelect label="Ja / Nee" k="kozijn_jn" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <OSelect label="Materiaal" k="kozijn_materiaal" options={["Kunststof","Hout","Aluminium"]} ond={ond} ondSet={ondSet} />
                  <OField label="Kleurcode binnen" k="kozijn_kleur_binnen" placeholder="bv. RAL 9010" ond={ond} ondSet={ondSet} />
                  <OField label="Kleurcode buiten" k="kozijn_kleur_buiten" placeholder="bv. RAL 7016" ond={ond} ondSet={ondSet} />
                  <OField label="Aantal kozijnen" k="kozijn_aantal" placeholder="bv. 3" type="number" unit="stuks" ond={ond} ondSet={ondSet} />
                  <OField label="Buitenmaten" k="kozijn_maten" placeholder="bv. 120x140, 80x200" ond={ond} ondSet={ondSet} />
                  <ONote k="kozijn_notitie" ond={ond} ondSet={ondSet} />
                </OndRow>

                <OndRow col="Lichtstraat" aan={actief["Lichtstraat"]!==false} onToggle={()=>setActief(a=>({...a,["Lichtstraat"]:!(actief["Lichtstraat"]!==false)}))}>
                  <OSelect label="Ja / Nee" k="licht_jn" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <OField label="Maat" k="lichtstraat_maat" placeholder="bv. 60x120 cm"  ond={ond} ondSet={ondSet} />
                  <ONote k="lichtstraat_notitie" ond={ond} ondSet={ondSet} />
                </OndRow>

                <OndRow col="Heiwerk" aan={actief["Heiwerk"]!==false} onToggle={()=>setActief(a=>({...a,["Heiwerk"]:!(actief["Heiwerk"]!==false)}))}>
                  <OSelect label="Ja / Nee" k="hei_jn" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <OField label="Aantal palen" k="hei_palen" placeholder="bv. 12" type="number" unit="palen" ond={ond} ondSet={ondSet} />
                  <OField label="Diepte palen" k="hei_diepte" placeholder="bv. 8" type="number" unit="meter" ond={ond} ondSet={ondSet} />
                  <OSelect label="Toegang via" k="hei_toegang" options={["Achterom / tuinhek","Binnen door de woning"]} ond={ond} ondSet={ondSet} />
                  {(ond["hei_toegang"]||"").includes("Achterom") && (
                    <OField label="Breedte tuinhek" k="hei_hek_breedte" placeholder="bv. 90" type="number" unit="cm" ond={ond} ondSet={ondSet} />
                  )}
                  {(ond["hei_toegang"]||"").includes("Binnen") && (
                    <OField label="Breedte doorgang" k="hei_doorgang_breedte" placeholder="bv. 80" type="number" unit="cm" ond={ond} ondSet={ondSet} />
                  )}
                  <ONote k="hei_notitie" ond={ond} ondSet={ondSet} />
                </OndRow>

                <OndRow col="Fundering" aan={actief["Fundering"]!==false} onToggle={()=>setActief(a=>({...a,["Fundering"]:!(actief["Fundering"]!==false)}))}>
                  <OSelect label="Ja / Nee" k="fund_jn" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <OSelect label="Type" k="fund_type" options={["Fundering op staal","Broodjesvloer"]}  ond={ond} ondSet={ondSet} />
                  <OField label="Beton m³" k="fund_beton" placeholder="bv. 4.5" type="number" unit="m³"  ond={ond} ondSet={ondSet} />
                  <ONote k="fund_notitie" ond={ond} ondSet={ondSet} />
                </OndRow>

                <OndRow col="Electra" aan={actief["Electra"]!==false} onToggle={()=>setActief(a=>({...a,["Electra"]:!(actief["Electra"]!==false)}))}>
                  <OField label="Stopcontacten" k="el_stopcontacten" placeholder="bv. 6" type="number" unit="stuks" ond={ond} ondSet={ondSet} />
                  <OField label="Spotjes binnen" k="el_spotjes_binnen" placeholder="bv. 8" type="number" unit="stuks" ond={ond} ondSet={ondSet} />
                  <OField label="Spotjes buiten" k="el_spotjes_buiten" placeholder="bv. 2" type="number" unit="stuks" ond={ond} ondSet={ondSet} />
                  <OField label="Lichtpunten binnen" k="el_licht_binnen" placeholder="bv. 3" type="number" unit="stuks" ond={ond} ondSet={ondSet} />
                  <OField label="Lichtpunten buiten" k="el_licht_buiten" placeholder="bv. 2" type="number" unit="stuks" ond={ond} ondSet={ondSet} />
                  <OSelect label="Zonnescherm stroom" k="el_zonnescherm" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <OSelect label="Nieuwe meterkast" k="el_meterkast" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <OSelect label="Zonnepanelen" k="el_zonnepanelen" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <OSelect label="Ja / Nee" k="electra_jn" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <ONote k="electra_notitie" ond={ond} ondSet={ondSet} />
                </OndRow>

                <OndRow col="Verwarming" aan={actief["Verwarming"]!==false} onToggle={()=>setActief(a=>({...a,["Verwarming"]:!(actief["Verwarming"]!==false)}))}>
                  <OSelect label="Ja / Nee" k="verw_jn" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <OSelect label="Type" k="verw_type" options={["Radiator","Vloerverwarming aanbouw","Vloerverwarming aanbouw + woonkamer","Airco"]}  ond={ond} ondSet={ondSet} />
                  {(ond["verw_type"]||"").includes("Radiator") && (
                    <OField label="Aantal" k="verw_radiator_aantal" placeholder="bv. 3" type="number" unit="stuks"  ond={ond} ondSet={ondSet} />
                  )}
                  {(ond["verw_type"]||"").includes("Vloerverwarming") && (
                    <OField label="Opp. m²" k="verw_m2" placeholder="bv. 25" type="number" unit="m²"  ond={ond} ondSet={ondSet} />
                  )}
                  <ONote k="verw_notitie" ond={ond} ondSet={ondSet} />
                </OndRow>

                <OndRow col="Dakbedekking" aan={actief["Dakbedekking"]!==false} onToggle={()=>setActief(a=>({...a,["Dakbedekking"]:!(actief["Dakbedekking"]!==false)}))}>
                  <OSelect label="Type" k="dak_type" options={["EPDM","Bitumen"]}  ond={ond} ondSet={ondSet} />
                  <OSelect label="Ja / Nee" k="dak_jn" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <ONote k="dak_notitie" ond={ond} ondSet={ondSet} />
                </OndRow>

                <OndRow col="Hijsen" aan={actief["Hijsen"]!==false} onToggle={()=>setActief(a=>({...a,["Hijsen"]:!(actief["Hijsen"]!==false)}))}>
                  <OSelect label="Ja / Nee" k="hijsen_jn" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <ONote k="hijsen_notitie" ond={ond} ondSet={ondSet} />
                </OndRow>

                <OndRow col="Tegelwerk" aan={actief["Tegelwerk"]!==false} onToggle={()=>setActief(a=>({...a,["Tegelwerk"]:!(actief["Tegelwerk"]!==false)}))}>
                  <OField label="Opp. m²" k="tegel_m2" placeholder="bv. 18" type="number" unit="m²"  ond={ond} ondSet={ondSet} />
                  <OSelect label="Ja / Nee" k="tegel_jn" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <ONote k="tegel_notitie" ond={ond} ondSet={ondSet} />
                </OndRow>

                <OndRow col="Stucwerk" aan={actief["Stucwerk"]!==false} onToggle={()=>setActief(a=>({...a,["Stucwerk"]:!(actief["Stucwerk"]!==false)}))}>
                  <OField label="Opp. m²" k="stuc_m2" placeholder="bv. 30" type="number" unit="m²"  ond={ond} ondSet={ondSet} />
                  <OSelect label="Ja / Nee" k="stuc_jn" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <ONote k="stuc_notitie" ond={ond} ondSet={ondSet} />
                </OndRow>

                <OndRow col="Loodgieter" aan={actief["Loodgieter"]!==false} onToggle={()=>setActief(a=>({...a,["Loodgieter"]:!(actief["Loodgieter"]!==false)}))}>
                  <OSelect label="Buitenkraan" k="lood_buitenkraan" options={["Ja","Nee"]}  ond={ond} ondSet={ondSet} />
                  <OSelect label="Ja / Nee" k="lood_jn" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <ONote k="lood_notitie" ond={ond} ondSet={ondSet} />
                </OndRow>

                <OndRow col="Container" aan={actief["Container"]!==false} onToggle={()=>setActief(a=>({...a,["Container"]:!(actief["Container"]!==false)}))}>
                  <OField label="Aantal" k="cont_aantal" placeholder="bv. 2" type="number" unit="stuks"  ond={ond} ondSet={ondSet} />
                  <OSelect label="Ja / Nee" k="cont_jn" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <ONote k="cont_notitie" ond={ond} ondSet={ondSet} />
                </OndRow>

                <OndRow col="Steigers" aan={actief["Steigers"]!==false} onToggle={()=>setActief(a=>({...a,["Steigers"]:!(actief["Steigers"]!==false)}))}>
                  <OSelect label="Ja / Nee" k="steigers_jn" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <ONote k="steigers_notitie" ond={ond} ondSet={ondSet} />
                </OndRow>

                <OndRow col="Trap" aan={actief["Trap"]!==false} onToggle={()=>setActief(a=>({...a,["Trap"]:!(actief["Trap"]!==false)}))}>
                  <OSelect label="Ja / Nee" k="trap_jn" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <ONote k="trap_notitie" ond={ond} ondSet={ondSet} />
                </OndRow>

                <OndRow col="Extra" aan={actief["Extra"]!==false} onToggle={()=>setActief(a=>({...a,["Extra"]:!(actief["Extra"]!==false)}))}>
                  <OSelect label="Ja / Nee" k="extra_jn" options={["Ja","Nee"]} ond={ond} ondSet={ondSet} />
                  <ONote k="extra_notitie" ond={ond} ondSet={ondSet} />
                </OndRow>
            </>
          </div>
        </>}

        {/* ── TAB: KLANT ── */}
        {tab==="klant" && <>
          {sectionLabel("Klantgegevens")}
          <div>
            <label style={{ fontSize:11, fontWeight:600, color:"#546E7A", display:"block", marginBottom:3 }}>👤 Naam klant</label>
            <input value={klantNaam} onChange={e=>setKlantNaam(e.target.value)} placeholder="Voor- en achternaam"
              style={{ fontSize:12, padding:"6px 8px", borderRadius:5, border:"1px solid #CFD8DC",
                outline:"none", width:"100%", boxSizing:"border-box" }} />
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:600, color:"#546E7A", display:"block", marginBottom:3 }}>📞 Telefoonnummer</label>
            <input value={klantTel} onChange={e=>setKlantTel(e.target.value)} placeholder="06-12345678"
              type="tel"
              style={{ fontSize:12, padding:"6px 8px", borderRadius:5, border:"1px solid #CFD8DC",
                outline:"none", width:"100%", boxSizing:"border-box" }} />
            {klantTel && (
              <a href={`tel:${klantTel}`}
                style={{ display:"inline-block", marginTop:6, fontSize:11, color:"#1565C0",
                  textDecoration:"none", fontWeight:600 }}>📞 Bel {klantTel}</a>
            )}
          </div>
        </>}

        {/* Opslaan + PDF */}
        <div style={{ display:"flex", gap:6, marginTop:4 }}>
          <button onClick={save} disabled={saving||saved}
            style={{ flex:1, fontSize:12, fontWeight:800, border:"none", borderRadius:5, padding:"9px",
              cursor: saving||saved ? "default" : "pointer",
              background: saved?"#2E7D32": saving?"#FF8A65":"#E65100",
              color:"#fff", transition:"background .2s" }}>
            {saved ? "✓ Opgeslagen!" : saving ? "Opslaan..." : "✓ Opslaan"}
          </button>
          <button onClick={()=>drukWerkbon({...p, ond, actief, leider, collega, weken, date:startdatum, type, klantNaam, klantTel})}
            style={{ fontSize:11, background:"#1C2B3A", color:"#fff", border:"none",
              borderRadius:5, padding:"9px 12px", cursor:"pointer", fontWeight:700 }}>🖨️ PDF</button>
          <button onClick={onClose}
            style={{ fontSize:11, background:"#F5F7FA", color:"#546E7A", border:"1px solid #DDE3E9",
              borderRadius:5, padding:"9px 12px", cursor:"pointer" }}>✕</button>
        </div>
      </div>
    </div>
  );
}

// ── NIEUW PROJECT FORM ────────────────────────────────────────────────
function NieuwProjectForm({ onSave, onCancel }) {
  const [name,       setName]       = useState("");
  const [date,       setDate]       = useState("");
  const [leider,     setLeider]     = useState("");
  const [collega,    setCollega]    = useState("");
  const [duur,       setDuur]       = useState("");
  const [oplevering, setOplevering] = useState("");
  const [type,       setType]       = useState("");

  return (
    <div style={{ background:"#E3F2FD", border:"1px solid #90CAF9", borderRadius:8,
      padding:"14px 16px", marginBottom:12 }}>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"flex-end" }}>
        <div>
          <label style={{ fontSize:11, fontWeight:600, color:"#546E7A", display:"block", marginBottom:3 }}>Projectnaam</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Straatnaam + nr"
            style={{ padding:"7px 10px", borderRadius:5, border:"1px solid #CFD8DC", fontSize:12, width:200, outline:"none" }} />
        </div>
        <DatumPicker label="📅 Startdatum" value={date} onChange={setDate} />
        <div style={{ minWidth:130 }}>
          <MedewerkerSelect label="👷 Projectleider" value={leider} onChange={setLeider} border="1px solid #CFD8DC" />
        </div>
        <div style={{ minWidth:130 }}>
          <MedewerkerSelect label="👷 Collega" value={collega} onChange={setCollega} border="1px solid #CFD8DC" />
        </div>
        <div>
          <label style={{ fontSize:11, fontWeight:600, color:"#546E7A", display:"block", marginBottom:3 }}>📅 Duur</label>
          <input value={duur} onChange={e=>setDuur(e.target.value)} placeholder="bv. 6 weken"
            style={{ padding:"7px 10px", borderRadius:5, border:"1px solid #CFD8DC", fontSize:12, width:100, outline:"none" }} />
        </div>
        <DatumPicker label="🚚 Datum levering" value={oplevering} onChange={setOplevering} />
        <div>
          <label style={{ fontSize:11, fontWeight:600, color:"#546E7A", display:"block", marginBottom:3 }}>🏗️ Type</label>
          <select value={type} onChange={e=>setType(e.target.value)}
            style={{ padding:"7px 10px", borderRadius:5, border:"1px solid #CFD8DC", fontSize:12, width:130, background:"#fff" }}>
            <option value="">— Kies type —</option>
            {PROJECT_TYPES.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
          </select>
        </div>
        <button onClick={()=>onSave({ name, date, leider, collega, duur, oplevering, type })}
          style={{ padding:"9px 18px", borderRadius:6, border:"none", background:"#E65100",
            color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>Opslaan</button>
        <button onClick={onCancel}
          style={{ padding:"9px 18px", borderRadius:6, border:"1px solid #90A4AE",
            background:"transparent", color:"#546E7A", fontWeight:700, fontSize:13, cursor:"pointer" }}>Annuleer</button>
      </div>
    </div>
  );
}

// ── CHECKLIST ─────────────────────────────────────────────────────────
function Checklist({ projects, setProjects, canEdit, addLog, highlightProject, clearHighlight }) {
  const [editing,   setEditing]   = useState(null);
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("");
  const [openMonth, setOpenMonth] = useState(null);
  const [newProj,   setNewProj]   = useState(false);

  const [editTeam,  setEditTeam]  = useState(null);
  const [editName,  setEditName]  = useState(null); // pid being name-edited
  const [filterType, setFilterType] = useState("");

  // When a project is highlighted from jaarplanning, open its month and scroll to it
  useEffect(() => {
    if (!highlightProject) return;
    const proj = projects.find(p => p.id === highlightProject);
    if (!proj || proj.afgerond) return;
    const pd = parseDate(proj.date);
    if (pd) setOpenMonth(pd.month);
    // Scroll after render
    setTimeout(() => {
      const el = document.getElementById("proj-row-" + highlightProject);
      if (el) { el.scrollIntoView({ behavior:"smooth", block:"center" }); }
    }, 200);
  }, [highlightProject]);

  function parseDate(d="") {
    const full = d.match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{4})$/);
    if (full) return { day:parseInt(full[1]), month:parseInt(full[2])-1, year:parseInt(full[3]) };
    const short = d.match(/^(\d{1,2})[-./](\d{1,2})$/);
    if (short) return { day:parseInt(short[1]), month:parseInt(short[2])-1, year:2026 };
    return null;
  }
  function sortKey(p) {
    const pd = parseDate(p.date);
    if (!pd) return 99999;
    return pd.year * 10000 + pd.month * 100 + pd.day;
  }
  function projMonthIdx(p) {
    const pd = parseDate(p.date);
    return pd ? pd.month : null;
  }

  async function updateStatus(pid, ci, val) {
    const proj = projects.find(p => p.id===pid);
    const oudVal = proj?.statuses[ci] || "";
    const updated = projects.map(p => p.id===pid
      ? { ...p, statuses: p.statuses.map((s,i) => i===ci ? val : s) }
      : p);
    setProjects(updated);
    await saveData("bouw_projects", updated);
    if (oudVal !== val) await addLog({ type:"status", project: proj?.name, kolom: COLUMNS[ci], oud: oudVal, nieuw: val });
    setEditing(null);
  }

  async function updateCellDetail(pid, ci, field, val) {
    const updated = projects.map(p => {
      if (p.id !== pid) return p;
      const details = [...(p.details || Array(COLUMNS.length).fill(null))];
      details[ci] = { ...(details[ci] || {}), [field]: val };
      return { ...p, details };
    });
    setProjects(updated);
    await saveData("bouw_projects", updated);
  }

  async function toggleAfgerond(pid) {
    const proj = projects.find(p => p.id===pid);
    const was = proj?.afgerond || false;
    const updated = projects.map(p => p.id===pid ? { ...p, afgerond: !was } : p);
    setProjects(updated);
    await saveData("bouw_projects", updated);
    await addLog({ type: was ? "project_heropen" : "project_afgerond", project: proj?.name });
  }


  async function updateTeam(pid, fields) {
    const updated = projects.map(p => p.id===pid ? { ...p, ...fields } : p);
    setProjects(updated);
    // Save to localStorage immediately as backup
    try { localStorage.setItem("bouw_projects_backup", JSON.stringify(updated)); } catch {}
    const ok = await saveData("bouw_projects", updated);
    if (!ok) {
      // Retry once
      await new Promise(r => setTimeout(r, 500));
      await saveData("bouw_projects", updated);
    }
  }

  async function updateName(pid, val) {
    const trimmed = val.trim();
    if (!trimmed) { setEditName(null); return; }
    const updated = projects.map(p => p.id===pid ? { ...p, name: trimmed } : p);
    setProjects(updated);
    await saveData("bouw_projects", updated);
    await addLog({ type:"status", project: trimmed, kolom:"Naam", oud: projects.find(p=>p.id===pid)?.name||"", nieuw: trimmed });
    setEditName(null);
  }

  async function removeProject(pid) {
    if (!window.confirm("Project verwijderen?")) return;
    const proj = projects.find(p => p.id===pid);
    const updated = projects.filter(p => p.id !== pid);
    setProjects(updated);
    await saveData("bouw_projects", updated);
    await addLog({ type:"project_remove", project: proj?.name });
  }

  const activeProjects   = projects.filter(p => !p.afgerond);
  const afgerondProjects = projects.filter(p =>  p.afgerond);

  const sorted = [...activeProjects].sort((a,b) => sortKey(a)-sortKey(b));
  const byMonth = Array(12).fill(null).map(() => []);
  const noDate  = [];
  sorted.forEach(p => {
    const m = projMonthIdx(p);
    if (m !== null && m >= 0 && m < 12) byMonth[m].push(p);
    else noDate.push(p);
  });

  function applyFilter(list) {
    return list.filter(p => {
      if (!p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter && !p.statuses.some(s => s.startsWith(filter))) return false;
      if (filterType && p.type !== filterType) return false;
      return true;
    });
  }

  const counts = byMonth.map(ps => ps.length);
  const maxC   = Math.max(...counts, afgerondProjects.length, 1);
  const monthsToShow = openMonth !== null && openMonth >= 0
    ? [openMonth]
    : Array.from({length:12}, (_,i) => i);

  // ── ROW component (defined inside so it has closure over state) ──────
  function ProjectRow({ p, ri }) {
      const isHighlighted = highlightProject === p.id;
      return (
      <tr id={"proj-row-"+p.id}
        style={{ background: isHighlighted ? "#FFF8E1" : (p.afgerond ? "#F9FBE7" : (ri%2===0 ? "#FAFBFC" : "#fff")),
          opacity: p.afgerond ? 0.8 : 1,
          outline: isHighlighted ? "3px solid #E65100" : "none",
          transition:"background .3s" }}
        onMouseEnter={e=>{ if(!isHighlighted) e.currentTarget.style.background=p.afgerond?"#F0F4C3":"#EBF3FF"; }}
        onMouseLeave={e=>{ if(!isHighlighted) e.currentTarget.style.background=isHighlighted?"#FFF8E1":(p.afgerond?"#F9FBE7":(ri%2===0?"#FAFBFC":"#fff")); }}>
        <td style={{ ...TD, position:"sticky", left:0, background:"inherit",
          zIndex:1, borderRight:"2px solid #DDE3E9", minWidth:200, verticalAlign:"top", paddingTop:8 }}>
          <div style={{ display:"flex", gap:7, alignItems:"flex-start" }}>
            {/* checkbox */}
            <button onClick={()=>toggleAfgerond(p.id)}
              title={p.afgerond ? "Heropen project" : "Markeer als afgerond"}
              style={{ marginTop:1, flexShrink:0, width:20, height:20, borderRadius:4,
                border: p.afgerond ? "2px solid #7CB342" : "2px solid #BDBDBD",
                background: p.afgerond ? "#7CB342" : "#fff", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:13, color:"#fff", fontWeight:900, lineHeight:1 }}>
              {p.afgerond ? "✓" : ""}
            </button>
            <div style={{ flex:1 }}>
              {/* Project naam */}
              <div style={{ fontWeight:800, fontSize:12,
                color: p.afgerond ? "#90A4AE" : "#1C2B3A",
                textDecoration: p.afgerond ? "line-through" : "none" }}>
                {p.name}
              </div>
              {/* Type badge */}
              {p.type && (() => {
                const t = PROJECT_TYPES.find(t=>t.label===p.type);
                return t ? (
                  <span style={{ display:"inline-block", fontSize:10, fontWeight:700,
                    background:t.bg, color:t.text, border:`1px solid ${t.border}`,
                    borderRadius:4, padding:"1px 7px", marginBottom:3 }}>
                    🏗️ {t.label}
                  </span>
                ) : null;
              })()}
              {/* Datum + ingemeten badge */}
              <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap", marginBottom:2 }}>
                <span style={{ fontSize:10, color:"#90A4AE" }}>{p.date}</span>
                {p.ingemeten
                  ? <span style={{ fontSize:9, fontWeight:700, background:"#E8F5E9", color:"#2E7D32",
                      border:"1px solid #A5D6A7", borderRadius:3, padding:"1px 5px" }}>
                      ✓ Ingemeten{p.ingemetenDatum ? " "+p.ingemetenDatum : ""}
                    </span>
                  : <span style={{ fontSize:9, fontWeight:600, background:"#FFF3E0", color:"#E65100",
                      border:"1px solid #FFCC80", borderRadius:3, padding:"1px 5px" }}>
                      Niet ingemeten
                    </span>
                }
              </div>
              {/* Team + klant info */}
              {editTeam===p.id && typeof document !== "undefined" && ReactDOM.createPortal(
                <div style={{ position:"fixed", inset:0, zIndex:9998, background:"rgba(0,0,0,.35)" }}
                  onMouseDown={()=>setEditTeam(null)}>
                  <div style={{ position:"fixed", top:"50%", left:"50%",
                    transform:"translate(-50%,-50%)", zIndex:9999, maxHeight:"90vh",
                    overflowY:"auto", borderRadius:10 }}
                    onMouseDown={e=>e.stopPropagation()}>
                    <TeamEditInline p={p} onSave={(fields)=>{ updateTeam(p.id,fields); }} onClose={()=>setEditTeam(null)} />
                  </div>
                </div>,
                document.body
              )}
              <div>
                {(p.leider||p.collega) && (
                  <div style={{ fontSize:10, color:"#546E7A" }}>
                    👷 {p.leider}{p.collega?" & "+p.collega:""}
                  </div>
                )}
                {p.klantNaam && (
                  <div style={{ fontSize:10, color:"#546E7A" }}>
                    👤 {p.klantNaam}{p.klantTel ? " · "+p.klantTel : ""}
                  </div>
                )}
                {canEdit && !p.afgerond && (
                  <button onClick={()=>setEditTeam(p.id)}
                    style={{ marginTop:2, fontSize:10, background:"#F5F7FA",
                      border:"1px solid #DDE3E9", borderRadius:4, padding:"2px 6px",
                      cursor:"pointer", color:"#546E7A" }}>✏️ Bewerken</button>
                )}
              </div>
            </div>
          </div>
        </td>
        {p.statuses.map((s, ci) => {
          const isOpen = editing?.pid===p.id && editing?.col===ci;
          const isActief = !p.actief || p.actief[COLUMNS[ci]] !== false;
          return (
            <td key={ci} style={{ ...TD, textAlign:"center", position:"relative",
              minWidth:88, cursor: canEdit && !p.afgerond && isActief ? "pointer" : "default",
              background: !isActief ? "#F5F5F5" : "inherit", opacity: !isActief ? 0.4 : 1 }}
              onClick={()=>{ if(canEdit && !p.afgerond && !isOpen && isActief) setEditing({pid:p.id,col:ci}); }}>
              {!isActief ? (
                <span style={{ fontSize:10, color:"#BDBDBD", fontWeight:600 }}>—</span>
              ) : isOpen ? (
                (() => {
                  // local refs for unsaved uitvoerder text
                  const uitvRef = useRef(null);
                  const [showCal, setShowCal] = useState(false);

                  function saveAndClose() {
                    if (uitvRef.current) {
                      const v = uitvRef.current.value.trim();
                      updateCellDetail(p.id, ci, "uitvoerder", v);
                    }
                    setEditing(null);
                  }

                  return (
                    <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
                      zIndex:100, background:"#fff", borderRadius:10,
                      boxShadow:"0 8px 32px rgba(0,0,0,.25)",
                      border:"2px solid #E65100", padding:10, minWidth:220, maxWidth:250 }}
                      onClick={e=>e.stopPropagation()}>

                      {/* ── HEADER ── */}
                      <div style={{ display:"flex", justifyContent:"space-between",
                        alignItems:"center", marginBottom:10, paddingBottom:7,
                        borderBottom:"2px solid #F0F2F5" }}>
                        <span style={{ fontSize:12, color:"#1C2B3A", fontWeight:800 }}>
                          {COLUMNS[ci]}
                        </span>
                        <span style={{ fontSize:10, color:"#90A4AE" }}>
                          {p.name.split(" ")[0]}
                        </span>
                      </div>

                      {/* ── STATUS CHIPS ── */}
                      <div style={{ fontSize:10, color:"#90A4AE", fontWeight:700,
                        marginBottom:5, textTransform:"uppercase", letterSpacing:.5 }}>Status</div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:8 }}>
                        {STATUS_OPTIONS.map(o => {
                          const meta = STATUS_META[o] || STATUS_META[""];
                          const isCurrent = s === o;
                          return (
                            <div key={o}
                              onClick={()=>updateStatus(p.id,ci,o)}
                              style={{ padding:"4px 10px", borderRadius:6, cursor:"pointer",
                                fontSize:11, fontWeight: isCurrent?700:500,
                                background: isCurrent ? (meta.bg==="transparent"?"#E0E0E0":meta.bg) : "#F5F7FA",
                                color: isCurrent ? meta.text : "#546E7A",
                                border: isCurrent ? `2px solid ${meta.border}` : "1px solid #E0E0E0" }}>
                              {o || "— leeg —"}
                            </div>
                          );
                        })}
                      </div>

                      {/* ── EIGEN TEKST ── */}
                      <div style={{ marginBottom:10 }}>
                        <input
                          defaultValue={STATUS_OPTIONS.includes(s) ? "" : s}
                          placeholder="Eigen tekst (bv. datum notitie)..."
                          onKeyDown={e=>{ if(e.key==="Enter" && e.target.value.trim()) updateStatus(p.id,ci,e.target.value.trim()); }}
                          style={{ width:"100%", boxSizing:"border-box", fontSize:11,
                            padding:"5px 8px", borderRadius:5,
                            border:"1px solid #CFD8DC", outline:"none" }} />
                        <div style={{ fontSize:9, color:"#B0BEC5", marginTop:2 }}>Enter = opslaan als status</div>
                      </div>

                      {/* ── KALENDER ── */}
                      <div style={{ borderTop:"1px solid #F0F2F5", paddingTop:8, marginBottom:8 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                          <span style={{ fontSize:10, color:"#1565C0", fontWeight:700 }}>🚚 Leverdatum</span>
                          {(p.details?.[ci]?.datum) && (
                            <span style={{ background:"#E3F2FD", borderRadius:4,
                              padding:"1px 7px", fontSize:11, fontWeight:800, color:"#1565C0" }}>
                              {p.details[ci].datum}
                            </span>
                          )}
                          <button onClick={()=>setShowCal(v=>!v)}
                            style={{ marginLeft:"auto", background: showCal?"#E3F2FD":"#F5F7FA",
                              border:`1px solid ${showCal?"#90CAF9":"#DDE3E9"}`,
                              borderRadius:5, padding:"2px 8px", cursor:"pointer",
                              fontSize:10, fontWeight:700,
                              color: showCal?"#1565C0":"#546E7A" }}>
                            {showCal ? "▲ Sluit kalender" : "📅 Kies datum"}
                          </button>
                        </div>
                        {showCal && (
                          <MiniCalendar
                            value={(p.details?.[ci]?.datum) || ""}
                            onChange={v => {
                              updateCellDetail(p.id,ci,"datum",v);
                              setShowCal(false);
                            }}
                          />
                        )}
                      </div>

                      {/* ── UITVOERDER ── */}
                      <div style={{ marginBottom:12 }}>
                        <div style={{ fontSize:10, color:"#546E7A", fontWeight:700,
                          marginBottom:4, textTransform:"uppercase", letterSpacing:.5 }}>
                          👷 Uitvoerder
                        </div>
                        <input
                          ref={uitvRef}
                          defaultValue={(p.details?.[ci]?.uitvoerder) || ""}
                          placeholder="Naam of bedrijf..."
                          onKeyDown={e=>{ if(e.key==="Enter") saveAndClose(); }}
                          style={{ width:"100%", boxSizing:"border-box", fontSize:12,
                            padding:"6px 8px", borderRadius:6,
                            border:"2px solid #90CAF9", outline:"none" }} />
                      </div>

                      {/* ── OPSLAAN KNOP ── */}
                      <button onClick={saveAndClose}
                        style={{ width:"100%", padding:"10px", background:"#2E7D32",
                          color:"#fff", border:"none", borderRadius:8,
                          fontWeight:800, fontSize:14, cursor:"pointer",
                          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                          boxShadow:"0 2px 8px rgba(46,125,50,.3)",
                          letterSpacing:.3 }}>
                        ✓ Opslaan &amp; Sluiten
                      </button>

                    </div>
                  );
                })()
              ) : (
                <div>
                  <Chip value={s} />
                  {(p.details?.[ci]?.datum || p.details?.[ci]?.uitvoerder) && (
                    <div style={{ marginTop:3, fontSize:9, color:"#546E7A", lineHeight:1.4, textAlign:"left" }}>
                      {p.details?.[ci]?.datum && <div style={{ color:"#1565C0", fontWeight:600 }}>📅 {p.details[ci].datum}</div>}
                      {p.details?.[ci]?.uitvoerder && <div style={{ color:"#546E7A" }}>👷 {p.details[ci].uitvoerder}</div>}
                    </div>
                  )}
                  {/* ── ONDERDEEL INFO uit ✏️ Bewerken popup ── */}
                  {(() => {
                    const ond = p.ond || {};
                    const col = COLUMNS[ci];
                    const infos = [];
                    if (col === "Kozijn") {
                      if (ond.kozijn_materiaal)    infos.push(ond.kozijn_materiaal);
                      if (ond.kozijn_kleur_binnen) infos.push("Binnen: " + ond.kozijn_kleur_binnen);
                      if (ond.kozijn_kleur_buiten) infos.push("Buiten: " + ond.kozijn_kleur_buiten);
                      if (ond.kozijn_aantal)       infos.push(ond.kozijn_aantal + "x kozijn");
                      if (ond.kozijn_maten)        infos.push(ond.kozijn_maten);
                      if (ond.kozijn_notitie)      infos.push(ond.kozijn_notitie);
                    }
                    if (col === "Steen-strips / Metselwerk") {
                      if (ond.steen_type)    infos.push(ond.steen_type);
                      if (ond.steen_m2)      infos.push(ond.steen_m2 + " m²");
                      if (ond.steen_code)    infos.push("Code: " + ond.steen_code);
                      if (ond.steen_notitie) infos.push(ond.steen_notitie);
                    }
                    if (col === "Lichtstraat") {
                      if (ond.lichtstraat_maat)   infos.push("Maat: " + ond.lichtstraat_maat);
                      if (ond.lichtstraat_notitie) infos.push(ond.lichtstraat_notitie);
                    }
                    if (col === "Heiwerk") {
                      if (ond.hei_palen)           infos.push(ond.hei_palen + " palen");
                      if (ond.hei_diepte)          infos.push(ond.hei_diepte + "m diep");
                      if (ond.hei_toegang)         infos.push(ond.hei_toegang);
                      if (ond.hei_hek_breedte)     infos.push("Hek: " + ond.hei_hek_breedte + "cm");
                      if (ond.hei_doorgang_breedte) infos.push("Doorgang: " + ond.hei_doorgang_breedte + "cm");
                      if (ond.hei_notitie)         infos.push(ond.hei_notitie);
                    }
                    if (col === "Fundering") {
                      if (ond.fund_type)    infos.push(ond.fund_type);
                      if (ond.fund_beton)   infos.push(ond.fund_beton + " m³ beton");
                      if (ond.fund_notitie) infos.push(ond.fund_notitie);
                    }
                    if (col === "Verwarming") {
                      if (ond.verw_type) infos.push(ond.verw_type);
                      if (ond.verw_radiator_aantal) infos.push(ond.verw_radiator_aantal + "x radiator");
                      if (ond.verw_m2)   infos.push(ond.verw_m2 + " m²");
                      if (ond.verw_notitie) infos.push(ond.verw_notitie);
                    }
                    if (col === "Dakbedekking") {
                      if (ond.dak_type)    infos.push(ond.dak_type);
                      if (ond.dak_notitie) infos.push(ond.dak_notitie);
                    }
                    if (col === "Tegelwerk") {
                      if (ond.tegel_m2)    infos.push(ond.tegel_m2 + " m²");
                      if (ond.tegel_notitie) infos.push(ond.tegel_notitie);
                    }
                    if (col === "Stucwerk") {
                      if (ond.stuc_m2)    infos.push(ond.stuc_m2 + " m²");
                      if (ond.stuc_notitie) infos.push(ond.stuc_notitie);
                    }
                    if (col === "Loodgieter") {
                      if (ond.lood_buitenkraan) infos.push("Buitenkraan: " + ond.lood_buitenkraan);
                      if (ond.lood_notitie)     infos.push(ond.lood_notitie);
                    }
                    if (col === "Container") {
                      if (ond.cont_aantal)  infos.push(ond.cont_aantal + "x container");
                      if (ond.cont_notitie) infos.push(ond.cont_notitie);
                    }
                    if (col === "Graafwerk") {
                      if (ond.graaf_afvoer)    infos.push("Grond afvoeren: " + ond.graaf_afvoer);
                      if (ond.graaf_m3)        infos.push(ond.graaf_m3 + " m³");
                      if (ond.graaf_tegels)    infos.push("Tuintegels: " + ond.graaf_tegels);
                      if (ond.graaf_schutting) infos.push("Schutting: " + ond.graaf_schutting);
                      if (ond.graaf_notitie)   infos.push(ond.graaf_notitie);
                    }
                    if (col === "Staal") {
                      if (ond.staal_achtergevel)    infos.push("Achtergevel: " + ond.staal_achtergevel);
                      if (ond.staal_binnen_dragend) infos.push("Binnenmuur dragend: " + ond.staal_binnen_dragend);
                      if (ond.staal_buiten_dragend) infos.push("Buitenmuur dragend: " + ond.staal_buiten_dragend);
                      if (ond.staal_notitie)        infos.push(ond.staal_notitie);
                    }
                    if (col === "Constructie berekening"    && ond.constructie_notitie) infos.push(ond.constructie_notitie);
                    if (col === "Electra") {
                      if (ond.el_stopcontacten)  infos.push(ond.el_stopcontacten + "x stopcontact");
                      if (ond.el_spotjes_binnen) infos.push(ond.el_spotjes_binnen + "x spot binnen");
                      if (ond.el_spotjes_buiten) infos.push(ond.el_spotjes_buiten + "x spot buiten");
                      if (ond.el_licht_binnen)   infos.push(ond.el_licht_binnen + "x licht binnen");
                      if (ond.el_licht_buiten)   infos.push(ond.el_licht_buiten + "x licht buiten");
                      if (ond.el_zonnescherm)    infos.push("Zonnescherm: " + ond.el_zonnescherm);
                      if (ond.el_meterkast)      infos.push("Meterkast: " + ond.el_meterkast);
                      if (ond.el_zonnepanelen)   infos.push("Zonnepanelen: " + ond.el_zonnepanelen);
                      if (ond.electra_notitie)   infos.push(ond.electra_notitie);
                    }
                    if (col === "Hijsen"                    && ond.hijsen_notitie)     infos.push(ond.hijsen_notitie);
                    if (col === "Steigers"                  && ond.steigers_notitie)   infos.push(ond.steigers_notitie);
                    if (col === "Trap"                      && ond.trap_notitie)       infos.push(ond.trap_notitie);
                    if (col === "Extra"                     && ond.extra_notitie)      infos.push(ond.extra_notitie);
                    if (!infos.length) return null;
                    return (
                      <div style={{ marginTop:3, textAlign:"left" }}>
                        {infos.map((info, i) => (
                          <div key={i} style={{ fontSize:9, color:"#E65100", fontWeight:600,
                            lineHeight:1.4, whiteSpace:"normal", wordBreak:"break-word" }}>
                            {info}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </td>
          );
        })}
        {canEdit && (
          <td style={{ ...TD, textAlign:"center" }}>
            <button onClick={()=>{ removeProject(p.id); if(isHighlighted) clearHighlight(); }}
              style={{ background:"none", border:"none", cursor:"pointer", color:"#EF5350", fontSize:15 }}>🗑</button>
          </td>
        )}
      </tr>
      );
  }

  function MonthTable({ list, headerBg="#1C2B3A", label }) {
    const filtered = applyFilter(list);
    if (filtered.length === 0) return null;
    return (
      <div style={{ marginBottom:26 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
          <div style={{ background:headerBg, color:"#fff", borderRadius:8,
            padding:"5px 18px", fontWeight:800, fontSize:14 }}>{label}</div>
          <div style={{ background:"#FFF3E0", color:"#E65100", borderRadius:6,
            padding:"2px 10px", fontSize:12, fontWeight:700 }}>
            {filtered.length} project{filtered.length!==1?"en":""}
          </div>
          <div style={{ flex:1, height:2, background:"#F0F2F5" }}/>
        </div>
        <div style={{ overflowX:"auto", borderRadius:8, border:"1px solid #DDE3E9",
          boxShadow:"0 1px 6px rgba(0,0,0,.05)" }}>
          <table style={{ borderCollapse:"collapse", width:"100%", minWidth:2200, fontSize:12 }}>
            <thead>
              <tr style={{ background:headerBg, color:"#fff", position:"sticky", top:0, zIndex:2 }}>
                <th style={{ ...TH, minWidth:200, textAlign:"left", padding:"10px 12px",
                  position:"sticky", left:0, background:headerBg, zIndex:3 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span>Project</span>
                    <div style={{ display:"flex", alignItems:"center", gap:5,
                      background:"rgba(255,255,255,.12)", borderRadius:5,
                      padding:"2px 8px", fontSize:10, fontWeight:500, whiteSpace:"nowrap" }}>
                      <div style={{ width:14, height:14, borderRadius:3,
                        border:"2px solid rgba(255,255,255,.7)",
                        background:"transparent", flexShrink:0 }}/>
                      <span style={{ opacity:.85 }}>= nog bezig</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:5,
                      background:"rgba(255,255,255,.12)", borderRadius:5,
                      padding:"2px 8px", fontSize:10, fontWeight:500, whiteSpace:"nowrap" }}>
                      <div style={{ width:14, height:14, borderRadius:3,
                        border:"2px solid #7CB342", background:"#7CB342",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:10, color:"#fff", fontWeight:900, flexShrink:0 }}>✓</div>
                      <span style={{ opacity:.85 }}>= afgerond</span>
                    </div>
                  </div>
                </th>
                {COLUMNS.map(c => <th key={c} style={{ ...TH, minWidth:88 }}>{c}</th>)}
                {canEdit && <th style={{ ...TH, width:48 }}>Del</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p,ri) => <ProjectRow key={p.id} p={p} ri={ri} />)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── TOOLBAR ── */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", marginBottom:12 }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Zoek project…"
          style={{ padding:"8px 12px", borderRadius:6, border:"1px solid #CFD8DC", fontSize:12, width:200, outline:"none" }} />
        <select value={filter} onChange={e=>setFilter(e.target.value)}
          style={{ padding:"8px 10px", borderRadius:6, border:"1px solid #CFD8DC", fontSize:12, background:"#fff" }}>
          <option value="">Alle statussen</option>
          {STATUS_OPTIONS.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {/* type filter */}
        <select value={filterType} onChange={e=>setFilterType(e.target.value)}
          style={{ padding:"8px 10px", borderRadius:6, border:"1px solid #CFD8DC",
            fontSize:12, background:"#fff" }}>
          <option value="">Alle types</option>
          {PROJECT_TYPES.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
        </select>
        {openMonth !== null && (
          <button onClick={()=>setOpenMonth(null)}
            style={{ padding:"7px 12px", borderRadius:6, border:"1px solid #90A4AE",
              background:"transparent", cursor:"pointer", fontSize:12, color:"#546E7A", fontWeight:600 }}>
            ✕ Alle maanden
          </button>
        )}
        {canEdit && <Btn onClick={()=>setNewProj(v=>!v)} style={{ whiteSpace:"nowrap" }}>+ Nieuw project</Btn>}
      </div>

      {/* ── KLIKBARE MAAND BARCHART ── */}
      <div style={{ background:"#fff", border:"1px solid #DDE3E9", borderRadius:10,
        padding:"14px 16px", marginBottom:16 }}>
        <div style={{ fontSize:11, color:"#90A4AE", marginBottom:8, fontWeight:600 }}>
          Klik op een maand om te filteren · Klik "Klaar" voor afgeronde projecten
        </div>
        <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:80 }}>
          {counts.map((c,i) => {
            const isActive = openMonth === i;
            return (
              <div key={i} onClick={()=> c>0 && setOpenMonth(openMonth===i ? null : i)}
                style={{ flex:1, display:"flex", flexDirection:"column",
                  alignItems:"center", gap:2, cursor:c>0?"pointer":"default" }}>
                <div style={{ fontSize:10, fontWeight:800,
                  color: isActive?"#E65100":(c>0?"#1C2B3A":"#BDBDBD") }}>{c||""}</div>
                <div style={{ width:"100%", borderRadius:"3px 3px 0 0",
                  background: isActive?"#E65100":(c>0?"#FFAB76":"#ECEFF1"),
                  border: isActive?"2px solid #BF360C":"none",
                  boxSizing:"border-box",
                  height:Math.max((c/maxC)*52,c?5:0), transition:"all .2s" }}/>
                <div style={{ fontSize:9, fontWeight:isActive?800:500,
                  color:isActive?"#E65100":"#78909C" }}>{YEAR_MONTHS[i]}</div>
              </div>
            );
          })}
          {/* Afgerond kolom */}
          <div onClick={()=>setOpenMonth(openMonth===-1?null:-1)}
            style={{ flex:1, display:"flex", flexDirection:"column",
              alignItems:"center", gap:2, cursor:"pointer" }}>
            <div style={{ fontSize:10, fontWeight:800,
              color:openMonth===-1?"#2E7D32":(afgerondProjects.length>0?"#2E7D32":"#BDBDBD") }}>
              {afgerondProjects.length||""}
            </div>
            <div style={{ width:"100%", borderRadius:"3px 3px 0 0",
              background:openMonth===-1?"#2E7D32":(afgerondProjects.length>0?"#A5D6A7":"#ECEFF1"),
              border:openMonth===-1?"2px solid #1B5E20":"none",
              boxSizing:"border-box",
              height:Math.max((afgerondProjects.length/maxC)*52,afgerondProjects.length?5:0),
              transition:"all .2s" }}/>
            <div style={{ fontSize:9, fontWeight:openMonth===-1?800:500,
              color:openMonth===-1?"#2E7D32":"#78909C", textAlign:"center" }}>✅ Klaar</div>
          </div>
        </div>
      </div>

      {/* ── NIEUW PROJECT FORM ── */}
      {newProj && canEdit && (
        <NieuwProjectForm
          onSave={({ name, date, leider, collega, duur, oplevering, type }) => {
            if (!name.trim()) return;
            const id = Math.max(...projects.map(p=>p.id), 0) + 1;
            const updated = [...projects, { id, name, date, einddatum:"", type, leider, collega, duur, oplevering, afgerond:false, statuses:Array(COLUMNS.length).fill("") }];
            setProjects(updated);
            saveData("bouw_projects", updated);
            addLog({ type:"project_add", project: name, datum: date });
            setNewProj(false);
          }}
          onCancel={() => setNewProj(false)}
        />
      )}

      {/* ── LEGEND ── */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
        {Object.entries(STATUS_META).filter(([k])=>k).map(([k,v]) => (
          <span key={k} style={{ background:v.bg, color:v.text, border:`1px solid ${v.border}`,
            padding:"2px 8px", borderRadius:4, fontSize:10, fontWeight:600 }}>{k}</span>
        ))}
      </div>

      {/* ── AFGERONDE PROJECTEN ── */}
      {openMonth === -1 && (
        <div style={{ marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <div style={{ background:"#2E7D32", color:"#fff", borderRadius:8,
              padding:"5px 18px", fontWeight:800, fontSize:14 }}>✅ Afgeronde projecten</div>
            <div style={{ background:"#E8F5E9", color:"#2E7D32", borderRadius:6,
              padding:"2px 10px", fontSize:12, fontWeight:700 }}>
              {afgerondProjects.length} project{afgerondProjects.length!==1?"en":""}
            </div>
            <div style={{ flex:1, height:2, background:"#F0F2F5" }}/>
          </div>
          {afgerondProjects.length === 0 ? (
            <div style={{ fontSize:13, color:"#90A4AE", fontStyle:"italic", padding:16,
              background:"#F5F7FA", borderRadius:8 }}>Nog geen afgeronde projecten.</div>
          ) : (
            <div style={{ overflowX:"auto", borderRadius:8, border:"1px solid #C8E6C9" }}>
              <table style={{ borderCollapse:"collapse", width:"100%", minWidth:2200, fontSize:12 }}>
                <thead>
                  <tr style={{ background:"#2E7D32", color:"#fff", position:"sticky", top:0, zIndex:2 }}>
                    <th style={{ ...TH, minWidth:200, textAlign:"left", padding:"10px 12px",
                      position:"sticky", left:0, background:"#2E7D32", zIndex:3 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span>Project</span>
                        <div style={{ display:"flex", alignItems:"center", gap:5,
                          background:"rgba(255,255,255,.15)", borderRadius:5,
                          padding:"2px 8px", fontSize:10, fontWeight:500 }}>
                          <div style={{ width:14, height:14, borderRadius:3,
                            border:"2px solid #fff", background:"#7CB342",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:10, color:"#fff", fontWeight:900 }}>✓</div>
                          <span style={{ opacity:.9 }}>= klik om te heropenen</span>
                        </div>
                      </div>
                    </th>
                    {COLUMNS.map(c => <th key={c} style={{ ...TH, minWidth:88 }}>{c}</th>)}
                    {canEdit && <th style={{ ...TH, width:48 }}>Del</th>}
                  </tr>
                </thead>
                <tbody>
                  {afgerondProjects.map((p,ri) => <ProjectRow key={p.id} p={p} ri={ri} />)}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ACTIEVE PROJECTEN PER MAAND ── */}
      {openMonth !== -1 && (
        <>
          {monthsToShow.map(mi => (
            <MonthTable key={mi} list={byMonth[mi]}
              label={`${YEAR_MONTHS[mi]} 2026`} headerBg="#1C2B3A" />
          ))}
          {noDate.length > 0 && openMonth === null && (
            <MonthTable list={noDate} label="Geen datum" headerBg="#78909C" />
          )}
        </>
      )}

      <div style={{ marginTop:8, fontSize:11, color:"#90A4AE" }}>
        {activeProjects.length} actieve · {afgerondProjects.length} afgerond
        {canEdit && " · Klik het vakje naast een project om het af te vinken"}
      </div>
    </div>
  );
}

// ── JAARPLANNING ──────────────────────────────────────────────────────
function Jaarplanning({ projects, setProjects, onProjectClick }) {
  const [year,       setYear]       = useState(2026);
  const [openMonth,  setOpenMonth]  = useState(null); // null = all, 0-11 = specific
  const [editDate,   setEditDate]   = useState(null); // pid being date-edited

  function parseDate(d="") {
    // Try dd-mm-yyyy or d-m-yyyy
    const full = d.match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{4})$/);
    if (full) return { day:parseInt(full[1]), month:parseInt(full[2])-1, year:parseInt(full[3]) };
    // Try dd-mm (assume current year)
    const short = d.match(/^(\d{1,2})[-./](\d{1,2})$/);
    if (short) return { day:parseInt(short[1]), month:parseInt(short[2])-1, year:2026 };
    return null;
  }

  function projYear(p) {
    const pd = parseDate(p.date);
    return pd ? pd.year : 2026;
  }

  function projMonthIdx(p) {
    const pd = parseDate(p.date);
    if (!pd || pd.year !== year) return null;
    return pd.month;
  }

  // Sort projects by date
  function sortKey(p) {
    const pd = parseDate(p.date);
    if (!pd) return 99999;
    return pd.year * 10000 + pd.month * 100 + pd.day;
  }

  const counts = Array(12).fill(0);
  projects.forEach(p => {
    const m = projMonthIdx(p);
    if (m !== null && m >= 0 && m < 12) counts[m]++;
  });
  const maxC = Math.max(...counts, 1);

  const byMonth = Array(12).fill(null).map(() => []);
  [...projects].sort((a,b) => sortKey(a)-sortKey(b)).forEach(p => {
    const m = projMonthIdx(p);
    if (m !== null && m >= 0 && m < 12) byMonth[m].push(p);
  });

  async function updateDate(pid, newDate) {
    const updated = projects.map(p => p.id===pid ? {...p, date:newDate} : p);
    setProjects(updated);
    await saveData("bouw_projects", updated);
    setEditDate(null);
  }

  const monthsToShow = openMonth !== null ? [openMonth] : Array.from({length:12},(_,i)=>i);
  const totalYear = projects.filter(p => projYear(p) === year).length;

  return (
    <div>
      {/* header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        <Btn variant="ghost" style={{ padding:"6px 12px" }} onClick={()=>{ setYear(y=>y-1); setOpenMonth(null); }}>◀</Btn>
        <h3 style={{ margin:0, fontSize:18, color:"#1C2B3A" }}>Jaarplanning {year}</h3>
        <Btn variant="ghost" style={{ padding:"6px 12px" }} onClick={()=>{ setYear(y=>y+1); setOpenMonth(null); }}>▶</Btn>
        <span style={{ fontSize:12, color:"#78909C", marginLeft:4 }}>{totalYear} projecten totaal</span>
        {openMonth !== null && (
          <Btn variant="ghost" style={{ padding:"5px 12px", fontSize:12 }}
            onClick={()=>setOpenMonth(null)}>✕ Toon alle maanden</Btn>
        )}
      </div>

      {/* clickable bar chart */}
      <div style={{ background:"#fff", border:"1px solid #DDE3E9", borderRadius:10,
        padding:"16px", marginBottom:24 }}>
        <div style={{ fontSize:11, color:"#90A4AE", marginBottom:8, fontWeight:600 }}>
          Klik op een maand om in te zoomen
        </div>
        <div style={{ display:"flex", gap:4, alignItems:"flex-end", height:90 }}>
          {counts.map((c,i) => {
            const isActive = openMonth === i;
            const hasProj  = c > 0;
            return (
              <div key={i} onClick={()=> hasProj && setOpenMonth(openMonth===i ? null : i)}
                style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
                  gap:3, cursor:hasProj?"pointer":"default" }}>
                <div style={{ fontSize:11, fontWeight:800,
                  color: isActive ? "#E65100" : (hasProj ? "#1C2B3A" : "#BDBDBD") }}>
                  {c||""}
                </div>
                <div style={{
                  width:"100%",
                  background: isActive ? "#E65100" : (hasProj ? "#FFAB76" : "#ECEFF1"),
                  borderRadius:"4px 4px 0 0",
                  height: Math.max((c/maxC)*64, c?6:0),
                  transition:"all .2s",
                  border: isActive ? "2px solid #BF360C" : "none",
                  boxSizing:"border-box"
                }}/>
                <div style={{ fontSize:10, fontWeight: isActive?800:500,
                  color: isActive?"#E65100":"#78909C" }}>
                  {YEAR_MONTHS[i]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* month sections */}
      {monthsToShow.map(mi => {
        const ps = byMonth[mi];
        if (ps.length === 0) return null;
        return (
          <div key={mi} style={{ marginBottom:24 }}>
            {/* month header */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ background:"#1C2B3A", color:"#fff", borderRadius:8,
                padding:"5px 18px", fontWeight:800, fontSize:14, letterSpacing:.5 }}>
                {YEAR_MONTHS[mi]} {year}
              </div>
              <div style={{ background:"#FFF3E0", color:"#E65100", borderRadius:6,
                padding:"3px 10px", fontSize:12, fontWeight:700 }}>
                {ps.length} project{ps.length>1?"en":""}
              </div>
              <div style={{ flex:1, height:2, background:"#F0F2F5", borderRadius:1 }}/>
            </div>

            {/* project cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:10 }}>
              {ps.map(p => (
                <div key={p.id}
                  onClick={()=>onProjectClick(p.id)}
                  style={{ background:"#fff", borderRadius:10,
                    border:"1px solid #DDE3E9", padding:"12px 14px",
                    borderTop:"3px solid #E65100",
                    boxShadow:"0 1px 4px rgba(0,0,0,.05)",
                    cursor:"pointer", transition:"box-shadow .15s, transform .15s" }}
                  onMouseEnter={e=>{ e.currentTarget.style.boxShadow="0 4px 16px rgba(230,81,0,.18)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,.05)"; e.currentTarget.style.transform="translateY(0)"; }}>

                  {/* project name */}
                  <div style={{ fontWeight:800, fontSize:13, color:"#1C2B3A", marginBottom:4 }}>
                    📍 {p.name}
                  </div>
                  {p.type && (() => {
                    const t = PROJECT_TYPES.find(t=>t.label===p.type);
                    return t ? (
                      <span style={{ display:"inline-block", fontSize:10, fontWeight:700,
                        background:t.bg, color:t.text, border:`1px solid ${t.border}`,
                        borderRadius:4, padding:"1px 7px", marginBottom:4 }}>
                        🏗️ {t.label}
                      </span>
                    ) : null;
                  })()}
                  <div style={{ fontSize:10, color:"#E65100", fontWeight:600, marginBottom:4 }}>
                    Klik om checklist te openen →
                  </div>

                  {/* startdatum — klikbaar om te bewerken */}
                  {editDate === p.id ? (
                    <div style={{ display:"flex", gap:4, alignItems:"center", marginBottom:6 }}>
                      <input
                        defaultValue={p.date}
                        placeholder="dd-mm-yyyy"
                        autoFocus
                        onKeyDown={e => {
                          if (e.key==="Enter") updateDate(p.id, e.target.value);
                          if (e.key==="Escape") setEditDate(null);
                        }}
                        onBlur={e => updateDate(p.id, e.target.value)}
                        style={{ fontSize:12, padding:"4px 8px", borderRadius:5,
                          border:"2px solid #E65100", outline:"none", width:120 }}
                      />
                      <span style={{ fontSize:10, color:"#90A4AE" }}>Enter = opslaan</span>
                    </div>
                  ) : (
                    <div onClick={()=>setEditDate(p.id)}
                      style={{ display:"inline-flex", alignItems:"center", gap:5,
                        background:"#FFF3E0", borderRadius:5, padding:"3px 9px",
                        cursor:"pointer", marginBottom:6, border:"1px solid #FFCC80" }}>
                      <span style={{ fontSize:11, color:"#E65100", fontWeight:700 }}>📅 {p.date}</span>
                      <span style={{ fontSize:10, color:"#FFAB76" }}>✏️</span>
                    </div>
                  )}

                  {/* duur & oplevering */}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:p.leider?6:0 }}>
                    {p.duur && (
                      <span style={{ fontSize:10, background:"#E3F2FD", color:"#1565C0",
                        borderRadius:4, padding:"2px 7px", fontWeight:600 }}>⏱ {p.duur}</span>
                    )}
                    {p.oplevering && (
                      <span style={{ fontSize:10, background:"#FFEBEE", color:"#B71C1C",
                        borderRadius:4, padding:"2px 7px", fontWeight:600 }}>🚚 {p.oplevering}</span>
                    )}
                  </div>

                  {/* team */}
                  {(p.leider || p.collega) && (
                    <div style={{ fontSize:11, color:"#546E7A", borderTop:"1px solid #F0F2F5",
                      paddingTop:6, marginTop:4 }}>
                      👷 {p.leider}{p.collega ? ` & ${p.collega}` : ""}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {monthsToShow.every(mi => byMonth[mi].length === 0) && (
        <div style={{ textAlign:"center", color:"#90A4AE", fontSize:13, padding:40,
          background:"#F5F7FA", borderRadius:10 }}>
          <div style={{ fontSize:28, marginBottom:8 }}>📅</div>
          Geen projecten gevonden voor {year}
        </div>
      )}
    </div>
  );
}

// ── TIJDSCHEMA ────────────────────────────────────────────────────────
const PROJ_COLORS = [
  "#E65100","#1565C0","#6A1B9A","#2E7D32","#B71C1C",
  "#0277BD","#558B2F","#4527A0","#AD1457","#00695C",
  "#F57F17","#00838F","#6D4C41","#37474F","#C62828",
  "#1B5E20","#4A148C","#BF360C","#006064","#37474F",
];

function Tijdschema({ projects, setProjects }) {
  const today = new Date();

  // View mode: day | week | month | year
  const [viewMode, setViewMode] = useState("month");
  // Anchor date — start of visible range
  const [anchor, setAnchor] = useState(() => {
    const d = new Date(today);
    d.setDate(1);
    return d;
  });
  const [editWeken, setEditWeken] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");

  // ── Date helpers ────────────────────────────────────────────────────
  function parseD(str = "") {
    if (!str) return null;
    const m = str.match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{4})$/);
    if (m) return new Date(parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1]));
    const s = str.match(/^(\d{1,2})[-./](\d{1,2})$/);
    if (s) return new Date(2026, parseInt(s[2]) - 1, parseInt(s[1]));
    return null;
  }
  function getEndDate(p) {
    const start = parseD(p.date);
    if (!start) return null;
    const defaultWeken = p.type === "Dakopbouw" ? 8 : p.type === "Dakkapel" ? 1 : 4;
    const weken = parseInt(p.weken) || defaultWeken;
    const end = new Date(start);
    end.setDate(start.getDate() + weken * 7);
    return end;
  }
  function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
  function startOfWeek(d) {
    const r = new Date(d);
    const day = r.getDay();
    r.setDate(r.getDate() - ((day + 6) % 7));
    return r;
  }
  function sameDay(a, b) { return a.toDateString() === b.toDateString(); }
  function fmtDay(d) { return `${d.getDate()}-${d.getMonth()+1}`; }
  function fmtFull(d) { return `${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`; }

  // ── Build columns based on viewMode ─────────────────────────────────
  function buildCols() {
    if (viewMode === "day") {
      // 14 days starting from anchor
      return Array.from({length: 14}, (_, i) => {
        const d = addDays(anchor, i);
        return { label: fmtDay(d), subLabel: ["Zo","Ma","Di","Wo","Do","Vr","Za"][d.getDay()], start: d, end: d, isWeekend: d.getDay()===0||d.getDay()===6, isToday: sameDay(d, today) };
      });
    }
    if (viewMode === "week") {
      // 12 weeks starting from Monday of anchor week
      const mon = startOfWeek(anchor);
      return Array.from({length: 12}, (_, i) => {
        const ws = addDays(mon, i * 7);
        const we = addDays(ws, 6);
        const wn = Math.ceil((((ws - new Date(ws.getFullYear(),0,1))/86400000)+1)/7);
        return { label: `W${wn}`, subLabel: `${fmtDay(ws)}`, start: ws, end: we, isWeekend: false, isToday: today >= ws && today <= we };
      });
    }
    if (viewMode === "month") {
      // 12 months starting from anchor month
      return Array.from({length: 12}, (_, i) => {
        let m = anchor.getMonth() + i;
        let y = anchor.getFullYear();
        while (m > 11) { m -= 12; y++; }
        const s = new Date(y, m, 1);
        const e = new Date(y, m + 1, 0);
        return { label: YEAR_MONTHS[m], subLabel: String(y), start: s, end: e, isWeekend: false, isToday: today.getMonth()===m && today.getFullYear()===y };
      });
    }
    // year — show 4 years, each split into quarters
    const startY = anchor.getFullYear();
    const cols = [];
    for (let y = startY; y < startY + 4; y++) {
      for (let q = 0; q < 4; q++) {
        const s = new Date(y, q * 3, 1);
        const e = new Date(y, q * 3 + 3, 0);
        cols.push({ label: `K${q+1}`, subLabel: String(y), start: s, end: e, isWeekend: false, isToday: today >= s && today <= e });
      }
    }
    return cols;
  }

  const cols = buildCols();
  const rangeStart = cols[0].start;
  const rangeEnd   = cols[cols.length - 1].end;

  // ── Navigate ─────────────────────────────────────────────────────────
  function navigate(dir) {
    const d = new Date(anchor);
    const steps = { day: 7, week: 6, month: 6, year: 2 };
    const n = steps[viewMode] * dir;
    if (viewMode === "day")   d.setDate(d.getDate() + n);
    if (viewMode === "week")  d.setDate(d.getDate() + n * 7);
    if (viewMode === "month") d.setMonth(d.getMonth() + n);
    if (viewMode === "year")  d.setFullYear(d.getFullYear() + n);
    setAnchor(d);
  }
  function goToday() {
    const d = new Date(today);
    if (viewMode !== "day") d.setDate(1);
    setAnchor(d);
  }

  // ── Filter projects ───────────────────────────────────────────────────
  const visibleProjects = projects
    .filter(p => !p.afgerond)
    .filter(p => filterType ? p.type === filterType : true)
    .filter(p => search ? p.name.toLowerCase().includes(search.toLowerCase()) : true)
    .filter(p => {
      const s = parseD(p.date);
      const e = getEndDate(p);
      if (!s || !e) return false;
      return s <= rangeEnd && e >= rangeStart;
    })
    .sort((a, b) => {
      const sa = parseD(a.date), sb = parseD(b.date);
      return (sa || new Date(9999,0,1)) - (sb || new Date(9999,0,1));
    });

  // ── Bar position for a project within cols ────────────────────────────
  function getBar(p) {
    const pStart = parseD(p.date);
    const pEnd   = getEndDate(p);
    if (!pStart || !pEnd) return null;
    let startIdx = -1, endIdx = -1;
    let startFrac = 0, endFrac = 1;
    for (let i = 0; i < cols.length; i++) {
      const { start, end } = cols[i];
      const colMs = end - start + 86400000;
      if (pStart <= end && pEnd >= start) {
        if (startIdx === -1) {
          startIdx = i;
          startFrac = pStart > start ? (pStart - start) / colMs : 0;
        }
        endIdx = i;
        endFrac = pEnd < end ? (pEnd - start + 86400000) / colMs : 1;
      }
    }
    return startIdx === -1 ? null : { startIdx, endIdx, startFrac, endFrac };
  }

  async function saveWeken(pid, val) {
    const w = parseInt(val);
    if (!w || w < 1) { setEditWeken(null); return; }
    const updated = projects.map(p => p.id===pid ? {...p, weken: String(w)} : p);
    setProjects(updated);
    await saveData("bouw_projects", updated);
    setEditWeken(null);
  }

  const COL_W = viewMode === "day" ? 38 : viewMode === "week" ? 52 : viewMode === "month" ? 58 : 56;
  const ROW_H = 26;
  const NAME_W = 190;
  const dayNames = ["Zo","Ma","Di","Wo","Do","Vr","Za"];

  // group cols by year/month for header spanning
  function buildHeaderGroups() {
    if (viewMode === "day") {
      const groups = {};
      cols.forEach((c,i) => {
        const key = `${c.start.getFullYear()}-${c.start.getMonth()}`;
        if (!groups[key]) groups[key] = { label: `${YEAR_MONTHS[c.start.getMonth()]} ${c.start.getFullYear()}`, count: 0 };
        groups[key].count++;
      });
      return Object.values(groups);
    }
    if (viewMode === "week") {
      const groups = {};
      cols.forEach(c => {
        const key = `${c.start.getFullYear()}-${c.start.getMonth()}`;
        if (!groups[key]) groups[key] = { label: `${YEAR_MONTHS[c.start.getMonth()]} ${c.start.getFullYear()}`, count: 0 };
        groups[key].count++;
      });
      return Object.values(groups);
    }
    if (viewMode === "month") {
      const groups = {};
      cols.forEach(c => {
        const key = c.subLabel;
        if (!groups[key]) groups[key] = { label: c.subLabel, count: 0 };
        groups[key].count++;
      });
      return Object.values(groups);
    }
    // year — group by year
    const groups = {};
    cols.forEach(c => {
      const key = c.subLabel;
      if (!groups[key]) groups[key] = { label: key, count: 0 };
      groups[key].count++;
    });
    return Object.values(groups);
  }

  const headerGroups = buildHeaderGroups();
  const totalWidth = NAME_W + cols.length * COL_W;

  return (
    <div style={{ fontFamily:"'Inter',sans-serif" }}>

      {/* ── CONTROLS ── */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, alignItems:"center", marginBottom:16 }}>

        {/* View mode */}
        <div style={{ display:"flex", background:"#F0F2F5", borderRadius:8, padding:3 }}>
          {[["day","Dag"],["week","Week"],["month","Maand"],["year","Jaar"]].map(([k,l]) => (
            <button key={k} onClick={()=>{ setViewMode(k); goToday(); }}
              style={{ background:viewMode===k?"#1C2B3A":"transparent",
                color:viewMode===k?"#fff":"#546E7A",
                border:"none", borderRadius:6, padding:"6px 14px",
                cursor:"pointer", fontSize:12, fontWeight:viewMode===k?700:500,
                transition:"all .15s" }}>
              {l}
            </button>
          ))}
        </div>

        {/* Navigate */}
        <button onClick={()=>navigate(-1)}
          style={{ background:"#1C2B3A", color:"#fff", border:"none",
            borderRadius:6, padding:"7px 14px", cursor:"pointer", fontWeight:700, fontSize:14 }}>◀</button>
        <button onClick={goToday}
          style={{ background:"#FFF3E0", color:"#E65100", border:"1px solid #FFCC80",
            borderRadius:6, padding:"6px 12px", cursor:"pointer", fontSize:12, fontWeight:700 }}>
          Vandaag
        </button>
        <button onClick={()=>navigate(1)}
          style={{ background:"#1C2B3A", color:"#fff", border:"none",
            borderRadius:6, padding:"7px 14px", cursor:"pointer", fontWeight:700, fontSize:14 }}>▶</button>

        {/* Range label */}
        <span style={{ fontWeight:800, fontSize:14, color:"#1C2B3A", minWidth:180 }}>
          {viewMode==="day"   && `${fmtDay(cols[0].start)} – ${fmtDay(cols[cols.length-1].end)}`}
          {viewMode==="week"  && `${fmtDay(cols[0].start)} – ${fmtDay(cols[cols.length-1].end)}`}
          {viewMode==="month" && `${YEAR_MONTHS[cols[0].start.getMonth()]} – ${YEAR_MONTHS[cols[cols.length-1].start.getMonth()]} ${cols[cols.length-1].start.getFullYear()}`}
          {viewMode==="year"  && `${cols[0].subLabel} – ${cols[cols.length-1].subLabel}`}
        </span>

        {/* Filters */}
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="🔍 Zoek project…"
          style={{ padding:"6px 10px", borderRadius:6, border:"1px solid #CFD8DC",
            fontSize:12, width:160, outline:"none" }} />
        <select value={filterType} onChange={e=>setFilterType(e.target.value)}
          style={{ padding:"6px 10px", borderRadius:6, border:"1px solid #CFD8DC",
            fontSize:12, background:"#fff" }}>
          <option value="">Alle types</option>
          {PROJECT_TYPES.map(t=><option key={t.label} value={t.label}>{t.label}</option>)}
        </select>

        <span style={{ fontSize:12, color:"#78909C", marginLeft:4 }}>
          {visibleProjects.length} project{visibleProjects.length!==1?"en":""}
        </span>
      </div>

      {/* ── GANTT ── */}
      <div style={{ overflowX:"auto", borderRadius:10,
        border:"1px solid #DDE3E9", boxShadow:"0 2px 12px rgba(0,0,0,.07)",
        background:"#fff", cursor:"grab", userSelect:"none" }}
        onMouseDown={e=>{
          const el=e.currentTarget; let sx=e.pageX+el.scrollLeft;
          const mv=ev=>{ el.scrollLeft=sx-ev.pageX; };
          const up=()=>{ document.removeEventListener("mousemove",mv); document.removeEventListener("mouseup",up); el.style.cursor="grab"; };
          el.style.cursor="grabbing";
          document.addEventListener("mousemove",mv);
          document.addEventListener("mouseup",up);
        }}>

        <div style={{ width:totalWidth, minWidth:totalWidth }}>

          {/* ── HEADER ROW 1 — groups (month/year spans) ── */}
          <div style={{ display:"flex", background:"#0D1B2A", color:"#fff",
            borderBottom:"1px solid #1C2B3A" }}>
            <div style={{ width:NAME_W, minWidth:NAME_W, flexShrink:0,
              padding:"4px 10px", fontWeight:800, fontSize:11, letterSpacing:.3 }}>
              🏗️ Project / Team
            </div>
            {headerGroups.map((g,i) => (
              <div key={i} style={{ width:g.count*COL_W, flexShrink:0, textAlign:"center",
                padding:"3px 2px", fontWeight:800, fontSize:11,
                borderLeft:"2px solid #1C2B3A" }}>
                {g.label}
              </div>
            ))}
          </div>

          {/* ── HEADER ROW 2 — individual cols ── */}
          <div style={{ display:"flex", background:"#1C2B3A", color:"#fff",
            borderBottom:"2px solid #0D1B2A", position:"sticky", top:0, zIndex:5 }}>
            <div style={{ width:NAME_W, minWidth:NAME_W, flexShrink:0,
              padding:"3px 10px", fontSize:9, color:"#90A4AE", fontWeight:600 }}>
              ↔ sleep
            </div>
            {cols.map((c,i) => (
              <div key={i} style={{ width:COL_W, minWidth:COL_W, flexShrink:0,
                textAlign:"center", padding:"3px 1px",
                background: c.isToday ? "#E65100" : (c.isWeekend ? "#263547" : "#1C2B3A"),
                borderLeft: i===0 ? "none" : "1px solid #263547",
                fontSize:10, fontWeight:c.isToday?800:500,
                color: c.isToday?"#fff":(c.isWeekend?"#90A4AE":"#fff") }}>
                <div style={{ fontWeight:700 }}>{c.label}</div>
                {c.subLabel && viewMode!=="month" && viewMode!=="year" &&
                  <div style={{ fontSize:8, opacity:.7 }}>{c.subLabel}</div>}
              </div>
            ))}
          </div>

          {/* ── PROJECT ROWS ── */}
          {visibleProjects.length === 0 ? (
            <div style={{ padding:40, textAlign:"center", color:"#90A4AE", fontSize:13 }}>
              Geen projecten zichtbaar in deze periode
            </div>
          ) : visibleProjects.map((p, pi) => {
            const bar   = getBar(p);
            const color = PROJ_COLORS[pi % PROJ_COLORS.length];
            const typeInfo = PROJECT_TYPES.find(t=>t.label===p.type);

            return (
              <div key={p.id}
                style={{ display:"flex", alignItems:"stretch", minHeight:ROW_H,
                  background: pi%2===0?"#FAFBFC":"#fff",
                  borderBottom:"none" }}
                onMouseEnter={e=>e.currentTarget.style.background="#EBF3FF"}
                onMouseLeave={e=>e.currentTarget.style.background=pi%2===0?"#FAFBFC":"#fff"}>

                {/* project name cell */}
                <div style={{ width:NAME_W, minWidth:NAME_W, flexShrink:0,
                  borderRight:"2px solid #DDE3E9", padding:"2px 6px",
                  display:"flex", alignItems:"center", gap:5 }}>
                  {/* color bar */}
                  <div style={{ width:2, alignSelf:"stretch", background:color,
                    borderRadius:1, flexShrink:0 }}/>
                  <div style={{ flex:1, overflow:"hidden" }}>
                    <div style={{ fontWeight:700, fontSize:10, color:"#1C2B3A",
                      whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", lineHeight:1.2 }}>
                      {p.name}
                    </div>
                    {p.typeLabel && (
                      <div style={{ fontSize:8, color:"#fff", background:"rgba(0,0,0,.35)",
                        borderRadius:2, padding:"0px 4px", display:"inline-block",
                        marginTop:1, maxWidth:"100%", overflow:"hidden",
                        textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {p.typeLabel}
                      </div>
                    )}
                    <div style={{ display:"flex", gap:3, alignItems:"center", flexWrap:"wrap" }}>
                      {typeInfo && (
                        <span style={{ fontSize:9, fontWeight:700,
                          background:typeInfo.bg, color:typeInfo.text,
                          border:`1px solid ${typeInfo.border}`,
                          borderRadius:3, padding:"0px 5px" }}>
                          {typeInfo.label}
                        </span>
                      )}
                      {/* weken badge / edit */}
                      {editWeken===p.id ? (
                        <input defaultValue={p.weken||"4"} autoFocus type="number" min="1" max="52"
                          style={{ width:38, fontSize:10, padding:"1px 4px", borderRadius:3,
                            border:"1px solid #E65100", outline:"none", textAlign:"center" }}
                          onKeyDown={e=>{ if(e.key==="Enter") saveWeken(p.id,e.target.value); if(e.key==="Escape") setEditWeken(null); }}
                          onBlur={e=>saveWeken(p.id,e.target.value)} />
                      ) : (
                        <span onClick={()=>setEditWeken(p.id)}
                          style={{ fontSize:9, color:"#fff", background: color,
                            borderRadius:3, padding:"1px 5px", cursor:"pointer",
                            fontWeight:700 }}>
                          {p.weken||"4"}w
                        </span>
                      )}
                      {(p.leider||p.collega) && (
                        <span style={{ fontSize:9, color:"#546E7A", whiteSpace:"nowrap",
                          overflow:"hidden", textOverflow:"ellipsis", maxWidth:90 }}>
                          👷{p.leider}{p.collega?" & "+p.collega:""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* gantt bar cells */}
                <div style={{ display:"flex", flex:1, position:"relative", alignItems:"center" }}>
                  {cols.map((c,ci) => (
                    <div key={ci} style={{ width:COL_W, minWidth:COL_W, flexShrink:0, height:"100%",
                      background: c.isToday ? "rgba(230,81,0,.07)" : (c.isWeekend ? "rgba(0,0,0,.025)" : "transparent"),
                      borderLeft: c.isToday ? "2px solid rgba(230,81,0,.4)" : "1px solid #F0F2F5",
                      boxSizing:"border-box" }}/>
                  ))}

                  {/* the actual gantt bar — positioned absolute over cells */}
                  {bar && (() => {
                    const left  = bar.startIdx * COL_W + bar.startFrac * COL_W;
                    const right = (cols.length - bar.endIdx - 1) * COL_W + (1 - bar.endFrac) * COL_W;
                    const width = totalWidth - NAME_W - left - right;
                    const weken = parseInt(p.weken)||4;
                    return (
                      <div style={{ position:"absolute", left, width: Math.max(width,4),
                        top:"50%", transform:"translateY(-50%)",
                        height:ROW_H-2, borderRadius:3,
                        background:`linear-gradient(90deg, ${color}, ${color}cc)`,
                        boxShadow:`0 2px 6px ${color}55`,
                        display:"flex", alignItems:"center",
                        overflow:"hidden", cursor:"default" }}
                        title={`${p.name} · ${p.date} · ${weken} weken${p.leider?" · 👷 "+p.leider:""}`}>
                        {/* label inside bar if wide enough */}
                        {width > 50 && (
                          <span style={{ fontSize:9, color:"#fff", fontWeight:700,
                            paddingLeft:5, whiteSpace:"nowrap", overflow:"hidden",
                            textOverflow:"ellipsis", maxWidth:width-12 }}>
                            {p.typeLabel ? `${p.typeLabel} · ${p.name.split(" ")[0]}` : p.name.split(" ").slice(0,2).join(" ")}
                          </span>
                        )}
                        {/* start marker */}
                        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4,
                          background:"rgba(255,255,255,.5)", borderRadius:"5px 0 0 5px" }}/>
                        {/* end marker */}
                        <div style={{ position:"absolute", right:0, top:0, bottom:0, width:4,
                          background:"rgba(0,0,0,.2)", borderRadius:"0 5px 5px 0" }}/>
                      </div>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── LEGEND ── */}
      <div style={{ marginTop:12, display:"flex", gap:16, flexWrap:"wrap",
        fontSize:11, color:"#78909C", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <span>↔</span> Sleep om te scrollen
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:16, height:12, background:"rgba(230,81,0,.15)",
            border:"2px solid rgba(230,81,0,.4)", borderRadius:2 }}/> Vandaag
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <span style={{ background:"#E65100", color:"#fff", borderRadius:3,
            padding:"1px 5px", fontSize:9, fontWeight:700 }}>4w</span>
          Klik weken-badge om looptijd aan te passen
        </div>
        {PROJECT_TYPES.map(t => (
          <div key={t.label} style={{ display:"flex", alignItems:"center", gap:4 }}>
            <div style={{ width:12, height:12, background:t.bg, border:`1px solid ${t.border}`,
              borderRadius:2 }}/>
            <span style={{ color:t.text, fontWeight:600 }}>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── LOGBOEK ───────────────────────────────────────────────────────────
function Logboek({ logs, onClear }) {
  const TYPE_META = {
    "status":    { icon:"✏️", color:"#1565C0", bg:"#E3F2FD", label:"Status gewijzigd" },
    "project_add":    { icon:"➕", color:"#2E7D32", bg:"#E8F5E9", label:"Project toegevoegd" },
    "project_remove": { icon:"🗑️", color:"#B71C1C", bg:"#FFEBEE", label:"Project verwijderd" },
  };

  return (
    <div style={{ maxWidth:780 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <div>
          <div style={{ fontWeight:800, fontSize:15, color:"#1C2B3A" }}>Wijzigingenlog</div>
          <div style={{ fontSize:12, color:"#90A4AE", marginTop:2 }}>
            Alle aanpassingen worden hier automatisch bijgehouden.
          </div>
        </div>
        {logs.length > 0 && (
          <button onClick={onClear}
            style={{ background:"#fff", border:"1px solid #EF9A9A", color:"#B71C1C",
              borderRadius:6, padding:"6px 14px", fontSize:12, fontWeight:600, cursor:"pointer" }}>
            Log wissen
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div style={{ background:"#F5F7FA", border:"1px solid #DDE3E9", borderRadius:12,
          padding:"40px 24px", textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:8 }}>📋</div>
          <div style={{ fontWeight:700, color:"#546E7A", fontSize:14 }}>Nog geen wijzigingen</div>
          <div style={{ fontSize:12, color:"#90A4AE", marginTop:4 }}>
            Zodra iemand een status aanpast of een project toevoegt, verschijnt dat hier.
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {[...logs].reverse().map((log, i) => {
            const meta = TYPE_META[log.type] || TYPE_META["status"];
            return (
              <div key={i} style={{ background:"#fff", border:"1px solid #DDE3E9",
                borderRadius:10, padding:"12px 16px",
                display:"flex", alignItems:"flex-start", gap:12 }}>
                {/* icon */}
                <div style={{ width:36, height:36, borderRadius:8, background:meta.bg,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:16, flexShrink:0 }}>{meta.icon}</div>
                {/* content */}
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontWeight:700, fontSize:13, color:"#1C2B3A" }}>{log.project}</span>
                    <span style={{ background:meta.bg, color:meta.color, borderRadius:4,
                      padding:"1px 7px", fontSize:10, fontWeight:700 }}>{meta.label}</span>
                  </div>
                  {log.type === "status" && (
                    <div style={{ fontSize:12, color:"#546E7A", marginTop:3 }}>
                      <span style={{ fontWeight:600 }}>{log.kolom}</span>
                      {" · "}
                      <span style={{ textDecoration:"line-through", color:"#90A4AE" }}>{log.oud || "leeg"}</span>
                      {" → "}
                      <span style={{ fontWeight:700, color:meta.color }}>{log.nieuw || "leeg"}</span>
                    </div>
                  )}
                  {log.type === "project_add" && (
                    <div style={{ fontSize:12, color:"#546E7A", marginTop:3 }}>
                      Startdatum: <span style={{ fontWeight:600 }}>{log.datum}</span>
                    </div>
                  )}
                </div>
                {/* timestamp */}
                <div style={{ fontSize:11, color:"#90A4AE", whiteSpace:"nowrap", flexShrink:0 }}>
                  {log.tijd}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── SHELL / MAIN ──────────────────────────────────────────────────────
// ── ONDERDELEN OVERZICHT ──────────────────────────────────────────────
function Onderdelen({ projects }) {
  const [selected, setSelected] = useState(null); // column index
  const [filterStatus, setFilterStatus] = useState(""); // filter by status

  // For each column, collect all projects that have a non-empty, non-× status
  function getProjectsForColumn(ci) {
    return projects
      .filter(p => !p.afgerond)
      .filter(p => {
        const s = p.statuses[ci] || "";
        if (!s || s === "×") return false;
        if (filterStatus && !s.startsWith(filterStatus)) return false;
        return true;
      })
      .map(p => ({
        ...p,
        status: p.statuses[ci],
        datum:  p.details?.[ci]?.datum || "",
        uitvoerder: p.details?.[ci]?.uitvoerder || "",
      }))
      .sort((a,b) => {
        // Sort by datum if available, else by project name
        if (a.datum && b.datum) return a.datum.localeCompare(b.datum);
        return a.name.localeCompare(b.name);
      });
  }

  // Summary: count per column
  const colCounts = COLUMNS.map((_, ci) => getProjectsForColumn(ci).length);

  return (
    <div style={{ fontFamily:"'Inter',sans-serif" }}>

      {/* ── FILTER ── */}
      <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:20, flexWrap:"wrap" }}>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
          style={{ padding:"8px 12px", borderRadius:6, border:"1px solid #CFD8DC",
            fontSize:12, background:"#fff" }}>
          <option value="">Alle statussen</option>
          {STATUS_OPTIONS.filter(Boolean).map(s =>
            <option key={s} value={s}>{s}</option>)}
        </select>
        {selected !== null && (
          <button onClick={()=>setSelected(null)}
            style={{ padding:"7px 12px", borderRadius:6, border:"1px solid #90A4AE",
              background:"transparent", cursor:"pointer", fontSize:12,
              color:"#546E7A", fontWeight:600 }}>
            ✕ Toon alle onderdelen
          </button>
        )}
        <span style={{ fontSize:12, color:"#78909C" }}>
          Klik op een onderdeel om te zien welke projecten dat nodig hebben
        </span>
      </div>

      {/* ── COLUMN GRID — click to filter ── */}
      {selected === null && (
        <div style={{ display:"grid",
          gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:10, marginBottom:28 }}>
          {COLUMNS.map((col, ci) => {
            const count = colCounts[ci];
            const hasItems = count > 0;
            return (
              <div key={ci} onClick={()=>hasItems && setSelected(ci)}
                style={{ background:"#fff", borderRadius:10,
                  border: hasItems ? "2px solid #DDE3E9" : "1px solid #F0F2F5",
                  padding:"14px 16px", cursor: hasItems ? "pointer" : "default",
                  opacity: hasItems ? 1 : 0.45,
                  transition:"all .15s",
                  boxShadow: hasItems ? "0 1px 4px rgba(0,0,0,.06)" : "none" }}
                onMouseEnter={e=>{ if(hasItems) { e.currentTarget.style.borderColor="#E65100"; e.currentTarget.style.boxShadow="0 4px 16px rgba(230,81,0,.15)"; e.currentTarget.style.transform="translateY(-2px)"; }}}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=hasItems?"#DDE3E9":"#F0F2F5"; e.currentTarget.style.boxShadow=hasItems?"0 1px 4px rgba(0,0,0,.06)":"none"; e.currentTarget.style.transform="translateY(0)"; }}>
                <div style={{ fontSize:22, marginBottom:6 }}>
                  {["⚙️","📐","🧱","🪟","💡","🔨","🏛️","⚡","🌡️","🏠","🏗️","🔲","🪣","🔧","📦","🏗️","🪜","➕"][ci] || "🔩"}
                </div>
                <div style={{ fontWeight:800, fontSize:13, color:"#1C2B3A", marginBottom:4 }}>
                  {col}
                </div>
                {hasItems ? (
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ background:"#E65100", color:"#fff", borderRadius:20,
                      padding:"2px 10px", fontSize:12, fontWeight:800 }}>
                      {count}
                    </div>
                    <span style={{ fontSize:11, color:"#78909C" }}>
                      project{count!==1?"en":""}
                    </span>
                  </div>
                ) : (
                  <div style={{ fontSize:11, color:"#BDBDBD" }}>Geen projecten</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── DETAIL VIEW — selected column ── */}
      {selected !== null && (
        <div>
          {/* header */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <button onClick={()=>setSelected(null)}
              style={{ background:"#F0F2F5", border:"none", borderRadius:6,
                padding:"6px 12px", cursor:"pointer", fontSize:13, fontWeight:700,
                color:"#546E7A" }}>◀ Terug</button>
            <div style={{ background:"#1C2B3A", color:"#fff", borderRadius:8,
              padding:"6px 20px", fontWeight:800, fontSize:16 }}>
              🔩 {COLUMNS[selected]}
            </div>
            <div style={{ background:"#FFF3E0", color:"#E65100", borderRadius:6,
              padding:"3px 12px", fontSize:13, fontWeight:700 }}>
              {getProjectsForColumn(selected).length} project{getProjectsForColumn(selected).length!==1?"en":""}
            </div>
          </div>

          {/* project cards */}
          {getProjectsForColumn(selected).length === 0 ? (
            <div style={{ textAlign:"center", color:"#90A4AE", fontSize:13,
              padding:40, background:"#F5F7FA", borderRadius:10 }}>
              Geen projecten met deze status voor {COLUMNS[selected]}
            </div>
          ) : (
            <div style={{ display:"grid",
              gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:12 }}>
              {getProjectsForColumn(selected).map(p => {
                const meta = STATUS_META[STATUS_OPTIONS.find(k=>k&&p.status.startsWith(k))||""] || STATUS_META[""];
                const typeInfo = PROJECT_TYPES.find(t=>t.label===p.type);
                return (
                  <div key={p.id} style={{ background:"#fff", borderRadius:10,
                    border:"1px solid #DDE3E9", padding:"14px 16px",
                    borderLeft:"4px solid #E65100",
                    boxShadow:"0 1px 6px rgba(0,0,0,.06)" }}>

                    {/* project name + type */}
                    <div style={{ display:"flex", alignItems:"flex-start",
                      justifyContent:"space-between", gap:8, marginBottom:6 }}>
                      <div style={{ fontWeight:800, fontSize:13, color:"#1C2B3A" }}>
                        📍 {p.name}
                      </div>
                      {typeInfo && (
                        <span style={{ fontSize:10, fontWeight:700, flexShrink:0,
                          background:typeInfo.bg, color:typeInfo.text,
                          border:`1px solid ${typeInfo.border}`,
                          borderRadius:4, padding:"1px 6px" }}>
                          {typeInfo.label}
                        </span>
                      )}
                    </div>

                    {/* status chip */}
                    <div style={{ marginBottom:8 }}>
                      <span style={{ background:meta.bg, color:meta.text,
                        border:`1px solid ${meta.border}`,
                        borderRadius:4, padding:"2px 10px",
                        fontSize:12, fontWeight:700 }}>
                        {p.status}
                      </span>
                    </div>

                    {/* details */}
                    <div style={{ fontSize:11, color:"#546E7A", display:"flex",
                      flexDirection:"column", gap:3 }}>
                      <div>📅 Start: <strong>{p.date}</strong></div>
                      {p.datum && (
                        <div style={{ color:"#1565C0", fontWeight:600 }}>
                          🚚 Leverdatum: <strong>{p.datum}</strong>
                        </div>
                      )}
                      {p.uitvoerder && (
                        <div style={{ color:"#2E7D32", fontWeight:600 }}>
                          👷 Uitvoerder: <strong>{p.uitvoerder}</strong>
                        </div>
                      )}
                      {(p.leider||p.collega) && (
                        <div style={{ color:"#546E7A" }}>
                          🏗️ Team: {p.leider}{p.collega?" & "+p.collega:""}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── ALL COLUMNS TABLE (when none selected) ── */}
      {selected === null && (
        <div style={{ marginTop:8 }}>
          <div style={{ fontWeight:800, fontSize:15, color:"#1C2B3A", marginBottom:12 }}>
            📊 Volledig overzicht per onderdeel
          </div>
          <div style={{ overflowX:"auto", borderRadius:8, border:"1px solid #DDE3E9" }}>
            <table style={{ borderCollapse:"collapse", width:"100%", fontSize:12 }}>
              <thead>
                <tr style={{ background:"#1C2B3A", color:"#fff" }}>
                  <th style={{ ...TH, textAlign:"left", padding:"10px 14px",
                    position:"sticky", left:0, background:"#1C2B3A", minWidth:180 }}>Onderdeel</th>
                  <th style={{ ...TH, minWidth:60 }}>Totaal</th>
                  {STATUS_OPTIONS.filter(Boolean).map(s => (
                    <th key={s} style={{ ...TH, minWidth:80 }}>{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COLUMNS.map((col, ci) => {
                  const allForCol = projects.filter(p=>!p.afgerond && p.statuses[ci] && p.statuses[ci]!=="×");
                  const total = allForCol.length;
                  return (
                    <tr key={ci}
                      style={{ background:ci%2===0?"#FAFBFC":"#fff", cursor:"pointer" }}
                      onClick={()=>setSelected(ci)}
                      onMouseEnter={e=>e.currentTarget.style.background="#EBF3FF"}
                      onMouseLeave={e=>e.currentTarget.style.background=ci%2===0?"#FAFBFC":"#fff"}>
                      <td style={{ ...TD, fontWeight:700, color:"#1C2B3A",
                        position:"sticky", left:0, background:"inherit",
                        borderRight:"2px solid #DDE3E9", padding:"8px 14px" }}>
                        {["⚙️","📐","🧱","🪟","💡","🔨","🏛️","⚡","🌡️","🏠","🏗️","🔲","🪣","🔧","📦","🏗️","🪜","➕"][ci] || "🔩"} {col}
                      </td>
                      <td style={{ ...TD, textAlign:"center", fontWeight:800,
                        color: total>0?"#E65100":"#BDBDBD" }}>{total||"—"}</td>
                      {STATUS_OPTIONS.filter(Boolean).map(s => {
                        const cnt = allForCol.filter(p=>p.statuses[ci].startsWith(s)).length;
                        const meta = STATUS_META[s];
                        return (
                          <td key={s} style={{ ...TD, textAlign:"center" }}>
                            {cnt > 0 ? (
                              <span style={{ background:meta.bg, color:meta.text,
                                border:`1px solid ${meta.border}`,
                                borderRadius:4, padding:"1px 8px",
                                fontSize:11, fontWeight:700 }}>
                                {cnt}
                              </span>
                            ) : <span style={{ color:"#E0E0E0" }}>—</span>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const TABS = [
  { key:"checklist",    label:"📋 Checklist" },
  { key:"jaarplanning", label:"📅 Jaarplanning" },
  { key:"tijdschema",   label:"⏰ Tijdschema" },
  { key:"onderdelen",   label:"🔩 Onderdelen" },
  { key:"logboek",      label:"📝 Logboek" },
];


// ── WAARSCHUWINGEN BANNER ─────────────────────────────────────────────
const KRITIEKE_KOLOMMEN = ["Kozijn","Steen-strips / Metselwerk","Lichtstraat","Constructie berekening"];
const BESTELD_STATUSSEN = ["Besteld","Geleverd","Gereed"];

function WaarschuwingsBanner({ projects }) {
  const [open, setOpen] = useState(false);
  const vandaag = new Date();

  function parseDate(d="") {
    const m = d.match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{4})$/);
    if (m) return new Date(+m[3], +m[2]-1, +m[1]);
    return null;
  }

  // Projecten waarvan startdatum binnen 3 maanden valt
  const waarschuwingen = [];
  projects.filter(p => !p.afgerond).forEach(p => {
    const start = parseDate(p.date);
    if (!start) return;
    const maandenTot = (start - vandaag) / (1000 * 60 * 60 * 24 * 30);
    if (maandenTot > 2 || maandenTot < 0) return; // alleen 0-2 maanden vooruit

    const probleem = [];
    KRITIEKE_KOLOMMEN.forEach(kol => {
      const ci = COLUMNS.indexOf(kol);
      if (ci === -1) return;
      // Onderdeel moet actief zijn (niet uitgeschakeld)
      if (p.actief && p.actief[kol] === false) return;
      const status = p.statuses[ci] || "";
      const isOk = BESTELD_STATUSSEN.some(s => status.startsWith(s));
      if (!isOk) probleem.push(kol);
    });

    if (probleem.length > 0) {
      const dagenTot = Math.ceil((start - vandaag) / (1000 * 60 * 60 * 24));
      waarschuwingen.push({ project: p, probleem, dagenTot });
    }
  });

  if (waarschuwingen.length === 0) return null;

  return (
    <div style={{ background:"#FFF3CD", borderBottom:"2px solid #FFC107",
      padding:"0 24px" }}>
      {/* Header balk — altijd zichtbaar */}
      <div onClick={()=>setOpen(v=>!v)}
        style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0",
          cursor:"pointer", userSelect:"none" }}>
        <span style={{ fontSize:18 }}>⚠️</span>
        <span style={{ fontWeight:800, fontSize:13, color:"#7D4F00" }}>
          {waarschuwingen.length} project{waarschuwingen.length!==1?"en":""} — kritieke onderdelen nog niet besteld!
        </span>
        <span style={{ marginLeft:"auto", fontSize:12, color:"#A06000", fontWeight:600 }}>
          {open ? "▲ Inklappen" : "▼ Uitklappen"}
        </span>
      </div>

      {/* Detail lijst */}
      {open && (
        <div style={{ paddingBottom:14, display:"flex", flexDirection:"column", gap:8 }}>
          {waarschuwingen.map(({ project: p, probleem, dagenTot }) => (
            <div key={p.id} style={{ background:"#fff", border:"2px solid #FFC107",
              borderRadius:8, padding:"10px 14px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6, flexWrap:"wrap" }}>
                <span style={{ fontWeight:800, fontSize:13, color:"#1C2B3A" }}>
                  📍 {p.name}
                </span>
                <span style={{ background: dagenTot <= 14 ? "#FFEBEE" : "#FFF3CD",
                  color: dagenTot <= 14 ? "#B71C1C" : "#7D4F00",
                  border: `1px solid ${dagenTot <= 14 ? "#EF9A9A" : "#FFC107"}`,
                  borderRadius:4, padding:"2px 8px", fontSize:11, fontWeight:700 }}>
                  {dagenTot <= 0 ? "⛔ AL BEGONNEN"
                    : dagenTot <= 14 ? `🔴 Nog ${dagenTot} dagen!`
                    : `🟡 Start over ${dagenTot} dagen`}
                </span>
                <span style={{ fontSize:11, color:"#78909C" }}>
                  Startdatum: {p.date}
                </span>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {probleem.map(kol => (
                  <span key={kol} style={{ background:"#FFEBEE", color:"#B71C1C",
                    border:"1px solid #EF9A9A", borderRadius:4,
                    padding:"3px 10px", fontSize:11, fontWeight:700 }}>
                    ⚠️ {kol} — niet besteld
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const SESSION_KEY = "bouw_session";
const SESSION_DAYS = 5;

function saveSession(user) {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user, expires }));
}
function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const { user, expires } = JSON.parse(raw);
    if (Date.now() > expires) { localStorage.removeItem(SESSION_KEY); return null; }
    return user;
  } catch { return null; }
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export default function App() {
  const [projects,         setProjects]         = useState(null);
  const [logs,             setLogs]             = useState([]);
  const [tab,              setTab]              = useState("checklist");
  const [loading,          setLoading]          = useState(true);
  const [highlightProject, setHighlightProject] = useState(null);
  const [currentUser,      setCurrentUser]      = useState(() => loadSession());
  const [users,            setUsers]            = useState([]);
  const [showAdmin,        setShowAdmin]        = useState(false);

  function goToProject(pid) {
    setTab("checklist");
    setHighlightProject(pid);
  }

  function nowStr() {
    const n = new Date();
    return n.toLocaleDateString("nl-NL") + " " + n.toLocaleTimeString("nl-NL", { hour:"2-digit", minute:"2-digit" });
  }

  async function addLog(entry) {
    const updated = [...logs, { ...entry, tijd: nowStr() }];
    setLogs(updated);
    await saveData("bouw_logs", updated);
  }

  async function clearLogs() {
    if (!window.confirm("Weet je zeker dat je het logboek wilt wissen?")) return;
    setLogs([]);
    await saveData("bouw_logs", []);
  }

  useEffect(()=>{
    (async()=>{
      const [savedProjects, savedLogs, savedUsers] = await Promise.all([
        loadData("bouw_projects", null),
        loadData("bouw_logs", []),
        loadData("bouw_users", []),
      ]);
      if (!savedProjects) {
        await saveData("bouw_projects", DEFAULT_PROJECTS);
        setProjects(DEFAULT_PROJECTS);
      } else {
        setProjects(savedProjects);
      }
      setLogs(savedLogs);
      setUsers(savedUsers);
      setLoading(false);
    })();
  },[]);

  if (loading || !projects) return (
    <div style={{ minHeight:"100vh", background:"#1C2B3A",
      display:"flex", alignItems:"center", justifyContent:"center",
      flexDirection:"column", gap:12,
      color:"#fff", fontSize:16, fontFamily:"Inter,sans-serif" }}>
      <div style={{ fontSize:32 }}>🏗️</div>
      <div>De Aanbouw Expert — laden…</div>
      <div style={{ fontSize:12, color:"#78909C" }}>Opgeslagen data wordt opgehaald</div>
    </div>
  );

  if (!currentUser) return (
    <AuthScreen
      onLogin={(user) => { saveSession(user); setCurrentUser(user); }}
      users={users}
      setUsers={setUsers}
    />
  );

  return (
    <div style={{ minHeight:"100vh", background:"#F0F2F5",
      fontFamily:"'Inter',system-ui,sans-serif" }}>

      {/* header */}
      <header style={{ background:"#1C2B3A", color:"#fff", height:52,
        display:"flex", alignItems:"center", padding:"0 20px", gap:12,
        boxShadow:"0 2px 8px rgba(0,0,0,.3)", position:"sticky", top:0, zIndex:20 }}>
        <div style={{ background:"#E65100", borderRadius:6, width:30, height:30,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🏗️</div>
        <span style={{ fontWeight:800, fontSize:15 }}>De Aanbouw Expert</span>
        <div style={{ flex:1 }}/>
        {TABS.map(t => (
          <button key={t.key} onClick={()=>setTab(t.key)}
            style={{ background:tab===t.key?"#E65100":"transparent",
              border:"none", color:"#fff", padding:"6px 13px", borderRadius:6,
              fontWeight:tab===t.key?700:400, cursor:"pointer", fontSize:12 }}>
            {t.label}
          </button>
        ))}
        <div style={{ flex:1 }}/>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {currentUser.role === "admin" && (
            <button onClick={()=>setShowAdmin(v=>!v)}
              style={{ background: showAdmin?"#E65100":"rgba(255,255,255,.12)",
                border:"none", color:"#fff", padding:"5px 12px", borderRadius:6,
                fontWeight:700, cursor:"pointer", fontSize:12, position:"relative" }}>
              👥 Accounts
              {users.filter(u=>!u.approved).length > 0 && (
                <span style={{ position:"absolute", top:-6, right:-6,
                  background:"#FF5722", color:"#fff", borderRadius:"50%",
                  width:18, height:18, fontSize:10, fontWeight:800,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {users.filter(u=>!u.approved).length}
                </span>
              )}
            </button>
          )}
          <div style={{ fontSize:12, color:"#CFD8DC" }}>
            👤 {currentUser.name}
          </div>
          <button onClick={()=>{ clearSession(); setCurrentUser(null); }}
            style={{ background:"rgba(255,255,255,.12)", border:"none", color:"#fff",
              padding:"5px 12px", borderRadius:6, fontWeight:600,
              cursor:"pointer", fontSize:12 }}>
            Uitloggen
          </button>
        </div>
      </header>

      {/* Admin panel overlay */}
      {showAdmin && currentUser.role === "admin" && (
        <div style={{ background:"#FFF8E1", borderBottom:"2px solid #FFD600",
          padding:"20px 24px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            marginBottom:16 }}>
            <h3 style={{ margin:0, fontSize:16, color:"#1C2B3A" }}>👥 Accountbeheer</h3>
            <button onClick={()=>setShowAdmin(false)}
              style={{ background:"none", border:"none", fontSize:20,
                cursor:"pointer", color:"#546E7A" }}>✕</button>
          </div>
          <AdminPanel users={users} setUsers={setUsers} />
        </div>
      )}

      {/* waarschuwingen */}
      <WaarschuwingsBanner projects={projects||[]} />

      {/* page title */}
      <div style={{ background:"#fff", borderBottom:"1px solid #DDE3E9",
        padding:"12px 24px" }}>
        <h2 style={{ margin:0, fontSize:17, color:"#1C2B3A" }}>
          { tab==="checklist"    ? "Projecten checklist"
          : tab==="jaarplanning" ? "Jaarplanning"
          : tab==="tijdschema"   ? "Weekoverzicht"
          : tab==="onderdelen"   ? "Onderdelen overzicht"
          :                       "Wijzigingenlog" }
        </h2>
      </div>

      {/* content */}
      <main style={{ padding:"20px 24px" }}>
        { tab==="checklist"    ? <Checklist projects={projects} setProjects={setProjects} canEdit={true} addLog={addLog} highlightProject={highlightProject} clearHighlight={()=>setHighlightProject(null)} />
        : tab==="jaarplanning" ? <Jaarplanning projects={projects} setProjects={setProjects} onProjectClick={goToProject} />
        : tab==="tijdschema"   ? <Tijdschema projects={projects} setProjects={setProjects} />
        : tab==="onderdelen"   ? <Onderdelen projects={projects} />
        :                        <Logboek logs={logs} onClear={clearLogs} />
        }
      </main>
    </div>
  );
}

// ── SHARED STYLE TOKENS ───────────────────────────────────────────────
const TH = { padding:"8px 6px", fontWeight:600, fontSize:10, letterSpacing:.5,
  textTransform:"uppercase", textAlign:"center", whiteSpace:"normal" };
const TD = { padding:"6px 5px", borderBottom:"1px solid #ECEFF1", verticalAlign:"middle" };
