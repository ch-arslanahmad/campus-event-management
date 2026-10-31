<!--
Thanks for the PR. Keep the sections below - the CI check "PR links an issue"
fails without a Closes/Fixes line, and the lead review starts from this summary.
-->

## Summary

<!-- Two sentences at most: what this PR does and why. Then link the issue: -->

Closes #

## What changed

<!-- Bullet points, one per meaningful change. Files/areas touched, behaviour before vs after. -->

-

## How to run and verify it

<!-- Commands a reviewer can paste, and what they should see. -->

```bash
cd backend && ./mvnw verify
cd frontend && npm run lint && npm test && npm run build
docker compose up --build
```

- [ ] `./mvnw verify` passes
- [ ] `npm run lint && npm test && npm run build` passes
- [ ] Checked manually in the running app

## Notes for the reviewer

<!-- Anything risky, unfinished, or worth a second look. Delete if empty. -->
