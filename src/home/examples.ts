// The home page's examples: what each kind of creator sees. The pictures are drawn with CSS (no images),
// as small pieces of markup built from these constants.
import type { Kind } from '../makes'

export const esc = (s: string): string => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
/** *word* → highlighted word. */
export const stars = (s: string): string => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>')

const person = (left: number, width: number, height: number, skin: string, shirt: string): string =>
  `<b class="pp" style="left:${left}%;width:${width}%;height:${height}%;--skin:${skin};--shirt:${shirt}"></b>`
const A: [string, string] = ['#c99a76', '#3e7a8f']
const B: [string, string] = ['#8d5b3e', '#b5536b']
const C: [string, string] = ['#e0b08a', '#6b8f3e']
export const scenes = {
  game: (cam: boolean): string =>
    `<div class="scene game"><div class="grid"></div><div class="cross"></div>${cam ? `<div class="cam">${person(30, 40, 80, ...A)}</div>` : ''}</div>`,
  gameOnly: (): string => '<div class="scene game"><div class="grid"></div><div class="cross"></div></div>',
  room: (...people: string[]): string => `<div class="scene room">${people.join('')}</div>`,
  class: (...people: string[]): string => `<div class="scene class"><div class="board"></div>${people.join('')}</div>`,
  out: (...people: string[]): string => `<div class="scene out"><div class="hill"></div>${people.join('')}</div>`
}
export const pane = (inner: string): string => `<div class="pane">${inner}</div>`
const zoom = (html: string, scale: number, origin: string): string =>
  `<div style="position:absolute;inset:0;transform:scale(${scale});transform-origin:${origin}">${html}</div>`

export type Example = {
  makes: string
  caption: string
  moments: [string, string, number][]
  phones: [string, string]
  before: () => string
  after: (cap: string) => string
  split: boolean
  points: string[]
}

export const EXAMPLES: Record<Kind, Example> = {
  gaming: {
    makes: 'Gaming',
    caption: 'Wait for *this* clutch',
    moments: [
      ['Big reaction', '12:04 – 12:41 · 37 s', 96],
      ['Clutch final round', '27:18 – 28:02 · 44 s', 90],
      ['Laughing', '41:50 – 42:16 · 26 s', 71]
    ],
    phones: ['WAIT FOR *THIS*', 'CLUTCH *1v3*'],
    before: () => scenes.game(true),
    after: (cap) => pane(scenes.room(person(25, 50, 80, ...A))) + pane(scenes.gameOnly()) + cap,
    split: true,
    points: [
      '<b>Facecam found in a corner:</b> you on top, the game below.',
      '<b>Captions between the two</b>, right where people look.',
      '<b>It stays a normal clip:</b> change the layout any time.'
    ]
  },
  podcast: {
    makes: 'Podcasts',
    caption: 'This is the *one* tip nobody shares',
    moments: [
      ['"Nobody tells you this…"', '27:18 – 28:02 · 44 s', 94],
      ['Hot take', '51:10 – 51:52 · 42 s', 87],
      ['Both laughing', '1:04:31 – 1:04:55 · 24 s', 69]
    ],
    phones: ['NOBODY TELLS YOU *THIS*', 'HOT *TAKE*'],
    before: () => scenes.room(person(16, 20, 62, ...A), person(62, 20, 62, ...B)),
    after: (cap) => pane(scenes.room(person(22, 56, 85, ...A))) + pane(scenes.room(person(22, 56, 85, ...B))) + cap,
    split: true,
    points: [
      '<b>Two people found:</b> a Split, one above the other.',
      '<b>Each box follows a face</b>, so nobody is cut off.',
      '<b>Three people?</b> It makes a Trio.'
    ]
  },
  teaching: {
    makes: 'Education',
    caption: 'Stop making this *one* mistake',
    moments: [
      ['"The one formula you need"', '08:12 – 08:58 · 46 s', 93],
      ['Common mistake', '22:40 – 23:15 · 35 s', 85],
      ['Quick tip', '37:05 – 37:31 · 26 s', 72]
    ],
    phones: ['THE *ONE* FORMULA', 'COMMON *MISTAKE*'],
    before: () => scenes.class(person(62, 18, 60, ...A)),
    after: (cap) => pane(zoom(scenes.class(person(62, 18, 60, ...A)), 2.3, '70% 75%')) + cap,
    split: false,
    points: [
      '<b>One person found:</b> Fill, centred on your face.',
      '<b>Want the board too?</b> Switch to On background in one click.',
      '<b>Captions</b> make every step easy to follow.'
    ]
  },
  vlog: {
    makes: 'Other',
    caption: 'You have to *see* this view',
    moments: [
      ['First look at the city', '03:20 – 03:52 · 32 s', 91],
      ['"This view is unreal"', '18:44 – 19:21 · 37 s', 86],
      ['Funny moment', '33:02 – 33:24 · 22 s', 70]
    ],
    phones: ['YOU HAVE TO *SEE* THIS', 'BEST *VIEW*'],
    before: () => scenes.out(person(40, 18, 58, ...B)),
    after: (cap) => pane(zoom(scenes.out(person(40, 18, 58, ...B)), 2, '49% 80%')) + cap,
    split: false,
    points: [
      '<b>One person found:</b> Fill, centred on your face.',
      '<b>No face in the shot?</b> It goes On background, so nothing is cut off.',
      '<b>Speed and captions</b> per clip, for the fun bits.'
    ]
  }
}

/** The parts of the video each layout shows, in the Try it framing demo. */
export const SOURCES: Record<Kind, () => { a: string; b: string; c: string }> = {
  gaming: () => ({ a: scenes.room(person(25, 50, 80, ...A)), b: scenes.gameOnly(), c: zoom(scenes.gameOnly(), 1.8, '50% 55%') }),
  podcast: () => ({ a: scenes.room(person(22, 56, 85, ...A)), b: scenes.room(person(22, 56, 85, ...B)), c: scenes.room(person(22, 56, 85, ...C)) }),
  teaching: () => ({
    a: zoom(scenes.class(person(62, 18, 60, ...A)), 2.3, '70% 75%'),
    b: zoom(scenes.class(), 2, '28% 30%'),
    c: scenes.class(person(62, 18, 60, ...A))
  }),
  vlog: () => ({ a: zoom(scenes.out(person(40, 18, 58, ...B)), 2, '49% 80%'), b: zoom(scenes.out(), 1.6, '30% 60%'), c: scenes.out(person(40, 18, 58, ...B)) })
}
