import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <ul className="pagination justify-content-end">
      <li className="page-item">
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
      </li>
      
      <li className="page-item">
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
