"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building2,
  Search,
  Briefcase,
  MessageCircle,
  User,
  Send,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  ArrowLeft,
  Headphones,
  Home,
  CheckCheck,
  Loader2,
} from "lucide-react";

interface Chat {
  id: string;
  type: "deal" | "support";
  title: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar?: string;
  apartmentTitle?: string;
  price?: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  status?: "sent" | "delivered" | "read";
}

const mockChats: Chat[] = [
  {
    id: "1",
    type: "deal",
    title: "Продавец: Иван Петров",
    lastMessage: "Да, можем встретиться завтра в 14:00",
    lastMessageTime: "12:45",
    unreadCount: 2,
    apartmentTitle: "3-комн. квартира, 78 м²",
    price: "12 500 000 ₽",
  },
  {
    id: "2",
    type: "deal",
    title: "Продавец: Мария Сидорова",
    lastMessage: "Документы готовы, можем приступать к сделке",
    lastMessageTime: "вчера",
    unreadCount: 0,
    apartmentTitle: "2-комн. квартира, 56 м²",
    price: "8 900 000 ₽",
  },
  {
    id: "support",
    type: "support",
    title: "Служба поддержки",
    lastMessage: "Здравствуйте! Чем можем помочь?",
    lastMessageTime: "10:30",
    unreadCount: 1,
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "other",
    content: "Здравствуйте! Интересует ваша квартира на Арбате.",
    timestamp: "10:00",
    isOwn: false,
  },
  {
    id: "2",
    senderId: "me",
    content: "Добрый день! Да, квартира свободна. Когда хотите посмотреть?",
    timestamp: "10:15",
    isOwn: true,
    status: "read",
  },
  {
    id: "3",
    senderId: "other",
    content: "Можно завтра после обеда? Часов в 14:00?",
    timestamp: "10:30",
    isOwn: false,
  },
  {
    id: "4",
    senderId: "me",
    content: "Конечно, давайте в 14:00. Адрес: ул. Арбат, д. 25, кв. 15. Вход со двора.",
    timestamp: "10:45",
    isOwn: true,
    status: "read",
  },
  {
    id: "5",
    senderId: "other",
    content: "Отлично! А какие документы на квартиру? Всё чисто?",
    timestamp: "11:00",
    isOwn: false,
  },
  {
    id: "6",
    senderId: "me",
    content: "Да, квартира в собственности более 5 лет, один владелец, никаких обременений. Могу показать все документы при встрече.",
    timestamp: "11:15",
    isOwn: true,
    status: "read",
  },
  {
    id: "7",
    senderId: "other",
    content: "Да, можем встретиться завтра в 14:00",
    timestamp: "12:45",
    isOwn: false,
  },
];

export default function MessagesPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <MessageCircle className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Необходима авторизация</h1>
        <p className="text-muted-foreground">Войдите в систему для доступа к сообщениям</p>
        <Button asChild>
          <Link href="/api/login">Войти</Link>
        </Button>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setMessage("");
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setIsMobileView(true);
  };

  const handleBackToList = () => {
    setIsMobileView(false);
    setSelectedChat(null);
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">RealtyPro</span>
          </Link>
          
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/search" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" data-testid="link-search">
              <Search className="h-4 w-4" />
              Поиск
            </Link>
            <Link href="/services" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" data-testid="link-services">
              <Briefcase className="h-4 w-4" />
              Сервисы
            </Link>
            <Link href="/messages" className="flex items-center gap-2 text-sm font-medium text-foreground" data-testid="link-messages">
              <MessageCircle className="h-4 w-4" />
              Сообщения
            </Link>
            <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" data-testid="link-profile">
              <User className="h-4 w-4" />
              Профиль
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className={`w-full border-r md:w-80 lg:w-96 ${isMobileView ? 'hidden md:flex' : 'flex'} flex-col`}>
          <div className="border-b p-4">
            <h1 className="mb-4 text-xl font-bold">Сообщения</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по чатам..."
                className="pl-10"
                data-testid="input-search-chats"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2">
              {mockChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
                  className={`w-full rounded-lg p-3 text-left transition-colors hover:bg-muted/50 ${
                    selectedChat?.id === chat.id ? 'bg-muted' : ''
                  }`}
                  data-testid={`button-chat-${chat.id}`}
                >
                  <div className="flex gap-3">
                    <Avatar className="h-12 w-12">
                      {chat.type === "support" ? (
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Headphones className="h-5 w-5" />
                        </AvatarFallback>
                      ) : (
                        <AvatarFallback>{chat.title.split(" ")[1]?.[0] || "П"}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium">{chat.title}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">{chat.lastMessageTime}</span>
                      </div>
                      {chat.apartmentTitle && (
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-primary">
                          <Home className="h-3 w-3" />
                          <span className="truncate">{chat.apartmentTitle}</span>
                        </div>
                      )}
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="truncate text-sm text-muted-foreground">{chat.lastMessage}</p>
                        {chat.unreadCount > 0 && (
                          <Badge className="h-5 min-w-5 shrink-0 justify-center">{chat.unreadCount}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className={`flex-1 flex-col ${isMobileView ? 'flex' : 'hidden md:flex'}`}>
          {selectedChat ? (
            <>
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={handleBackToList}
                    data-testid="button-back"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-10 w-10">
                    {selectedChat.type === "support" ? (
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Headphones className="h-4 w-4" />
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback>{selectedChat.title.split(" ")[1]?.[0] || "П"}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{selectedChat.title}</h2>
                    {selectedChat.apartmentTitle && (
                      <p className="text-sm text-muted-foreground">
                        {selectedChat.apartmentTitle} • {selectedChat.price}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedChat.type === "deal" && (
                    <>
                      <Button variant="ghost" size="icon" data-testid="button-call">
                        <Phone className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" data-testid="button-video">
                        <Video className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="icon" data-testid="button-more">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedChat.apartmentTitle && (
                    <Card className="mx-auto max-w-md">
                      <CardContent className="flex items-center gap-3 p-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <Home className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{selectedChat.apartmentTitle}</p>
                          <p className="text-sm text-primary">{selectedChat.price}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {mockMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          msg.isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                        data-testid={`message-${msg.id}`}
                      >
                        <p>{msg.content}</p>
                        <div className={`mt-1 flex items-center justify-end gap-1 text-xs ${
                          msg.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          <span>{msg.timestamp}</span>
                          {msg.isOwn && msg.status === "read" && (
                            <CheckCheck className="h-3 w-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" data-testid="button-attach">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Введите сообщение..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                    data-testid="input-message"
                  />
                  <Button variant="ghost" size="icon" data-testid="button-emoji">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button size="icon" onClick={handleSendMessage} data-testid="button-send">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <MessageCircle className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold">Выберите чат</h2>
              <p className="max-w-sm text-muted-foreground">
                Выберите существующий чат из списка слева или начните новый диалог
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
