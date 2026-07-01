import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Send, User as UserIcon } from 'lucide-react';
import { chatApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCurrUser } from '@/store/userStore';
import { toast } from 'sonner';

export default function InboxPage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useCurrUser();
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch threads
  const { data: threads = [], isLoading: loadingThreads } = useQuery({
    queryKey: ['chats'],
    queryFn: chatApi.listThreads,
  });

  // Fetch messages of active thread
  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', activeThreadId],
    queryFn: () => chatApi.getMessages(activeThreadId || ''),
    enabled: !!activeThreadId,
    refetchInterval: 3000, // Poll every 3 seconds for real-time-like feel
  });

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!activeThreadId || !messageText.trim()) return;
      return chatApi.sendMessage(activeThreadId, messageText);
    },
    onSuccess: () => {
      setMessageText('');
      queryClient.invalidateQueries({ queryKey: ['messages', activeThreadId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to send message');
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMutation.mutate();
    }
  };

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Set first thread as active if none selected
  useEffect(() => {
    if (threads.length > 0 && !activeThreadId) {
      setActiveThreadId(threads[0].id);
    }
  }, [threads, activeThreadId]);

  const activeThread = threads.find((t: any) => t.id === activeThreadId);

  // Helper to extract other participant details
  const getRecipient = (thread: any) => {
    return thread?.participants?.find((p: any) => p.id !== currentUser.id) || { displayName: 'User', role: '' };
  };

  return (
    <div className="bg-card border border-border flex h-[78vh] rounded-sm overflow-hidden">
      {/* Thread list (Left Panel) */}
      <aside className="w-80 border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <h2 className="text-foreground text-xl font-bold tracking-tight">Inbox Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border/50">
          {loadingThreads ? (
            <div className="text-muted-foreground text-center py-10 text-xs font-bold tracking-widest uppercase animate-pulse">
              LOADING THREADS...
            </div>
          ) : threads.length === 0 ? (
            <div className="text-muted-foreground text-center py-20 text-xs font-semibold px-4">
              No chat threads open. Start a chat from a player profile page.
            </div>
          ) : (
            threads.map((thread: any) => {
              const recipient = getRecipient(thread);
              const isActive = thread.id === activeThreadId;
              return (
                <button
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full text-left p-4 flex gap-3 items-center transition-all ${
                    isActive ? 'bg-secondary' : 'hover:bg-secondary/40'
                  }`}
                >
                  <div className="bg-primary/10 border border-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm">
                    <UserIcon className="text-primary h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="text-foreground font-bold text-sm truncate">{recipient.displayName}</span>
                      <span className="text-muted-foreground text-[9px] uppercase tracking-wider font-semibold">
                        {recipient.role}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs truncate font-medium">
                      {thread.lastMessage?.text || 'No messages yet'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Message History (Right Panel) */}
      <main className="flex-1 flex flex-col min-w-0 bg-background/25">
        {activeThreadId ? (
          <>
            {/* Header info */}
            <div className="p-4 border-b border-border bg-card flex justify-between items-center">
              <div>
                <h3 className="text-foreground font-bold tracking-tight">
                  {getRecipient(activeThread).displayName}
                </h3>
                <span className="text-primary text-[10px] font-bold tracking-widest uppercase block mt-0.5">
                  {getRecipient(activeThread).role}
                </span>
              </div>
            </div>

            {/* Messages box */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="text-muted-foreground text-center py-20 text-xs font-bold tracking-widest uppercase animate-pulse">
                  SYNCING MESSAGES...
                </div>
              ) : messages.length === 0 ? (
                <p className="text-muted-foreground text-center py-20 text-xs font-semibold">
                  Send a message to start the conversation!
                </p>
              ) : (
                messages.map((msg: any) => {
                  const isSentByMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-sm px-4 py-2.5 text-sm font-semibold border ${
                          isSentByMe
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'bg-card border-border text-foreground'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className={`text-[9px] block mt-1 text-right font-medium opacity-75`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input field */}
            <form onSubmit={handleSend} className="p-4 bg-card border-t border-border flex gap-3">
              <Input
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="bg-background border-border rounded-sm flex-1"
                disabled={sendMutation.isPending}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!messageText.trim() || sendMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm shrink-0"
              >
                <Send className="h-4.5 w-4.5" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <MessageSquare className="text-muted-foreground h-12 w-12 opacity-50 mb-3" />
            <h3 className="text-foreground text-lg font-bold">No conversation active</h3>
            <p className="text-muted-foreground text-sm font-medium mt-1">
              Select a conversation thread from the sidebar list to see messages.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
