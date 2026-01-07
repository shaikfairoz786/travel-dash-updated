import React, { useState, useEffect, useRef } from 'react';
import {
    XMarkIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface Message {
    id: number;
    text: string;
    sender: 'bot' | 'user';
    options?: { label: string; action: () => void }[];
}

const Chatbot: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showGreeting, setShowGreeting] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "👋 Hi there! Welcome to Travores. How can I help you realize your dream journey today?",
            sender: 'bot',
            options: [
                { label: "Plan a Trip ✈️", action: () => handleAction('plan') },
                { label: "Browse Packages 📦", action: () => handleAction('browse') },
                { label: "Talk to Support 💬", action: () => handleAction('support') },
            ]
        }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        // Show greeting after 2 seconds
        const timer = setTimeout(() => {
            if (!isOpen) setShowGreeting(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, [isOpen]);

    const handleAction = (action: string) => {
        let userMsg = "";
        let botResponse: Message = { id: Date.now(), text: "", sender: 'bot' };

        switch (action) {
            case 'plan':
                userMsg = "I want to plan a custom trip.";
                botResponse = {
                    id: Date.now() + 1,
                    text: "That's exciting! I can take you to our Itinerary Builder where you can customize every detail.",
                    sender: 'bot',
                    options: [
                        { label: "Go to Itinerary Builder", action: () => { setIsOpen(false); navigate('/plan-my-trip'); } }
                    ]
                };
                break;
            case 'browse':
                userMsg = "I'd like to browse existing packages.";
                botResponse = {
                    id: Date.now() + 1,
                    text: "Great choice! We have some amazing curated packages for you.",
                    sender: 'bot',
                    options: [
                        { label: "View All Packages", action: () => { setIsOpen(false); navigate('/packages'); } }
                    ]
                };
                break;
            case 'support':
                userMsg = "I need to talk to support.";
                botResponse = {
                    id: Date.now() + 1,
                    text: "Our community experts are ready to help! You can chat with us on WhatsApp.",
                    sender: 'bot',
                    options: [
                        { label: "Chat on WhatsApp", action: () => window.open('https://wa.me/919398281078', '_blank') }
                    ]
                };
                break;
            default:
                break;
        }

        setMessages(prev => [
            ...prev,
            { id: Date.now(), text: userMsg, sender: 'user' },
            botResponse
        ]);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Greeting Bubble */}
            <div
                className={`
                    absolute bottom-20 right-0 bg-white p-4 rounded-2xl shadow-xl w-64 
                    transition-all duration-500 transform origin-bottom-right border border-gray-100
                    ${showGreeting && !isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'}
                `}
            >
                <div className="relative">
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowGreeting(false); }}
                        className="absolute -top-2 -right-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                    <p className="text-gray-700 text-sm font-medium leading-relaxed">
                        👋 Hi! Need help planning your dream trip?
                    </p>
                    <div className="absolute -bottom-6 right-6 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-100 hidden"></div>
                </div>
            </div>

            {/* Trigger Button */}
            <button
                onClick={() => { setIsOpen(!isOpen); setShowGreeting(false); }}
                className={`${isOpen ? 'rotate-90 opacity-0 pointer-events-none' : 'rotate-0 opacity-100'} absolute bottom-0 right-0 transition-all duration-300 bg-white hover:bg-gray-50 text-gray-800 w-16 h-16 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 flex items-center justify-center overflow-hidden border-2 border-white`}
            >
                <img
                    src="https://iili.io/KyD9NzF.png"
                    alt="Travores Chat"
                    className="w-full h-full object-cover"
                />
            </button>

            {/* Close Button (replaces trigger when open) */}
            <button
                onClick={() => setIsOpen(false)}
                className={`${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} absolute bottom-0 right-0 transition-all duration-300 bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center pointer-events-auto`}
            >
                <XMarkIcon className="w-8 h-8" />
            </button>

            {/* Chat Window */}
            <div
                className={`
          absolute bottom-20 right-0 w-[350px] sm:w-[380px] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10 pointer-events-none'}
        `}
            >
                {/* Header */}
                <div className="bg-travores-green p-4 flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                        <SparklesIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">Travores Assistant</h3>
                        <p className="text-green-100 text-xs flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                        </p>
                    </div>
                </div>

                {/* Messages Body */}
                <div className="h-[400px] overflow-y-auto p-4 bg-travores-sand/20 space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                        >
                            <div
                                className={`
                   max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                   ${msg.sender === 'user'
                                        ? 'bg-travores-green text-white rounded-tr-none'
                                        : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                                    }
                 `}
                            >
                                {msg.text}
                            </div>

                            {/* Options Chips */}
                            {msg.options && (
                                <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
                                    {msg.options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={opt.action}
                                            className="bg-white border border-travores-green text-travores-green text-xs font-semibold px-3 py-2 rounded-full hover:bg-travores-green hover:text-white transition-colors shadow-sm"
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Footer (Input placeholder) */}
                <div className="p-3 border-t bg-white">
                    <p className="text-center text-xs text-gray-400">
                        Automated Assistant • Powered by Travores
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
