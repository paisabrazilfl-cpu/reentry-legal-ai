import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MapPin, 
  Search, 
  Gavel, 
  Vote, 
  Briefcase, 
  Home, 
  GraduationCap, 
  FileCheck,
  ShieldCheck,
  Users
} from "lucide-react";

interface StateEntry {
  name: string;
  code: string;
  statutes: string;
  parole: string;
  goodTime: string;
  votingRights: string;
  expungement: string;
  employment: string;
  housing: string;
  programs: string;
  legalAid: string;
}

const ALL_STATES: StateEntry[] = [
  { name: "Alabama", code: "AL", statutes: "Ala. Code \u00a7 15-22-1 through \u00a7 15-22-55", parole: "Alabama Board of Pardons and Paroles", goodTime: "Sentence reduction credits; work credits; educational credits", votingRights: "Felony disenfranchisement; restoration after completion of sentence", expungement: "Limited expungement; Certificate of Rehabilitation; pardons", employment: "Ban the Box (Executive Order); occupational licensing; expungement", housing: "Restrictions on sex offenders; public housing restrictions; local ordinances", programs: "MRT, SAP, GED, vocational training, reentry courts", legalAid: "Alabama State Bar; legal aid societies" },
  { name: "Alaska", code: "AK", statutes: "AS 33.30; AS 33.30.241; AS 33.30.291", parole: "Alaska DOC; discretionary and mandatory parole", goodTime: "Good time; deductions; forfeiture; restoration", votingRights: "Restoration upon completion of sentence; automatic restoration", expungement: "Sealing records; limited expungement; pardons", employment: "State employment; private employment; licensing restrictions", housing: "Transitional housing; supportive housing; homelessness prevention", programs: "Alaska Reentry Coalition; substance abuse treatment; GED programs", legalAid: "Alaska Legal Services Corporation; pro bono services" },
  { name: "Arizona", code: "AZ", statutes: "A.R.S. \u00a7 13-901; A.R.S. \u00a7 31-233", parole: "Arizona Board of Executive Clemency", goodTime: "Earned release credits; work credits; educational credits", votingRights: "Restoration after first felony; two-time felons require court application", expungement: "Set Aside; limited sealing; pardons", employment: "Ban the Box; occupational licensing; expungement", housing: "Transitional housing; sober housing; supportive housing", programs: "Substance abuse; education; vocational training; job readiness", legalAid: "Arizona State Bar; legal aid societies" },
  { name: "Arkansas", code: "AR", statutes: "Ark. Code Ann. \u00a7 16-93-1201", parole: "Arkansas Board of Parole", goodTime: "Earned release credits; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Sealing records; pardons", employment: "Ban the Box; occupational licensing; certificate of employability", housing: "Transitional housing; halfway houses; sex offender restrictions", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Arkansas Bar Association; legal aid societies" },
  { name: "California", code: "CA", statutes: "Cal. Penal Code \u00a7 3000 et seq.; Prop 57, 47, 64", parole: "California Board of Parole Hearings; CDCR", goodTime: "Milestone credits; rehabilitative achievement credits; good conduct credits", votingRights: "Restoration upon completion of sentence; automatic", expungement: "Penal Code 1203.4; record sealing; certificates of rehabilitation; pardons", employment: "Ban the Box; occupational licensing; record clearing; expungement", housing: "Transitional housing; sober housing; supportive housing; emergency shelters", programs: "Realignment (AB 109); reentry programs; education; vocational training", legalAid: "Public defender; legal aid; law school clinics; pro bono" },
  { name: "Colorado", code: "CO", statutes: "C.R.S. \u00a7 17-22.5-101", parole: "Colorado Board of Parole", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration upon completion of sentence; automatic", expungement: "Sealing records; pardons; record clearing", employment: "Ban the Box; occupational licensing; certificate of employability", housing: "Transitional housing; supportive housing; homeless assistance", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Colorado Bar Association; legal aid societies" },
  { name: "Connecticut", code: "CT", statutes: "Conn. Gen. Stat. \u00a7 18-100 et seq.", parole: "Connecticut Board of Pardons and Paroles", goodTime: "Risk reduction credits; earned credits; program credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Absolute pardon; conditional pardon; record sealing", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Connecticut Bar Association; legal aid societies" },
  { name: "Delaware", code: "DE", statutes: "11 Del. Code \u00a7 4321", parole: "Delaware Board of Parole", goodTime: "Good conduct time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; pardons; expungement", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Delaware State Bar; legal aid societies" },
  { name: "Florida", code: "FL", statutes: "Fla. Stat. \u00a7 947.01", parole: "Florida Commission on Offender Review", goodTime: "Gain time; incentive gain time; meritorious time", votingRights: "Restoration of civil rights; clemency; automatic for some felonies", expungement: "Sealing records; expungement; clemency; pardons", employment: "Ban the Box (some counties); occupational licensing; restoration of civil rights", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Florida State Bar; legal aid societies" },
  { name: "Georgia", code: "GA", statutes: "O.C.G.A. \u00a7 42-9-1", parole: "Georgia Board of Pardons and Paroles", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record restriction; pardons; record sealing", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Georgia State Bar; legal aid societies" },
  { name: "Hawaii", code: "HI", statutes: "HRS \u00a7 353-61", parole: "Hawaii Paroling Authority", goodTime: "Good time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Expungement; pardons; record sealing", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Hawaii State Bar; legal aid societies" },
  { name: "Idaho", code: "ID", statutes: "Idaho Code \u00a7 20-101", parole: "Idaho Commission of Pardons and Parole", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; pardons; expungement", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Idaho State Bar; legal aid societies" },
  { name: "Illinois", code: "IL", statutes: "730 ILCS 5/3-3-1", parole: "Prisoner Review Board", goodTime: "Sentence credit; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Sealing records; expungement; pardons; certificates of employability", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Public defender; legal aid; law school clinics; pro bono" },
  { name: "Indiana", code: "IN", statutes: "IC \u00a7 11-8-1-1", parole: "Indiana Parole Board", goodTime: "Earned credit; good time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; pardons", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Indiana State Bar; legal aid societies" },
  { name: "Iowa", code: "IA", statutes: "Iowa Code \u00a7 906.1", parole: "Iowa Board of Parole", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; pardons; expungement", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Iowa State Bar; legal aid societies" },
  { name: "Kansas", code: "KS", statutes: "K.S.A. \u00a7 75-5201", parole: "Kansas Prisoner Review Board", goodTime: "Good time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; pardons", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Kansas State Bar; legal aid societies" },
  { name: "Kentucky", code: "KY", statutes: "KRS 197.045; KRS 439.345; KRS 439.3401; KRS 532.080", parole: "Kentucky Parole Board", goodTime: "Sentence credit; program credit; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; pardons", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "MRT, SAP, PORTAL, GED, Career & Technical; CPP 30.1-30.7", legalAid: "Kentucky State Bar; legal aid societies" },
  { name: "Louisiana", code: "LA", statutes: "La. Rev. Stat. \u00a7 15:574.1", parole: "Louisiana Board of Pardons and Committee on Parole", goodTime: "Good time; meritorious time; educational credits; trusty time", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; first offender pardon", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Louisiana State Bar; legal aid societies" },
  { name: "Maine", code: "ME", statutes: "15-A M.R.S. \u00a7 2301", parole: "Maine Parole Board", goodTime: "Good time; meritorious time; educational credits", votingRights: "Never disenfranchised; voting while incarcerated", expungement: "Record sealing; pardons; expungement", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Maine State Bar; legal aid societies" },
  { name: "Maryland", code: "MD", statutes: "Md. Code, Corr. Servs. \u00a7 7-301", parole: "Maryland Parole Commission", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; pardons; shielding", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Maryland State Bar; legal aid societies" },
  { name: "Massachusetts", code: "MA", statutes: "MGL c.127, \u00a7 1", parole: "Massachusetts Parole Board", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; pardons", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Massachusetts State Bar; legal aid societies" },
  { name: "Michigan", code: "MI", statutes: "MCL \u00a7 791.201", parole: "Michigan Parole Board", goodTime: "Earned time; meritorious time; educational credits; disciplinary credit", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; Clean Slate; automatic expungement", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Michigan State Bar; legal aid societies" },
  { name: "Minnesota", code: "MN", statutes: "Minn. Stat. \u00a7 244.01", parole: "Minnesota Board of Pardons", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; pardons", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Minnesota State Bar; legal aid societies" },
  { name: "Mississippi", code: "MS", statutes: "Miss. Code Ann. \u00a7 47-7-1", parole: "Mississippi Parole Board", goodTime: "Earned time; meritorious time; educational credits; trusty time", votingRights: "Disenfranchisement for some felonies; restoration after completion of sentence; clemency", expungement: "Record sealing; expungement; pardons", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Mississippi State Bar; legal aid societies" },
  { name: "Missouri", code: "MO", statutes: "RSMo \u00a7 217.010", parole: "Missouri Board of Probation and Parole", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; pardons", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Missouri State Bar; legal aid societies" },
  { name: "Montana", code: "MT", statutes: "MCA \u00a7 46-23-101", parole: "Montana Board of Pardons and Parole", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; pardons", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Montana State Bar; legal aid societies" },
  { name: "Nebraska", code: "NE", statutes: "Neb. Rev. Stat. \u00a7 83-1,100", parole: "Nebraska Board of Parole", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; pardons; set aside", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Nebraska State Bar; legal aid societies" },
  { name: "Nevada", code: "NV", statutes: "NRS \u00a7 213.010", parole: "Nevada Board of Parole Commissioners", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; pardons; expungement", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Nevada State Bar; legal aid societies" },
  { name: "New Hampshire", code: "NH", statutes: "RSA 651-A:1", parole: "New Hampshire Adult Parole Board", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Annulment; record sealing; pardons", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "New Hampshire State Bar; legal aid societies" },
  { name: "New Jersey", code: "NJ", statutes: "N.J.S.A. 30:4-123.1", parole: "New Jersey State Parole Board", goodTime: "Earned time; meritorious time; educational credits; commutation credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; clean slate; pardons", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "New Jersey State Bar; legal aid societies" },
  { name: "New Mexico", code: "NM", statutes: "NMSA 1978, \u00a7 31-21-10", parole: "New Mexico Parole Board", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; pardons", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "New Mexico State Bar; legal aid societies" },
  { name: "New York", code: "NY", statutes: "N.Y. Correct. Law \u00a7 1; N.Y. Penal Law \u00a7 60.01; N.Y. Exec. Law \u00a7 259", parole: "New York State Board of Parole; DOCCS", goodTime: "Merit time; good time; educational credits; work release", votingRights: "Restoration after completion of sentence; automatic; voting while on parole/probation", expungement: "Record sealing; certificate of good conduct; certificate of relief from disabilities; pardons", employment: "Ban the Box; occupational licensing; certificates of employability; restoration of licenses", housing: "Transitional housing; supportive housing; emergency shelters; homeless shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Public defender; legal aid; law school clinics; pro bono; reentry legal services" },
  { name: "North Carolina", code: "NC", statutes: "N.C. Gen. Stat. \u00a7 15A-1341; N.C. Gen. Stat. \u00a7 15A-1371", parole: "North Carolina Post-Release Supervision and Parole Commission", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; certificates of relief; pardons", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "North Carolina State Bar; legal aid societies" },
  { name: "North Dakota", code: "ND", statutes: "N.D. Cent. Code \u00a7 12-59.1-01", parole: "North Dakota Parole Board", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; pardons; expungement", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "North Dakota State Bar; legal aid societies" },
  { name: "Ohio", code: "OH", statutes: "Ohio Rev. Code \u00a7 2967.01", parole: "Ohio Adult Parole Authority", goodTime: "Earned time; meritorious time; educational credits; reintegration credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; certificates of qualification for employment; pardons", employment: "Ban the Box; occupational licensing; certificates of employability; record sealing", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Ohio State Bar; legal aid societies" },
  { name: "Oklahoma", code: "OK", statutes: "Okla. Stat. tit. 57, \u00a7 1", parole: "Oklahoma Pardon and Parole Board", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; pardons; commutations", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Oklahoma State Bar; legal aid societies" },
  { name: "Oregon", code: "OR", statutes: "ORS \u00a7 144.010", parole: "Oregon Board of Parole and Post-Prison Supervision", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; pardons; set aside", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Oregon State Bar; legal aid societies" },
  { name: "Pennsylvania", code: "PA", statutes: "61 Pa. C.S. \u00a7 6101", parole: "Pennsylvania Board of Probation and Parole", goodTime: "Earned time; meritorious time; educational credits; reentry credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; limited access; pardons; Clean Slate", employment: "Ban the Box; occupational licensing; certificates of employability; pardons board", housing: "Transitional housing; supportive housing; emergency shelters; sober houses", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Pennsylvania State Bar; legal aid societies" },
  { name: "Rhode Island", code: "RI", statutes: "R.I. Gen. Laws \u00a7 13-8-1", parole: "Rhode Island Parole Board", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; pardons", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Rhode Island State Bar; legal aid societies" },
  { name: "South Carolina", code: "SC", statutes: "S.C. Code \u00a7 24-21-10", parole: "South Carolina Department of Probation, Parole and Pardon Services", goodTime: "Earned time; meritorious time; educational credits; work credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; pardons; youthful offender", employment: "Ban the Box; occupational licensing; certificates of employability; pardons", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "South Carolina State Bar; legal aid societies" },
  { name: "South Dakota", code: "SD", statutes: "S.D. Codified Laws \u00a7 24-14-1", parole: "South Dakota Board of Pardons and Paroles", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; pardons; expungement", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "South Dakota State Bar; legal aid societies" },
  { name: "Tennessee", code: "TN", statutes: "Tenn. Code Ann. \u00a7 40-28-101", parole: "Tennessee Board of Parole", goodTime: "Earned time; meritorious time; educational credits; trusty time", votingRights: "Restoration after completion of sentence; automatic; payment of restitution", expungement: "Record sealing; expungement; pardons; certificate of employability", employment: "Ban the Box; occupational licensing; certificates of employability; expungement", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Tennessee State Bar; legal aid societies" },
  { name: "Texas", code: "TX", statutes: "Tex. Gov. Code \u00a7 508.001", parole: "Texas Board of Pardons and Paroles", goodTime: "Earned time; good conduct time; meritorious time; educational credits; trusty time", votingRights: "Restoration after completion of sentence; automatic", expungement: "Expunction; nondisclosure; orders of nondisclosure; pardons; commutations", employment: "Ban the Box; occupational licensing; certificates of employability; restoration of licenses", housing: "Transitional housing; supportive housing; emergency shelters; halfway houses", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Texas State Bar; legal aid societies" },
  { name: "Utah", code: "UT", statutes: "Utah Code \u00a7 76-3-201", parole: "Utah Board of Pardons and Parole", goodTime: "Earned time; meritorious time; educational credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; expungement; pardons; certificates of rehabilitation", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Utah State Bar; legal aid societies" },
  { name: "Vermont", code: "VT", statutes: "13 V.S.A. \u00a7 5301", parole: "Vermont Parole Board", goodTime: "Earned time; meritorious time; educational credits; disciplinary credits", votingRights: "Never disenfranchised; voting while incarcerated", expungement: "Record sealing; expungement; pardons; diversion", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Vermont State Bar; legal aid societies" },
  { name: "Virginia", code: "VA", statutes: "Va. Code \u00a7 53.1-1", parole: "Virginia Parole Board", goodTime: "Earned sentence credits; good conduct credits; educational credits; work credits", votingRights: "Restoration after completion of sentence; automatic; governor's clemency for some", expungement: "Record sealing; expungement; pardons; simple marijuana possession", employment: "Ban the Box; occupational licensing; certificates of employability; restoration of licenses", housing: "Transitional housing; supportive housing; emergency shelters; housing vouchers", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Virginia State Bar; legal aid societies" },
  { name: "Washington", code: "WA", statutes: "RCW 9.95.010", parole: "Washington State Indeterminate Sentence Review Board", goodTime: "Earned time; meritorious time; educational credits; work credits; educational release", votingRights: "Restoration after completion of sentence; automatic; voting while incarcerated for some", expungement: "Record sealing; vacating conviction; pardons; certificates of discharge", employment: "Ban the Box; occupational licensing; certificates of employability; restoration of licenses", housing: "Transitional housing; supportive housing; emergency shelters; rapid rehousing", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Washington State Bar; legal aid societies" },
  { name: "West Virginia", code: "WV", statutes: "W. Va. Code \u00a7 62-12-1; W. Va. Code \u00a7 62-12-13", parole: "West Virginia Parole Board", goodTime: "Earned time; meritorious time; educational credits; work credits", votingRights: "Restoration after completion of sentence; automatic; petition for restoration", expungement: "Record sealing; expungement; pardons; certificates of rehabilitation", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "West Virginia State Bar; legal aid societies" },
  { name: "Wisconsin", code: "WI", statutes: "Wis. Stat. \u00a7 302.11", parole: "Wisconsin Division of Hearings and Appeals", goodTime: "Earned time; meritorious time; educational credits; positive adjustment time", votingRights: "Restoration after completion of sentence; automatic; voting while incarcerated for some", expungement: "Expungement; pardons; record sealing; certificate of rehabilitation", employment: "Ban the Box; occupational licensing; certificates of employability; restoration of licenses", housing: "Transitional housing; supportive housing; emergency shelters; halfway houses", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Wisconsin State Bar; legal aid societies" },
  { name: "Wyoming", code: "WY", statutes: "Wyo. Stat. \u00a7 7-13-401", parole: "Wyoming Board of Parole", goodTime: "Earned time; meritorious time; educational credits; work credits", votingRights: "Restoration after completion of sentence; automatic", expungement: "Record sealing; pardons; expungement; certificates of employability", employment: "Ban the Box; occupational licensing; certificates of employability", housing: "Transitional housing; supportive housing; emergency shelters", programs: "Reentry programs; substance abuse; education; vocational training", legalAid: "Wyoming State Bar; legal aid societies" },
];

const SECTION_ICONS = {
  statutes: Gavel,
  parole: Users,
  goodTime: FileCheck,
  votingRights: Vote,
  expungement: ShieldCheck,
  employment: Briefcase,
  housing: Home,
  programs: GraduationCap,
  legalAid: MapPin,
};

const SECTION_LABELS: Record<string, string> = {
  statutes: "Key Statutes",
  parole: "Parole / Probation",
  goodTime: "Good Time / Earned Credits",
  votingRights: "Voting Rights",
  expungement: "Expungement / Sealing",
  employment: "Employment / Licensing",
  housing: "Housing Restrictions",
  programs: "Key Programs",
  legalAid: "Legal Aid Resources",
};

export default function StateGuidePage() {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<StateEntry | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return ALL_STATES;
    const q = search.toLowerCase();
    return ALL_STATES.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.statutes.toLowerCase().includes(q) ||
      s.parole.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">
          50 State Reentry Guide
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Reentry statutes, parole rules, voting rights, and expungement information for every state.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by state name, code, or statute..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Count badge */}
      <div className="text-center">
        <Badge variant="secondary" className="text-sm">
          {filtered.length} of {ALL_STATES.length} states
        </Badge>
      </div>

      {/* State Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((state) => (
          <Card
            key={state.code}
            className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-md group"
            onClick={() => setSelectedState(state)}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm group-hover:bg-primary/20 transition-colors">
                    {state.code}
                  </div>
                  <div>
                    <CardTitle className="text-base">{state.name}</CardTitle>
                    <p className="text-xs text-muted-foreground line-clamp-1">{state.statutes}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">{state.votingRights.split(";")[0].trim()}</Badge>
                <Badge variant="outline" className="text-xs">{state.expungement.split(";")[0].trim()}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* State Detail Modal */}
      {selectedState && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedState(null)}
        >
          <div
            className="bg-background rounded-xl border shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {selectedState.code}
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold">{selectedState.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedState.statutes}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedState(null)}
                className="text-muted-foreground hover:text-foreground text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {(
                  [
                    "statutes",
                    "parole",
                    "goodTime",
                    "votingRights",
                    "expungement",
                    "employment",
                    "housing",
                    "programs",
                    "legalAid",
                  ] as const
                ).map((key) => {
                  const Icon = SECTION_ICONS[key];
                  const label = SECTION_LABELS[key];
                  const value = selectedState[key];
                  return (
                    <div key={key} className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-foreground mb-1">{label}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-muted/30 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                This is legal information, not legal advice. Consult a licensed attorney for specific guidance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
