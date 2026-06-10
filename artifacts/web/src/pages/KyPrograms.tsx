import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Search,
  Brain,
  Users,
  Compass,
  ShieldAlert,
  HeartPulse,
  GraduationCap,
  Clock,
  Award,
  ClipboardCheck,
  FileText,
  MapPin,
  ChevronDown,
  Info,
} from "lucide-react";

// Source: Kentucky Department of Corrections — Course Catalogue of Offender
// Programs and Education, Vol 1 (2024). Division of Probation and Parole,
// Reentry Service Centers, Recovery Kentucky Centers.

type Provider = { name: string; phone?: string; address: string };

type Program = {
  id: string;
  name: string;
  type: "Evidence Based" | "Cognitive Behavioral" | "Life Skills" | "Substance Abuse" | "Education";
  credit: string;
  description: string;
  timeFrame: string;
  admission: string[];
  policies: string[];
  locations: string[];
  providers?: Provider[];
  providersLabel?: string;
};

type Category = {
  id: string;
  title: string;
  icon: typeof Brain;
  programs: Program[];
};

const MRT_NOTICE =
  "MRT© is the product of Correctional Counseling Inc. (CCI). MRT certification is required to facilitate.";

const CORE_POLICIES = [
  "CPP 30.1 Program Evaluation and Measurement",
  "CPP 30.2 Program Credit",
  "CPP 30.3 Risk and Needs Assessment and Quality Assurance",
  "CPP 30.4 Probation Program Credit",
  "KRS 197.045",
  "KRS 439.345",
];

const SAP_POLICIES = [
  "CPP 27-05-02 Use of Substance Abuse Staff",
  "CPP 27-13-01 Drug and Alcohol Testing of Offenders",
  "CPP 30.6 Division of Addiction Services Substance Abuse Program",
  "CPP 30.7 Community Substance Abuse Program Good Time Credit",
  "KRS 197.045",
  "KRS 439.345",
];

const P = {
  newLegacy: { name: "New Legacy Reentry Corporation", phone: "502-276-0660", address: "1115 Garvin Place, Louisville, KY 40203" },
  mccracken: { name: "McCracken County Jail Annex", phone: "270-444-4730", address: "400 Clarence Gaines St., Paducah, KY 42003" },
  lighthouse: { name: "Lighthouse Recovery", phone: "270-689-4025", address: "731 Hall St., Owensboro, KY 42303" },
  daviess: { name: "Daviess County Detention Center", phone: "270-685-8466", address: "3337 Hwy 144, Owensboro, KY 42303" },
  communityCounseling: { name: "Community Counseling Center", phone: "270-886-1515", address: "509 West 9th St., Hopkinsville, KY 42240" },
  christianCounty: { name: "Christian County Remediation Center", phone: "270-632-2450", address: "216 West 7th Street, Hopkinsville, KY 42240" },
  lifeMinistries: { name: "Life Ministries", phone: "502-558-2576", address: "1209 Highland Ave. Suite R, Carrollton, KY 41008" },
  kyCareMurray: { name: "Kentucky Care", phone: "270-908-4260", address: "312 S. 8th St., Murray, KY 42071" },
  kyCarePaducah: { name: "Kentucky Care", phone: "270-908-4260", address: "3360 Wayne Sullivan Drive, Paducah, KY 42003" },
  kyCareMayfield: { name: "Kentucky Care", phone: "270-443-9474", address: "110 Kings Dr., Mayfield, KY 42066" },
  kyCareBarlow: { name: "Kentucky Care", phone: "270-908-4260", address: "120 N. 4th Street, Barlow, KY 42024" },
  nkuOwenton: { name: "Northern Kentucky University", phone: "502-851-6267", address: "401 Main St., Owenton, KY 40359" },
  nkuCarrollton: { name: "Northern Kentucky University", phone: "502-851-6267", address: "800 Clay St., Carrollton, KY 41008" },
  freshStart: { name: "Fresh Start Educational & Counseling Center", phone: "502-235-0238", address: "4936 Hazelwood Ave., Louisville, KY 40216" },
  fourRiversPaducah: { name: "Four Rivers Behavioral Health (Paducah)", phone: "270-442-7121", address: "425 Broadway, Paducah, KY 42001" },
  fourRiversLakes: { name: "Four Rivers Behavioral Health (Lakes Office)", phone: "270-753-6622", address: "1051 N. 16th St., Murray, KY 42071" },
  fourRiversFuller: { name: "Four Rivers Behavioral Health (Fuller Center)", phone: "270-247-2588", address: "1525 Cuba Rd., Mayfield, KY 42066" },
  emeraldPaducah: { name: "Emerald Therapy Center, LLC", phone: "270-534-5128", address: "5050B Village Square Drive, Paducah, KY 42001" },
  emeraldMurray: { name: "Emerald Therapy Center, LLC", phone: "270-534-5128", address: "111 Poplar Street Suite 104, Murray, KY 42071" },
  emeraldMayfield: { name: "Emerald Therapy Center, LLC", phone: "270-534-5128", address: "1019 Paducah Road Suite C, Mayfield, KY 42066" },
  mindful: { name: "Mindful Service Foundation, Inc.", phone: "502-295-4087", address: "9210 Old Six Mile Lane, Louisville, KY 40299" },
  spotChestnut: { name: "The Spot", phone: "502-232-0415", address: "800 W. Chestnut St., Louisville, KY 40203" },
  spotNia: { name: "The Spot (NIA Center)", phone: "502-804-8441", address: "2900 W. Broadway, Louisville, KY 40211" },
  communicareLebanon: { name: "Communicare", phone: "270-692-2509", address: "519 Workshop Lane, Lebanon, KY 40033" },
  communicareBardstown: { name: "Communicare (Bardstown)", phone: "502-348-9206", address: "331 S. Third St., Bardstown, KY 40004" },
  invictus: { name: "Invictus4Core", phone: "859-710-1800", address: "3150 Custer Dr. Suite #101, Lexington, KY 40517" },
  lakeCumberland: { name: "Lake Cumberland Health Department", phone: "606-679-4416", address: "500 Bourne Ave., Somerset, KY 42501" },
  sparcRecovery: { name: "Lake Cumberland HD (SPARC Recovery)", phone: "270-858-5377", address: "1442 W. Steve Warriner Dr., Russell Springs, KY 42642" },
  sparcWildflower: { name: "Lake Cumberland HD (SPARC at Wildflower)", phone: "270-858-5377", address: "7339 S. Hwy 127, Russell Springs, KY 42642" },
  sterling: { name: "Sterling Health Care", phone: "606-674-9776", address: "506 N. Maysville St. Ste #2, Mount Sterling, KY 40353" },
  cfc1: { name: "A Center for Change", phone: "606-898-3982", address: "120 Samantha St., Olive Hill, KY 41164" },
  cfc2: { name: "A Center for Change (Extension Site)", phone: "606-898-3982", address: "153 W. Tom T Hall Blvd., Olive Hill, KY 41164" },
  cfc3: { name: "A Center for Change (Extension Site)", phone: "606-898-3982", address: "1163 Erwin Ridge Rd., Olive Hill, KY 41164" },
  cfc4: { name: "A Center for Change (Extension Site)", phone: "606-898-3982", address: "3699 KY-1704, Olive Hill, KY 41164" },
  cfc5: { name: "A Center for Change (Extension Site)", phone: "606-898-3982", address: "143 Samantha St., Olive Hill, KY 41164" },
  cfc6: { name: "A Center for Change (Extension Site)", phone: "606-898-3982", address: "128 Samantha St., Olive Hill, KY 41164" },
  shepherdsShelter: { name: "Shepherds Shelter/Ross Rehab", phone: "859-498-7111", address: "236 Bridgett Drive, Mount Sterling, KY 40353" },
  newDay: { name: "A New Day Counseling Service", phone: "270-994-8997", address: "1202 Main Street, Benton, KY 42025" },
  renest1: { name: "reNEST Recovery Support Services", phone: "270-319-9899", address: "226 Adams Rd., Elizabethtown, KY 42707" },
  renest2: { name: "reNEST Recovery Support Services", phone: "270-319-9899", address: "413 E. Dixie Ave., Suite 106, Elizabethtown, KY 42701" },
  purchaseArea: { name: "Purchase Area Drug and Alcohol Intervention", phone: "270-705-7194", address: "17 Construction Road, Suite A, Graves, KY 42066" },
  genesisReentry: { name: "Genesis Reentry Skills, Inc.", phone: "270-688-8232", address: "1301 Tamarack Road, Owensboro, KY 42301" },
  newVision: { name: "New Vision Recovery Center", phone: "606-743-2107", address: "1390 West Main Street, West Liberty, KY 41472" },
  fuse: { name: "Fuse Medical", phone: "606-770-5161", address: "425 South Main Street, London, KY 40741" },
} satisfies Record<string, Provider>;

const CFC_ALL = [P.cfc1, P.cfc2, P.cfc3, P.cfc4, P.cfc5, P.cfc6];
const LAKE_CUMBERLAND_ALL = [P.lakeCumberland, P.sparcRecovery, P.sparcWildflower];
const NKU_ALL = [P.nkuOwenton, P.nkuCarrollton];
const KY_CARE_ALL = [P.kyCareMurray, P.kyCarePaducah, P.kyCareMayfield, P.kyCareBarlow];
const EMERALD_ALL = [P.emeraldPaducah, P.emeraldMurray, P.emeraldMayfield];

const RKC_CENTERS: Provider[] = [
  { name: "Brighton Recovery Center for Women **", phone: "859-491-8303", address: "375 Weaver Rd., Florence, KY 41042" },
  { name: "CenterPoint Recovery Center for Men **", phone: "270-444-3640", address: "530 County Park Rd., Paducah, KY 42001" },
  { name: "Cumberland Hope Community Center for Women **", phone: "606-837-0100", address: "6050 KY 38, Evarts, KY 40828" },
  { name: "Genesis Recovery Kentucky Center for Men **", phone: "606-898-2111", address: "400 CW Stevens Blvd., Grayson, KY 41143" },
  { name: "Grateful Life Center **", phone: "859-359-4500", address: "305 Pleasure Isle Dr., Erlanger, KY 41017" },
  { name: "The Healing Place of Campbellsville **", phone: "270-789-0176", address: "105 Hiestand Farm Rd., Campbellsville, KY 42718" },
  { name: "Hickory Hills Recovery Center for Men **", phone: "606-785-0141", address: "100 Recovery Way, Emmalena, KY 41740" },
  { name: "Liberty Place Recovery Center for Women **", phone: "859-625-0104", address: "218 Lake St., Richmond, KY 40475" },
  { name: "Men's Addiction Recovery Center (M.A.R.C.) **", phone: "270-715-0810", address: "1791 River St., Bowling Green, KY 42101" },
  { name: "Owensboro Regional Recovery for Men **", phone: "270-689-0905", address: "4301 Veach Rd., Owensboro, KY 42303" },
  { name: "SKY Hope Recovery Center for Women **", phone: "606-425-4787", address: "77 Union St., Somerset, KY 42501" },
  { name: "Trilogy Center for Women **", phone: "270-885-2902", address: "100 Trilogy Ave., Hopkinsville, KY 42240" },
  { name: "Women's Addiction Recovery Manor (W.A.R.M.) **", phone: "270-826-0036", address: "56 North McKinley St., Henderson, KY 42420" },
  { name: "Chrysalis House (Female)", phone: "859-977-2504", address: "1589 Hill Rise Dr., Lexington, KY 40504" },
  { name: "Healing Place for Women **", phone: "502-568-1268", address: "1503 S 15th St., Louisville, KY 40203" },
  { name: "Hope Center – Ball-Quantrell Jones for Women **", phone: "859-252-2002", address: "1524 Versailles Rd., Lexington, KY 40588" },
  { name: "Hope Center – Jacobs House **", phone: "859-543-2222", address: "289 W Loudon Ave., Lexington, KY 40508" },
  { name: "George Privett Recovery Center – Hope Center Recovery for Men **", phone: "859-225-4673", address: "250 W Loudon Ave., Lexington, KY 40508" },
];

const RKC_RSC_EXTRA: Provider[] = [
  { name: "CTS Russell", phone: "502-855-6500", address: "1407 W Jefferson St., Louisville, KY 40203" },
  { name: "Dismas Charities – Diersen (Female)", phone: "502-636-1572", address: "1218 W Oak St., Louisville, KY 40210" },
  { name: "Dismas Charities – Owensboro (Female)", phone: "270-685-6054", address: "615 Carlton Dr., Owensboro, KY 42303" },
  { name: "St. Anns", phone: "502-637-9150", address: "1515 Algonquin Pkwy., Louisville, KY 40210" },
  { name: "WestCare Ashcamp Hal Rogers Appalachian Recovery Center", phone: "606-754-7077", address: "10057 Elkhorn Creek Rd., Ashcamp, KY 41512" },
  { name: "WestCare Women's (Lookout)", phone: "606-772-3011", address: "5971 Poor Bottom Road, Elkhorn City, KY 41522" },
];

// DOC-approved community substance abuse treatment providers (SAP).
// Treatment levels: IOP = intensive outpatient, Residential, PHP = partial hospitalization.
const SAP_DOC_PROVIDERS: Provider[] = [
  { name: "1st Step Recovery — IOP & Residential", address: "220 South 23rd St, Louisville, KY 40215" },
  { name: "A New Way to Live — IOP", address: "127 W. Fifth St., Lexington, KY 40508" },
  { name: "Appalachian Wellness — IOP", address: "592 KY 15 South, Campton, KY 41301" },
  { name: "ARC — IOP & Residential", address: "Multiple locations statewide (Tyner, Booneville, St. Catherine, Owenton, Ashland, Louisa, Catlettsburg, Owingsville, Pippa Passes, Benham, Inez, Pikeville, Somerset, Wallingford, and more)" },
  { name: "BHG XXXV LLC — IOP", address: "Lexington, Berea, Corbin, Hazard, Paducah, Paintsville, Pikeville" },
  { name: "Bingham Behavioral Health — IOP", address: "417 Knox Street, Suite 3, Barbourville, KY 40906" },
  { name: "Bluegrass Professional Counseling — IOP", address: "Multiple locations" },
  { name: "Brightview — IOP", address: "Glasgow, Paris, Lexington, Clarkson, Henderson, Madisonville, Louisville, Nicholasville, Elsmere, London, Benton, Hazard, Georgetown, Campbellsville, Somerset, Covington, Pikeville" },
  { name: "Choose Hope — IOP with transitional living", address: "620 South 3rd Street, Suite 101, Louisville, KY 40202" },
  { name: "Chrysalis House — IOP with transitional living", address: "1589 Hill View Place #1104, Lexington, KY 40504" },
  { name: "Cleanse Clinic — IOP", address: "Multiple locations" },
  { name: "ClearPath Recovery — IOP & Residential", address: "225 Country Court Circle, London, KY 40741" },
  { name: "CommonHealth Kentucky — IOP", address: "1604 Louisville Road, Frankfort, KY 40601" },
  { name: "Community Counseling Center — IOP", address: "509 West 9th Street, Hopkinsville, KY" },
  { name: "Comp Serv Health Resources — IOP", address: "101 North 7th Street, Louisville, KY 40202" },
  { name: "Comprehend — IOP", address: "Multiple locations" },
  { name: "Deaton and Deaton Counseling and Consulting — IOP", address: "Multiple locations" },
  { name: "Denova — IOP", address: "Lexington & Richmond, KY" },
  { name: "Divine Steps — IOP", address: "3050 West Broadway, Suite 1D, Louisville, KY 40211" },
  { name: "Edgewater Recovery Center — IOP & Residential", address: "Morehead, Pikeville, Paducah, Flemingsburg" },
  { name: "Emerald Therapy Center — IOP", address: "Murray, Mayfield, Paducah" },
  { name: "Ethan Health — IOP & Residential", address: "1621 Foxhaven Drive, Richmond, KY 40475 (residential); multiple IOP locations" },
  { name: "Everlasting Arms — IOP", address: "Multiple locations" },
  { name: "Faithful Recovery — Residential", address: "3776 Poplar Plains Road, Flemingsburg, KY 41041" },
  { name: "Family Care Counseling Center, LLC — IOP", address: "2156 Bluegrass Rd, Franklin, KY 42134" },
  { name: "FM Healing Center — IOP", address: "1041 Center Drive, Suite 100, Richmond, KY" },
  { name: "Foothills Academy: Community Based Interventions — IOP", address: "80 Rolling Hills Blvd, Monticello, KY" },
  { name: "Four Rivers Behavioral Health — IOP & Residential", address: "Paducah & Mayfield, KY" },
  { name: "Fresh Start Educational and Counseling — IOP", address: "4936 Hazelwood Avenue, Louisville, KY 40214" },
  { name: "Frontier Behavioral Health Center — IOP & Residential", address: "Staffordsville & Auxier, KY; multiple IOP locations" },
  { name: "Fuller Life Counseling and Partners — IOP", address: "Multiple locations" },
  { name: "Fuse Medical — IOP", address: "43 Waco Drive, London, KY 40741" },
  { name: "Gratitude Adjustment — IOP", address: "9245 W. Hwy 80, Nancy, KY 42544" },
  { name: "Green House Recovery and Rehabilitation Center — IOP", address: "717 West Market Street, Suite 2, Louisville, KY 40202" },
  { name: "Harlan Recovery — IOP", address: "109 Second Street, Suite 4, Harlan, KY 40831" },
  { name: "Hope Center Services — IOP", address: "298 W. Loudon Ave., Lexington, KY 40588" },
  { name: "Hope City — IOP & Residential", address: "335 North Main Street, Barbourville, KY 40906" },
  { name: "Hoskins Medical Center — IOP", address: "11120 Reuben Street, London, KY 40741" },
  { name: "Horizon Health — IOP", address: "Multiple locations" },
  { name: "Invictus4Core — IOP", address: "3150 Custer Drive, Suite 101, Lexington, KY 40517" },
  { name: "Isaiah House, Inc — IOP & Residential", address: "Chaplin, Louisville, Willisburg, Hustonville, Harrodsburg, Versailles, Danville, Georgetown" },
  { name: "JourneyPure — IOP & Residential", address: "Bowling Green, KY; multiple IOP locations" },
  { name: "Journey to Healing — IOP & Residential", address: "Olive Hill, KY; multiple IOP locations" },
  { name: "Lifeskills - Genesis — Residential", address: "Hopkinsville, KY" },
  { name: "Living Clean — IOP", address: "214 Bridget St, Manchester, KY 40962" },
  { name: "Mercy Medical Clinic — IOP", address: "14659 US North Highway 25 East, Suite 16, Corbin, KY 40701" },
  { name: "Mindful Direction Counseling Services — IOP", address: "4602 Southern Parkway Ste 2C, Louisville, KY 40214" },
  { name: "Mountain Comprehensive Care Center — IOP", address: "Multiple locations" },
  { name: "Mountain of Hope (Mountain Comprehensive Care) — Residential", address: "485 Berger Road, Paducah, KY 42001" },
  { name: "Neartown, Inc — Residential", address: "1250 Old Soldier Creek Road, Kirksey, KY 42054" },
  { name: "New Beginnings Education and Counseling Center, Inc — IOP", address: "Multiple locations" },
  { name: "New Day Recovery Center — IOP & Residential", address: "Winchester & Lexington, KY" },
  { name: "New Hope Community Services — IOP", address: "Multiple locations" },
  { name: "New Hope Counseling and Recovery — IOP", address: "Multiple locations" },
  { name: "New Leaf Recovery and Wellness — IOP", address: "1129 W. Lexington Ave, Winchester, KY 40391" },
  { name: "New Vision Recovery Center, LLC — IOP & Residential", address: "1390 West Main Street, West Liberty, KY 41472" },
  { name: "Not Forgotten Recovery — IOP", address: "1100 US 127 South Suite B4, Frankfort, KY 40601" },
  { name: "Optimal Living Services — IOP", address: "Multiple locations" },
  { name: "Park Place Recovery Center for Women — Residential", address: "49 Hillview Drive, Scottsville, KY 42164" },
  { name: "Park Place Recovery Center for Men — Residential", address: "822 Woodway Street, Bowling Green, KY 42101" },
  { name: "P&N Behavioral Health — IOP", address: "Georgetown, KY" },
  { name: "Primary Purpose Behavioral Health — IOP", address: "715 Shaker Drive, #80, Lexington, KY 40504" },
  { name: "Panancea — IOP", address: "140 Kings Daughters Drive, Frankfort, KY 40601" },
  { name: "Prodigal Counseling Services — IOP", address: "Multiple locations" },
  { name: "Protea Behavioral Health Counseling — IOP", address: "Multiple locations" },
  { name: "REACH — IOP", address: "841 Old Preston Hwy, Shepherdsville, KY 40165" },
  { name: "Recovery Plus - Caris Counseling / Behavioral Health Group — IOP", address: "Multiple locations" },
  { name: "Recovery Defined — IOP", address: "8120 Dream Street, Florence, KY 41042" },
  { name: "Recovery Services — IOP", address: "1017 West Market Street, Louisville, KY 40202" },
  { name: "Redeemed and Restored (men's) — Residential", address: "210 Cadiz Rd, Hopkinsville, KY 42240" },
  { name: "Redemption Road Recovery — IOP & Residential", address: "Heidrick & Gray, KY" },
  { name: "Ramey-Estep Homes - Regroup — IOP & Residential", address: "Rush, Ashland, Grayson, Crestview Hills" },
  { name: "Renest Recovery Support Services — IOP", address: "413 East Dixie Avenue, Suite 106, Elizabethtown, KY 42701" },
  { name: "Revived Recovery — Residential", address: "2710 US 60 East, Morehead, KY 40351" },
  { name: "Rivervalley Behavioral Health (Onyx & Amethyst Centers) — Residential", address: "Owensboro, KY" },
  { name: "Roaring Brook Recovery — IOP", address: "600 Perimeter Drive, Suite 125, Lexington, KY 40517" },
  { name: "RRJ Solutions — IOP", address: "Multiple locations" },
  { name: "Second Mile Behavioral Health — IOP", address: "280 Levi Jackson Mill Rd, Suite A, London, KY 40744" },
  { name: "Serenitee at Its Best — IOP", address: "125 Big Sink Road, Suite D, Versailles, KY 40383" },
  { name: "Serenity Counseling Services — IOP", address: "Multiple locations" },
  { name: "Shepherd's House — IOP & Residential", address: "635 Maxwelton Court, Lexington, KY 40508; multiple IOP locations" },
  { name: "Shepherd's Shelter - Ross Rehab — Residential & PHP", address: "236 Bridgett Drive, Mount Sterling, KY 40353" },
  { name: "Spero Health — IOP", address: "Multiple locations" },
  { name: "Stepworks Recovery Centers — IOP & Residential", address: "Elizabethtown, Nicholasville, Paducah, London, Bowling Green" },
  { name: "Sterling Health Solutions dba Sterling Health Care — IOP", address: "103 Commonwealth Dr., Mt. Sterling, KY 40353" },
  { name: "Structure House Recovery — IOP", address: "318 West Dixie Street, London, KY 40741" },
  { name: "Ten Ten Program, Inc. — IOP", address: "130 West 43rd Street, Covington, KY 41015" },
  { name: "The Morton Center — IOP", address: "1028 Barrett Ave, Louisville, KY 40204" },
  { name: "The Next Chapter — Residential", address: "65 Center Avenue, Whitley City, KY 42653" },
  { name: "The Walker House Inc — IOP", address: "Multiple locations" },
  { name: "Tracy's House — IOP", address: "1365 Devonport Drive, Lexington, KY 40504" },
  { name: "True North Treatment Center — IOP", address: "Owensboro & Central City, KY" },
  { name: "Twin Lakes Counseling Services — IOP", address: "346 South Main Street, Leitchfield, KY 42754" },
  { name: "UofL Peace Hospital — IOP & Residential", address: "4414 Churchman Ave., Louisville, KY 40215" },
  { name: "Victory House Transitional Living — IOP", address: "561 Breckinridge St, Suite 202, Lexington, KY 40508" },
  { name: "VOA — IOP & Residential", address: "Multiple Louisville locations & Manchester, KY" },
  { name: "Winds of Change — IOP", address: "1220 Master Street, Suite 6, Corbin, KY 40701" },
  { name: "Women in Circle — IOP with transitional living", address: "Multiple locations" },
];

const OUTPATIENT_CMHC: Provider[] = [
  { name: "Four Rivers Behavioral Health", address: "Paducah: 425 Broadway Suite LL · Mayfield: 1525 Cuba Rd" },
  { name: "Pennyroyal Mental Health Center", address: "Central City, Hopkinsville, Madisonville, Princeton clinics" },
  { name: "River Valley Behavioral Health", address: "Owensboro: 1100 Walnut St. · Henderson: 618 N. Green St." },
  { name: "New Vista (previously Bluegrass.org)", address: "Cynthiana, Richmond, Lexington, Danville offices" },
  { name: "NorthKey", address: "513 Madison Ave, Covington, KY 41011" },
  { name: "Cumberland River Behavioral Health", address: "Pineville, Harlan (virtual), and virtual/online groups for Whitley, Knox, Laurel, Clay, Jackson, Rockcastle" },
  { name: "Kentucky River Community Care", address: "Mayking, Jackson, Beattyville, Hazard, Campton, Hyden, Emmalena offices" },
  { name: "Mountain Comprehensive Care Center", address: "Paintsville, Prestonsburg, Pikeville offices" },
  { name: "Lifeskills", address: "Glasgow: 608 Happy Valley · Bowling Green: 380 Trail Street" },
  { name: "Pathways", address: "Ashland, Greenup, Grayson, Mt. Sterling, Morehead offices" },
  { name: "Comprehend", address: "Maysville, Flemingsburg, Vanceburg offices" },
  { name: "Seven Counties", address: "600 S. Preston St., Louisville, KY 40203" },
  { name: "Adanta", address: "Monticello, Somerset, Columbia offices" },
  { name: "Communicare", address: "Elizabethtown, Lebanon, Springfield, Leitchfield, Brandenburg offices" },
  { name: "Hope Center", address: "298 Loudon Ave, Lexington, KY" },
];

const CATEGORIES: Category[] = [
  {
    id: "cbt",
    title: "Cognitive Behavioral Programs",
    icon: Brain,
    programs: [
      {
        id: "mrt",
        name: "MRT© — Moral Reconation Therapy",
        type: "Evidence Based",
        credit: "90 days",
        description:
          `Combines group presentations and individual assignments with facilitator guidance. Designed in a criminal justice setting, MRT targets an offender's belief system and attempts to raise their level of moral reasoning in decision-making. Researched for over thirty years with proven reduction in recidivism. Achieves formal completion after 12 in-group steps using the 'How to Escape Your Prison'© workbook. ${MRT_NOTICE}`,
        timeFrame: "Generally 24-36 open-ended group sessions plus individual homework assignments; length depends on individual progress.",
        admission: ["Recommendations based on specific criminogenic needs identified in the KyRAS assessment."],
        policies: CORE_POLICIES,
        locations: [
          "All 20 Probation and Parole Districts",
          "BCDC, Brady Center, Center Point Recovery Center, CTS Russell, DC Diersen, Jacobs House, KCI Paducah, DC Louisville, Mary Street, DC Owensboro, DC Portland, DC St. Patrick's, VOA, Westcare Ashcamp, and Westcare Lookout",
        ],
        providers: [
          P.newLegacy, P.mccracken, P.lighthouse, P.daviess, P.communityCounseling, P.christianCounty,
          P.lifeMinistries, ...KY_CARE_ALL, ...NKU_ALL, P.freshStart, P.fourRiversPaducah, P.fourRiversLakes,
          P.fourRiversFuller, ...EMERALD_ALL, P.mindful, P.spotChestnut, P.spotNia, P.communicareLebanon,
          P.communicareBardstown, P.invictus, ...LAKE_CUMBERLAND_ALL, P.sterling, ...CFC_ALL,
          P.shepherdsShelter, P.newDay, P.renest1, P.renest2, P.purchaseArea,
        ],
      },
      {
        id: "mrt-mentor",
        name: "MRT© Mentor",
        type: "Evidence Based",
        credit: "90 days",
        description:
          `Strives to ensure a higher success rate for those who have previously completed MRT. Mentors are held to a higher behavioral expectation, revisit steps 1-4 of 'How to Escape Your Prison'©, and complete the 'Character Development'© workbook. A maximum of 3 mentors per MRT group of 15 (1:5 ratio) assist in monitoring the group while working through their own curriculum. ${MRT_NOTICE}`,
        timeFrame: "Generally 24-36 open-ended group sessions plus individual homework assignments.",
        admission: [
          "Prerequisite: completion of MRT.",
          "Recommendations based on specific criminogenic needs identified in the KYRAS assessment.",
        ],
        policies: CORE_POLICIES,
        locations: ["All 20 Probation and Parole Districts", "CTS Russell, DC Diersen, DC Portland, and DC St Patrick's"],
        providers: [...NKU_ALL, P.mccracken, ...LAKE_CUMBERLAND_ALL, P.sterling, ...CFC_ALL, P.lighthouse, P.daviess, P.newDay],
      },
      {
        id: "mrt-tfg",
        name: "MRT© Thinking for Good",
        type: "Cognitive Behavioral",
        credit: "60 days",
        description:
          `Developed to confront anti-social and criminal thinking errors. Completion entails 10 modules with a minimum of 10-12 group sessions utilizing the 'Thinking for Good'© workbook, plus homework assignments prepared outside of group. ${MRT_NOTICE}`,
        timeFrame: "Minimum of 10-12 group sessions depending on offender needs and progression.",
        admission: ["Recommendations based on specific criminogenic needs identified in the KYRAS assessment."],
        policies: CORE_POLICIES,
        locations: ["All 20 Probation and Parole Districts", "CTS Russell, DC Diersen, DC Portland, DC St Patrick's, and KCI Paducah"],
        providers: [...NKU_ALL, P.mccracken, P.spotChestnut, P.spotNia, P.communicareLebanon, P.communicareBardstown, ...LAKE_CUMBERLAND_ALL, P.sterling, ...CFC_ALL, P.newDay, P.lighthouse, P.daviess],
      },
      {
        id: "mrt-anger",
        name: "MRT© Anger Management",
        type: "Cognitive Behavioral",
        credit: "90 days",
        description:
          `Designed to assist offenders in recognizing and overcoming anger. Includes 8 modules with a minimum of 8-10 group sessions using the 'Coping with Anger'© workbook, supplemental materials, and homework assignments. ${MRT_NOTICE}`,
        timeFrame: "Minimum of 10-12 group sessions depending on offender needs and progression.",
        admission: ["Recommendations based on specific criminogenic needs identified in the KYRAS assessment."],
        policies: CORE_POLICIES,
        locations: ["All 20 Probation and Parole Districts", "BCDC, CTS Russell, DC Portland, DC St. Patricks, DC Diersen, KCI Paducah, and Westcare Ashcamp"],
        providers: [...NKU_ALL, P.lifeMinistries, P.mccracken, ...EMERALD_ALL, ...KY_CARE_ALL, P.spotChestnut, P.spotNia, P.communicareLebanon, P.communicareBardstown, ...LAKE_CUMBERLAND_ALL, P.sterling, ...CFC_ALL, P.newDay, P.lighthouse, P.daviess],
      },
      {
        id: "mrt-staying-quit",
        name: "MRT© Staying Quit",
        type: "Cognitive Behavioral",
        credit: "60 days",
        description:
          `Designed to assist with relapse prevention by helping offenders recognize risky situations, cravings, and triggers. Requires eight modules over a minimum of 8-10 open-ended group sessions, completion of the 'Staying Quit'© workbook, and homework outside of group. ${MRT_NOTICE}`,
        timeFrame: "Minimum of 8-10 sessions depending on offender needs and progression.",
        admission: [
          "Prerequisite: successful completion of the SAP program on the current conviction and sentence prior to admission.",
          "Recommendations based on criminogenic needs identified in the KYRAS assessment and a substance use history.",
        ],
        policies: CORE_POLICIES,
        locations: ["All 20 Probation and Parole Districts", "CTS Russell, DC Diersen, DC Portland, DC St Patrick's, KCI Paducah, and WestCare Ashcamp"],
        providers: [...NKU_ALL, ...KY_CARE_ALL, P.mccracken, P.communicareLebanon, P.communicareBardstown, ...LAKE_CUMBERLAND_ALL, P.sterling, ...CFC_ALL, P.newDay, P.lighthouse, P.daviess, ...EMERALD_ALL],
      },
      {
        id: "mrt-untangling",
        name: "MRT© Untangling Relationships",
        type: "Cognitive Behavioral",
        credit: "90 days",
        description:
          `Focuses on providing treatment to offenders involved in addictive/co-dependent relationships — confronting manipulation and dependence. Targets domestic violence, unhealthy relationships, enabling, substance abusers, and criminality. Uses the 'Untangling Relationships'© workbook. ${MRT_NOTICE}`,
        timeFrame: "Completion of 12 modules with a minimum of 12 group sessions plus homework outside of group.",
        admission: ["Recommendations based on specific criminogenic needs identified in the KYRAS assessment."],
        policies: CORE_POLICIES,
        locations: ["All 20 Probation and Parole Districts", "KCI Paducah"],
        providers: [...NKU_ALL, P.mccracken, P.communicareLebanon, P.communicareBardstown, ...LAKE_CUMBERLAND_ALL, P.sterling, ...CFC_ALL, P.newDay, P.lighthouse, P.daviess],
      },
      {
        id: "mrt-trauma",
        name: "MRT© Trauma (Breaking the Chains of Trauma)",
        type: "Evidence Based",
        credit: "60 days",
        description:
          "A recovery program for trauma-informed care based on the MRT approach. Designed to target trauma-related symptoms by incorporating the key issues outlined by SAMHSA's Trauma-Informed Treatment Protocol. Uses the 'Breaking the Chains of Trauma'© workbook (gender-designated; separate groups for women and men). Training certification specific to MRT Trauma is required to facilitate.",
        timeFrame: "Generally 9-12 open-ended group sessions plus individual homework assignments.",
        admission: ["Recommendations based on specific criminogenic needs identified in the KYRAS assessment."],
        policies: ["CPP 30.1 Program Evaluation and Measurement", "CPP 30.2 Program Credit", "CPP 30.3 Risk and Needs Assessment Administration, Training, and Quality Assurance", "KRS 197.045"],
        locations: ["All 20 Probation and Parole Districts"],
        providers: [...CFC_ALL, P.newDay, P.kyCareMurray],
      },
      {
        id: "employment",
        name: "Employment Program (Job Readiness)",
        type: "Cognitive Behavioral",
        credit: "45 days",
        description:
          `Designed to assist offenders in job readiness. Includes 8 modules with a minimum of 8-10 group sessions utilizing the 'Job Readiness'© workbook, resume preparation and completion, supplemental materials, and homework assignments. ${MRT_NOTICE}`,
        timeFrame: "Minimum of 9-12 group sessions depending on offender needs and progression.",
        admission: ["Recommendations based on specific criminogenic needs identified in the KYRAS assessment."],
        policies: ["CPP 30.1 Program Evaluation and Measurement", "CPP 30.2 Program Credit", "CPP 30.3 Risk and Needs Assessment Administration, Training, and Quality Assurance", "KRS 197.045"],
        locations: ["All 20 Probation and Parole Districts"],
      },
      {
        id: "mee",
        name: "MEE Journaling Series",
        type: "Evidence Based",
        credit: "90 days",
        description:
          "Product of The Change Companies. The MEE Journal Series (Motivational, Educational and Experiential) provides a structured, client-centered addiction series combining Cognitive Behavioral Therapy (CBT), Motivational Interviewing (MI), the Transtheoretical Model of Change, experiential writing, and action-oriented steps, facilitated in groups of 10-12 to motivate residents toward change.",
        timeFrame: "Generally 48-72 hours of group sessions plus individual homework assignments.",
        admission: ["Recommendations based on specific criminogenic needs identified in the KyRAS assessment."],
        policies: CORE_POLICIES,
        locations: ["Not currently active in any locations."],
      },
    ],
  },
  {
    id: "parenting",
    title: "Parenting Programs",
    icon: Users,
    programs: [
      {
        id: "mrt-parenting",
        name: "MRT© Parenting",
        type: "Cognitive Behavioral",
        credit: "90 days",
        description:
          `Focuses on family values and individual priorities; appropriate for all parents. Uses the 'Parenting and Family Values'© workbook. ${MRT_NOTICE}`,
        timeFrame: "Completion of 12 modules with a minimum of 12 sessions, depending on offender needs and progression.",
        admission: [
          "Prerequisite: offenders should be in an active parenting role of a minor child under the age of 18.",
          "Recommendations based on specific criminogenic needs identified in the KYRAS assessment.",
        ],
        policies: CORE_POLICIES,
        locations: [
          "All 20 Probation and Parole Districts",
          "Center Point Recovery Center, CTS Russell, DC Diersen, DC Owensboro, DC Portland, DC St. Patrick, KCI Paducah, Westcare Ashcamp, and Westcare Lookout",
        ],
        providers: [...NKU_ALL, P.lifeMinistries, P.communityCounseling, P.christianCounty, P.freshStart, ...KY_CARE_ALL, P.mccracken, ...EMERALD_ALL, P.communicareLebanon, P.communicareBardstown, ...LAKE_CUMBERLAND_ALL, P.sterling, ...CFC_ALL, P.newDay, P.renest1, P.renest2, P.lighthouse, P.daviess],
      },
    ],
  },
  {
    id: "reentry",
    title: "Reentry Programs",
    icon: Compass,
    programs: [
      {
        id: "portal",
        name: "PORTAL New Direction",
        type: "Life Skills",
        credit: "60 days",
        description:
          "Designed to provide information and resources to address the most common reentry needs and barriers — housing, employment, transportation, money management, parenting, and more. PORTAL New Direction certification is required to facilitate.",
        timeFrame:
          "Minimum of 21 hours of group participation plus preparation and presentation of a Reentry/Maintenance plan in front of the group. Consists of 16 modules, facilitated no more than twice per week.",
        admission: [
          "Recommendations based on specific criminogenic needs identified in the KYRAS assessment.",
          "Should be within 36 months prior to release from incarceration.",
        ],
        policies: CORE_POLICIES,
        locations: [
          "All 20 Probation and Parole Districts",
          "BCDC, Brady Center, Brighton Recovery Center, CTS Russell, DC Diersen, Grateful Life Center, Healing Place, Healing Place-Campbellsville, KCI Paducah, Privett Hope Center, BQJ Hope Center, DC Louisville, DC Lexington, DC Owensboro, DC Portland, DC St. Patrick's, DC St. Ann's, Sky Hope, VOA, Liberty Place Recovery Center for Women, MARC, ORR, Center Pointe, Cumberland Hope Community, Trilogy, Genesis, Morehead Inspiration Center, WARM, and Hickory Hill",
        ],
        providers: [P.freshStart, P.genesisReentry, P.communityCounseling, P.christianCounty, P.mccracken, ...LAKE_CUMBERLAND_ALL, P.newVision, P.fuse],
      },
    ],
  },
  {
    id: "sotp",
    title: "Sex Offender Treatment",
    icon: ShieldAlert,
    programs: [
      {
        id: "sotp-c",
        name: "Sex Offender Treatment Program — Community (SOTP-C)",
        type: "Evidence Based",
        credit: "90 days*",
        description:
          "Individual and group counseling for offenders in the community, providing tools sexual offenders can use for controlling sexually assaultive behavior. Offenders are referred and screened for acceptance. *Application of sentence credits is subject to statute governing eligibility of sentence credit for sex offenders.",
        timeFrame: "Typically 24 to 30 months depending on offender needs and progression.",
        admission: ["Statutorily required based on the offender's crime and conviction date."],
        policies: ["CPP 30.1 Program Evaluation and Measurement", "CPP 30.2 Program Credit", "CPP 30.5 Sex Offender Treatment Program", "KRS 197.045"],
        locations: ["Community DOC sites: Louisville, Florence, Morehead, Lexington, Somerset, Pikeville, Hazard, London, and Williamsburg"],
      },
      {
        id: "sotp-p",
        name: "Sex Offender Treatment Program — Private Providers (SOTP-P)",
        type: "Evidence Based",
        credit: "90 days*",
        description:
          "Individual and group counseling by private providers to offenders in the community. 501 KAR 6:220 defines the amount of time it takes to complete SOTP-P. *Application of sentence credits is subject to statute governing eligibility of sentence credit for sex offenders.",
        timeFrame: "Typically 18 to 24 months depending on offender risk level, previous treatment, and needs.",
        admission: ["Statutorily required based on the offender's crime and conviction date."],
        policies: ["CPP 30.1 Program Evaluation and Measurement", "CPP 30.2 Program Credit", "CPP 30.5 Sex Offender Treatment Program", "KRS 197.045"],
        locations: ["Private providers approved by the Sex Offender Risk Assessment Advisory Board, in different locations throughout Kentucky"],
      },
    ],
  },
  {
    id: "addiction",
    title: "Addiction Services",
    icon: HeartPulse,
    programs: [
      {
        id: "rkc-rsc",
        name: "Recovery Kentucky Center (RKC) & Reentry Service Center (RSC) — SAP",
        type: "Substance Abuse",
        credit: "90 days",
        description:
          "RKCs use a peer-driven model incorporating Twelve Step Principles and Recovery Dynamics, broken into 5 phases: Safe off the Streets (SoS), Motivational Track I & II, Phase I, and Phase II/Peer Mentor. Clients participate in alcohol and drug education, community meetings, self-help meetings, a Twelve Step program, and written assignments. Most RSCs use the Therapeutic Community Model — a peer-driven program incorporating Cognitive Behavioral Therapy with evidence-based curriculum. ** denotes the program utilizes the Recovery Model.",
        timeFrame:
          "RKCs: 6 to 18 months overall; DOC only requires completion through Phase I (typically ~7 months). RSCs: typically six months, based on individual progress and participation.",
        admission: [
          "Evidence of a substance use disorder that requires treatment.",
          "Deemed appropriate for this level of care by clinical staff within the Division of Addiction Services.",
          "Medically and psychologically stable (RKC placement only).",
          "Custody status of Level 1 / community (RSC placement only).",
          "Incarcerated: parole upon completion (PUC) of SAP cases are assessed by a Branch Manager or Program Administrator to determine level of care.",
          "Community: court or supervising officer can refer to community Social Service Clinicians (SSC).",
          "While enrolled in SAP a client may enroll in one other evidence-based program; GED attendance does not count against this.",
        ],
        policies: SAP_POLICIES,
        locations: [],
        providersLabel: "Program locations",
        providers: [...RKC_CENTERS, ...RKC_RSC_EXTRA],
      },
      {
        id: "sap-mentor",
        name: "RKC/RSC Mentor (SAP Mentor / Phase II)",
        type: "Substance Abuse",
        credit: "90 days",
        description:
          "Clients who completed Phase I of a Recovery Kentucky program can apply for Phase II/Peer Mentorship. Phase II clients may seek outside employment, pay rent, and complete the 7-and-7 mentoring program. Peer Mentors act as mentors, counselors, and teachers, trained to teach the Recovery Dynamics curriculum (no outside employment during the first 90-day commitment). RSC completers can apply to stay as Peer Mentors, acting as role models and teachers to other phases.",
        timeFrame:
          "Phase II: 1 to 6 months. Peer Mentor commitments are 90-day contracts. DOC requires a full six-month commitment to be eligible for good time. RSC mentorship is typically six months.",
        admission: [
          "Must have completed all previous program requirements and applied for Phase II or peer mentorship.",
          "While enrolled, a client may enroll in one other evidence-based program; GED attendance does not count against this.",
        ],
        policies: SAP_POLICIES,
        locations: [],
        providersLabel: "Program locations",
        providers: RKC_CENTERS,
      },
      {
        id: "sap-doc",
        name: "SAP — DOC Approved Program",
        type: "Substance Abuse",
        credit: "30 / 60 / 90 days",
        description:
          "For clients on misdemeanor supervision, pre-trial diversion, probation, MRS, or parole who complete substance abuse treatment at a DOC Approved Substance Abuse Treatment Provider. Three levels of treatment are eligible: Level II (intensive outpatient/partial hospitalization), Level III (residential clinically managed/medically monitored intensive inpatient), Level IV (medically managed intensive inpatient).",
        timeFrame:
          "Varies; may include treatment at multiple locations for a combined course. Credit by length of treatment (for court-ordered release, at the sentencing Judge's discretion): 28-59 days = 30 days credit · 60-89 days = 60 days credit · 90-180 days = 90 days credit.",
        admission: [
          "Program is a DOC approved substance abuse treatment provider.",
          "Evidence of a substance use disorder that requires treatment.",
          "Deemed appropriate for this level of care by clinical staff within the Division of Addiction Services.",
        ],
        policies: SAP_POLICIES,
        locations: [],
        providersLabel: "DOC-approved community treatment providers",
        providers: SAP_DOC_PROVIDERS,
      },
      {
        id: "sap-voa",
        name: "SAP — VOA Liberty Place at Shelby Campus",
        type: "Substance Abuse",
        credit: "45 days (up to 90)",
        description:
          "Offered to justice-involved males on probation or parole. Delivers the customary six-month curriculum at an accelerated pace using a modified schedule, allowing completion in less time based on individualized clinical progress. A weekly Treatment Team (VOA + DOC Division of Addiction Services) reviews each client's progress. 45 days program good time credit on successful completion in ~45, 60, or 90 days; if the treatment team extends care to a full 180 days, two certificates each valid for 45 days PGTC are issued (90 days total).",
        timeFrame: "Short-term residential; length of stay based on level-of-care criteria and treatment team review.",
        admission: [
          "Substance Use Disorder treatment need; meets clinical and classification criteria for community custody at this level of care.",
          "Meets general criteria for referral to Reentry Service Centers approved for SUD treatment.",
          "Referrals: parolees, probationers, ISC, or HIP (limited), made through the Community SSC specifying \"VOA Only\".",
          "Not equipped for severe mental health issues or severe chronic medical conditions requiring frequent outside appointments; unable to serve sex offenders (women and children housed on the same campus).",
        ],
        policies: SAP_POLICIES,
        locations: ["1436 S. Shelby Street, Louisville, KY 40217 · (502) 635-4530 · voamid.org"],
      },
      {
        id: "sap-outpatient",
        name: "Community SAP — Comprehensive Outpatient Program",
        type: "Substance Abuse",
        credit: "90 days",
        description:
          "Outpatient SUD treatment as an initial entry point or continuum of care, with weekly group treatment through Regional Community Mental Health Centers (CMHC) and, in central Kentucky, the Hope Center. Evidence-based curriculum with random drug screening. Eligible: MRS, probationers, parolees, HIP, pre-trial diversions; ICOTS and misdemeanor offenders upon approval.",
        timeFrame:
          "Three phases, most to least intensive. CMHC (2-hour sessions): Phase 1 — 3×/week for 12 weeks; Phase 2 — 2×/week for 8 weeks; Phase 3 — 1×/week for 4 weeks (≈6 months, 56 sessions/112 hours). Hope Center (3-hour sessions): Phase 1 — 3×/week for 8 weeks; Phase 2 — 2×/week for 5 weeks; Phase 3 — 1×/week for 3 weeks (≈4 months, 37 sessions/111 hours). One restart to the beginning of the current phase is allowed if clinically needed.",
        admission: [
          "Substance use disorder causing multidimensional instability; entry point, step-down, or step-up level of care.",
          "Must be medically and mentally stable to attend group treatment sessions.",
          "Incarcerated PUC cases assessed by Division of Addiction Services; those enrolled in SAP at release can enter with credit for weeks already completed.",
          "Community: court or supervising officer can refer to community Social Service Clinicians (SSC).",
        ],
        policies: SAP_POLICIES,
        locations: [],
        providersLabel: "CMHC and Hope Center locations",
        providers: OUTPATIENT_CMHC,
      },
      {
        id: "samat",
        name: "Community SAMAT (Medication for Addiction Treatment)",
        type: "Substance Abuse",
        credit: "90 days",
        description:
          "Candidates may be referred to a medical provider for evaluation for FDA-approved medication to treat Opioid Use Disorder and/or Alcohol Use Disorder — Naltrexone (Vivitrol), Buprenorphine (Suboxone and Sublocade), or Methadone. SAMAT may prevent overdose, relapse, and recidivism. The goal is a successful transition to a referred level of care using medication, counseling, drug screens, and Narcan education.",
        timeFrame:
          "Participants meet with a community Social Service Clinician and remain in the program approximately six months. Credit requires 6 consecutive months of monthly documented participation and progress in ASAM level of care; continued medication after 6 months earns no additional credit.",
        admission: [
          "Identified Opioid Use Disorder or Alcohol Use Disorder (AUD-only: Vivitrol is the only FDA-approved medication for PGTC).",
          "Voluntary agreement to participate.",
          "On community supervision (parole, MRS, probation, diversion agreement).",
          "Community medical provider supervising medication management and drug screens.",
          "Documentation of one-time Narcan training.",
          "Compliance with all supervision requirements and SSC-referred ASAM level of care.",
        ],
        policies: SAP_POLICIES,
        locations: ["Available at all Probation and Parole locations in Kentucky"],
      },
      {
        id: "share-co",
        name: "SHARE-CO (Supportive Housing for Adaptive Reentry — Co-occurring)",
        type: "Evidence Based",
        credit: "90 days",
        description:
          "Evidence-based program for individuals with co-occurring mental illness and substance use disorder. Combines the Recovery Kentucky peer-driven therapeutic community model with the Living in Balance curriculum; severe-SUD clients may also attend Recovery Dynamics. Licensed mental health professionals provide direct services, onsite counseling, and referrals for outpatient psychiatric care, with smaller therapeutic community groups.",
        timeFrame: "Minimum of six months with options for aftercare services; completion depends on client needs and progress.",
        admission: [
          "Serious Mental Illness plus a history of Substance Use Disorder.",
          "Meets requirements for residential level of care.",
          "Able to participate in a pro-social therapeutic community model.",
          "No history of violence or present suicidal/homicidal ideations.",
          "Stabilized through medication management or other mental health services.",
        ],
        policies: ["CPP 30.6 Division of Addiction Services Substance Abuse Program", "CPP 30.7 Community Substance Abuse Program Good Time Credit", "KRS 197.045", "KRS 439.345"],
        locations: [
          "Jacobs House — 289 W. Loudon Ave., Lexington, KY 40508",
          "Hope Center Ball-Quantrell Jones for Women — (859) 252-2002 — 1524 Versailles Rd., Lexington, KY 40588",
        ],
      },
      {
        id: "share-smi",
        name: "SHARE-SMI (Supportive Housing for Adaptive Reentry — Serious Mental Illness)",
        type: "Evidence Based",
        credit: "90 days",
        description:
          "Evidence-based program for individuals with Serious Mental Illness who may not meet criteria for any Substance Use Disorders. Combines the Recovery Kentucky peer-driven therapeutic community model with the Living in Balance curriculum. Provides referrals for primary health care, job training, vocational support, educational services, and permanent housing, plus Targeted Case Management referrals for ongoing aftercare support.",
        timeFrame: "Minimum of six months with options for aftercare services; completion depends on client needs and progress.",
        admission: [
          "Serious Mental Illness.",
          "Meets requirements for residential level of care.",
          "Able to participate in a pro-social therapeutic community model.",
          "No history of violence or present suicidal/homicidal ideations.",
          "Stabilized through medication management or other mental health services.",
        ],
        policies: ["CPP 30.6 Division of Addiction Services Substance Abuse Program", "CPP 30.7 Community Substance Abuse Program Good Time Credit", "KRS 197.045", "KRS 439.345"],
        locations: [
          "Jacobs House — 289 W. Loudon Ave., Lexington, KY 40508",
          "Hope Center Ball-Quantrell Jones for Women — (859) 252-2002 — 1524 Versailles Rd., Lexington, KY 40588",
        ],
      },
    ],
  },
  {
    id: "education",
    title: "Education & Career Technical",
    icon: GraduationCap,
    programs: [
      {
        id: "ged",
        name: "Adult Education — GED®",
        type: "Education",
        credit: "90 days EGT",
        description:
          "Develops foundational to higher-level knowledge and skills in reading, math, science, social studies, and written expression, preparing students to earn a high school equivalency credential. TABE 11/12 assessments and GED® exams align to College and Career Readiness standards; content is individualized through Individualized Learning Plans (ILP). On completion, give the official transcript to your Probation & Parole Officer or Center Director for submission to DOCEdu.Registrar@ky.gov for the 90-day EGT award.",
        timeFrame: "Varied length of time depending on student needs.",
        admission: ["All inmates without a GED® or a high school diploma are eligible to participate."],
        policies: ["CPP 20.1"],
        locations: ["All KY Adult Education Centers offer GED® classes"],
      },
      {
        id: "hs-diploma",
        name: "High School Diploma / Correspondence Courses",
        type: "Education",
        credit: "90 days EGT (one-time)",
        description:
          "Courses designed to achieve a high school diploma or high school equivalency diploma from an accredited institution as defined by CPP 20.1, including correspondence options. The offender is financially responsible for all coursework. EGT is credited only for a diploma or degree conferred by an accredited institution (CHEA or USDE recognized) per KRS 197.045(1)(a)(2). Submit official transcripts via your Probation & Parole Officer or Center Director to DOCEdu.Registrar@ky.gov.",
        timeFrame: "Varied length of time depending on the educational institution.",
        admission: ["Anyone without a high school diploma or equivalency is eligible to apply."],
        policies: ["CPP 20.1", "CPP 16.2", "KRS 197.045"],
        locations: ["Student choice of accredited educational institution"],
      },
      {
        id: "post-secondary",
        name: "Post-Secondary Education",
        type: "Education",
        credit: "90 days EGT per degree",
        description:
          "College/university classes to earn a diploma or degree. 90 days EGT awarded for a diploma, associate's, bachelor's, master's, or doctoral degree — not for a single class (KRS 197.045(1)(a)(2)). The student pays all tuition and fees not covered by financial aid. Submit official transcripts via your Probation & Parole Officer or Center Director to DOCEdu.Registrar@ky.gov.",
        timeFrame: "Varied length depending on the college/university, field of study, and emphasis areas.",
        admission: ["All offenders with a GED® or high school diploma are eligible to apply; admission criteria set by each institution."],
        policies: ["CPP 20.1"],
        locations: ["Student choice of accredited college/university"],
      },
      {
        id: "cdl",
        name: "Class A Commercial Drivers Permit",
        type: "Education",
        credit: "90 days EGT",
        description:
          "Prepares students to operate a combination tractor-trailer for entry-level positions in the trucking industry, including basic control skills tests and the Rules and Regulations of the Department of Transportation and other regulatory agencies. Content: safe and advanced operating practices, vehicle maintenance, non-vehicle activities, U.S. DOT physical and permit test. Graduates receive a KDOC course transcript and Commercial Drivers Permit.",
        timeFrame: "6 months and 121 working days.",
        admission: [
          "GED® or high school diploma.",
          "TABE 11/12 minimum scores: Reading 501, Math 496.",
          "Successful completion of Materials Management course.",
          "Work Ready Assessment at level 3 (Silver), 4 (Gold), or 5 (Platinum) prior to completion (may be concurrent).",
        ],
        policies: ["CPP 20.1"],
        locations: ["Bluegrass Career Development Center, Richmond, Kentucky"],
      },
      {
        id: "culinary",
        name: "Culinary Arts",
        type: "Education",
        credit: "90 days EGT",
        description:
          "Recognized by the American Culinary Federation Education Foundation. Trainees work toward the ServSafe® Food Protection Manager Certification (ANSI-accredited), learning cooking skills, restaurant management, and institutional programming to earn the 5-year culinary management certification. Requires a minimum passing score of 70% on the ServSafe® exam. Graduates receive a KDOC course transcript and ServSafe® credential.",
        timeFrame: "6 months and 121 working days.",
        admission: [
          "GED® or high school diploma.",
          "TABE 11/12 minimum scores: Reading 501, Math 496.",
          "Work Ready Assessment at level 3 (Silver), 4 (Gold), or 5 (Platinum) prior to completion (may be concurrent).",
        ],
        policies: ["CPP 20.1"],
        locations: ["Bluegrass Career Development Center, Richmond, Kentucky"],
      },
      {
        id: "materials",
        name: "Materials Management",
        type: "Education",
        credit: "90 days EGT",
        description:
          "Guidance and instruction in waste reduction through recycling, introducing Lean Manufacturing tools and principles — team development, process improvement, and waste elimination. Participants earn certifications in OSHA 10 General Industry, Lift Truck Safety, Bobcat Skid-Steer Loading, and Shipping/Receiving and Inventory Control, all in a working manufacturing environment. Graduates receive a KDOC course transcript and Materials Management credential.",
        timeFrame: "6 months and 121 working days.",
        admission: [
          "GED® or high school diploma.",
          "TABE 11/12 minimum scores: Reading 501, Math 496.",
          "Work Ready Assessment at level 3 (Silver), 4 (Gold), or 5 (Platinum) prior to completion (may be concurrent).",
        ],
        policies: ["CPP 20.1"],
        locations: ["Bluegrass Career Development Center, Richmond, Kentucky"],
      },
    ],
  },
];

const TYPE_STYLES: Record<Program["type"], string> = {
  "Evidence Based": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Cognitive Behavioral": "bg-sky-50 text-sky-700 border-sky-200",
  "Life Skills": "bg-amber-50 text-amber-700 border-amber-200",
  "Substance Abuse": "bg-violet-50 text-violet-700 border-violet-200",
  Education: "bg-rose-50 text-rose-700 border-rose-200",
};

function ProviderList({ label, providers }: { label: string; providers: Provider[] }) {
  return (
    <Collapsible>
      <CollapsibleTrigger className="group flex items-center gap-2 text-sm font-semibold text-[#0f172a] hover:text-[#c9a227] transition-colors">
        <MapPin className="w-4 h-4" />
        {label} ({providers.length})
        <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="mt-3 grid sm:grid-cols-2 gap-2">
          {providers.map((p, i) => (
            <li key={i} className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2">
              <p className="text-sm font-medium text-[#0f172a]">{p.name}</p>
              <p className="text-xs text-[#64748b]">
                {p.address}
                {p.phone ? ` · ${p.phone}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

function ProgramDetail({ program }: { program: Program }) {
  return (
    <div className="space-y-5 pt-1 pb-3">
      <p className="text-sm text-[#475569] leading-relaxed">{program.description}</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#e2e8f0] p-4">
          <div className="flex items-center gap-2 mb-1.5 text-[#0f172a]">
            <Clock className="w-4 h-4 text-[#c9a227]" />
            <span className="text-sm font-semibold">Time Frame</span>
          </div>
          <p className="text-sm text-[#64748b]">{program.timeFrame}</p>
        </div>
        <div className="rounded-xl border border-[#e2e8f0] p-4">
          <div className="flex items-center gap-2 mb-1.5 text-[#0f172a]">
            <Award className="w-4 h-4 text-[#c9a227]" />
            <span className="text-sm font-semibold">Program Credit</span>
          </div>
          <p className="text-sm text-[#64748b]">{program.credit} program credit upon completion.</p>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2 text-[#0f172a]">
          <ClipboardCheck className="w-4 h-4 text-[#c9a227]" />
          <span className="text-sm font-semibold">Admission Criteria</span>
        </div>
        <ul className="space-y-1.5">
          {program.admission.map((a, i) => (
            <li key={i} className="text-sm text-[#64748b] border-l-2 border-[#c9a227]/40 pl-3">
              {a}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2 text-[#0f172a]">
          <FileText className="w-4 h-4 text-[#c9a227]" />
          <span className="text-sm font-semibold">Applicable Policies</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {program.policies.map((p, i) => (
            <span key={i} className="text-xs bg-[#f1f5f9] text-[#475569] rounded-full px-2.5 py-1">
              {p}
            </span>
          ))}
        </div>
      </div>

      {program.locations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2 text-[#0f172a]">
            <MapPin className="w-4 h-4 text-[#c9a227]" />
            <span className="text-sm font-semibold">Program Locations</span>
          </div>
          <ul className="space-y-1.5">
            {program.locations.map((l, i) => (
              <li key={i} className="text-sm text-[#64748b]">
                {l}
              </li>
            ))}
          </ul>
        </div>
      )}

      {program.providers && program.providers.length > 0 && (
        <ProviderList
          label={program.providersLabel ?? "Approved community provider locations"}
          providers={program.providers}
        />
      )}
    </div>
  );
}

export default function KyProgramsPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.map((cat) => ({
      ...cat,
      programs: cat.programs.filter((p) => {
        const haystack = [
          p.name,
          p.type,
          p.description,
          p.timeFrame,
          ...p.admission,
          ...p.policies,
          ...p.locations,
          ...(p.providers?.flatMap((pr) => [pr.name, pr.address]) ?? []),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      }),
    })).filter((cat) => cat.programs.length > 0);
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#0f172a] mb-2">KY Program Catalogue</h1>
        <p className="text-[#64748b]">
          Kentucky Department of Corrections — Course Catalogue of Offender Programs and Education (Vol 1, 2024).
          Division of Probation and Parole, Reentry Service Centers, and Recovery Kentucky Centers.
        </p>
      </div>

      <Card className="border-[#e2e8f0] shadow-sm rounded-2xl mb-8">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f8fafc] flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-[#64748b]" />
            </div>
            <div className="space-y-3 text-sm text-[#64748b]">
              <p>
                <span className="font-semibold text-[#0f172a]">Evidence Based</span> — demonstrated by scientific
                research to reliably reduce recidivism. <span className="font-semibold text-[#0f172a]">Promising
                Practice</span> — some research or data showing positive outcomes with clear focus, accountability,
                and evaluation. <span className="font-semibold text-[#0f172a]">Life Skills</span> — strategies to
                remove reintegration barriers (time and money management, technology, communication, social
                skills). <span className="font-semibold text-[#0f172a]">Substance Abuse</span> — evidence-based drug
                treatment for substance use disorder. <span className="font-semibold text-[#0f172a]">Religious
                Programs</span> do not qualify for program credit.
              </p>
              <p>
                Program offerings are updated quarterly and subject to change. Offenders cannot complete the same
                program or course twice unless authorized staff have approved. Programs not listed in the course
                catalogue are not eligible for sentence credit. Faith-based/religious programs shall not receive
                sentence credit.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search programs, providers, cities, or policies (e.g. MRT, Paducah, KRS 197.045)…"
          className="pl-11 h-12 rounded-xl border-[#e2e8f0]"
        />
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[#64748b] py-12">No programs match "{query}".</p>
      )}

      <div className="space-y-8">
        {filtered.map((cat) => (
          <section key={cat.id}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#0f172a] flex items-center justify-center">
                <cat.icon className="w-4.5 h-4.5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#0f172a]">{cat.title}</h2>
              <span className="text-sm text-[#94a3b8]">
                {cat.programs.length} program{cat.programs.length === 1 ? "" : "s"}
              </span>
            </div>
            <Card className="border-[#e2e8f0] shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="px-6 py-2">
                <Accordion type="multiple" className="w-full">
                  {cat.programs.map((program) => (
                    <AccordionItem
                      key={program.id}
                      value={program.id}
                      className="border-b border-[#e2e8f0] last:border-0"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-5">
                        <div className="flex flex-wrap items-center gap-2 pr-2">
                          <span className="text-base font-semibold text-[#0f172a]">{program.name}</span>
                          <Badge variant="outline" className={TYPE_STYLES[program.type]}>
                            {program.type}
                          </Badge>
                          <Badge variant="outline" className="bg-[#f8fafc] text-[#475569] border-[#e2e8f0]">
                            {program.credit}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ProgramDetail program={program} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </section>
        ))}
      </div>

      <p className="text-xs text-[#94a3b8] mt-10 text-center max-w-2xl mx-auto">
        Source: Kentucky Department of Corrections Course Catalogue of Offender Programs and Education, Vol 1
        (2024). MRT© is the product of Correctional Counseling Inc. (CCI); the MEE Journaling Series is the
        product of The Change Companies. Information is updated quarterly by the Department and subject to change.
      </p>
    </div>
  );
}
