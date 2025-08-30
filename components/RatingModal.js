import { useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useTranslation } from '../lib/translations';

export function RatingModal({ game, isOpen, onClose, onRatingSubmit, userId }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslation();

  const ratingOptions = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/games/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          rawgGameId: game.id,
          rating,
          review: review.trim() || undefined,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        onRatingSubmit(result);
        onClose();
      } else {
        const error = await response.json();
        console.error('Rating failed:', error);
        alert('Failed to submit rating. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setReview('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="p-8 max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t.rateGame}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {game.name}
          </p>
        </div>

        {/* Rating Stars */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t.selectRating}
          </label>
          <div className="flex flex-wrap gap-2 justify-center">
            {ratingOptions.map((value) => (
              <button
                key={value}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
                  rating >= value || hoverRating >= value
                    ? 'bg-yellow-100 border-yellow-400 text-yellow-700 dark:bg-yellow-900 dark:border-yellow-600 dark:text-yellow-300'
                    : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                } hover:scale-105`}
              >
                <span className="text-lg">⭐</span>
                <span className="ml-1 font-medium">{value}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Review Textarea */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.review} ({t.optional})
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder={t.reviewPlaceholder}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
            rows={4}
            maxLength={500}
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
            {review.length}/500
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting ? t.submitting : t.submitRating}
          </Button>
        </div>
      </Card>
    </div>
  );
}
