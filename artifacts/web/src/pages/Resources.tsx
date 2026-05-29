import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const RESOURCES = [
  {
    id: "1",
    title: "Constitutional Rights",
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
    items: [
      { label: "First Step Act (2018)", desc: "Earned Time Credits, PATTERN risk, compassionate release" },
      { label: "18 U.S.C. § 3624(b)", desc: "Good Conduct Time — up to 54 days/year" },
      { label: "18 U.S.C. § 3624(c)", desc: "Pre-release custody: RRC & home confinement placement" },
      { label: "28 C.F.R. § 571", desc: "Compassionate release / reduction in sentence" },
      { label: "42 U.S.C. § 1983", desc: "Civil rights claims against state actors" },
    ]
  },
  {
    id: "3",
    title: "Kentucky State Law",
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
    title: "Key Case Law",
    items: [
      { label: "Wolff v. McDonnell (1974)", desc: "Due process rights in disciplinary proceedings" },
      { label: "Greenholtz v. Nebraska (1979)", desc: "Liberty interest in parole" },
      { label: "Sandin v. Conner (1995)", desc: "Atypical/significant hardship standard" },
      { label: "Holt v. Hobbs (2015)", desc: "RLUIPA religious accommodation in prisons" },
      { label: "Wilkinson v. Austin (2005)", desc: "Due process in classification decisions" },
    ]
  },
  {
    id: "7",
    title: "Reentry Remedies",
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
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-xl text-primary">
          <BookOpen className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Legal Quick Reference</h1>
          <p className="text-muted-foreground mt-1">Cross-reference applicable laws and policies.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {RESOURCES.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="text-lg font-serif font-semibold hover:text-primary">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-4 pt-2">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 border-l-2 border-primary/20 pl-4 py-1">
                        <span className="font-semibold text-foreground whitespace-nowrap">{item.label}</span>
                        <span className="hidden sm:inline text-muted-foreground">—</span>
                        <span className="text-muted-foreground">{item.desc}</span>
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
