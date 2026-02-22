import React from 'react'

export const About = React.memo(() => {
  return (
    <>
      <h2>About this app</h2>
      <p>Under normal conditions, opportunities to see a leap second only occur once every 18 months or so. In recent times (as of 2026) there has been an extended dry spell of leap seconds; the most recent was on 31 December 2016. Furthermore, leap seconds <a href='https://en.wikipedia.org/wiki/Leap_second#Future'>may soon be abolished entirely</a>, which means there may <em>never</em> be another one.</p>
      <p>This app allows you to revisit past leap seconds. You can also visit a few other points of interest.</p>
      <p>Official sources are ambiguous and inconsistent about how the relationship between TAI and Unix time should be modelled during a leap second. This app provides <a href='https://github.com/qntm/t-a-i?tab=readme-ov-file#modelling-discontinuities'>several different options</a> for this. Try pausing during a leap second and switching between the models.</p>
      <p>You can slow time down to watch leap seconds happen in more detail, or accelerate time to watch the relationship between TAI and Unix time evolve over longer time periods.</p>
      <p>You can adjust the precision of the clock, from seconds down to nanoseconds.</p>
      <p>Time conversions are handled using my JavaScript package <a href='https://github.com/qntm/t-a-i'><code>t-a-i</code></a>.</p>
      <p><b>About me:</b> I am <a href='https://qntm.org/'>qntm</a>, a writer and software developer.</p>
      <p>🐋</p>
      <h3>Notes</h3>
      <ul>
        <li>Higher framerates may drain your device's battery.</li>
        <li>Framerates should be considered approximate. "1fps" is more like one frame every 1000 ± 15ms.</li>
      </ul>
    </>
  )
})

About.displayName = 'About'
