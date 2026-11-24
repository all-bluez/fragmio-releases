// Everything you may want to change, in one place.
window.FRAGMIO = {
  version: '1.18.0',
  channel: 'beta', // alpha / beta / stable (set automatically when a release is published)
  date: '13 Nov 2026',
  // Download buttons start the installer straight away, from this pattern ({v} = the newest version, from version.json).
  installerUrl:
    "https://github.com/all-bluez/fragmio-releases/releases/download/v{v}/Fragmio-{v}-setup.exe",
  // The last resort, if the version can't be read: the newest release on GitHub.
  downloadUrl:
    "https://github.com/all-bluez/fragmio-releases/releases/latest",
  releasesUrl:
    "https://github.com/all-bluez/fragmio-releases/releases",
  // The AllBlueZ hub: Support and "Buy Pro" go to its Pay page (change to https://allbluez.com once you have the domain).
  hubUrl: "https://allbluez-hub.vercel.app",
  // Support page: card/netbanking uses the hub's Pay page unless you put a Razorpay link here. Add your UPI ID and replace support-qr.png.
  razorpayUrl: "", // e.g. 'https://rzp.io/l/your-page'  (empty = the hub's Pay page)
  upiId: "", // e.g. 'yourname@okaxis'          (empty = hidden)
  // Feedback: a Google Form link (Send → link icon). Empty = the page shows "coming soon".
  feedbackFormUrl: "",
  youtubeChannel: "https://www.youtube.com/@all_blue_z",
};
