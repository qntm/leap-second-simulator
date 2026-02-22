import { TaiConverter, MODELS, UNIX_START } from 't-a-i/nanos'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { About } from './About.tsx'
import { Main } from './Main.tsx'
import { PointsOfInterest } from './PointsOfInterest.tsx'
import {
  INITIAL_MODEL,
  INITIAL_PRECISION_OPTION,
  INITIAL_FPS,
  INITIAL_SCALE
} from '../options.tsx'
import { multiplyByScale } from '../utils.ts'

// TODO: add this to `t-a-i`
const ATOMIC_START = -283_996_798_577_182_000n

export const App = React.memo(() => {
  const [isHidden, setIsHidden] = useState(document.hidden)

  // Stop refreshing when page is hidden
  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      setIsHidden(document.hidden)
    })
  }, [])

  const [page, setPage] = useState('main')

  const handleClickQm = useCallback(() => {
    setPage('about')
  }, [])

  const handleClickX = useCallback(() => {
    setPage(page => page === 'main' ? 'about' : 'main')
  }, [])

  const handleClickMore = useCallback(() => {
    setPage('points')
  }, [])

  const [fps, setFps] = useState(INITIAL_FPS)
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

    // TODO: would be nice to attempt to hit exact fractions
    // of seconds? Especially at 1fps
    const interval = setInterval(() => {
      setNow(BigInt(Date.now()) * 1_000_000n)
    }, 1000 / fps)

    return () => {
      clearInterval(interval)
    }
  }, [fps, params, isHidden])

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

  const goToUnix = useCallback(unixNanos => {
    // Do not allow setting time to before UTC started
    if (unixNanos < UNIX_START) {
      unixNanos = BigInt(UNIX_START)
    }

    const atomicNanos = converter.unixToAtomic(unixNanos)
    goToAtomic(atomicNanos)
  }, [])

  const handleClickPoint = useCallback(point => {
    let unixNanos = BigInt(point.description === 'Present day' ? Date.now() : point.unixMillis) * 1_000_000n

    if (point.backTrack !== false) {
      if (model === MODELS.SMEAR) {
        unixNanos -= 43_200_000_000_000n
      }

      unixNanos -= multiplyByScale(10_000_000_000n, params.scale)
    }

    goToUnix(unixNanos)
    setPage('main')
  }, [converter, model, params])

  return (
    <>
      <div className='app'>
        <div className='controls-row'>
          <h1>qntm's leap second simulator</h1>
          <div className='buttons'>
            {page === 'main' && (
              <button className='secondary' onClick={handleClickQm}>
                ?
              </button>
            )}

            {page !== 'main' && (
              <button className='secondary' onClick={handleClickX}>
                ✕
              </button>
            )}
            {/* option for more buttons here */}
          </div>
        </div>

        {page === 'main' && (
          <Main
            converter={converter}
            fps={fps}
            getInitialParams={getInitialParams}
            goToUnix={goToUnix}
            goToAtomic={goToAtomic}
            handleClickMore={handleClickMore}
            handleClickPoint={handleClickPoint}
            model={model}
            now={now}
            params={params}
            precisionOption={precisionOption}
            setFps={setFps}
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
