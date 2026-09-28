import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';

interface DraggableChatButtonProps {
  onClick: () => void;
  isBottomNavVisible?: boolean;
}

export const DraggableChatButton: React.FC<DraggableChatButtonProps> = ({
  onClick,
  isBottomNavVisible = false,
}) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; buttonX: number; buttonY: number; moved: boolean }>({
    startX: 0,
    startY: 0,
    buttonX: 0,
    buttonY: 0,
    moved: false,
  });
  const buttonRef = useRef<HTMLDivElement>(null);

  // Initialize position on mount or resize
  useEffect(() => {
    const updateDefaultPosition = () => {
      if (typeof window === 'undefined') return;
      const defaultY = window.innerHeight - (isBottomNavVisible ? 88 : 32);
      const defaultX = window.innerWidth - 68;
      setPosition((prev) => prev ? {
        x: Math.min(prev.x, window.innerWidth - 64),
        y: Math.min(prev.y, window.innerHeight - 64)
      } : { x: defaultX, y: defaultY });
    };

    updateDefaultPosition();
    window.addEventListener('resize', updateDefaultPosition);
    return () => window.removeEventListener('resize', updateDefaultPosition);
  }, [isBottomNavVisible]);

  // Adjust Y when bottom nav appears/disappears if user hasn't custom dragged it
  useEffect(() => {
    if (!dragStartRef.current.moved && position) {
      const targetY = window.innerHeight - (isBottomNavVisible ? 88 : 32);
      setPosition((prev) => prev ? { ...prev, y: targetY } : null);
    }
  }, [isBottomNavVisible]);

  // Mouse drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!position) return;
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      buttonX: position.x,
      buttonY: position.y,
      moved: dragStartRef.current.moved,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - dragStartRef.current.startX;
      const deltaY = moveEvent.clientY - dragStartRef.current.startY;
      const dist = Math.hypot(deltaX, deltaY);
      if (dist > 4) {
        dragStartRef.current.moved = true;
      }
      const newX = Math.max(12, Math.min(window.innerWidth - 64, dragStartRef.current.buttonX + deltaX));
      const newY = Math.max(12, Math.min(window.innerHeight - 64, dragStartRef.current.buttonY + deltaY));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setIsDragging(false);
      const dist = Math.hypot(
        upEvent.clientX - dragStartRef.current.startX,
        upEvent.clientY - dragStartRef.current.startY
      );
      if (dist < 6) {
        onClick();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Touch drag handling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!position) return;
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      buttonX: position.x,
      buttonY: position.y,
      moved: dragStartRef.current.moved,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartRef.current.startX;
    const deltaY = touch.clientY - dragStartRef.current.startY;
    const dist = Math.hypot(deltaX, deltaY);
    if (dist > 4) {
      dragStartRef.current.moved = true;
    }
    const newX = Math.max(12, Math.min(window.innerWidth - 64, dragStartRef.current.buttonX + deltaX));
    const newY = Math.max(12, Math.min(window.innerHeight - 64, dragStartRef.current.buttonY + deltaY));
    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    const touch = e.changedTouches[0];
    const dist = Math.hypot(
      touch.clientX - dragStartRef.current.startX,
      touch.clientY - dragStartRef.current.startY
    );
    if (dist < 8) {
      onClick();
    }
  };

  if (!position) return null;

  return (
    <div
      ref={buttonRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`fixed z-50 select-none cursor-grab active:cursor-grabbing transition-shadow duration-200 ${
        isDragging ? 'scale-110 shadow-2xl opacity-95' : 'hover:scale-105 shadow-xl'
      }`}
      title="Moveable Chat & Support Button (Drag anywhere)"
      aria-label="Contact Support"
    >
      <div className="relative group">
        <button
          type="button"
          className="w-13 h-13 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/40 flex items-center justify-center cursor-pointer transition-transform"
        >
          <MessageCircle className="w-6 h-6 fill-white text-blue-600" />
        </button>

        {/* Small badge dot to indicate movable */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
        </span>
      </div>
    </div>
  );
};
