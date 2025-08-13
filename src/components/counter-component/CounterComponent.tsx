'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useCounter } from '@/context/CounterContext';

interface CounterProps {
  counterIdToEdit?: string;
}

const CounterComponent: React.FC<CounterProps> = ({ counterIdToEdit }) => {
  const [title, setTitle] = useState('');
  const [count, setCount] = useState<number | string>('');
  const [description, setDescription] = useState('');

  const { addCounter, updateCounter, counters } = useCounter();

  useEffect(() => {
    if (counterIdToEdit) {
      const counterToEdit = counters.find(c => c._id === counterIdToEdit);
      if (counterToEdit) {
        setTitle(counterToEdit.title);
        setCount(counterToEdit.count);
        setDescription(counterToEdit.description);
      }
    }
  }, [counterIdToEdit, counters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const counterData = {
      title,
      count: Number(count),
      description,
    };
    
    try {
      if (counterIdToEdit) {
        await updateCounter(counterIdToEdit, counterData);
        alert('Counter updated successfully!');
      } else {
        await addCounter(counterData);
        alert('Counter created successfully!');
        // Clear form after successful submission
        setTitle('');
        setCount('');
        setDescription('');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <ComponentCard title={counterIdToEdit ? 'Edit Counter' : 'Add New Counter'}>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* --- Title --- */}
          <div>
            <Label htmlFor="counterTitle">Counter Title</Label>
            <Input
              id="counterTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Counter title"
              required
            />
          </div>

          {/* --- Count --- */}
          <div>
            <Label htmlFor="counterCount">Count</Label>
            <Input
              id="counterCount"
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="Enter count"
              required
            />
          </div>

          {/* --- Description (Textarea) --- */}
          <div>
            <Label htmlFor="counterDescription">Description</Label>
            <textarea
              id="counterDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Counter description"
              rows={6}
              className="w-full p-2 border border-gray-300 dark:border-dark-700 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-500 dark:bg-dark-800 dark:text-dark-100"
              required
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {counterIdToEdit ? 'Update Counter' : 'Add Counter'}
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
};

export default CounterComponent;