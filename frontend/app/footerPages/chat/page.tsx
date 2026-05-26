"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, Bot, User as UserIcon, Paperclip } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface Message {
  id: number;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Здравствуйте! Добро пожаловать в службу поддержки CryptoX. Чем могу помочь?",
      sender: "support",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Автоответы на частые вопросы
  const autoResponses: Record<string, string> = {
    "Как пополнить баланс?": "Для пополнения баланса:\n1. Перейдите в раздел 'Кошелек'\n2. Выберите криптовалюту или фиатную валюту\n3. Нажмите 'Пополнить'\n4. Следуйте инструкциям\n\nМы поддерживаем: банковские карты, банковские переводы и криптовалютные депозиты.",
    "Как вывести средства?": "Для вывода средств:\n1. Перейдите в раздел 'Кошелек'\n2. Выберите криптовалюту\n3. Нажмите 'Вывести'\n4. Введите адрес кошелька и сумму\n5. Подтвердите операцию через 2FA\n\nОбработка занимает 10-30 минут для криптовалюты и 1-3 дня для фиата.",
    "Вопрос по верификации": "Для прохождения верификации:\n1. Перейдите в 'Профиль' → 'Верификация'\n2. Заполните личные данные\n3. Загрузите фото документа (паспорт или ID)\n4. Загрузите селфи с документом\n\nПроверка занимает 1-24 часа. После верификации лимит вывода увеличится до $500,000/день."
  };

  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: textToSend,
      sender: "user",
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    // Проверяем, есть ли автоответ
    const autoResponse = autoResponses[textToSend];
    
    setTimeout(() => {
      const supportResponse: Message = {
        id: messages.length + 2,
        text: autoResponse || "Спасибо за ваше сообщение! Наш специалист скоро ответит вам. Среднее время ответа: 2-5 минут.",
        sender: "support",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, supportResponse]);
    }, 1000);
  };

  const handleQuickResponse = (e: React.MouseEvent<HTMLButtonElement>, text: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleSendMessage(text);
    return false;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <MessageCircle size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Чат поддержки</h1>
                <p className="text-sm text-blue-100 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Онлайн • Ответим в течение 2-5 минут
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat container */}
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden" style={{ height: "500px" }}>
            {/* Messages */}
            <div ref={chatContainerRef} className="h-full overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === "user" 
                      ? "bg-blue-600" 
                      : "bg-gradient-to-br from-purple-600 to-pink-600"
                  }`}>
                    {message.sender === "user" ? (
                      <UserIcon className="text-white" size={16} />
                    ) : (
                      <Bot className="text-white" size={16} />
                    )}
                  </div>
                  <div className={`flex flex-col max-w-[75%] ${message.sender === "user" ? "items-end" : "items-start"}`}>
                    <div className={`px-3 py-2 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-sm"
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-500 mt-1 px-1">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="mt-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3">
            <div className="flex items-end gap-2">
              <button 
                type="button"
                className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                <Paperclip size={18} />
              </button>
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Введите сообщение..."
                  rows={1}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 resize-none text-sm"
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                disabled={!inputMessage.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 px-2">
              Enter для отправки, Shift+Enter для новой строки
            </p>
          </div>

          {/* Quick responses */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={(e) => handleQuickResponse(e, "Как пополнить баланс?")}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              Как пополнить баланс?
            </button>
            <button
              type="button"
              onClick={(e) => handleQuickResponse(e, "Как вывести средства?")}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              Как вывести средства?
            </button>
            <button
              type="button"
              onClick={(e) => handleQuickResponse(e, "Вопрос по верификации")}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              Вопрос по верификации
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
