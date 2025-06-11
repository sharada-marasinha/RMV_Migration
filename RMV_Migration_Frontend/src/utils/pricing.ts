export const getSpecialNumberPrice = (category: string): number => {
  switch (category) {
    case 'MILESTONE':
      return 10000;
    case 'ONE_REPETITION':
      return 20000;
    case 'TWO_REPETITIONS':
      return 30000;
    case 'FULL_REPETITION':
      return 50000;
    case 'CHARACTER_BUMP':
      return 100000;
    default:
      return 7000;
  }
};

export const formatPrice = (price: number): string => {
  return `Rs. ${price.toLocaleString()}`;
};

export const getCategoryLabel = (category: string): string => {
  switch (category) {
    case 'MILESTONE':
      return 'Milestone Number';
    case 'ONE_REPETITION':
      return 'One Repetition';
    case 'TWO_REPETITIONS':
      return 'Two Repetitions';
    case 'FULL_REPETITION':
      return 'Full Repetition';
    case 'CHARACTER_BUMP':
      return 'Character Bump';
    default:
      return 'Normal';
  }
};

export const getCategoryBadgeColor = (category: string): string => {
  switch (category) {
    case 'MILESTONE':
      return 'bg-blue-100 text-blue-800';
    case 'ONE_REPETITION':
      return 'bg-green-100 text-green-800';
    case 'TWO_REPETITIONS':
      return 'bg-yellow-100 text-yellow-800';
    case 'FULL_REPETITION':
      return 'bg-purple-100 text-purple-800';
    case 'CHARACTER_BUMP':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};