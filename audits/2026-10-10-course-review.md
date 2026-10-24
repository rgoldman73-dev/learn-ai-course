# Learn AI deployment review — 2026-10-10

Baseline: main commit `333d132`; live application at https://rgoldman73-dev.github.io/learn-ai-course/.
The October 9 manual workflow, run 37956912611, has successful build and deploy jobs. No workflow was rerun and no deployment was requested. No open PRs were returned by the repository PR search before this change.

## Observed online results

| Check | Result |
| --- | --- |
| Deployed lesson assets | All 32 Markdown bodies and 32 SRT files match the repository byte for byte. |
| Deployed narration assets | m01, m03, m16 and m32 MP3s match the repository byte for byte. |
| Browser lessons | m01, m03, m16 and m32 load text, rendered citations, narration and transcripts. Playback advances with no media error. |
| Captions | m01, m16 and m32 show narration captions during playback. m03 has a populated 44-cue transcript. |
| Narration duration | m01 164.016s; m03 165.888s; m16 175.920s; m32 175.296s. |
| Player controls | Pause, forward 15 seconds, captions toggle and 1.5× playback work. Speed and caption preference survive reload. |
| Citation cards | m01 and m32 cards show the correct indexed source and original URL. m32's “In library” link filters to the same source ID and URL. |
| Progress | m01 completion, lab checkbox and notes survive navigation and reload. The self-check reveals an answer and accepts “Got it.” Quiz-stat reload persistence is covered separately by a store unit test. |
| Source/index validation | 32 generated lessons, 115 unique indexed sources, all cited IDs and source URLs validate locally. |

The checks do not establish that all 115 external sources remain accessible or substantiate every course claim. Several citations link to X posts; the app correctly points to those indexed URLs, but an external site's login requirement is separate from an app defect.

Detailed HTTP checks: `live-assets.json`. Audio metadata checks: `audio-metadata.json`.

## Offline behavior: intentional limits and actual defects

The built service worker contains 80 precache entries, including all 32 lesson bodies and all 32 caption files, with no MP3 precache entries. It uses CacheFirst for MP3s in `learn-ai-audio`, including the Workbox range-request plugin. Text and captions are intended to work once service-worker installation has finished; a first visit made entirely offline cannot install the app.

Unplayed narration is not guaranteed offline. Opening a lesson can initiate a metadata request, but that is not proof of a complete cached MP3. First playback starts a separate full-file Cache API download. Going offline during that download, a quota failure or later browser eviction can leave a previously played lesson unavailable. External citation originals are not precached; source metadata and cards are local.

A real offline browser test could not be performed: the available cloud-browser API offers neither offline emulation nor an isolated fresh-cache context, and its read-only evaluation interface does not expose Cache Storage or service-worker state. Therefore this review **does not certify deployed offline playback, range seeking, or fresh-profile service-worker installation**. The player logic was tested with explicit empty-cache, saved-cache, failed-download, pending-download and rejected-play doubles; these are unit tests, not browser integration tests.

### Defects corrected on the review branch

1. **Citation numbering restarted after self-check.** In m01, source 1 in the lesson body is Jeff Dean while source 1 in the Sources section is the optimisation article. The renderer now shares one citation order across both sections. URLs were correct; the numbers were misleading.
2. **Failed narration saving was suppressed and never retried within that player.** The old `cached` flag was set before caching succeeded. Saving now retries on a subsequent play, reports pending/failure/success separately from captions, and confirms offline availability only after a cache match. Cache checks cannot overwrite a playback error. Rejected play promises are handled; Play reloads an errored media element before retrying.
3. **The documented validator did not run in a clean checkout.** `npm run validate` referenced an absent script inside the untracked research pack. A dependency-free validator now checks the committed lesson/citation/audio/caption data.

The audio policy remains on-demand. No course content, PWA caching strategy, deployment workflow or interface layout was redesigned.

## Verification of changes

- `npm test`: 7 passing regression tests, covering cache completion/retry, empty versus saved cache, error visibility and retry, progress/notes/quiz/preferences reload, citation numbering, and SRT timing.
- `npm run validate`: passes for all 32 lessons and 115 sources.
- `npm run build`: succeeds; all 32 lesson bodies and 32 SRT files still appear in precache, MP3s remain excluded, and range-request handling remains present.
- All 32 local MP3s are readable by ffprobe and their final caption timestamps fit within the audio duration.
- `git diff --check`: passes.

The patched browser UI has not been exercised in the live deployment; these changes are proposed on a separate branch for review.

## Remaining browser acceptance check

Use a disposable profile in Chrome and, ideally, an iPhone/Safari installation:

1. Visit online with empty storage. Wait for service-worker activation and reload under its control. Do not play the test narration.
2. Disable the network. Reload, open an unvisited lesson, inspect text and its transcript/citation card. They should work. An unplayed MP3 may fail with a visible message; that is expected. Seeking and opening external originals need separate checks.
3. Reconnect, play one lesson, and wait for the full MP3 to be stored (the proposed player reports confirmation). Disable the network, reload, then test playback and forward/back seeking for that saved lesson. Try a different unplayed lesson as the control.
4. Interrupt an initial save or simulate a quota failure. Restore the connection/storage, pause and play again; saving should retry. Confirm pending or failed saving never reports success.
5. Mark a lesson complete, check its lab, add a note and grade a self-check; reload offline and confirm those records persist. Restore the test profile or discard it afterward.
