import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface ResourceSection {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  items: { label: string; desc: string }[];
}

const RESOURCES: ResourceSection[] = [
  {
    title: "Constitutional Rights",
    icon: "award",
    color: "#1B4F8A",
    items: [
      { label: "1st Amendment", desc: "Religion, speech, petition & access to courts" },
      { label: "4th Amendment", desc: "Reasonable search & seizure (reduced during supervision)" },
      { label: "5th Amendment", desc: "Due process, self-incrimination protection" },
      { label: "8th Amendment", desc: "Protection from cruel & unusual punishment" },
      { label: "14th Amendment", desc: "Equal protection & due process liberty interests" },
    ],
  },
  {
    title: "Federal Law",
    icon: "flag",
    color: "#C9A84C",
    items: [
      { label: "First Step Act (2018)", desc: "Earned Time Credits, PATTERN risk, compassionate release" },
      { label: "18 U.S.C. § 3624(b)", desc: "Good Conduct Time — up to 54 days/year" },
      { label: "18 U.S.C. § 3624(c)", desc: "Pre-release custody: RRC & home confinement placement" },
      { label: "28 C.F.R. § 571", desc: "Compassionate release / reduction in sentence" },
      { label: "42 U.S.C. § 1983", desc: "Civil rights claims against state actors" },
    ],
  },
  {
    title: "Kentucky State Law",
    icon: "map-pin",
    color: "#059669",
    items: [
      { label: "KRS 197.045", desc: "Sentence credit for program completion (90 days)" },
      { label: "KRS 439.345", desc: "Parole eligibility and requirements" },
      { label: "KRS 439.3401", desc: "Violent offender requirements" },
      { label: "CPP 30.1-30.7", desc: "DOC policies governing programs & credit" },
    ],
  },
  {
    title: "BOP Policies",
    icon: "book",
    color: "#7C3AED",
    items: [
      { label: "PS 5100.08", desc: "Security designation & custody classification" },
      { label: "PS 5140.40", desc: "Placement of inmates in RRCs" },
      { label: "PS 5330.11", desc: "RDAP — up to 12 months sentence reduction" },
      { label: "28 C.F.R. § 542", desc: "Administrative Remedy Program (grievances)" },
    ],
  },
  {
    title: "KY DOC Programs",
    icon: "check-circle",
    color: "#DC2626",
    items: [
      { label: "MRT (Moral Reconation Therapy)", desc: "90 days credit — evidence based, 24-36 sessions" },
      { label: "Substance Abuse Program (SAP)", desc: "Evidence based drug treatment for substance use disorder" },
      { label: "PORTAL New Direction", desc: "Reentry program for transitioning to the community" },
      { label: "GED / Adult Education", desc: "Education programs eligible for sentence credit" },
      { label: "Career & Technical", desc: "CDL, Culinary Arts, Materials Management" },
    ],
  },
  {
    title: "Key Case Law",
    icon: "briefcase",
    color: "#0891B2",
    items: [
      { label: "Wolff v. McDonnell (1974)", desc: "Due process rights in disciplinary proceedings" },
      { label: "Greenholtz v. Nebraska (1979)", desc: "Liberty interest in parole" },
      { label: "Sandin v. Conner (1995)", desc: "Atypical/significant hardship standard" },
      { label: "Holt v. Hobbs (2015)", desc: "RLUIPA religious accommodation in prisons" },
      { label: "Wilkinson v. Austin (2005)", desc: "Due process in classification decisions" },
    ],
  },
  {
    title: "Reentry Remedies",
    icon: "tool",
    color: "#EA580C",
    items: [
      { label: "Administrative Remedy", desc: "File BP-8 through BP-11 to exhaust BOP remedies" },
      { label: "Grievance Procedure", desc: "State/RRC grievances — document everything in writing" },
      { label: "Legal Aid / Public Defender", desc: "Contact local legal aid for representation" },
      { label: "2-1-1 Helpline", desc: "Free 24/7 resource referral line for reentry services" },
      { label: "Congressional Inquiry", desc: "Contact U.S. Representative or Senator for BOP issues" },
    ],
  },
];

export default function ResourcesScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [expanded, setExpanded] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 84;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.headerBg,
            paddingTop: topPad + 16,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>
          Legal Resources
        </Text>
        <Text style={[styles.headerSubtitle, { color: "#94A3B8" }]}>
          Quick reference guide
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomPad },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {RESOURCES.map((section) => (
          <View key={section.title} style={styles.sectionWrapper}>
            <TouchableOpacity
              style={[
                styles.sectionHeader,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() =>
                setExpanded(expanded === section.title ? null : section.title)
              }
              activeOpacity={0.7}
              testID={`resource-${section.title}`}
            >
              <View
                style={[
                  styles.sectionIcon,
                  { backgroundColor: section.color + "18" },
                ]}
              >
                <Feather
                  name={section.icon}
                  size={18}
                  color={section.color}
                />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                {section.title}
              </Text>
              <Feather
                name={expanded === section.title ? "chevron-up" : "chevron-down"}
                size={18}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>

            {expanded === section.title && (
              <View
                style={[
                  styles.sectionBody,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                {section.items.map((item, idx) => (
                  <View
                    key={item.label}
                    style={[
                      styles.item,
                      idx < section.items.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.itemDot,
                        { backgroundColor: section.color },
                      ]}
                    />
                    <View style={styles.itemText}>
                      <Text
                        style={[
                          styles.itemLabel,
                          { color: colors.foreground },
                        ]}
                      >
                        {item.label}
                      </Text>
                      <Text
                        style={[
                          styles.itemDesc,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {item.desc}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <View
          style={[
            styles.disclaimer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Feather name="alert-triangle" size={16} color={colors.accent} />
          <Text style={[styles.disclaimerText, { color: colors.mutedForeground }]}>
            This is legal information, not legal advice. Consult a licensed
            attorney for representation in your specific case.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  sectionWrapper: { gap: 0 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  sectionIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  sectionBody: {
    marginTop: 2,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    gap: 12,
  },
  itemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  itemText: { flex: 1 },
  itemLabel: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  itemDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  disclaimer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
});
