import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  RefreshControl,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useConversations, useDeleteConversation } from "@/hooks/useConversations";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { data: conversations, isLoading, refetch } = useConversations();
  const deleteConversation = useDeleteConversation();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 84;

  const handleDelete = useCallback(
    (id: number, title: string) => {
      Alert.alert("Delete Conversation", `Delete "${title}"?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            deleteConversation.mutate(id);
          },
        },
      ]);
    },
    [deleteConversation]
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
  };

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
          History
        </Text>
        <Text style={[styles.headerSubtitle, { color: "#94A3B8" }]}>
          Past conversations
        </Text>
      </View>

      <FlatList
        data={conversations ?? []}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomPad },
        ]}
        scrollEnabled={!!(conversations && conversations.length > 0)}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="message-circle" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No conversations yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
              Start by asking a legal question on the Ask tab
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => router.push({ pathname: "/chat/[id]", params: { id: item.id } })}
            activeOpacity={0.7}
            testID={`conversation-${item.id}`}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: colors.secondary }]}
            >
              <Feather name="message-square" size={20} color={colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Text
                style={[styles.cardTitle, { color: colors.foreground }]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text style={[styles.cardDate, { color: colors.mutedForeground }]}>
                {formatDate(item.createdAt)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleDelete(item.id, item.title)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              testID={`delete-${item.id}`}
            >
              <Feather name="trash-2" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: { flex: 1 },
  cardTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 3,
  },
  cardDate: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});
