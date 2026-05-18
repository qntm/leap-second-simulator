import { TaiConverter, MODELS } from 't-a-i/nanos'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { About } from './About.tsx'
import { Main } from './Main.tsx'
import { PointsOfInterest } from './PointsOfInterest.tsx'
import {
  INITIAL_MODEL,
  INITIAL_PRECISION_OPTION,
  INITIAL_SCALE
} from '../options.tsx'
import { multiplyByScale } from '../utils.tsx'

const ATOMIC_START = -283_996_798_577_182_000n

// `null` on main page
const getPageFromAddressBar = () => new URLSearchParams(location.search).get('page')

export const App = React.memo(() => {
  const [isHidden, setIsHidden] = useState(document.hidden)

  // Stop refreshing when page is hidden
  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      setIsHidden(document.hidden)
    })
  }, [])

  const [page, setPage] = useState(getPageFromAddressBar)

  const pushPage = useCallback(page => {
    const url = new URL(location)
    if (page === null) {
      url.searchParams.delete('page')
    } else {
      url.searchParams.set('page', page)
    }
    history.pushState({}, '', url)
    setPage(page)
  }, [])

  // Handle case where used clicks "Back"
  useEffect(() => {
    const onPopstate = () => {
      setPage(getPageFromAddressBar())
    }
    window.addEventListener('popstate', onPopstate)
    return () => {
      window.removeEventListener('popstate', onPopstate)
    }
  }, [setPage])

  const handleClickQm = useCallback(() => {
    pushPage('about')
  }, [pushPage])

  const handleClickX = useCallback(() => {
    pushPage(null)
  }, [pushPage])

  const handleClickMore = useCallback(() => {
    pushPage('points')
  }, [pushPage])

  const [model, setModel] = useState(INITIAL_MODEL)
  const [precisionOption, setPrecisionOption] = useState(INITIAL_PRECISION_OPTION)
  const [now, setNow] = useState(BigInt(Date.now()) * 1_000_000n)

  const converter = useMemo(() => TaiConverter(model), [model])

  const getInitialParams = useCallback(() => {
    const now = BigInt(Date.now()) * 1_000_000n
    return {
      offset: converter.unixToAtomic(now) - now,
      scale: INITIAL_SCALE,
      pausedAt: undefined
    }
  }, [converter])

  const [params, setParams] = useState(getInitialParams)

  useEffect(() => {
    if (params.pausedAt !== undefined || isHidden) {
      return
    }

    const interval = setInterval(() => {
      setNow(BigInt(Date.now()) * 1_000_000n)
    }, 1000 / 60)

    return () => {
      clearInterval(interval)
    }
  }, [params, isHidden])

  const goToAtomic = useCallback(atomicNanos => {
    const now = BigInt(Date.now()) * 1_000_000n
    setParams(({ scale, offset, pausedAt }) => {
      // Do not allow setting time to before UTC started
      if (atomicNanos < ATOMIC_START) {
        atomicNanos = ATOMIC_START
      }

      if (pausedAt !== undefined) {
        pausedAt = atomicNanos
      }
      offset = atomicNanos - multiplyByScale(now, scale)
      return { offset, scale, pausedAt }
    })
    setNow(now)
  }, [])

  const handleClickPoint = useCallback(point => {
    // This point in time is always guaranteed to exist.
    // Though it may be at the precise end of some removed time.
    let unixNanos = BigInt(point.description === 'Present day' ? Date.now() : point.unixMillis) * 1_000_000n

    // If there's a smear, backtrack through Unix time to the start of the smear
    if (
      model === MODELS.SMEAR && (
        // No point in accounting for the smear if there is no parameter
        // change to smear out
        point.offsetChange !== undefined ||
        point.driftRateChange !== undefined
      )
    ) {
      unixNanos -= 43_200_000_000_000n
    }

    // If we're in stall mode, we want the START of the stall
    let [atomicNanos] = converter.unixToAtomic(unixNanos, { range: true })

    // Back 10 seconds in atomic nanoseconds...
    // This is more accurate than Unix nanoseconds
    // and more importantly it avoids landing in possibly-removed time
    // (Old bug: set speed to 0.001x, then jump to 1 August 1961)
    if (point.backTrack !== false) {
      atomicNanos -= multiplyByScale(10_000_000_000n, params.scale)
    }

    goToAtomic(atomicNanos)
    pushPage(null)
  }, [converter, model, params, goToAtomic, pushPage])

  return (
    <>
      <div className='app'>
        <div className='controls-row'>
          <h1>qntm's leap second simulator</h1>
          <div className='buttons'>
            {page === null && (
              <button className='secondary' onClick={handleClickQm}>
                ?
              </button>
            )}

            {page !== null && (
              <button className='secondary' onClick={handleClickX}>
                ✕
              </button>
            )}
            {/* option for more buttons here */}
          </div>
        </div>

        {page === null && (
          <Main
            converter={converter}
            getInitialParams={getInitialParams}
            goToAtomic={goToAtomic}
            handleClickMore={handleClickMore}
            handleClickPoint={handleClickPoint}
            model={model}
            now={now}
            params={params}
            precisionOption={precisionOption}
            setModel={setModel}
            setNow={setNow}
            setPrecisionOption={setPrecisionOption}
            setParams={setParams}
          />
        )}

        {page === 'about' && (
          <About />
        )}

        {page === 'points' && (
          <PointsOfInterest
            handleClickPoint={handleClickPoint}
          />
        )}
      </div>
    </>
  )
})

App.displayName = 'App'
