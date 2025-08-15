import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check, X, Edit3, Trash2, Calendar, Flag } from 'lucide-react';

const TodoItem = ({ 
  todo, 
  onToggle, 
  onDelete, 
  onUpdate,
  index 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isHovered, setIsHovered] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, { ...todo, text: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-green-500 bg-green-50 border-green-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const isOverdue = date < today && !todo.completed;
    
    return (
      <span className={`text-xs flex items-center gap-1 ${
        isOverdue ? 'text-red-500' : 'text-gray-500'
      }`}>
        <Calendar className="w-3 h-3" />
        {date.toLocaleDateString()}
        {isOverdue && <span className="font-medium">(Overdue)</span>}
      </span>
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        duration: 0.3,
        delay: index * 0.05,
        layout: { duration: 0.3 }
      }}
      className={`group relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 ${
        todo.completed ? 'bg-gray-50 border-gray-100' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Priority indicator */}
      {todo.priority && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
            getPriorityColor(todo.priority).split(' ')[1]
          }`}
        />
      )}

      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            todo.completed
              ? 'bg-blue-500 border-blue-500 text-white'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          {todo.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Check className="w-3 h-3" />
            </motion.div>
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <motion.p
                layout
                className={`text-sm leading-relaxed transition-all duration-200 ${
                  todo.completed
                    ? 'text-gray-500 line-through'
                    : 'text-gray-900'
                }`}
              >
                {todo.text}
              </motion.p>
              
              {/* Metadata */}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {todo.category && (
                  <span className="px-2 py-1 bg-gray-100 rounded-full">
                    {todo.category}
                  </span>
                )}
                
                {todo.priority && (
                  <span className={`px-2 py-1 rounded-full border flex items-center gap-1 ${
                    getPriorityColor(todo.priority)
                  }`}>
                    <Flag className="w-3 h-3" />
                    {todo.priority}
                  </span>
                )}
                
                {todo.dueDate && formatDate(todo.dueDate)}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ 
            opacity: isHovered || isEditing ? 1 : 0,
            x: isHovered || isEditing ? 0 : 10
          }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1"
        >
          {!isEditing && (
            <>
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEdit}
                className="p-2 text-gray-400 hover:text-blue-500 rounded-lg transition-colors"
                title="Edit todo"
              >
                <Edit3 className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: '#fef2f2' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(todo.id)}
                className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                title="Delete todo"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </motion.div>
      </div>

      {/* Progress indicator for subtasks */}
      {todo.subtasks && todo.subtasks.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: `${(todo.subtasks.filter(s => s.completed).length / todo.subtasks.length) * 100}%`
                }}
                transition={{ duration: 0.3 }}
                className="bg-blue-500 h-full rounded-full"
              />
            </div>
            <span>
              {todo.subtasks.filter(s => s.completed).length}/{todo.subtasks.length}
            </span>
          </div>
        </div>
      )}

      {/* Completion animation overlay */}
      {todo.completed && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          className="absolute inset-0 bg-green-500 rounded-xl pointer-events-none"
        />
      )}
    </motion.div>
  );
};

export default TodoItem;