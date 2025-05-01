import React from 'react';

const Star = ({ selectedStarCount, setSelectedStarCount }) => {
  const [hoveredStarIndex, setHoveredStarIndex] = React.useState(null);

  return (
    <>
      <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => {
          const isFilled = index < (hoveredStarIndex ?? selectedStarCount);
          return (
            <span
              key={index}
              className={`text-3xl cursor-pointer transition-colors duration-150 ${
                isFilled ? 'text-yellow-400' : 'text-gray-300'
              }`}
              onClick={() => setSelectedStarCount(index + 1)}
              onMouseEnter={() => setHoveredStarIndex(index + 1)}
              onMouseLeave={() => setHoveredStarIndex(null)}
            >
              &#9733;
            </span>
          );
        })}
      </div>
    </>
  );
};

export default Star;
