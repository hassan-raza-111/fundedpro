"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react";

// FAQ Data - Moved outside component to prevent recreation
const FAQ_DATA = [
  {
    question: "What is FundedPro?",
    answer: "FundedPro is a leading proprietary trading firm that provides funded trading accounts to skilled traders worldwide. We offer comprehensive evaluation programs with industry-leading benefits and transparent trading rules.",
  },
  {
    question: "How long is the evaluation period?",
    answer: "Our challenge accounts offer a 100-day evaluation period - that's 3x longer than most competitors who only provide 30-60 days. This extended timeframe gives you more confidence to develop and refine your trading strategy.",
  },
  {
    question: "What profit splits do you offer?",
    answer: "We offer industry-leading profit splits of 70-80% for traders, which is 15% higher than most competitors who typically offer 50-70%. Higher tiers receive better profit splits, rewarding successful performance.",
  },
  {
    question: "What are the account sizes available?",
    answer: "We offer three account tiers: $10,000 (Starter), $25,000 (Professional), and $50,000 (Expert) to suit different experience levels and trading styles. Each tier comes with progressively better benefits and profit splits.",
  },
  {
    question: "What happens if I fail the challenge?",
    answer: "Don't worry! Our $10K challenge comes with a free 50% retry option. Plus, with our extended 100-day period and 10% drawdown allowance, you have much better chances of success compared to other firms.",
  },
  {
    question: "How do withdrawals work?",
    answer: "Challenge account holders receive full fee refunds upon success, then move to funded status with regular withdrawal schedules. Funded traders can withdraw profits weekly with no minimum withdrawal amounts.",
  },
  {
    question: "What trading platforms do you support?",
    answer: "We support MT4/MT5, TradingView, and cTrader through our API integrations, giving you the flexibility to trade on your preferred platform with seamless execution and real-time data.",
  },
  {
    question: "What are the drawdown rules?",
    answer: "We use a standardized 10% maximum drawdown across all accounts, making our rules more predictable than competitors who vary their requirements. This includes both daily and overall drawdown limits.",
  },
  {
    question: "What are the minimum trading days?",
    answer: "You need to complete 3 days of profitable trading with at least 0.50% of your total account balance in profits to meet the minimum trading days requirement. This ensures consistent trading activity.",
  },
  {
    question: "How does account scaling work?",
    answer: "Challenge accounts can scale based on performance with faster scaling available for higher tier accounts. Successful traders can increase their account size and profit splits through consistent performance.",
  },
  {
    question: "What makes FundedPro different from other prop firms?",
    answer: "We offer 67% longer evaluation periods, up to 50% lower fees, higher profit splits, and focus on empowering traders globally with transparent, fair rules. Our technology and support are unmatched in the industry.",
  },
  {
    question: "Is there any real financial risk during the challenge?",
    answer: "No, challenge phases use simulated capital with full automation. There's no real financial risk until you're verified and move to a live funded account. Your challenge fee is fully refundable upon success.",
  },
  {
    question: "What security measures do you have?",
    answer: "We use AI-powered monitoring, biometric ID verification for payouts, encrypted transactions, and anti-cheat detection to ensure a secure trading environment. All data is protected with bank-level security.",
  },
];

// Optimized synonyms map - Moved outside component
const SYNONYMS_MAP = {
  'fundedpro': ['funded pro', 'fundedpro', 'funded pro trading'],
  'evaluation': ['challenge', 'evaluation period', 'assessment', 'test'],
  'profit split': ['profit sharing', 'split', 'commission', 'earnings'],
  'account size': ['account', 'balance', 'funding', 'capital'],
  'drawdown': ['loss limit', 'risk limit', 'maximum loss'],
  'withdrawal': ['payout', 'payment', 'cash out', 'money out'],
  'platform': ['trading platform', 'software', 'mt4', 'mt5', 'tradingview'],
  'scaling': ['account scaling', 'increase account', 'grow account'],
  'security': ['safety', 'protection', 'secure', 'safe'],
  'risk': ['financial risk', 'danger', 'loss risk'],
};

// Quick replies - Moved outside component
const QUICK_REPLIES = [
  "What is FundedPro?",
  "How long is the evaluation period?",
  "What profit splits do you offer?",
  "What are the account sizes?",
];

// Types
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotProps {
  className?: string;
}

// Optimized FAQ matching function
const findBestFAQMatch = (userQuestion: string): string | null => {
  const normalizedQuestion = userQuestion.toLowerCase().trim();
  
  // Expand question with synonyms
  let expandedQuestion = normalizedQuestion;
  Object.entries(SYNONYMS_MAP).forEach(([key, values]) => {
    values.forEach(synonym => {
      if (normalizedQuestion.includes(synonym)) {
        expandedQuestion += ' ' + key;
      }
    });
  });
  
  // Direct match first
  const directMatch = FAQ_DATA.find(faq => 
    faq.question.toLowerCase().includes(normalizedQuestion) ||
    normalizedQuestion.includes(faq.question.toLowerCase()) ||
    expandedQuestion.includes(faq.question.toLowerCase())
  );
  
  if (directMatch) return directMatch.answer;
  
  // Keyword matching with improved scoring
  const keywords = expandedQuestion.split(' ').filter(word => word.length > 2);
  const keywordMatches = FAQ_DATA.map(faq => {
    const questionLower = faq.question.toLowerCase();
    const answerLower = faq.answer.toLowerCase();
    
    const questionScore = keywords.filter(keyword => 
      questionLower.includes(keyword)
    ).length;
    
    const answerScore = keywords.filter(keyword => 
      answerLower.includes(keyword)
    ).length;
    
    const totalScore = (questionScore * 2) + answerScore;
    return { faq, score: totalScore };
  }).filter(match => match.score > 0);
  
  if (keywordMatches.length > 0) {
    const bestMatch = keywordMatches.reduce((best, current) => 
      current.score > best.score ? current : best
    );
    
    if (bestMatch.score >= 2) {
      return bestMatch.faq.answer;
    }
  }
  
  return null;
};

// Optimized chat message component
const ChatMessage = memo(({ message }: { message: Message }) => {
  const isBot = message.sender === 'bot';
  const timeString = message.timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex items-start gap-3 max-w-[88%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isBot ? 'bg-brand-cyan text-black' : 'bg-brand-navy text-white'
        }`}>
          {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>
        <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
          <div className={`px-4 py-3 rounded-2xl w-full min-w-0 ${
            isBot 
              ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-white' 
              : 'bg-brand-cyan text-black'
          }`}>
            <p className="text-sm leading-6 text-left whitespace-normal break-words hyphens-none tracking-wide">
              {message.text}
            </p>
          </div>
          <span className="text-xs text-white/50 mt-1">{timeString}</span>
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

// Optimized typing indicator
const TypingIndicator = memo(() => (
  <div className="flex justify-start mb-4">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-brand-cyan text-black flex items-center justify-center">
        <Bot className="w-4 h-4" />
      </div>
      <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
        <div className="flex space-x-1">
          {[0, 0.1, 0.2].map((delay, index) => (
            <div
              key={index}
              className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
));

TypingIndicator.displayName = "TypingIndicator";

// Optimized quick replies
const QuickReplies = memo(({ onSendMessage }: { onSendMessage: (message: string) => void }) => (
  <div className="mt-4">
    <p className="text-white/60 text-xs mb-3">Quick questions:</p>
    <div className="flex flex-col gap-2">
      {QUICK_REPLIES.map((reply, index) => (
        <button
          key={index}
          onClick={() => onSendMessage(reply)}
          className="px-4 py-2.5 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all duration-200 hover:scale-[1.02] text-left"
        >
          {reply}
        </button>
      ))}
    </div>
  </div>
));

QuickReplies.displayName = "QuickReplies";

// Optimized floating chat button
const FloatingChatButton = memo(({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) => (
  <button
    onClick={onClick}
    className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-cyan hover:bg-brand-cyan/90 text-black shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-glow ${
      isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
    }`}
    aria-label="Open chat"
  >
    <MessageCircle className="w-6 h-6 mx-auto" />
  </button>
));

FloatingChatButton.displayName = "FloatingChatButton";

// Optimized header component
const ChatHeader = memo(({ 
  isMinimized, 
  onMinimize, 
  onClose 
}: { 
  isMinimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
}) => (
  <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-brand-cyan flex items-center justify-center">
        <Bot className="w-4 h-4 text-black" />
      </div>
      <div>
        <h3 className="text-white font-semibold text-sm">FundedPro Assistant</h3>
        <p className="text-white/60 text-xs">Online • Ready to help</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onMinimize}
        className="text-white/60 hover:text-white transition-colors p-1"
        aria-label={isMinimized ? "Maximize" : "Minimize"}
      >
        {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
      </button>
      <button
        onClick={onClose}
        className="text-white/60 hover:text-white transition-colors p-1"
        aria-label="Close chat"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
));

ChatHeader.displayName = "ChatHeader";

// Optimized input area
const ChatInput = memo(({ 
  inputValue, 
  onInputChange, 
  onSend, 
  onKeyPress, 
  isTyping, 
  inputRef 
}: { 
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isTyping: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) => (
  <div className="p-3 border-t border-white/10 flex-shrink-0">
    <div className="flex gap-2 items-center">
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="Type your message..."
        className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-brand-cyan focus:ring-brand-cyan/20 text-sm h-10"
        disabled={isTyping}
      />
      <Button
        onClick={onSend}
        disabled={!inputValue.trim() || isTyping}
        className="bg-brand-cyan hover:bg-brand-cyan/90 text-black px-3 h-10 w-10 flex-shrink-0"
        size="sm"
        aria-label="Send message"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  </div>
));

ChatInput.displayName = "ChatInput";

// Main optimized chatbot component
export const Chatbot = memo(({ className = "" }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your FundedPro assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Optimized scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized]);

  // Optimized message sending
  const handleSendMessage = useCallback(async (customMessage?: string) => {
    const messageText = customMessage || inputValue.trim();
    if (!messageText || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowQuickReplies(false);
    setIsTyping(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const faqAnswer = findBestFAQMatch(userMessage.text);
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: faqAnswer || "Sir, please contact our support team at support@thefundedpro.com for further assistance.",
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
  }, [inputValue, isTyping]);

  // Optimized key handlers
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const handleSend = useCallback(() => {
    handleSendMessage();
  }, [handleSendMessage]);

  // Optimized toggle functions
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
    if (isMinimized) setIsMinimized(false);
  }, [isMinimized]);

  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleChat();
      }
      
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleChat]);

  // Optimized window classes
  const windowClasses = isMinimized 
    ? 'w-80 h-16 minimized' 
    : 'w-[calc(100vw-2rem)] max-w-[350px] h-[450px] max-h-[70vh] sm:w-96 sm:h-[480px] sm:max-h-[75vh] md:w-[420px] md:h-[520px] md:max-h-[80vh]';

  const containerClasses = isOpen 
    ? 'opacity-100 scale-100 translate-y-0' 
    : 'opacity-0 scale-95 translate-y-4 pointer-events-none';

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <FloatingChatButton onClick={toggleChat} isOpen={isOpen} />

      <div className={`transition-all duration-300 ease-in-out ${containerClasses}`}>
        <div className={`bg-brand-gradient backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col ${windowClasses} transition-all duration-300`}>
          <ChatHeader 
            isMinimized={isMinimized}
            onMinimize={toggleMinimize}
            onClose={toggleChat}
          />

          {!isMinimized && (
            <>
              <div className="flex-1 p-4 min-h-0 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-2">
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    {isTyping && <TypingIndicator />}
                    {showQuickReplies && messages.length === 1 && (
                      <QuickReplies onSendMessage={handleSendMessage} />
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </div>

              <ChatInput
                inputValue={inputValue}
                onInputChange={handleInputChange}
                onSend={handleSend}
                onKeyPress={handleKeyPress}
                isTyping={isTyping}
                inputRef={inputRef}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
});

Chatbot.displayName = "Chatbot";
