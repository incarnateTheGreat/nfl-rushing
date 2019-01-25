import React, { memo, Fragment } from 'react';

const Row = (playerData) => {
	return (
        <Fragment>
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
        </Fragment>
    )
};

export default memo(Row);
