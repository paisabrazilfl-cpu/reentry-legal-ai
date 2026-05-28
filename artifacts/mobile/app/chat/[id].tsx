import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  useColorScheme,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { fetch } from "expo/fetch";
import { useColors } from "@/hooks/useColors";
import { useConversation, useConversationMessages } from "@/hooks/useConversations";
import { useQueryClient } from "@tanstack/react-query";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

export default function ChatScreen() {
  const { id, initialMessage } = useLocalSearchParams<{ id: string; initialMessage?: string }>();
  const convId = parseInt(id ?? "0");
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const queryClient = useQueryClient();

  const { data: conversation } = useConversation(convId);
  const { data: serverMessages } = useConversationMessages(convId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const initialSent = useRef(false);
  const streamingIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (serverMessages && serverMessages.length > 0) {
      const mapped: Message[] = serverMessages.map((m) => ({
        id: String(m.id),
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
      setMessages(mapped);
    }
  }, [serverMessages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || streaming) return;
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const userMsgId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const aiMsgId = Date.now().toString() + Math.random().toString(36).substr(2, 9) + "ai";
      streamingIdRef.current = aiMsgId;

      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", content: text },
        { id: aiMsgId, role: "assistant", content: "", streaming: true },
      ]);
      setInput("");
      setStreaming(true);

      try {
        const baseUrl = process.env.EXPO_PUBLIC_DOMAIN
          ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
          : "";
        const resp = await fetch(
          `${baseUrl}/api/openai/conversations/${convId}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: text }),
          }
        );

        const reader = resp.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let buffer = "";
        let accumulated = "";

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
                  const captured = accumulated;
                  const capturedId = aiMsgId;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === capturedId
                        ? { ...m, content: captured, streaming: true }
                        : m
                    )
                  );
                }
                if (json.done) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === aiMsgId ? { ...m, streaming: false } : m
                    )
                  );
                }
              } catch {}
            }
          }
        }
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? { ...m, content: "Sorry, something went wrong. Please try again.", streaming: false }
              : m
          )
        );
      } finally {
        setStreaming(false);
        streamingIdRef.current = null;
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
        queryClient.invalidateQueries({ queryKey: ["conversation", convId] });
      }
    },
    [streaming, convId, queryClient]
  );

  useEffect(() => {
    if (initialMessage && !initialSent.current && !streaming) {
      initialSent.current = true;
      setTimeout(() => sendMessage(initialMessage), 400);
    }
  }, [initialMessage, sendMessage, streaming]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => {
      const isUser = item.role === "user";
      return (
        <View
          style={[
            styles.msgRow,
            isUser ? styles.msgRowUser : styles.msgRowAI,
          ]}
        >
          {!isUser && (
            <View
              style={[
                styles.aiAvatar,
                { backgroundColor: isDark ? "#1E3050" : "#EEF2F8" },
              ]}
            >
              <Feather name="feather" size={14} color={colors.primary} />
            </View>
          )}
          <View
            style={[
              styles.bubble,
              isUser
                ? [styles.userBubble, { backgroundColor: colors.userBubble }]
                : [styles.aiBubble, { backgroundColor: colors.aiBubble, borderColor: colors.border }],
            ]}
          >
            {item.streaming && item.content === "" ? (
              <View style={styles.typingDots}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : (
              <Text
                style={[
                  styles.bubbleText,
                  {
                    color: isUser ? colors.userBubbleText : colors.aiBubbleText,
                    fontFamily: isUser ? "Inter_400Regular" : "Inter_400Regular",
                  },
                ]}
                selectable
              >
                {item.content}
                {item.streaming && (
                  <Text style={{ color: colors.primary }}>▋</Text>
                )}
              </Text>
            )}
          </View>
        </View>
      );
    },
    [colors, isDark]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.headerBg,
            paddingTop: topPad + 10,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          testID="back-button"
        >
          <Feather name="arrow-left" size={22} color={colors.headerText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.headerText }]} numberOfLines={1}>
          {conversation?.title ?? "Legal Advisor"}
        </Text>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/letter/[id]", params: { id: convId } })}
          style={styles.letterBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          testID="draft-letter-button"
        >
          <Feather name="file-text" size={20} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <FlatList
          data={[...messages].reverse()}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          inverted
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: 16 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Feather name="feather" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyChatText, { color: colors.mutedForeground }]}>
                Your legal advisor is ready
              </Text>
            </View>
          }
        />

        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: colors.card,
              borderTopColor: colors.border,
              paddingBottom: Platform.OS === "web" ? bottomPad + 34 : bottomPad + 12,
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? colors.secondary : colors.surface ?? "#F5F5F0",
                color: colors.foreground,
                borderColor: colors.border,
              },
            ]}
            placeholder="Ask a follow-up question..."
            placeholderTextColor={colors.mutedForeground}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={2000}
            testID="chat-input"
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              {
                backgroundColor:
                  input.trim() && !streaming ? colors.primary : colors.muted,
              },
            ]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || streaming}
            testID="chat-send-button"
          >
            {streaming ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Feather name="send" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  letterBtn: { width: 36, alignItems: "center" },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  msgRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  msgRowUser: {
    justifyContent: "flex-end",
  },
  msgRowAI: {
    justifyContent: "flex-start",
  },
  aiAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    alignSelf: "flex-end",
  },
  bubble: {
    maxWidth: "82%",
    padding: 14,
    borderRadius: 18,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  typingDots: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  emptyChat: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 12,
    transform: [{ scaleY: -1 }],
  },
  emptyChatText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
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
