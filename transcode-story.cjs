const { execFileSync } = require('child_process')
const ffmpeg = require('ffmpeg-static')
const path = require('path')

const src = 'C:\\Users\\hello\\Desktop\\Ericeira Paws and Its Little Story!\u{1F436}\u{1F43E}\u{1F431}Ericeira Paws was born as a personal project because of.mp4'
const outDir = path.join(__dirname, 'web', 'public')
const outVideo = path.join(outDir, 'our-story.mp4')
const outPoster = path.join(outDir, 'our-story-poster.jpg')

console.log('Transcoding video → our-story.mp4 ...')
execFileSync(ffmpeg, [
  '-y',
  '-i', src,
  '-vf', "scale='if(gt(iw,ih),-2,540)':'if(gt(iw,ih),540,-2)'",
  '-c:v', 'libx264',
  '-preset', 'slow',
  '-crf', '32',
  '-profile:v', 'high',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  '-c:a', 'aac',
  '-b:a', '96k',
  outVideo,
], { stdio: 'inherit' })

console.log('Extracting poster frame → our-story-poster.jpg ...')
execFileSync(ffmpeg, [
  '-y',
  '-i', outVideo,
  '-ss', '00:00:01.5',
  '-frames:v', '1',
  '-q:v', '3',
  outPoster,
], { stdio: 'inherit' })

console.log('Done.')
