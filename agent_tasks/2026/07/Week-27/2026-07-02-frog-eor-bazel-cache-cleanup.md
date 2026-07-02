# 2026-07-02 Frog EOR Bazel Cache Cleanup

## Summary

Coordinated Bazel output-base cleanup after the three frog EOR fresh training monitors reached the requested finish condition.

## Gate Status

- Run 1 baseline original data: Surfboard job `187893`, branch `boris/parking-frog-eor-fresh-base`, already passed 1K at W&B `trainer/global_step=1210`.
- Run 2 70% driving: Surfboard job `187902`, branch `boris/parking-frog-eor-fresh-driving70`, W&B summary showed `trainer/global_step=1732`.
- Run 3 rawgear: Surfboard job `187920`, branch `boris/parking-frog-eor-fresh-rawgear`, monitor loop observed W&B `trainer/global_step=1114` while Surfboard remained `Running`.

## Cleanup

Deleted only these requested Bazel output-base directories:

- `/workspace/.cache/bazel/4b8bba71479b7fd2393f29785e7217ae`
- `/workspace/.cache/bazel/e833bf48384809aa2dd55b49c3a24092`
- `/workspace/.cache/bazel/155e32be28cd81ba8170921c8b600b39`

Before deletion, approximate sizes were:

- `18G` for baseline original data
- `49G` for 70% driving
- `67G` for rawgear

`rm -rf` initially hit permission-denied files under those exact directories. Ran scoped `chmod -R u+rwX` only on the three remaining target directories and retried deletion successfully.

## Verification

- Final directory check: none of the three output-base directories remained.
- Process check: no live processes remained for the three output-base paths or frog EOR worktrees.
- Final disk usage:

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/sdc        1.0T  840G  185G  83% /workspace
```

## Slack

Attempted to send the requested Slack DM to Boris (`U09RQU5V68M`) with the cleanup summary and final `df -h /workspace`, but the Slack connector returned `HTTP 401 token_expired`.
