'use client';

import { useState, useCallback } from 'react';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import FloatingChatButton from '@/components/FloatingChatButton';
import Chatbot from '@/components/Chatbot';

export default function Page() {
  const [chatOpen, setChatOpen] = useState(false);
  const openChat = useCallback(() => setChatOpen(true), []);
  const closeChat = useCallback(() => setChatOpen(false), []);

  return (
    <>
      <Hero onOpenChat={openChat} />
      <Footer />
      <FloatingChatButton onClick={openChat} isOpen={chatOpen} />
      <Chatbot isOpen={chatOpen} onClose={closeChat} />
    </>
  );
}
