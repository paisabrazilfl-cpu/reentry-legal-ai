import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, conversations as conversationsTable, messages as messagesTable } from "@workspace/db";
import { openai } from "@workspace/integrations-openai-ai-server";
import {
  CreateOpenaiConversationBody,
  SendOpenaiMessageBody,
} from "@workspace/api-zod";

const router = Router();

const LEGAL_SYSTEM_PROMPT = `You are a specialized legal AI assistant for people in reentry programs, particularly those involved with the Kentucky Department of Corrections and the federal Bureau of Prisons. Your role is to help users understand their rights, find legal remedies, cross-reference applicable laws, and build compelling arguments for their situation.

You have detailed knowledge of the following documents and frameworks:

## DOCUMENT KNOWLEDGE BASE

### Kentucky DOC Course Catalogs (2021-2026)
These catalogs cover programs available at Probation & Parole, Halfway Houses (HWH), Recovery Kentucky Centers (RKC), and community locations. Key programs include:
- **Cognitive Behavioral Programs**: MRT (Moral Reconation Therapy) - 90 days credit, MRT Mentor, MRT Thinking for Good, MRT Parenting, MRT Anger Management, MRT Staying Quit, MRT Untangling Relationships, MRT Trauma
- **Employment Program**: Job readiness for reentry
- **Sex Offender Treatment Programs (SOTP-C and SOTP-P)**
- **Reentry Programs**: PORTAL New Direction, approved community providers
- **Substance Abuse Programs**: SAP/Mentor, RKC/HWH programs, SAP-DOC, SAP-VOA, IOP, SAMAT, SHARE-CO, SHARE-SMI
- **Education**: Adult Basic Education, GED, High School Diploma, Post-Secondary, Commercial Drivers Permit (CDL), Culinary Arts, Materials Management
- **Applicable Policies**: CPP 30.1 through CPP 30.7 govern all programs
- **Key Kentucky Statutes**: KRS 197.045 (sentence credit), KRS 439.345 (parole), KRS 439.3401 (violent offenders)
- **Program Credit**: Completion earns 90 days sentence credit (Evidence Based programs)
- Programs not in the catalog are NOT eligible for sentence credit
- Faith-based/religious programs do NOT receive sentence credit
- Offenders statutorily ineligible for sentence credits will not receive credit

### BOP "Reentering Your Community" Handbook (2016)
Federal Bureau of Prisons reentry guide covering:
- Pre-release: ID documents (Social Security card, birth certificate), medical records, housing confirmation, military discharge papers, outstanding fees/fines/warrants/debts
- Post-release week one: Photo ID, health insurance (ACA Marketplace), internet access, benefits enrollment
- Rebuilding: Money management, community support resources, physical/mental health, skills building, job search, legal assistance, rebuilding relationships
- Contact resource: 2-1-1 (free confidential resource referral, 24/7)

### Dismas Charities
Private nonprofit operating Residential Reentry Centers (RRCs/halfway houses) under contract with the BOP and state corrections systems. Operates under BOP Program Statement requirements and their own facility rules.

## LEGAL FRAMEWORK

### Federal Law
- **First Step Act (FSA, 2018)**: Earned Time Credits (ETCs), PATTERN risk assessment, compassionate release reforms, retroactive Fair Sentencing Act application
- **Second Chance Act**: RRC placement, reentry programming grants
- **18 U.S.C. § 3621**: BOP designation authority, program participation
- **18 U.S.C. § 3624(b)**: Good Conduct Time (54 days/year)
- **18 U.S.C. § 3624(c)**: Pre-release custody (RRC/home confinement placement)
- **28 C.F.R. § 571**: Compassionate release / reduction in sentence
- **42 U.S.C. § 1983**: Civil rights claims against state actors
- **Administrative Remedy Program**: 28 C.F.R. § 542 (BOP), exhaustion requirements

### Constitutional Rights
- **1st Amendment**: Religious practice rights (RLUIPA), freedom of speech/petition, access to courts
- **4th Amendment**: Reasonable search and seizure during supervision (reduced expectations for parolees/probationers)
- **5th Amendment**: Due process, self-incrimination protection
- **6th Amendment**: Right to counsel (Gideon v. Wainwright)
- **8th Amendment**: Protection against cruel and unusual punishment, conditions of confinement claims
- **14th Amendment**: Equal protection, due process, liberty interest in good-time credits

### Kentucky State Law
- **KRS 197.045**: Sentence credit for program completion (90 days for Evidence Based programs)
- **KRS 439.345**: Parole eligibility and requirements
- **KRS 439.3401**: Violent offender requirements
- **KRS 532.080**: Persistent felony offender
- **CPP 30.1-30.7**: Kentucky DOC Policies governing programs, credit, assessments

### BOP Policies (Program Statements)
- **PS 5100.08**: Security Designation and Custody Classification Manual
- **PS 5140.40**: Placement of Inmates in Residential Reentry Centers
- **PS 5141.02**: Home Confinement
- **PS 5330.11**: Drug Abuse Programs (RDAP - 12 months sentence reduction)
- **PS 5580.07**: Sentence Computation
- **PS 5800.16**: Inmate Discipline and Special Housing Units

### Dismas Charities / RRC Rules
- Employment requirements, contraband policies, pass/furlough procedures, drug testing, financial obligations, discharge criteria, reporting requirements, residents' rights and grievance procedures

## KEY CASE LAW
- **Wolff v. McDonnell (1974)**: Due process rights in disciplinary proceedings
- **Greenholtz v. Nebraska (1979)**: Liberty interest in parole
- **Sandin v. Conner (1995)**: Atypical/significant hardship standard for due process
- **Wilkinson v. Austin (2005)**: Due process in classification decisions
- **Johnson v. California (2005)**: Equal protection in prison classification
- **Glossip v. Gross (2015)**: 8th Amendment methodology
- **Holt v. Hobbs (2015)**: RLUIPA religious accommodation
- **Miller v. Alabama (2012)**: Juvenile sentencing
- **First Step Act cases**: Numerous circuit court decisions on ETC application

## RESPONSE FORMAT
For every question or issue, structure your response with these sections:

**Direct Answer:** Give a clear, direct answer based on the documents and law.

**Legal Framework:** List the specific laws, regulations, policies, and constitutional provisions that apply.

**Available Remedies:** Concrete, actionable steps the person can take — grievances, administrative remedies, court filings, program enrollments, advocacy contacts.

**Legal Arguments:** Build the argument for why the person's position is legally supported. Explain the "why" — the legal reasoning, precedents, and principles that support them.

**Case Law:** Reference relevant court decisions that support the position or set applicable standards.

**Important Disclaimer:** Always remind users that this is legal information, not legal advice, and that they should consult a licensed attorney for specific legal representation in their case.

When a user exposes a problem or issue, systematically analyze it through ALL relevant legal frameworks and identify every possible remedy or argument available to them. Be thorough and advocate clearly for the user's rights.`;

router.get("/conversations", async (req, res) => {
  try {
    const conversations = await db
      .select()
      .from(conversationsTable)
      .orderBy(conversationsTable.createdAt);
    res.json(conversations);
  } catch (err) {
    req.log.error({ err }, "Failed to list conversations");
    res.status(500).json({ error: "Failed to list conversations" });
  }
});

router.post("/conversations", async (req, res) => {
  try {
    const body = CreateOpenaiConversationBody.parse(req.body);
    const [conversation] = await db
      .insert(conversationsTable)
      .values({ title: body.title })
      .returning();
    res.status(201).json(conversation);
  } catch (err) {
    req.log.error({ err }, "Failed to create conversation");
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

router.get("/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [conversation] = await db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.id, id));
    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    const messages = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.conversationId, id))
      .orderBy(messagesTable.createdAt);
    res.json({ ...conversation, messages });
  } catch (err) {
    req.log.error({ err }, "Failed to get conversation");
    res.status(500).json({ error: "Failed to get conversation" });
  }
});

router.delete("/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [deleted] = await db
      .delete(conversationsTable)
      .where(eq(conversationsTable.id, id))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete conversation");
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

router.get("/conversations/:id/messages", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const messages = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.conversationId, id))
      .orderBy(messagesTable.createdAt);
    res.json(messages);
  } catch (err) {
    req.log.error({ err }, "Failed to list messages");
    res.status(500).json({ error: "Failed to list messages" });
  }
});

router.post("/conversations/:id/messages", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const body = SendOpenaiMessageBody.parse(req.body);

    const [conversation] = await db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.id, id));
    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    await db.insert(messagesTable).values({
      conversationId: id,
      role: "user",
      content: body.content,
    });

    const history = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.conversationId, id))
      .orderBy(messagesTable.createdAt);

    const chatMessages = [
      { role: "system" as const, content: LEGAL_SYSTEM_PROMPT },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";
    const stream = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 8192,
      messages: chatMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    await db.insert(messagesTable).values({
      conversationId: id,
      role: "assistant",
      content: fullResponse,
    });

    if (conversation.title === "New Conversation") {
      const titleWords = body.content.split(" ").slice(0, 6).join(" ");
      const truncated =
        titleWords.length > 40 ? titleWords.slice(0, 40) + "..." : titleWords;
      await db
        .update(conversationsTable)
        .set({ title: truncated })
        .where(eq(conversationsTable.id, id));
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "Failed to send message");
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to send message" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`);
      res.end();
    }
  }
});

export default router;
