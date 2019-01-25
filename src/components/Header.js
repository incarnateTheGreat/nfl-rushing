import React, { memo } from 'react';

const Header = (props) => {
	const { exportCSV,
			isPaginationActive,
			nextPage,
			pageNumber,  
			paginationClasses,
			paginationFromArrowClasses,
			paginationToArrowClasses,
			previousPage,
			search,
			togglePagination } = props;

	return (
		<header>
			<div className="header-container">
				<h2>NFL Rushing</h2>
				<nav>
					<div className="nav__interactive">
						<input type="checkbox" checked={isPaginationActive} onChange={togglePagination} />
						<span>Pagination</span>
						<div className={paginationClasses}>
							<span className={paginationFromArrowClasses} onClick={previousPage}></span>
							<span className="nav__interactive__pagination">Page {pageNumber}</span>
							<span className={paginationToArrowClasses} onClick={nextPage}></span>
						</div>
					</div>
					<input type="search" name="search" className="searchInput" placeholder="Search for a Player" onChange={search} />
					<button type="button" className="exportCSV" onClick={exportCSV}>Export CSV</button>
				</nav>
			</div>
	  	</header>
	)
};

export default memo(Header);
