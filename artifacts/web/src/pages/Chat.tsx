import { useEffect, useRef, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useGetOpenaiConversation, getGetOpenaiConversationQueryKey } from "@workspace/api-client-react";
import { useChatStream } from "@/hooks/use-chat-stream";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, FileText, ArrowLeft, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

function FormattedText({ content }: { content: string }) {
  // Simple markdown-ish rendering
  const paragraphs = content.split('\n\n').filter(Boolean);
  
  return (
    <div className="space-y-4 text-base leading-relaxed">
      {paragraphs.map((p, i) => {
        // Handle bold text **text**
        const parts = p.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={i}>
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>;
              }
              // Handle lines with breaks
              return part.split('\n').map((line, k, arr) => (
                <span key={`${j}-${k}`}>
                  {line}
                  {k < arr.length - 1 && <br />}
                </span>
              ));
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function ChatPage() {
  const [, params] = useRoute("/chat/:id");
  const [location, setLocation] = useLocation();
  const id = parseInt(params?.id || "0", 10);
  
  const { data: conversation, isLoading } = useGetOpenaiConversation(id, {
    query: { enabled: !!id, queryKey: getGetOpenaiConversationQueryKey(id) }
  });
  
  const { streamMessage, draftLetter, isStreaming, streamingContent } = useChatStream(id);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Handle initial message from Ask page
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current || !id) return;
    const state = window.history.state;
    if (state?.initialMessage) {
      initialized.current = true;
      streamMessage(state.initialMessage);
      // Clear state so it doesn't trigger again
      window.history.replaceState({}, document.title);
    }
  }, [id, streamMessage]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation?.messages, streamingContent]);

  const [copied, setCopied] = useState(false);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto h-[80vh] flex flex-col gap-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="flex-1 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!conversation) {
    return <div className="text-center py-12">Conversation not found</div>;
  }

  const messages = conversation.messages || [];

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/history")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-serif font-semibold text-lg truncate max-w-[200px] md:max-w-md">
            {conversation.title}
          </h1>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={() => draftLetter()}
          disabled={isStreaming || messages.length === 0}
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Draft Demand Letter</span>
        </Button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto mb-4 space-y-6 pr-4"
      >
        {messages.length === 0 && !isStreaming && (
          <div className="h-full flex items-center justify-center text-muted-foreground text-center p-8">
            <p>Start the conversation below to receive legal guidance.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={cn(
              "flex flex-col gap-2 max-w-[85%]",
              msg.role === "user" ? "ml-auto" : "mr-auto"
            )}
          >
            <div className={cn(
              "p-4 rounded-2xl",
              msg.role === "user" 
                ? "bg-primary text-primary-foreground rounded-tr-sm" 
                : "bg-card border shadow-sm rounded-tl-sm"
            )}>
              {msg.role === "user" ? (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              ) : (
                <div className="relative group">
                  <FormattedText content={msg.content} />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur"
                    onClick={() => handleCopy(msg.content)}
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>
            <span className={cn(
              "text-xs text-muted-foreground px-2",
              msg.role === "user" ? "text-right" : "text-left"
            )}>
              {msg.role === "user" ? "You" : "Legal AI"} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {isStreaming && (
          <div className="mr-auto max-w-[85%] flex flex-col gap-2">
            <div className="p-4 rounded-2xl bg-card border shadow-sm rounded-tl-sm relative">
              <FormattedText content={streamingContent} />
              <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1 align-middle" />
            </div>
            <span className="text-xs text-muted-foreground px-2">
              Legal AI is typing...
            </span>
          </div>
        )}
      </div>

      <div className="p-4 bg-card border rounded-xl shadow-sm">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your reply..."
            className="min-h-[60px] max-h-[200px] resize-none border-0 focus-visible:ring-0 bg-transparent p-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !isStreaming) {
                  streamMessage(input);
                  setInput("");
                }
              }
            }}
          />
          <Button 
            size="icon" 
            className="h-10 w-10 shrink-0 rounded-full mb-1"
            disabled={!input.trim() || isStreaming}
            onClick={() => {
              streamMessage(input);
              setInput("");
            }}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
