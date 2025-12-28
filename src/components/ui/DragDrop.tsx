/**
 * Drag and Drop Hook & Components
 * Implements reorderable widgets using native HTML5 drag and drop
 */

import React, { useState, useCallback, createContext, useContext, useRef } from 'react';
import { GripVertical, X, Plus, Settings } from 'lucide-react';

// Types
export interface DraggableWidget {
  id: string;
  title: string;
  component: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  visible?: boolean;
}

interface DragDropContextType {
  widgets: DraggableWidget[];
  setWidgets: React.Dispatch<React.SetStateAction<DraggableWidget[]>>;
  draggedId: string | null;
  setDraggedId: (id: string | null) => void;
  moveWidget: (fromIndex: number, toIndex: number) => void;
  toggleWidgetVisibility: (id: string) => void;
  isEditMode: boolean;
  setEditMode: (mode: boolean) => void;
}

const DragDropContext = createContext<DragDropContextType | null>(null);

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};

// Provider Component
export const DragDropProvider: React.FC<{
  children: React.ReactNode;
  initialWidgets: DraggableWidget[];
  storageKey?: string;
}> = ({ children, initialWidgets, storageKey = 'widget-order' }) => {
  const [widgets, setWidgets] = useState<DraggableWidget[]>(() => {
    if (typeof window === 'undefined') return initialWidgets;

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const savedOrder = JSON.parse(saved) as { id: string; visible: boolean }[];
        // Merge saved order with initial widgets (in case new widgets were added)
        const orderedWidgets: DraggableWidget[] = [];

        savedOrder.forEach(saved => {
          const widget = initialWidgets.find(w => w.id === saved.id);
          if (widget) {
            orderedWidgets.push({ ...widget, visible: saved.visible });
          }
        });

        // Add any new widgets not in saved order
        initialWidgets.forEach(widget => {
          if (!orderedWidgets.find(w => w.id === widget.id)) {
            orderedWidgets.push(widget);
          }
        });

        return orderedWidgets;
      } catch {
        return initialWidgets;
      }
    }
    return initialWidgets;
  });

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isEditMode, setEditMode] = useState(false);

  const saveOrder = useCallback((newWidgets: DraggableWidget[]) => {
    const orderToSave = newWidgets.map(w => ({ id: w.id, visible: w.visible ?? true }));
    localStorage.setItem(storageKey, JSON.stringify(orderToSave));
  }, [storageKey]);

  const moveWidget = useCallback((fromIndex: number, toIndex: number) => {
    setWidgets(prev => {
      const newWidgets = [...prev];
      const [removed] = newWidgets.splice(fromIndex, 1);
      newWidgets.splice(toIndex, 0, removed);
      saveOrder(newWidgets);
      return newWidgets;
    });
  }, [saveOrder]);

  const toggleWidgetVisibility = useCallback((id: string) => {
    setWidgets(prev => {
      const newWidgets = prev.map(w =>
        w.id === id ? { ...w, visible: !(w.visible ?? true) } : w
      );
      saveOrder(newWidgets);
      return newWidgets;
    });
  }, [saveOrder]);

  return (
    <DragDropContext.Provider
      value={{
        widgets,
        setWidgets,
        draggedId,
        setDraggedId,
        moveWidget,
        toggleWidgetVisibility,
        isEditMode,
        setEditMode
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
};

// Draggable Widget Wrapper
export const DraggableWidgetWrapper: React.FC<{
  widget: DraggableWidget;
  index: number;
  children: React.ReactNode;
}> = ({ widget, index, children }) => {
  const { draggedId, setDraggedId, moveWidget, toggleWidgetVisibility, isEditMode } = useDragDrop();
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounterRef = useRef(0);

  const handleDragStart = (e: React.DragEvent) => {
    setDraggedId(widget.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());

    // Add drag image styling
    const elem = e.currentTarget as HTMLElement;
    elem.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedId(null);
    const elem = e.currentTarget as HTMLElement;
    elem.style.opacity = '1';
    setIsDragOver(false);
    dragCounterRef.current = 0;
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current++;
    if (draggedId && draggedId !== widget.id) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    dragCounterRef.current = 0;

    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (fromIndex !== index) {
      moveWidget(fromIndex, index);
    }
  };

  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-1 md:col-span-2',
    large: 'col-span-1 md:col-span-2 lg:col-span-3',
    full: 'col-span-full'
  };

  if (widget.visible === false && !isEditMode) {
    return null;
  }

  return (
    <div
      draggable={isEditMode}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        ${sizeClasses[widget.size || 'medium']}
        ${isDragOver ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${draggedId === widget.id ? 'opacity-50' : ''}
        ${widget.visible === false ? 'opacity-50' : ''}
        transition-all duration-200
      `}
    >
      <div className={`
        bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
        shadow-sm overflow-hidden h-full
        ${isEditMode ? 'cursor-move' : ''}
      `}>
        {/* Widget Header (only in edit mode) */}
        {isEditMode && (
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-400 cursor-grab active:cursor-grabbing" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {widget.title}
              </span>
            </div>
            <button
              onClick={() => toggleWidgetVisibility(widget.id)}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                widget.visible === false ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
              }`}
              title={widget.visible === false ? 'Visa widget' : 'Dölj widget'}
            >
              {widget.visible === false ? <Plus className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Widget Content */}
        <div className={widget.visible === false && isEditMode ? 'opacity-50 pointer-events-none' : ''}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Drag Drop Grid Container
export const DragDropGrid: React.FC<{
  children: React.ReactNode;
  columns?: number;
}> = ({ children, columns = 4 }) => {
  const { isEditMode, setEditMode, widgets, toggleWidgetVisibility } = useDragDrop();

  return (
    <div className="space-y-4">
      {/* Edit Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEditMode && (
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium animate-pulse">
              Redigeringsläge aktivt - dra för att ordna om
            </span>
          )}
        </div>
        <button
          onClick={() => setEditMode(!isEditMode)}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
            transition-colors
            ${isEditMode
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }
          `}
        >
          <Settings className="w-4 h-4" />
          {isEditMode ? 'Klar' : 'Anpassa'}
        </button>
      </div>

      {/* Hidden Widgets Panel (edit mode only) */}
      {isEditMode && widgets.some(w => w.visible === false) && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Dolda widgets:</p>
          <div className="flex flex-wrap gap-2">
            {widgets.filter(w => w.visible === false).map(widget => (
              <button
                key={widget.id}
                onClick={() => toggleWidgetVisibility(widget.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm hover:border-blue-500 transition-colors"
              >
                <Plus className="w-4 h-4 text-green-500" />
                {widget.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
        {children}
      </div>
    </div>
  );
};

// Simple reorderable list (alternative to grid)
export const ReorderableList: React.FC<{
  items: { id: string; content: React.ReactNode }[];
  onReorder: (newOrder: string[]) => void;
}> = ({ items, onReorder }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      const newItems = [...items];
      const [removed] = newItems.splice(draggedIndex, 1);
      newItems.splice(index, 0, removed);
      onReorder(newItems.map(item => item.id));
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={() => handleDrop(index)}
          onDragEnd={() => {
            setDraggedIndex(null);
            setDragOverIndex(null);
          }}
          className={`
            flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg border
            cursor-move transition-all
            ${draggedIndex === index ? 'opacity-50' : ''}
            ${dragOverIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 dark:border-gray-700'}
          `}
        >
          <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="flex-1">{item.content}</div>
        </div>
      ))}
    </div>
  );
};

export default DragDropProvider;
