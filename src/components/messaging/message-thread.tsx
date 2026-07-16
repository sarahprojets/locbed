"use client";

import { useRef, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendMessage } from "@/features/messaging/actions";

type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export function MessageThread({
  conversationId,
  messages,
  currentUserId,
  otherParty,
  basePath,
}: {
  conversationId: string;
  messages: Message[];
  currentUserId: string;
  otherParty: { display_name: string | null; avatar_url: string | null } | null;
  basePath: string;
}) {
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-1">
        {messages.map((message) => {
          const isMine = message.sender_id === currentUserId;
          return (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : ""}`}
            >
              {!isMine ? (
                <Avatar className="size-6">
                  <AvatarImage src={otherParty?.avatar_url ?? undefined} />
                  <AvatarFallback className="text-[10px]">
                    {otherParty?.display_name?.[0]?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
              ) : null}
              <div
                className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                  isMine ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.body}
              </div>
            </div>
          );
        })}
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Démarrez la conversation.</p>
        ) : null}
      </div>
      <form
        ref={formRef}
        className="flex items-end gap-2 border-t pt-3"
        action={() => {
          if (!value.trim()) return;
          const body = value;
          setValue("");
          startTransition(() => sendMessage(conversationId, body, basePath));
        }}
      >
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
          rows={2}
          placeholder="Votre message..."
          className="flex-1 resize-none"
        />
        <Button type="submit" disabled={pending || !value.trim()}>
          Envoyer
        </Button>
      </form>
    </div>
  );
}
