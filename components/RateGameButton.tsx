'use client';

import { useState } from 'react';

interface RateGameButtonProps {
  rawgGameId: number;
  userId: string;
  currentRating?: number;
  currentReview?: string;
  onRatingSuccess?: (data: any) => void;
}

export default function RateGameButton({ 
  rawgGameId, 
  userId, 
  currentRating, 
  currentReview,
  onRatingSuccess 
}: RateGameButtonProps) {
  const [isRating, setIsRating] = useState(false);
  const [rating, setRating] = useState(currentRating || 0);
  const [review, setReview] = useState(currentReview || '');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    setIsRating(true);
    
    try {
      const response = await fetch('/api/games/rate/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          rawgGameId,
          rating,
          review: review.trim() || undefined,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to rate game');
      }
      
      const data = await response.json();
      
      // Call success callback
      onRatingSuccess?.(data);
      
      // Close form
      setShowForm(false);
      
      alert(`Game rated successfully! New average: ${data.averageRating.toFixed(1)}`);
    } catch (error) {
      console.error('Error rating game:', error);
      alert(error instanceof Error ? error.message : 'Failed to rate game');
    } finally {
      setIsRating(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        {currentRating ? 'Update Rating' : 'Rate Game'}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <div>
        <label className="block text-sm font-medium mb-2">Rating (1-10)</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setRating(num)}
              className={`w-8 h-8 rounded ${
                rating >= num ? 'bg-yellow-400' : 'bg-gray-200'
              }`}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Review (optional)</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="Write your review..."
        />
      </div>
      
      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={isRating || rating === 0}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
        >
          {isRating ? 'Rating...' : 'Submit Rating'}
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}