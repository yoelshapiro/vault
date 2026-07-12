# 2026-07-12 Drop Vehicle Frequency Fallback

- Branch: `boris/pudo_generic_materialization`
- PR: `#117075`
- Change type: PR cleanup, test verification
- Areas: `wayve/core/data/vehicles.py`; `wayve/core/data/test/test_vehicles.py`

## Summary

Removed the Parking/PUDO PR's changes to core vehicle frequency fallback behavior.

Decision:

- The fallback was originally added to tolerate `gen2-maserati-grecale-alpha3` during Parking/PUDO event metadata processing.
- After rebasing onto `main`, that vehicle model is formally registered as `VehicleModel.Gen2MaseratiGrecaleAlpha3`, so the permissive unregistered-Gen2 fallback is no longer needed.
- Kept the existing partner-platform fallback behavior unchanged.

Verification:

- `bazel test //wayve/core/data:py_test --test_arg="-k=get_platform_frequency or vehicle_model_definition_order"`
- Confirmed the PR diff no longer includes `wayve/core/data/vehicles.py` or `wayve/core/data/test/test_vehicles.py`.
