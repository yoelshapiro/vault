# Pudo-Unpudo Suite for May Model Table Rows

Date: 2026-05-27

## Summary

Filtered the Notion `Parking/PUDO model cards` database for rows with `Date >= 2026-05-06` and checked the Pudo-Unpudo suite version `86b2105d-3f72-4620-b020-0b10e445798d` under suite `ea663952-b914-47a3-8cc1-729db3683dce`.

## Models

- `chocolate-narwhal-adaptable`: no execution exists for requested version `86b2105d-3f72-4620-b020-0b10e445798d`. Creating via the public Eval Studio API can only target the stable suite UUID/current version, so it created current-version execution `f308a741-56e6-42a4-9ba7-1533e2acbb9f` on history `adf04489-bc65-492d-92e6-02bfff979c49` instead.
- `reassured-red-sea-turtle`: requested-version execution `7ca78f01-4163-4f7f-829e-953864a0ee51`, completed, score `0.759`.
- `circumspect-harlequin-elephant`: requested-version execution `9b950bbd-d4d2-4587-9289-28b79e9c08bd`, completed, score `0.752`.
- `fuchsia-tiger-masked`: requested-version execution `70b8737d-75b9-4e9a-bdc4-dcfdea31e731`, completed, score `0.0767`.
- `condor-fearless-ivory`: requested-version execution `c9e5e1ea-29a8-439f-b7e2-67f28c4aaaef`, completed, score `0.7843`.
- `dalmatian-scarlet-musical`: requested-version execution `37aaa307-a8f1-4983-a5a6-28c4975cca99`, completed, score `0.0811`.
- `armadillo-adaptable-maroon`: requested-version execution `619f5ce9-80c6-4940-9563-9cb3e13c2d29`, completed, score `0.7919`.
- `noncommittal-yellow-stingray`: requested-version execution `42bc5c57-f99a-4a32-aa0a-525aa43d8db2`, completed, score `0.7693`.
- `proficient-centipede-indigo`: helper could not resolve a successful licence row, but model-catalogue gen2 artefact `3ecd4460-5a60-467a-9053-30cf75468c82` has requested-version execution `37f91f84-8b03-4187-a14c-c40ba0a8eb0b`, completed, score `0.0703`.

## Notes

The public `createAvTestSuiteExecutions` API takes `avTestSuiteId` as the stable suite UUID and resolves the current/latest suite history. It rejected the requested history ID directly with `Test suites not found`, so it cannot launch historical suite version `86b2105d-3f72-4620-b020-0b10e445798d` through that path.
