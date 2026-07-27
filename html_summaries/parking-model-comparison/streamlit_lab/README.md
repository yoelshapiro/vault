# parking.py Streamlit Lab

This app builds mocked table/data inputs and calls the real Boris-branch `wayve.ai.si.datamodules.parking` functions.

Run from an environment that can import WayveCode Python dependencies:

```bash
cd ${HOME}/git/vault/html_summaries/parking-model-comparison/streamlit_lab
WAYVECODE_PATH=/workspace/.codex-borisindelman/worktrees/7992/WayveCode streamlit run app.py
```

If using a fresh virtualenv, install the small UI dependencies first. WayveCode itself may require the normal internal runtime/Bazel environment.

```bash
pip install -r requirements.txt
```
