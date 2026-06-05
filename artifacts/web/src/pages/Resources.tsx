import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Shield, Scale, FileText, Briefcase, Clock, Gavel, MapPin, Landmark } from "lucide-react";

const RESOURCES = [
  {
    id: "1",
    title: "Constitutional Rights",
    icon: Shield,
    items: [
      { label: "1st Amendment", desc: "Religion, speech, petition & access to courts" },
      { label: "4th Amendment", desc: "Reasonable search & seizure (reduced during supervision)" },
      { label: "5th Amendment", desc: "Due process, self-incrimination protection" },
      { label: "8th Amendment", desc: "Protection from cruel & unusual punishment" },
      { label: "14th Amendment", desc: "Equal protection & due process liberty interests" },
    ]
  },
  {
    id: "2",
    title: "Federal Law",
    icon: Scale,
    items: [
      { label: "First Step Act (2018)", desc: "Earned Time Credits, PATTERN risk, compassionate release" },
      { label: "18 U.S.C. § 3624(b)", desc: "Good Conduct Time — up to 54 days/year" },
      { label: "18 U.S.C. § 3624(c)", desc: "Pre-release custody: RRC & home confinement placement" },
      { label: "28 C.F.R. § 571", desc: "Compassionate release / reduction in sentence" },
      { label: "42 U.S.C. § 1983", desc: "Civil rights claims against state actors" },
      { label: "OSHA (29 U.S.C. § 651)", desc: "Workplace safety protections, whistleblower protections, post-release employment safety" },
    ]
  },
  {
    id: "3",
    title: "Kentucky State Law",
    icon: Landmark,
    items: [
      { label: "KRS 197.045", desc: "Sentence credit for program completion (90 days)" },
      { label: "KRS 439.345", desc: "Parole eligibility and requirements" },
      { label: "KRS 439.3401", desc: "Violent offender requirements" },
      { label: "CPP 30.1-30.7", desc: "DOC policies governing programs & credit" },
    ]
  },
  {
    id: "4",
    title: "BOP Policies",
    icon: FileText,
    items: [
      { label: "PS 5100.08", desc: "Security designation & custody classification" },
      { label: "PS 5140.40", desc: "Placement of inmates in RRCs" },
      { label: "PS 5330.11", desc: "RDAP — up to 12 months sentence reduction" },
      { label: "28 C.F.R. § 542", desc: "Administrative Remedy Program (grievances)" },
    ]
  },
  {
    id: "5",
    title: "KY DOC Programs",
    icon: Briefcase,
    items: [
      { label: "MRT (Moral Reconation Therapy)", desc: "90 days credit — evidence based, 24-36 sessions" },
      { label: "Substance Abuse Program (SAP)", desc: "Evidence based drug treatment for substance use disorder" },
      { label: "PORTAL New Direction", desc: "Reentry program for transitioning to the community" },
      { label: "GED / Adult Education", desc: "Education programs eligible for sentence credit" },
      { label: "Career & Technical", desc: "CDL, Culinary Arts, Materials Management" },
    ]
  },
  {
    id: "6",
    title: "Earned Time Credits (ETC)",
    icon: Clock,
    items: [
      { label: "First Step Act (2018)", desc: "Earned Time Credits (ETC) — up to 365 days reduction for eligible inmates" },
      { label: "PATTERN Risk Assessment", desc: "BOP tool determining ETC eligibility (minimum/low risk = eligible)" },
      { label: "ETC Application", desc: "Credits applied toward pre-release custody (RRC/home confinement) or sentence reduction" },
      { label: "Eligible Programs", desc: "Educational, vocational, substance abuse treatment, and reentry programs" },
      { label: "Ineligible Offenses", desc: "Certain violent, sex, terrorism, and deportable offenses may disqualify" },
    ]
  },
  {
    id: "7",
    title: "OSHA / Workplace Safety",
    icon: Gavel,
    items: [
      { label: "29 U.S.C. § 651 (OSHA Act)", desc: "Right to safe workplace, hazard reporting, retaliation protections" },
      { label: "OSHA 11(c)", desc: "Whistleblower protections — 30-day filing deadline for retaliation claims" },
      { label: "Post-Release Employment", desc: "Temporary workers, construction, general industry safety standards" },
      { label: "OSHA Complaint Process", desc: "File complaint online, by phone, or in person; right to inspection" },
      { label: "State OSHA Plans", desc: "22 states operate their own OSHA programs with additional protections" },
    ]
  },
  {
    id: "8",
    title: "50-State Reentry Guide",
    icon: MapPin,
    items: [
      { label: "All 50 States", desc: "Reentry statutes, parole rules, voting rights, and expungement information" },
      { label: "Interactive Search", desc: "Search by state name, code, or statute to find relevant laws" },
      { label: "Visit the Guide", desc: "Navigate to /50-states for the full interactive state-by-state guide" },
    ]
  },
  {
    id: "9",
    title: "Key Case Law",
    icon: Scale,
    items: [
      { label: "Wolff v. McDonnell (1974)", desc: "Due process rights in disciplinary proceedings" },
      { label: "Greenholtz v. Nebraska (1979)", desc: "Liberty interest in parole" },
      { label: "Sandin v. Conner (1995)", desc: "Atypical/significant hardship standard" },
      { label: "Holt v. Hobbs (2015)", desc: "RLUIPA religious accommodation in prisons" },
      { label: "Wilkinson v. Austin (2005)", desc: "Due process in classification decisions" },
    ]
  },
  {
    id: "10",
    title: "Reentry Remedies",
    icon: FileText,
    items: [
      { label: "Administrative Remedy", desc: "File BP-8 through BP-11 to exhaust BOP remedies" },
      { label: "Grievance Procedure", desc: "State/RRC grievances — document everything in writing" },
      { label: "Legal Aid / Public Defender", desc: "Contact local legal aid for representation" },
      { label: "2-1-1 Helpline", desc: "Free 24/7 resource referral line for reentry services" },
      { label: "Congressional Inquiry", desc: "Contact U.S. Representative or Senator for BOP issues" },
    ]
  }
];

export default function ResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[#0f172a] mb-2">Legal Quick Reference</h1>
        <p className="text-[#64748b]">Cross-reference applicable laws, policies, and programs.</p>
      </div>

      <Card className="border-[#e2e8f0] shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {RESOURCES.map((section) => (
              <AccordionItem key={section.id} value={section.id} className="border-b border-[#e2e8f0] last:border-0">
                <AccordionTrigger className="text-base font-semibold text-[#0f172a] hover:text-[#0f172a] hover:no-underline py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f8fafc] flex items-center justify-center">
                      <section.icon className="w-4 h-4 text-[#64748b]" />
                    </div>
                    {section.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pt-2 pb-2">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 border-l-2 border-[#c9a227]/40 pl-4 py-1">
                        <span className="font-semibold text-[#0f172a] text-sm whitespace-nowrap">{item.label}</span>
                        <span className="hidden sm:inline text-[#cbd5e1]">—</span>
                        <span className="text-[#64748b] text-sm">{item.desc}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
