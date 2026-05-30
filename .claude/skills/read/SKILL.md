---
name: read
description: >
  Load and internalize the project's SSOT.md file to get full context on the Shelter Project website we're building.
  Trigger this skill whenever the user types /read, asks you to "read the project", "load context", "get up to speed",
  or starts a new session and needs to understand the current state of the project. Also trigger if the user references
  the SSOT, open decisions, or asks what the project is about. This is the mandatory onboarding step for any new session
  on this project — always use it when invoked with /read.
---

# /read — Project Context Loader

## What to do

1. **Read the SSOT** — Read `SSOT.md` from the current working directory (the project root).

2. **Summarize for the session** — After reading, output a structured briefing with these sections:

### Briefing format

```
## Project Briefing — Shelter Website

**What we're building:** [1-2 sentence summary]

**Tech stack:** [Frontend / CMS / Hosting / i18n / Forms / Donations]

**Website structure:** [bullet list of main page sections + animal profile page sections]

**Animal data model:** [key fields — species, status, gender, age_group, size, neutered, media]

**Open decisions:** [list only unresolved items from the Open Decisions table, numbered]

**What's out of scope:** [brief list]

**Status check:** [See below]
```

3. **Status check** — After summarizing, briefly assess whether the SSOT looks current:
   - Flag any open decisions that seem overdue or blocking (e.g. CMS choice blocks data model implementation)
   - Note if anything looks inconsistent or missing
   - If the SSOT looks healthy and current, just say so in one line

4. **Invite next steps** — End with: "What would you like to work on?"

## Tone

Keep the briefing tight and scannable — this is for a developer starting a session, not a client presentation.
Don't pad. If something is clear from the SSOT, don't re-explain it at length.

## If SSOT.md is missing or unreadable

Let the user know the file wasn't found and suggest they check the project root or update the SSOT before continuing.
