import { useListOpenaiConversations, useDeleteOpenaiConversation, getListOpenaiConversationsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function HistoryPage() {
  const { data: conversations, isLoading } = useListOpenaiConversations();
  const deleteMutation = useDeleteOpenaiConversation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this conversation?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
      toast({ title: "Conversation deleted" });
    } catch (err) {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[#0f172a] mb-2">Conversation History</h1>
        <p className="text-[#64748b]">Resume past consultations or review legal drafts.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : conversations?.length === 0 ? (
        <div className="text-center py-16 bg-[#f8fafc] rounded-3xl border border-dashed border-[#e2e8f0]">
          <MessageSquare className="h-12 w-12 text-[#cbd5e1] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#0f172a] mb-2">No history yet</h3>
          <p className="text-[#64748b] mb-6">Start a conversation to see it here.</p>
          <Button asChild className="bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-xl">
            <Link href="/">Ask a Question</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {conversations?.map((conv) => (
            <Link key={conv.id} href={`/chat/${conv.id}`}>
              <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group border-[#e2e8f0] rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between p-5 sm:p-6">
                  <div className="space-y-1 pr-6">
                    <CardTitle className="text-lg font-semibold text-[#0f172a]">{conv.title}</CardTitle>
                    <CardDescription className="text-[#94a3b8] flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {new Date(conv.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'long', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-[#cbd5e1] opacity-0 group-hover:opacity-100 hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all h-9 w-9"
                    onClick={(e) => handleDelete(e, conv.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
