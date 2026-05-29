import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetOpenaiConversationQueryKey, getListOpenaiConversationsQueryKey } from "@workspace/api-client-react";

export function useChatStream(conversationId: number) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const queryClient = useQueryClient();

  const streamMessage = useCallback(async (content: string) => {
    setIsStreaming(true);
    setStreamingContent("");

    try {
      const resp = await fetch(`/api/openai/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!resp.ok) {
        throw new Error("Failed to send message");
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let buffer = "";

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
                setStreamingContent((prev) => prev + json.content);
              }
              if (json.done) {
                // Stream complete
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } finally {
      setIsStreaming(false);
      setStreamingContent("");
      // Invalidate to fetch the final persisted message
      queryClient.invalidateQueries({ queryKey: getGetOpenaiConversationQueryKey(conversationId) });
      queryClient.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
    }
  }, [conversationId, queryClient]);

  const draftLetter = useCallback(async (reinforce?: boolean, existingDraft?: string) => {
    setIsStreaming(true);
    setStreamingContent("");

    try {
      const resp = await fetch(`/api/openai/conversations/${conversationId}/draft-letter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reinforce, existingDraft }),
      });

      if (!resp.ok) {
        throw new Error("Failed to draft letter");
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let buffer = "";

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
                setStreamingContent((prev) => prev + json.content);
              }
              if (json.done) {
                // Stream complete
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    } finally {
      setIsStreaming(false);
      setStreamingContent("");
      queryClient.invalidateQueries({ queryKey: getGetOpenaiConversationQueryKey(conversationId) });
    }
  }, [conversationId, queryClient]);

  return { streamMessage, draftLetter, isStreaming, streamingContent };
}
