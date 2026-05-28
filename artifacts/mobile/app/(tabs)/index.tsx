import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useCreateConversation } from "@/hooks/useConversations";

const QUICK_PROMPTS = [
  {
    icon: "shield" as const,
    title: "Rights Violation",
    text: "I believe my constitutional rights are being violated. What can I do?",
  },
  {
    icon: "book-open" as const,
    title: "Program Credit",
    text: "How do I get sentence credit for completing programs in Kentucky DOC?",
  },
  {
    icon: "home" as const,
    title: "Halfway House",
    text: "What are my rights at a residential reentry center / halfway house?",
  },
  {
    icon: "file-text" as const,
    title: "Expose an Issue",
    text: "I want to describe a situation and get a full legal analysis of my options.",
  },
];

export default function AskScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [input, setInput] = useState("");
  const createConversation = useCreateConversation();

  const handleStart = async (text: string) => {
    if (!text.trim()) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const words = text.trim().split(" ").slice(0, 6).join(" ");
      const title = words.length > 0 ? words : "New Conversation";
      const conv = await createConversation.mutateAsync({ title });
      router.push({ pathname: "/chat/[id]", params: { id: conv.id, initialMessage: text.trim() } });
    } catch {
    }
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

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
        <View style={styles.headerBadge}>
          <Feather name="feather" size={14} color={colors.accent} />
          <Text style={[styles.headerBadgeText, { color: colors.accent }]}>
            Legal AI
          </Text>
        </View>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>
          Know Your Rights
        </Text>
        <Text style={[styles.headerSubtitle, { color: "#94A3B8" }]}>
          Ask about laws, programs, and remedies
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPad + 120 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          QUICK START
        </Text>

        {QUICK_PROMPTS.map((prompt) => (
          <TouchableOpacity
            key={prompt.title}
            style={[
              styles.promptCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => handleStart(prompt.text)}
            activeOpacity={0.7}
            testID={`quick-prompt-${prompt.title}`}
          >
            <View
              style={[
                styles.promptIcon,
                { backgroundColor: isDark ? colors.secondary : "#EEF2F8" },
              ]}
            >
              <Feather name={prompt.icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.promptTextContainer}>
              <Text
                style={[styles.promptTitle, { color: colors.foreground }]}
              >
                {prompt.title}
              </Text>
              <Text
                style={[
                  styles.promptSubtext,
                  { color: colors.mutedForeground },
                ]}
                numberOfLines={2}
              >
                {prompt.text}
              </Text>
            </View>
            <Feather
              name="chevron-right"
              size={18}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>
        ))}

        <View
          style={[
            styles.legalBanner,
            {
              backgroundColor: isDark ? "#1E3050" : "#EEF2F8",
              borderColor: isDark ? "#2D4A6E" : "#C7D7E9",
            },
          ]}
        >
          <Feather name="info" size={14} color={colors.primary} />
          <Text
            style={[styles.legalBannerText, { color: colors.mutedForeground }]}
          >
            Cross-references federal law, constitutional rights, KY state law,
            BOP policies, case law, and Dismas Charities rules.
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.inputBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 12,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface ?? colors.secondary,
              color: colors.foreground,
              borderColor: colors.border,
            },
          ]}
          placeholder="Describe your situation or ask a question..."
          placeholderTextColor={colors.mutedForeground}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={2000}
          testID="ask-input"
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            {
              backgroundColor:
                input.trim() && !createConversation.isPending
                  ? colors.primary
                  : colors.muted,
            },
          ]}
          onPress={() => handleStart(input)}
          disabled={!input.trim() || createConversation.isPending}
          testID="send-button"
        >
          {createConversation.isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Feather name="send" size={18} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  headerBadgeText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.2,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  promptCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 14,
  },
  promptIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  promptTextContainer: { flex: 1 },
  promptTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 3,
  },
  promptSubtext: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  legalBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 6,
  },
  legalBannerText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    maxHeight: 100,
    minHeight: 44,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
