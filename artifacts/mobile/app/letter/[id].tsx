import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Share,
  useColorScheme,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { fetch } from "expo/fetch";
import { useColors } from "@/hooks/useColors";
import { useConversation } from "@/hooks/useConversations";

type LetterState = "idle" | "generating" | "done" | "error";

export default function LetterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const convId = parseInt(id ?? "0");
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { data: conversation } = useConversation(convId);

  const [letterText, setLetterText] = useState("");
  const [letterState, setLetterState] = useState<LetterState>("idle");
  const [copied, setCopied] = useState(false);
  const [reinforceCount, setReinforceCount] = useState(0);
  const draftRef = useRef("");

  const generate = useCallback(
    async (reinforce = false) => {
      setLetterState("generating");
      if (!reinforce) {
        setLetterText("");
        draftRef.current = "";
      }
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      try {
        const baseUrl = process.env.EXPO_PUBLIC_DOMAIN
          ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
          : "";

        const body: Record<string, unknown> = { reinforce };
        if (reinforce && draftRef.current) {
          body.existingDraft = draftRef.current;
        }

        const resp = await fetch(
          `${baseUrl}/api/openai/conversations/${convId}/draft-letter`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );

        const reader = resp.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let buffer = "";
        let accumulated = reinforce ? "" : "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const json = JSON.parse(line.slice(6));
                if (json.content) {
                  accumulated += json.content;
                  setLetterText(accumulated);
                }
                if (json.done) {
                  draftRef.current = accumulated;
                  setLetterState("done");
                }
              } catch {}
            }
          }
        }
      } catch {
        setLetterState("error");
      }
    },
    [convId]
  );

  useEffect(() => {
    generate(false);
  }, []);

  const handleReinforce = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setReinforceCount((c) => c + 1);
    await generate(true);
  }, [generate]);

  const handleCopy = useCallback(async () => {
    if (!letterText) return;
    if (Platform.OS === "web") {
      await navigator.clipboard.writeText(letterText).catch(() => {});
    } else {
      await Share.share({ message: letterText });
      return;
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [letterText]);

  const handleShare = useCallback(async () => {
    if (!letterText) return;
    await Share.share({
      message: letterText,
      title: `Legal Demand Letter — ${conversation?.title ?? "Case"}`,
    });
  }, [letterText, conversation]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const isGenerating = letterState === "generating";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.headerBg, paddingTop: topPad + 10 },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="arrow-left" size={22} color={colors.headerText} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text
            style={[styles.headerTitle, { color: colors.headerText }]}
            numberOfLines={1}
          >
            Legal Demand Letter
          </Text>
          {reinforceCount > 0 && (
            <View style={[styles.reinforceBadge, { backgroundColor: colors.accent }]}>
              <Text style={styles.reinforceBadgeText}>
                ⚡ Reinforced ×{reinforceCount}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Letter content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPad + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Status banner */}
        {isGenerating && letterText === "" && (
          <View
            style={[
              styles.loadingBanner,
              {
                backgroundColor: isDark ? "#1E3050" : "#EEF2F8",
                borderColor: isDark ? "#2D4A6E" : "#C7D7E9",
              },
            ]}
          >
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
              {reinforceCount > 0
                ? "Reinforcing letter — escalating legal pressure..."
                : "Drafting your formal demand letter..."}
            </Text>
          </View>
        )}

        {letterText !== "" && (
          <View
            style={[
              styles.letterCard,
              {
                backgroundColor: colors.card,
                borderColor: isDark ? colors.border : "#D4C4A0",
                shadowColor: "#000",
              },
            ]}
          >
            {/* Letterhead accent */}
            <View
              style={[styles.letterheadBar, { backgroundColor: colors.headerBg }]}
            />
            <Text
              style={[
                styles.letterText,
                {
                  color: colors.foreground,
                },
              ]}
              selectable
            >
              {letterText}
              {isGenerating && (
                <Text style={{ color: colors.primary }}>▋</Text>
              )}
            </Text>
          </View>
        )}

        {letterState === "error" && (
          <View
            style={[
              styles.errorBanner,
              { backgroundColor: "#FEF2F2", borderColor: "#FECACA" },
            ]}
          >
            <Feather name="alert-circle" size={16} color="#DC2626" />
            <Text style={[styles.errorText, { color: "#DC2626" }]}>
              Failed to generate letter. Tap retry below.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Action bar */}
      <View
        style={[
          styles.actionBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: Platform.OS === "web" ? bottomPad + 34 : bottomPad + 12,
          },
        ]}
      >
        {/* Reinforce button — primary CTA */}
        <TouchableOpacity
          style={[
            styles.reinforceBtn,
            {
              backgroundColor:
                isGenerating || letterText === ""
                  ? colors.muted
                  : colors.accent,
              opacity: isGenerating || letterText === "" ? 0.6 : 1,
            },
          ]}
          onPress={handleReinforce}
          disabled={isGenerating || letterText === ""}
          testID="reinforce-button"
        >
          <Feather name="zap" size={18} color="#fff" />
          <Text style={styles.reinforceBtnText}>
            {isGenerating ? "Generating..." : "Reinforce Letter"}
          </Text>
        </TouchableOpacity>

        {/* Secondary actions */}
        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={[
              styles.secondaryBtn,
              {
                backgroundColor: colors.secondary,
                borderColor: colors.border,
                opacity: letterText === "" ? 0.4 : 1,
              },
            ]}
            onPress={handleCopy}
            disabled={letterText === ""}
            testID="copy-button"
          >
            <Feather
              name={copied ? "check" : "copy"}
              size={16}
              color={copied ? "#059669" : colors.foreground}
            />
            <Text
              style={[
                styles.secondaryBtnText,
                { color: copied ? "#059669" : colors.foreground },
              ]}
            >
              {copied ? "Copied!" : "Copy"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryBtn,
              {
                backgroundColor: colors.secondary,
                borderColor: colors.border,
                opacity: letterText === "" ? 0.4 : 1,
              },
            ]}
            onPress={handleShare}
            disabled={letterText === ""}
            testID="share-button"
          >
            <Feather name="share-2" size={16} color={colors.foreground} />
            <Text style={[styles.secondaryBtnText, { color: colors.foreground }]}>
              Share
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryBtn,
              { backgroundColor: colors.secondary, borderColor: colors.border },
            ]}
            onPress={() => generate(false)}
            disabled={isGenerating}
            testID="regenerate-button"
          >
            <Feather name="refresh-cw" size={16} color={colors.foreground} />
            <Text style={[styles.secondaryBtnText, { color: colors.foreground }]}>
              Redo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 12,
  },
  backBtn: { width: 36, alignItems: "center" },
  headerCenter: { flex: 1, alignItems: "center", gap: 4 },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  reinforceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  reinforceBadgeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  headerRight: { width: 36 },

  scroll: { flex: 1 },
  scrollContent: {
    padding: 16,
    gap: 12,
  },

  loadingBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  loadingText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },

  letterCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  letterheadBar: {
    height: 5,
  },
  letterText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    padding: 20,
    letterSpacing: 0.1,
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },

  actionBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  reinforceBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  reinforceBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 8,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
});
