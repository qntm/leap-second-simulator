import PropTypes from 'prop-types'
import React from 'react'

import { POINTS_OF_INTEREST } from '../options.tsx'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const PointsOfInterest = React.memo(({ handleClickPoint }) => {
  return (
    <>
      <h2>Points of interest</h2>
      <table className='points-of-interest'>
        {POINTS_OF_INTEREST.map((point, i, points) => {
          const date = new Date(point.unixMillis)
          return (
            <tr key={i}>
              <td>
                <button
                  style={{ width: '100%' }}
                  onClick={() => handleClickPoint(point)}
                >
                  {date.getUTCDate()}&nbsp;{MONTHS[date.getUTCMonth()]}&nbsp;{date.getUTCFullYear()}
                </button>
              </td>
              {point.description !== undefined && (
                <td>
                  {point.description}
                </td>
              )}
            </tr>
          )
        })}
      </table>
    </>
  )
})

PointsOfInterest.displayName = 'PointsOfInterest'
PointsOfInterest.propTypes = {
  handleClickPoint: PropTypes.func.isRequired
}
