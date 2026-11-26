// The home page. The live examples are in ../home/Demos.tsx.
import { useRef, type JSX } from 'react'
import { AccessForm } from '../components/AccessForm'
import { AllbluezLogo, FragmioMark } from '../components/Logos'
import { PlanCard } from '../components/Plans'
import { AppShot, AutoClipsDemo, BeforeAfter, BeforeAfterPoints, CaptionDemo, HeroWords, TryFrame, TryTemplates, TypePicker, useReveal } from '../home/Demos'
import { usePageMeta } from '../router'
import { site } from '../site'

/** The "Pro" tag: shown only once pricing is (from the first stable release). During the beta everything is free,
 *  so nothing on the site says what will be Pro. */
function Pro(): JSX.Element | null {
  return site.showPricing ? <span className="tag">Pro</span> : null
}

export function Home(): JSX.Element {
  usePageMeta(
    'Fragmio: turn one long video into many short clips',
    'Free offline Windows app. Cut one long video into Shorts, Reels and TikTok clips, add text and frames, and export them all at once.'
  )
  const root = useRef<HTMLDivElement>(null)
  useReveal(root)
  return (
    <div ref={root}>
      <section className="hero w">
        <div className="glow" />{' '}
        <span className="pill">
          <i />
          <span>{site.channelLabel}</span> · Windows 10 and 11 · Version <span>{site.version}</span>
        </span>{' '}
        <h1>
          Turn one long video into{' '}
          <span>
            <HeroWords />
          </span>
        </h1>{' '}
        <div className="ratios">
          <span>
            <b style={{ width: '9px', height: '15px' }} />
            9:16 Shorts, Reels, TikTok
          </span>
          <span>
            <b style={{ width: '11px', height: '14px' }} />
            4:5 Feed
          </span>
          <span>
            <b style={{ width: '13px', height: '13px' }} />
            1:1 Square
          </span>
          <span>
            <b style={{ width: '17px', height: '10px' }} />
            16:9 YouTube
          </span>
        </div>{' '}
        <p className="sub">
          Mark the moments in your stream, podcast or talk. Frame them for the phone, add titles and captions, and export every clip at once, right on your PC.
        </p>{' '}
        {site.invite && (
          <div id="get" className="haccess">
            <p>Fragmio is in private beta. Leave your email and we'll send you an invite code.</p>
            <AccessForm buttonClass="btn" />
            <p className="havecode">
              Already have a code? <a href="/download">Download for Windows</a>
            </p>
          </div>
        )}{' '}
        <div className="cta">
          {!site.invite && site.downloads && (
            <a href="/download" className="btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 5.5l7.5-1v7H3zm0 13l7.5 1v-7H3zm8.5 1.2L21 21v-8.5h-9.5zm0-15.4v7.2H21V3z" />
              </svg>
              Download for Windows
            </a>
          )}
          <a className="btn ghost" href="#features">
            See how it works
          </a>
        </div>{' '}
        <div className="trust">
          <span>Works offline</span>
          <span>No account</span>
          <span>No watermark</span>
          <span>AI clips and captions</span>
          <span>GPU export</span>
          <span>Up to 4K</span>
        </div>{' '}
        <TypePicker />{' '}
        <AppShot />{' '}
      </section>{' '}
      <section className="reveal plat w">
        <h2>Export once, sized for every app</h2>
        <div className="pgrid">
          {' '}
          <div className="pc">
            <span className="r">
              <b style={{ width: '9px', height: '15px' }} />
            </span>
            <div>
              <strong>YouTube Shorts</strong>
              <small>9:16 · up to 4K</small>
            </div>
          </div>{' '}
          <div className="pc">
            <span className="r">
              <b style={{ width: '9px', height: '15px' }} />
            </span>
            <div>
              <strong>Instagram Reels</strong>
              <small>9:16 · safe areas</small>
            </div>
          </div>{' '}
          <div className="pc">
            <span className="r">
              <b style={{ width: '9px', height: '15px' }} />
            </span>
            <div>
              <strong>TikTok</strong>
              <small>9:16 · 1080×1920</small>
            </div>
          </div>{' '}
          <div className="pc">
            <span className="r">
              <b style={{ width: '11px', height: '14px' }} />
            </span>
            <div>
              <strong>Facebook</strong>
              <small>4:5 or 9:16</small>
            </div>
          </div>{' '}
          <div className="pc">
            <span className="r">
              <b style={{ width: '13px', height: '13px' }} />
            </span>
            <div>
              <strong>LinkedIn</strong>
              <small>1:1 or 4:5</small>
            </div>
          </div>{' '}
          <div className="pc">
            <span className="r">
              <b style={{ width: '17px', height: '10px' }} />
            </span>
            <div>
              <strong>YouTube</strong>
              <small>16:9 · 4K</small>
            </div>
          </div>{' '}
        </div>
      </section>{' '}
      <section className="reveal feat" id="how">
        <div className="w">
          {' '}
          <div className="center">
            <h2>How it works</h2>
            <p>From one long video to a folder of clips in three steps.</p>
          </div>{' '}
          <ol className="how-steps">
            {' '}
            <li>
              <div className="sv sv1">
                <div className="file">
                  <i />
                  <b>stream_full.mp4</b>
                  <small>2 h 14 min · 4K</small>
                </div>
              </div>
              <h3>Open your video</h3>
              <p>A stream, podcast, class or vlog, up to 4K, as MP4 or MKV. It stays on your PC.</p>
            </li>{' '}
            <li>
              <div className="sv sv2">
                <div className="mini-tl">
                  <div className="mw" />
                  <i style={{ left: '14%', width: '16%' }} />
                  <i style={{ left: '46%', width: '12%' }} />
                  <i style={{ left: '74%', width: '14%' }} />
                </div>
                <span className="sv-note">Auto clips, or mark your own with I and O</span>
              </div>
              <h3>Find the moments</h3>
              <p>Let Fragmio pick the best parts, or mark them yourself.</p>
            </li>{' '}
            <li>
              <div className="sv sv3">
                <div className="ph9">
                  <i />
                  <span>
                    WAIT FOR <em>IT</em>
                  </span>
                </div>
                <div className="ph9 sp">
                  <i />
                  <i />
                </div>
                <div className="ph9">
                  <i />
                  <span>
                    THE <em>ONE</em> TIP
                  </span>
                </div>
              </div>
              <h3>Export them all</h3>
              <p>Every clip framed and captioned, ready for Shorts, Reels and TikTok.</p>
            </li>{' '}
          </ol>
        </div>
      </section>{' '}
      <section className="reveal feat alt" id="features">
        <div className="w fg rev">
          {' '}
          <div className="tx">
            <span className="eyebrow">
              Auto clips <Pro />
            </span>
            <h2>Let Fragmio find the clips for you.</h2>
            <p>Auto clips listens to your video, picks the best moments and frames each one for the phone, with captions. It all runs on your PC.</p>{' '}
            <ul className="points">
              <li>
                <span>
                  <b>Gaming or Talking:</b> big reactions from the sound, or strong lines from what is said.
                </span>
              </li>
              <li>
                <span>
                  <b>Framed around the faces:</b> one person fills the screen, two get a Split, a facecam goes over the gameplay.
                </span>
              </li>
              <li>
                <span>
                  <b>AI captions</b> in English, Hindi and Hinglish (in Roman letters), timed to every word.
                </span>
              </li>
              <li>
                <span>
                  <b>Fast on your graphics card</b>, and still works on the processor.
                </span>
              </li>
              <li>
                <span>
                  <b>Every moment becomes a normal clip</b> you can trim, restyle or delete. Find more never repeats one.
                </span>
              </li>
            </ul>
          </div>{' '}
          <AutoClipsDemo />{' '}
        </div>
      </section>{' '}
      <section className="reveal feat" id="before-after">
        <div className="w fg">
          {' '}
          <div className="tx">
            <span className="eyebrow">Before and after</span>
            <h2>From a wide recording to a clip made for the phone.</h2>
            <p>Drag the line to compare. Fragmio picks the layout from who is on screen.</p> <BeforeAfterPoints />
          </div>{' '}
          <BeforeAfter />{' '}
        </div>
      </section>{' '}
      <section className="reveal feat alt">
        <div className="w fg rev">
          {' '}
          <div className="tx">
            <span className="eyebrow">Mark</span>
            <h2>Find the moments. Mark them in seconds.</h2>
            <p>Play your video and press I and O. Each range becomes a clip you can trim, rename and reorder on the timeline.</p>{' '}
            <ul className="points">
              <li>
                <span>
                  <b>Thumbnails and waveform</b> so you see where the action and the talking are.
                </span>
              </li>
              <li>
                <span>
                  <b>Markers</b> for ideas you want to come back to.
                </span>
              </li>
              <li>
                <span>
                  <b>Projects save themselves</b>, and recover if Windows closes the app.
                </span>
              </li>
            </ul>
          </div>{' '}
          <div className="panel markp">
            <div className="ruler" />
            <div className="track" style={{ margin: '6px 0' }}>
              <i style={{ left: '0' }} />
              <i style={{ left: '14%' }} />
              <i style={{ left: '28%' }} />
              <i style={{ left: '42%' }} />
              <i style={{ left: '56%' }} />
              <i style={{ left: '70%' }} />
              <i style={{ left: '84%' }} />
              <div className="clip" style={{ left: '8%', width: '18%' }}>
                <b>1</b>
              </div>
              <div className="clip" style={{ left: '40%', width: '14%' }}>
                <b>2</b>
              </div>
              <div className="clip" style={{ left: '70%', width: '11%' }}>
                <b>3</b>
              </div>
              <div className="head" style={{ left: '52%' }} />
            </div>
            <div className="wave" />{' '}
            <div className="keys">
              <span>
                <span className="kbd">I</span> Mark in
              </span>
              <span>
                <span className="kbd">O</span> Mark out
              </span>
              <span>
                <span className="kbd">M</span> Marker
              </span>
              <span>
                <span className="kbd">Space</span> Play
              </span>
            </div>
          </div>{' '}
        </div>
      </section>{' '}
      <section className="reveal feat">
        <div className="w fg">
          {' '}
          <div className="tx">
            <span className="eyebrow">Frame</span>
            <h2>One video, framed for the phone.</h2>
            <p>Crop the speaker, split two people top and bottom, or place the whole frame on a background. Each clip keeps its own framing.</p>{' '}
            <ul className="points">
              <li>
                <span>
                  <b>Fill, Split, Trio, Picture in picture and On background</b> layouts.
                </span>
              </li>
              <li>
                <span>
                  <b>Five shapes:</b> 9:16, 4:5, 1:1, 4:3 and 16:9.
                </span>
              </li>
              <li>
                <span>
                  <b>Backgrounds:</b> blur, colour, gradient or your own picture.
                </span>
              </li>
            </ul>
          </div>{' '}
          <TryFrame />{' '}
        </div>
      </section>{' '}
      <section className="reveal feat alt" id="text">
        <div className="w fg rev">
          {' '}
          <div className="tx">
            <span className="eyebrow">Text</span>
            <h2>Titles and captions that look made, not added.</h2>
            <p>Fifteen ready text styles, any font on your computer, and highlighted words. Change anything, then save it as your own style.</p>{' '}
            <ul className="points">
              <li>
                <span>
                  <b>Captions your way:</b> paste text, import .srt, tap a key as each line starts, or let AI write them.
                </span>
              </li>
              <li>
                <span>
                  <b>Highlight words</b> by writing them between stars.
                </span>
              </li>
              <li>
                <span>
                  <b>Boxes, outlines, shadows and tilt</b> for every style.
                </span>
              </li>
              <li>
                <span>
                  <b>Timing and fades</b> for each text.
                </span>
              </li>
            </ul>
          </div>{' '}
          <CaptionDemo />{' '}
        </div>
      </section>{' '}
      <section className="reveal feat" id="templates">
        <div className="w">
          {' '}
          <div className="center">
            <span className="eyebrow">Templates and frames</span>
            <h2>Start from a finished look.</h2>
            <p>Thirty templates and thirty frames for single, split and trio clips. Apply one, swap the words, done. Copy a look to every clip in one click.</p>
          </div>{' '}
          <TryTemplates />
        </div>
      </section>{' '}
      <section className="reveal feat alt">
        <div className="w fg">
          {' '}
          <div className="tx">
            <span className="eyebrow">Export</span>
            <h2>Every clip, exported in one go.</h2>
            <p>Choose the clips, pick a size and quality, and let Fragmio work through the list. It uses your graphics card when it can.</p>{' '}
            <ul className="points">
              <li>
                <span>
                  <b>Standard, Original or 4K</b> sizes.
                </span>
              </li>
              <li>
                <span>
                  <b>Skip, cancel and retry</b> any clip while it runs.
                </span>
              </li>
              <li>
                <span>
                  <b>What you see is what you get:</b> the export matches the preview.
                </span>
              </li>
            </ul>
          </div>{' '}
          <div className="panel">
            <div className="exp-rows" id="exprows">
              {' '}
              <div className="er">
                <span className="th" />
                <div>
                  The big reveal.mp4
                  <div className="bar">
                    <b style={{ width: '100%' }} />
                  </div>
                </div>
                <small>Done</small>
              </div>{' '}
              <div className="er">
                <span className="th" style={{ background: 'linear-gradient(160deg,var(--a),color-mix(in srgb,var(--g2) 55%,#fff))' }} />
                <div>
                  Best advice.mp4
                  <div className="bar">
                    <b style={{ width: '62%' }} />
                  </div>
                </div>
                <small>62%</small>
              </div>{' '}
              <div className="er">
                <span className="th" style={{ background: 'linear-gradient(160deg,var(--g2),var(--g1))' }} />
                <div>
                  Funny moment.mp4
                  <div className="bar">
                    <b style={{ width: '0' }} />
                  </div>
                </div>
                <small>Waiting</small>
              </div>
            </div>{' '}
            <div className="stats">
              <div>
                <b>4K</b>
                <span>Largest size</span>
              </div>
              <div>
                <b>NVENC</b>
                <span>GPU encoding</span>
              </div>
              <div>
                <b>MP4</b>
                <span>Ready to upload</span>
              </div>
            </div>
          </div>{' '}
        </div>
      </section>{' '}
      <section className="reveal feat" id="all">
        <div className="w">
          {' '}
          <div className="center">
            <h2>Everything in Fragmio</h2>
            <p>
              The full list.
              {site.showPricing && (
                <span>
                  {' '}
                  Items marked <span className="tag">Pro</span> come with Fragmio Pro.
                </span>
              )}
            </p>
            {site.showPricing && (
              <p>
                <a className="btn" href={site.buyProUrl}>
                  Buy Fragmio Pro
                </a>
              </p>
            )}
          </div>{' '}
          <div className="allf">
            {' '}
            <div className="af">
              <h3>Projects</h3>
              <ul>
                <li>Home screen with your recent projects</li>
                <li>Project files that point to your video, never copy it</li>
                <li>Saves itself, and recovers after a crash</li>
                <li>Finds moved videos again with one Locate</li>
                <li>Undo and redo for every change</li>
              </ul>
            </div>{' '}
            <div className="af">
              <h3>Timeline</h3>
              <ul>
                <li>Mark In and Out with I and O</li>
                <li>Video thumbnails and sound waveform</li>
                <li>Drag, trim, move and rename clips</li>
                <li>Markers for ideas, with jump to next and previous</li>
                <li>Frame-by-frame steps, faster forward and backward</li>
                <li>Loop a clip while you work on it</li>
                <li>Zoom from the whole video to single frames</li>
                <li>
                  Unlimited clips on the timeline <Pro />
                </li>
              </ul>
            </div>{' '}
            <div className="af">
              <h3>Framing</h3>
              <ul>
                <li>Fill, Split, Trio and On background layouts</li>
                <li>Picture in picture: a facecam in a corner, as a box or a circle</li>
                <li>9:16, 4:5, 1:1, 4:3 and 16:9 shapes</li>
                <li>Framing, Editing and Preview views</li>
                <li>Move and zoom the picture, with snapping</li>
                <li>Speed from 0.5× to 2×</li>
                <li>Save a look as a preset, copy it to every clip</li>
              </ul>
            </div>{' '}
            <div className="af">
              <h3>Backgrounds</h3>
              <ul>
                <li>Blur of the video itself</li>
                <li>Colour or gradient, with recent colours</li>
                <li>Your own picture: position, zoom and blur</li>
                <li>Dim to make the video stand out</li>
              </ul>
            </div>{' '}
            <div className="af">
              <h3>Text</h3>
              <ul>
                <li>15 ready text styles</li>
                <li>Any font on your PC, plus 12 included fonts</li>
                <li>Highlighted *words*</li>
                <li>Boxes, outlines, shadows and tilt</li>
                <li>Timing and fades for each text</li>
                <li>Stickers, and your logo on every clip</li>
                <li>
                  Save your own styles
                  {site.showPricing && (
                    <>
                      {' '}
                      <Pro /> for more than 3
                    </>
                  )}
                </li>
              </ul>
            </div>{' '}
            <div className="af">
              <h3>Captions</h3>
              <ul>
                <li>Paste text, or import .srt, .vtt or .txt</li>
                <li>Tap to time: tap a key as each line starts</li>
                <li>Speaker names before a line</li>
                <li>Split, join, and shift all captions</li>
                <li>Style all lines, or one on its own</li>
                <li>Save captions as .srt</li>
                <li>
                  AI captions, offline <Pro />
                </li>
                <li>
                  Auto-sync pasted lines to the voice <Pro />
                </li>
              </ul>
            </div>{' '}
            <div className="af">
              <h3>Auto clips</h3>
              <ul>
                <li>Gaming and Talking modes</li>
                <li>Clip length 15–30, 30–60 or 60–90 s</li>
                <li>Layout chosen from the faces, or one you pick (including Picture in picture)</li>
                <li>Captions added from what was heard</li>
                <li>Review list with score, reason and preview</li>
                <li>Find more, never the same moment twice</li>
                <li>
                  {site.showPricing ? (
                    <>
                      3 a day free; up to 20 at a time <Pro />
                    </>
                  ) : (
                    'Up to 20 at a time'
                  )}
                </li>
              </ul>
            </div>{' '}
            <div className="af">
              <h3>Templates and frames</h3>
              <ul>
                <li>30 templates for single, split and trio clips</li>
                <li>30 frames, applied in one click</li>
                <li>
                  Save your own
                  {site.showPricing && (
                    <>
                      {' '}
                      <Pro /> for more than 3
                    </>
                  )}
                </li>
              </ul>
            </div>{' '}
            <div className="af">
              <h3>Export</h3>
              <ul>
                <li>Opens MP4 and MKV: H.264, HEVC, AV1 or VP9 (phone videos, OBS recordings, high-quality downloads)</li>
                <li>Always exports MP4 with the best encoder on your PC</li>
                <li>Pick and rename the clips to export</li>
                <li>
                  Standard and Original sizes, or 4K <Pro />
                </li>
                <li>High, Balanced or Small quality</li>
                <li>Sound fades at the start and end</li>
                <li>Music under a clip, quieter while someone speaks</li>
                <li>Graphics card encoding: NVIDIA, AMD or Intel</li>
                <li>Progress and time left for every clip</li>
                <li>Skip, cancel and retry while it runs</li>
                <li>Matches the preview exactly</li>
              </ul>
            </div>{' '}
            <div className="af">
              <h3>Look and help</h3>
              <ul>
                <li>Six colour themes, each dark or light</li>
                <li>Resizable panels and full screen</li>
                <li>Keyboard shortcuts for everything (press ?)</li>
                <li>Check for updates, Send feedback, Report a problem</li>
              </ul>
            </div>{' '}
            <div className="af">
              <h3>Privacy</h3>
              <ul>
                <li>Works offline</li>
                <li>No account, no sign-in</li>
                <li>No watermark</li>
                <li>Your videos are never uploaded</li>
                <li>AI models download once, only if you ask</li>
              </ul>
            </div>{' '}
          </div>
        </div>
      </section>{' '}
      <section className="reveal feat alt" id="compare">
        <div className="w">
          {' '}
          <div className="center">
            <h2>Fragmio or an online clip tool?</h2>
            <p>Both turn long videos into Shorts. Here's what's different.</p>
          </div>{' '}
          <div className="cmp-wrap">
            <table className="cmp">
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr">Feature</span>
                  </th>
                  <th scope="col" className="cmp-us">
                    Fragmio
                  </th>
                  <th scope="col">Other clipping tools</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Works offline, videos never uploaded</th>
                  <td className="cmp-us">
                    <span className="yes" aria-label="Yes">
                      ✓
                    </span>{' '}
                    Everything runs on your PC
                  </td>
                  <td>
                    <span className="no" aria-label="No">
                      ✕
                    </span>{' '}
                    Most upload your video to their servers
                  </td>
                </tr>
                <tr>
                  <th scope="row">No waiting for long uploads</th>
                  <td className="cmp-us">
                    <span className="yes" aria-label="Yes">
                      ✓
                    </span>{' '}
                    Open a 3-hour stream instantly
                  </td>
                  <td>
                    <span className="no" aria-label="No">
                      ✕
                    </span>{' '}
                    Long uploads, especially on slow internet
                  </td>
                </tr>
                <tr>
                  <th scope="row">Finds the best moments with AI</th>
                  <td className="cmp-us">
                    <span className="yes" aria-label="Yes">
                      ✓
                    </span>{' '}
                    Offline
                  </td>
                  <td>
                    <span className="yes" aria-label="Yes">
                      ✓
                    </span>{' '}
                    Online
                  </td>
                </tr>
                <tr>
                  <th scope="row">Captions made from speech</th>
                  <td className="cmp-us">
                    <span className="yes" aria-label="Yes">
                      ✓
                    </span>{' '}
                    Offline, English, Hindi and Hinglish
                  </td>
                  <td>Online, or you bring your own .srt file</td>
                </tr>
                <tr>
                  <th scope="row">Layout picked from the faces</th>
                  <td className="cmp-us">
                    <span className="yes" aria-label="Yes">
                      ✓
                    </span>{' '}
                    Fill, Split or Trio, automatically
                  </td>
                  <td>Some tools</td>
                </tr>
                <tr>
                  <th scope="row">Full manual editing</th>
                  <td className="cmp-us">
                    <span className="yes" aria-label="Yes">
                      ✓
                    </span>{' '}
                    Templates, cards, frames, outros, music, your brand kit
                  </td>
                  <td>Varies</td>
                </tr>
                <tr>
                  <th scope="row">Minute or credit limits</th>
                  <td className="cmp-us">
                    <span className="yes" aria-label="Yes">
                      ✓
                    </span>{' '}
                    None
                  </td>
                  <td>
                    <span className="no" aria-label="No">
                      ✕
                    </span>{' '}
                    Usually monthly limits
                  </td>
                </tr>
                <tr>
                  <th scope="row">Watermark</th>
                  <td className="cmp-us">
                    <span className="yes" aria-label="Yes">
                      ✓
                    </span>{' '}
                    Never
                  </td>
                  <td>
                    <span className="no" aria-label="No">
                      ✕
                    </span>{' '}
                    Often on free plans
                  </td>
                </tr>
                {site.showPricing && (
                  <tr>
                    <th scope="row">Price</th>
                    <td className="cmp-us">From ₹99, or once for life</td>
                    <td>Monthly subscriptions, often in dollars</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>{' '}
          <p className="center muted small cmp-note">"Other clipping tools" means popular online AI clip makers in general; each tool differs.</p>{' '}
        </div>
      </section>{' '}
      {site.showPricing && (
        <section className="reveal feat" id="pricing">
          <div className="w">
            {' '}
            <div className="center">
              <h2>Simple prices. No auto-renew.</h2>
              <p>Pay once for the time you need. Nothing renews by itself, and Fragmio keeps working offline the whole time.</p>{' '}
              {!site.stable && <p className="beta-note">During the beta, everything is free. These prices start with Fragmio 2.0.</p>}
            </div>{' '}
            <div className="plans">
              {' '}
              <div className="plan free">
                <h3>Free</h3>
                <div className="pr">₹0</div>
                <p className="per">forever</p>
                <ul>
                  <li>All framing, text, templates, cards, outros and music</li>
                  <li>Captions you type, paste or import</li>
                  <li>3 clips per project</li>
                  <li>3 Auto clips a day</li>
                  <li>Export up to 1080p</li>
                </ul>
                <a className="btn ghost" href="/download">
                  Download
                </a>
              </div>{' '}
              <PlanCard
                slug="fragmio-pro-1m"
                className="plan"
                buttonClass="btn ghost"
                fallback={{ name: '1 month', price: '₹99', per: '₹99 a month', badge: '' }}
              />{' '}
              <PlanCard
                slug="fragmio-pro-3m"
                className="plan"
                buttonClass="btn ghost"
                fallback={{ name: '3 months', price: '₹249', per: '₹83 a month', badge: 'Save 16%' }}
              />{' '}
              <PlanCard
                slug="fragmio-pro-6m"
                className="plan pop"
                buttonClass="btn"
                fallback={{ name: '6 months', price: '₹449', per: '₹75 a month', badge: 'Most popular · Save 24%' }}
              />{' '}
              <PlanCard
                slug="fragmio-pro-life"
                className="plan"
                buttonClass="btn ghost"
                fallback={{ name: 'Lifetime', price: '₹1,499', per: 'pay once, use forever', badge: 'Best value' }}
              />{' '}
            </div>{' '}
            <div className="pro-all">
              <h3>Every Pro plan includes</h3>
              <ul>
                <li>Auto clips: up to 20 at a time, no daily limit</li>
                <li>AI captions and auto-sync, offline</li>
                <li>4K export</li>
                <li>Unlimited clips</li>
                <li>Unlimited saved styles, templates, frames and outros</li>
                <li>Use on 1 PC, move it any time by activating on another</li>
                <li>Needs internet once to activate</li>
              </ul>
            </div>{' '}
            <p className="center muted small">
              Prices in Indian rupees. Payments are handled securely by{' '}
              <a className="by-ab" href={site.hubUrl}>
                <span className="inline-logo">
                  <AllbluezLogo />
                </span>
              </a>
              , Fragmio's maker, through Razorpay: UPI, cards, netbanking. {!site.stable && <a href="/download#access">Get beta access</a>}
            </p>{' '}
          </div>
        </section>
      )}{' '}
      <section className="reveal feat alt" id="privacy">
        <div className="w">
          <div className="center">
            <span className="eyebrow">Private by design</span>
            <h2>Your videos never leave your PC.</h2>
            <p>Fragmio is a desktop app. Nothing is uploaded, and there is nothing to sign up for.</p>
          </div>{' '}
          <div className="priv">
            {' '}
            <div className="panel">
              <span className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M2 2l20 20M8.5 8.5A5 5 0 0 0 12 17a5 5 0 0 0 3.5-1.5M5 5C3.5 6.3 2.4 8 2 12c1.5 5 5.5 8 10 8 1.9 0 3.7-.5 5.2-1.4M12 4c4.5 0 8.5 3 10 8-.4 1.4-1 2.6-1.8 3.7" />
                </svg>
              </span>
              <h3>Works offline</h3>
              <p>Everything runs on your computer, with no internet needed.</p>
            </div>{' '}
            <div className="panel">
              <span className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
                </svg>
              </span>
              <h3>No account</h3>
              <p>Install it and start. No sign-in, no email.</p>
            </div>{' '}
            <div className="panel">
              <span className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 9h18" />
                </svg>
              </span>
              <h3>No watermark</h3>
              <p>Your clips are yours, exactly as you made them.</p>
            </div>{' '}
            <div className="panel">
              <span className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" />
                </svg>
              </span>
              <h3>Updates on request</h3>
              <p>It only goes online when you click Check for updates.</p>
            </div>{' '}
          </div>
        </div>
      </section>{' '}
      <section className="reveal feat" id="faq">
        <div className="w">
          <div className="center">
            <h2>Questions</h2>
          </div>
          <div className="faq">
            {' '}
            <details open>
              <summary>Is Fragmio free?</summary>
              {site.showPricing ? (
                <p>
                  Yes. The free version has everything you need to make clips. Pro adds AI captions, 4K export, unlimited clips and more Auto clips.{' '}
                  <a href="/#pricing">See the prices</a>.
                </p>
              ) : (
                <p>Yes. Everything in Fragmio is free during the beta.</p>
              )}
            </details>{' '}
            <details>
              <summary>Does it work without the internet?</summary>
              <p>Yes. Fragmio only connects when you click Help → Check for updates, and then it only reads a small version file.</p>
            </details>{' '}
            <details>
              <summary>Does the AI send my video anywhere?</summary>
              <p>No. Auto clips and AI captions run on your PC. The speech model downloads once, only when you ask for it, and then works offline.</p>
            </details>{' '}
            {site.showPricing && (
              <details>
                <summary>What is in Pro?</summary>
                <p>
                  4K export, unlimited clips, AI captions, auto-sync, more Auto clips and more saved styles. <a href={site.buyProUrl}>Buy Pro</a>.
                </p>
              </details>
            )}{' '}
            <details>
              <summary>Which videos can I use?</summary>
              <p>MP4 videos from your camera, phone, screen recorder or streaming software, up to 4K.</p>
            </details>{' '}
            <details>
              <summary>Windows says "Windows protected your PC". Is it safe?</summary>
              <p>
                That message appears for new apps that haven't built a reputation yet. Click More info → Run anyway. It will go away as more people use Fragmio.
              </p>
            </details>{' '}
            <details>
              <summary>Do I need a powerful computer?</summary>
              <p>Windows 10 or 11 (64-bit) and 8 GB of memory. An NVIDIA graphics card makes exports faster but isn't required.</p>
            </details>{' '}
            <details>
              <summary>How do I report a problem?</summary>
              <p>In the app, choose Help → Report a problem. The form opens in your browser with your version filled in.</p>
            </details>{' '}
          </div>
        </div>
      </section>{' '}
      <section className="reveal final w" id="download">
        <div className="fbox">
          <h2>Turn your next video into ten.</h2>
          <p>
            Fragmio <span>{site.version}</span> is free{!site.stable && <span> during the beta</span>}.
          </p>
          {!site.invite && site.downloads && (
            <a href="/download" className="btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 5.5l7.5-1v7H3zm0 13l7.5 1v-7H3zm8.5 1.2L21 21v-8.5h-9.5zm0-15.4v7.2H21V3z" />
              </svg>
              Download for Windows
            </a>
          )}
          {site.invite && (
            <div className="faccess">
              <p>Fragmio is invite-only during the beta. Leave your email for a code.</p>
              <AccessForm buttonClass="btn light" />
              <p className="havecode">
                Already have a code? <a href="/download">Download for Windows</a>
              </p>
            </div>
          )}
          <small>
            Windows 10 and 11 · 64-bit ·{' '}
            <a style={{ textDecoration: 'underline' }} href="/changelog">
              What&apos;s new
            </a>
          </small>
        </div>
      </section>
    </div>
  )
}
