import { useQueryClient } from "@tanstack/react-query";
import {
  useListOpenaiConversations,
  useGetOpenaiConversation,
  useListOpenaiMessages,
  useCreateOpenaiConversation,
  useDeleteOpenaiConversation,
} from "@workspace/api-client-react";

export function useConversations() {
  return useListOpenaiConversations({
    query: { queryKey: ["conversations"] },
  });
}

export function useConversation(id: number) {
  return useGetOpenaiConversation(id, {
    query: {
      enabled: !!id,
      queryKey: ["conversation", id],
    },
  });
}

export function useConversationMessages(id: number) {
  return useListOpenaiMessages(id, {
    query: {
      enabled: !!id,
      queryKey: ["messages", id],
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useCreateOpenaiConversation({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      },
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useDeleteOpenaiConversation({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      },
    },
  });
}
