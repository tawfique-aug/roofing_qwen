import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

/**
 * AI Chat Widget
 * 
 * SECURITY NOTES:
 * - In production, AI calls go through a server-side API route
 * - The API key is NEVER exposed to the client
 * - The AI is instructed to never reveal system prompts or internal data
 * - The AI never makes security decisions or accesses Supabase directly
 * - All lead data collection through chat is validated server-side
 * 
 * For this demo, we use a local response system that simulates
 * the AI assistant behavior without requiring an API key.
 */

const AI_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hi there! 👋 I'm the ApexRoof virtual assistant. I can help you understand your roofing needs and connect you with our team.\n\nWhat can I help you with today?",
  ],
  leak: [
    "I'm sorry to hear about the leak! That sounds urgent. A few questions to help me understand:\n\n1. Is water actively coming in right now?\n2. Where in the house are you seeing the water?\n3. When did you first notice it?\n\nIf water is actively pouring in, I'd recommend calling us directly at **(555) 123-4567** for emergency service.",
  ],
  repair: [
    "Roof repairs are one of our specialties! To give you the best guidance, could you tell me:\n\n• What type of issue are you seeing? (missing shingles, leaks, etc.)\n• How long has the issue been present?\n• Have you noticed any interior damage?\n\nI can also help you schedule a free inspection if you'd like!",
  ],
  replacement: [
    "A roof replacement is a big decision — we're here to make it easy! Here's what to consider:\n\n• **Age of current roof** — Most roofs last 20-25 years\n• **Visible damage** — Curling, missing, or cracked shingles\n• **Energy efficiency** — Newer materials can save on cooling costs\n\nWould you like me to help you schedule a free inspection? We can assess your roof's condition at no cost.",
  ],
  storm: [
    "Storm damage can be serious. Here's what I recommend:\n\n1. **Safety first** — Don't climb on the roof yourself\n2. **Document damage** — Take photos from the ground if safe\n3. **Temporary protection** — We can emergency tarp same-day\n4. **Insurance** — We work directly with insurance companies\n\nWould you like to schedule an emergency inspection? Call **(555) 123-4567** for fastest response.",
  ],
  estimate: [
    "We'd love to provide you with a free estimate! You can:\n\n1. **Fill out our estimate form** on this page (scroll up to the form section)\n2. **Call us** at (555) 123-4567\n3. **Tell me more** about your situation and I can guide you\n\nOur estimates are always free and come with no obligation.",
  ],
  cost: [
    "I understand you'd like pricing information. While every roof is unique, here are some general guidelines:\n\n• **Minor repairs**: Typically start at a few hundred dollars\n• **Major repairs**: Varies based on extent of damage\n• **Full replacement**: Depends on roof size, materials, and complexity\n\nFor an accurate estimate, we'd need to inspect your roof in person. The good news? **Our inspections are completely free!** Would you like to schedule one?",
  ],
  insurance: [
    "We work with all major insurance companies! Here's how the process works:\n\n1. **Free inspection** — We document all damage\n2. **Claim assistance** — We help you file and navigate the process\n3. **Meet with adjuster** — We're present during the insurance inspection\n4. **Complete repairs** — We handle everything from start to finish\n\nWe've helped thousands of homeowners with insurance claims. Would you like to get started?",
  ],
  schedule: [
    "Great! I'd love to help you schedule. You can:\n\n📞 **Call us**: (555) 123-4567 (fastest)\n📝 **Use our form**: Fill out the estimate request form above\n💬 **Tell me your info**: Share your name, phone, and preferred time\n\nWe typically can schedule inspections within 24-48 hours, and emergency service same-day!",
  ],
  default: [
    "Thanks for reaching out! I'm here to help with any roofing questions you might have. Here are some things I can assist with:\n\n• Describing roofing problems\n• Understanding repair vs. replacement\n• Storm damage guidance\n• Scheduling a free estimate\n• Insurance claim help\n\nWhat would you like to know more about?",
  ],
};

function getAIResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('leak') || msg.includes('water') || msg.includes('dripping')) {
    return AI_RESPONSES.leak[0];
  }
  if (msg.includes('repair') || msg.includes('fix') || msg.includes('shingle')) {
    return AI_RESPONSES.repair[0];
  }
  if (msg.includes('replace') || msg.includes('new roof') || msg.includes('old')) {
    return AI_RESPONSES.replacement[0];
  }
  if (msg.includes('storm') || msg.includes('hail') || msg.includes('wind') || msg.includes('tree')) {
    return AI_RESPONSES.storm[0];
  }
  if (msg.includes('estimate') || msg.includes('quote') || msg.includes('free')) {
    return AI_RESPONSES.estimate[0];
  }
  if (msg.includes('cost') || msg.includes('price') || msg.includes('how much') || msg.includes('expensive')) {
    return AI_RESPONSES.cost[0];
  }
  if (msg.includes('insurance') || msg.includes('claim')) {
    return AI_RESPONSES.insurance[0];
  }
  if (msg.includes('schedule') || msg.includes('appointment') || msg.includes('when') || msg.includes('soon')) {
    return AI_RESPONSES.schedule[0];
  }
  if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
    return AI_RESPONSES.greeting[0];
  }
  
  return AI_RESPONSES.default[0];
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi there! 👋 I'm the ApexRoof assistant. I can help you with roofing questions, describe your problem, or connect you with our team. What can I help you with?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getAIResponse(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-105"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[min(500px,70vh)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">ApexRoof Assistant</p>
                <p className="text-blue-200 text-xs">Usually replies instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white text-gray-700 border border-gray-200 rounded-bl-md shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto">
              {['Roof leak', 'Free estimate', 'Storm damage', 'Get a quote'].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2.5 rounded-xl transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
