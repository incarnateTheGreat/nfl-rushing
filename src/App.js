import React, { Component } from 'react';
import { DOWN_ARROW,
		 LEFT_ARROW,
		 RIGHT_ARROW,
		 UP_ARROW} from './constants/constants';
import classNames from 'classnames';
import { rushingData } from './data/rushing.js';
import './styles/styles.scss';

// For the sake of cleaner data, parse out any letter characters that might impede sorting.
function formatDataInput(variable) {
	if (typeof variable === 'string') {
		variable = variable.replace(/\D/g,'');
	}

	return variable;
}

// Sort the Column Data.
function sortColumnData(columnData, col, sortOrder) {
	return columnData.sort((a, b) => {
		if (sortOrder === 'ASC') {
			return formatDataInput(a[col]) - formatDataInput(b[col]);
		} else if (sortOrder === 'DESC') {
			return formatDataInput(b[col]) - formatDataInput(a[col]);
		}

		return 0;
	});
}

class App extends Component {
  state = {
	fromRange: 0,
	isPaginationActive: true,
	pageNumber: 1,
	rushingData: null,
	rangePerPage: 50,
	result: null,
	query: null,
	sortOrder: 'ASC',
	sortColumn: null,
	toRange: 50
  };

clearArrows() {
	const columnElems = document.getElementsByClassName('table-container__table__columnHeader');

	// Find and Remove Arrow.
	for (let i = 0; i < columnElems.length; i++) {
		if (columnElems[i].children.length > 0) columnElems[i].removeChild(columnElems[i].children[0])
	}
}

exportCSV() {
	// Get the Headers.
	const headerRow = [...Object.keys(this.state.result[0])];

	// Print out the headers.
	let csv = headerRow.join(',') + '\n';

	// Loop through all lines of data and create rows.
	for (let line of this.getResultRows()) {
		csv += Object.values(line).map(e => {
			// Parse any comma Strings to Floats.
			if (typeof e === 'string' && e.indexOf(',') > -1) {
				e = parseFloat(e.replace(',',''))
			}

			return e;
		}).join(',') + '\n';
	}

	// Encode the CSV data and then allow the user to download the generated file.
	const encodedUri = encodeURI(csv);
	const link = document.createElement("a");
	link.setAttribute("href", "data:text/csv;charset=utf-8," + encodedUri);
	link.setAttribute("download", "nfl-rushing.csv");
	link.click();
}

getResultRows() {
	let result = [];

	if (this.state.result) {
		// Display Paginated results if there's sufficient data and Pagination is enabled.
		if (this.state.result.length >= 50 && this.state.isPaginationActive) {
			for (let i = this.state.fromRange; i <= this.state.toRange; i++) {
				if (this.state.result[i] !== undefined) {
					result.push(this.state.result[i]);
				}
			}
		} else {
			// Render everything.
			result = [...this.state.result];
		}
	}

	return result;
}

getSortOrder(sortOrder) {
	return sortOrder === 'ASC' ? UP_ARROW : DOWN_ARROW
}

nextPage() {
	// Pagination: navigate to the next page.
	if (this.state.toRange < this.state.result.length) {
		this.setState({
			fromRange: this.state.fromRange + 50,
			pageNumber: this.state.pageNumber + 1,
			toRange: this.state.toRange + 50
		})
	}
}

previousPage() {
	// Pagination: navigate to the previous page.
	if (this.state.pageNumber > 1) {
		this.setState({
			fromRange: this.state.fromRange - 50,
			pageNumber: (this.state.pageNumber > 1 ? this.state.pageNumber - 1 : this.state.pageNumber),
			toRange: this.state.toRange - 50
		});
	}
}

search(input) {
	// Search and return a Player using part of or the entire name.
	const regexp = new RegExp(input.target.value, 'i');
	let result = this.state.rushingData.filter(player => regexp.test(player.Player));

	// Persist sort order and column with searched data.
	if (result) {
		result = sortColumnData(result, this.state.sortColumn, this.state.sortOrder)
	}

	this.setState({
		fromRange: 0,
		pageNumber: 1,
		query: input.target.value,
		result,
		toRange: 50
	});
}

sortColumn(col, sortOrder, e) {
	const elem = e.currentTarget || null;

	// Change Order of Sort Direction.
	if (!sortOrder || sortOrder === 'ASC') {
		sortOrder = 'DESC';
	} else if (sortOrder === 'DESC') {
		sortOrder = 'ASC';
	}

	// Sort based on Sort Order and Data.
	const result = sortColumnData(this.state.result, col, sortOrder);

	// Clear the arrows in the headers.
	this.clearArrows();

	// Place Arrow in Clicked Column with updated direction.
	if (elem) {
		const arrowElem = `<span class='table-container__table__sortArrow'>${this.getSortOrder(sortOrder)}</span>`;
		elem.insertAdjacentHTML('beforeend', arrowElem);
	}

	this.setState({
		result,
		sortColumn: col,
		sortOrder
	});
}

togglePagination(e) {
	this.setState({
		isPaginationActive: e.target.checked
	})
}

// React Lifecycles
componentDidMount() {
	this.setState({
		rushingData,
		result: rushingData,
	}, () => {
		// Render Pagination Arrows.
		const left_arrow = document.getElementsByClassName("left_arrow")[0];
		const right_arrow = document.getElementsByClassName("right_arrow")[0];

		// Check to prevent test failures.
		if(left_arrow !== undefined) {
			left_arrow.insertAdjacentHTML('beforeend', LEFT_ARROW);
			right_arrow.insertAdjacentHTML('beforeend', RIGHT_ARROW);
		}
	});
}

render() {
	const result = this.getResultRows();
	const paginationClasses = classNames(
		'nav__interactive__pagination',
		this.state.isPaginationActive ? '' : '--inactive'
	);
	let paginationFromArrowClasses = null;
	let paginationToArrowClasses = null;

	// Set classes for Pagination controls.
	if (this.state.result) {
		paginationFromArrowClasses = classNames(
			'nav__interactive__nav_arrow left_arrow',
			this.state.pageNumber === 1 ? '--inactive' : ''
		);
		paginationToArrowClasses = classNames(
			'nav__interactive__nav_arrow right_arrow',
			this.state.toRange > this.state.result.length ? '--inactive' : ''
		);
	}

    return (
      <div className="App">
	  	<div className="container">
			<header>
				<div className="header-container">
					<h2>NFL Rushing</h2>
					<nav>
						<div className="nav__interactive">
							<input type="checkbox" checked={this.state.isPaginationActive} onChange={this.togglePagination.bind(this)} />
							<span>Pagination</span>
							<div className={paginationClasses}>
								<span className={paginationFromArrowClasses} onClick={this.previousPage.bind(this)}></span>
								<span className="nav__interactive__pagination">Page {this.state.pageNumber}</span>
								<span className={paginationToArrowClasses} onClick={this.nextPage.bind(this)}></span>
							</div>
						</div>
						<input type="search" name="search" className="searchInput" placeholder="Search for a Player" onChange={this.search.bind(this)} />
						<button type="button" className="exportCSV" onClick={this.exportCSV.bind(this)}>Export CSV</button>
					</nav>
				</div>
		  	</header>
			<section className="table-container">
				<div className="table-container__table">
					<div className='table-container__table__header table-container__row departures'>
						<div className='table-container__table__data table-container__table__columnHeader' title="Player's name">Player</div>
						<div className='table-container__table__data table-container__table__columnHeader' title="Player's team abreviation">Team</div>
						<div className='table-container__table__data table-container__table__columnHeader' title="Player's postion">Position</div>
						<div className='table-container__table__data table-container__table__columnHeader' title="Rushing Attempts">Att</div>
						<div className='table-container__table__data table-container__table__columnHeader' title="Rushing Attempts Per Game Average">Att/G</div>
						<div className='table-container__table__data table-container__table__columnHeader table-container__table__columnHeader--sortable'
							title="Total Rushing Yards"
							onClick={elem => this.sortColumn('Yds', this.state.sortOrder, elem)}>Yds</div>
						<div className='table-container__table__data table-container__table__columnHeader' title="Rushing Average Yards Per Attempt">Avg</div>
						<div className='table-container__table__data table-container__table__columnHeader' title="Rushing Yards Per Game">Yds/G</div>
						<div className='table-container__table__data table-container__table__columnHeader table-container__table__columnHeader--sortable'
							title="Total Rushing Touchdowns"
							onClick={elem => this.sortColumn('TD', this.state.sortOrder, elem)}>TD</div>
						<div className='table-container__table__data table-container__table__columnHeader table-container__table__columnHeader--sortable'
							title="Longest Rush"
							onClick={elem => this.sortColumn('Lng', this.state.sortOrder, elem)}>Lng</div>
						<div className='table-container__table__data table-container__table__columnHeader' title="Rushing First Downs">1st</div>
						<div className='table-container__table__data table-container__table__columnHeader' title="Rushing First Down Percentage">1st%</div>
						<div className='table-container__table__data table-container__table__columnHeader' title="Rushing 20+ Yards Each">20+</div>
						<div className='table-container__table__data table-container__table__columnHeader' title="Rushing 40+ Yards Each">40+</div>
						<div className='table-container__table__data table-container__table__columnHeader' title="Rushing Fumbles">FUM</div>
					</div>
					{result ? result.map((playerData, i) =>
					<div className='table-container__table__row' key={i}>
						<span className='table-container__table__data'>{playerData['Player']}</span>
						<span className='table-container__table__data'>{playerData['Team']}</span>
						<span className='table-container__table__data'>{playerData['Pos']}</span>
						<span className='table-container__table__data'>{playerData['Att']}</span>
						<span className='table-container__table__data'>{playerData['Att/G']}</span>
						<span className='table-container__table__data'>{playerData['Yds']}</span>
						<span className='table-container__table__data'>{playerData['Avg']}</span>
						<span className='table-container__table__data'>{playerData['Yds/G']}</span>
						<span className='table-container__table__data'>{playerData['TD']}</span>
						<span className='table-container__table__data'>{playerData['Lng']}</span>
						<span className='table-container__table__data'>{playerData['1st']}</span>
						<span className='table-container__table__data'>{playerData['1st%']}</span>
						<span className='table-container__table__data'>{playerData['20+']}</span>
						<span className='table-container__table__data'>{playerData['40+']}</span>
						<span className='table-container__table__data'>{playerData['FUM']}</span>
					</div>
					) : (<div className='table-container__table__row --no-data'>
						<span className='table-container__table__data'>None</span>
						</div>)}
				</div>
			</section>
		</div>
      </div>
    );
  }
}

export default App;
