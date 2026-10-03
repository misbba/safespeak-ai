# SafeSpeak AI — IntelliJ IDEA Setup & Run Guide

This guide provides step-by-step instructions for running and debugging the complete **SafeSpeak AI** application (Python Flask backend + React Vite frontend) comfortably inside **IntelliJ IDEA** (Ultimate or Community with the Python plugin).

---

## Prerequisites

Ensure the following runtimes are installed on your system:
* **Python:** 3.10 or higher (Python 3.13 recommended)
* **Node.js:** v18 or higher (Node v24 recommended)
* **IntelliJ IDEA:** IntelliJ IDEA Ultimate, PyCharm Professional, or IntelliJ IDEA Community with Python and Node.js plugins enabled.

---

## 1. Opening the Project in IntelliJ IDEA

1. Launch **IntelliJ IDEA**.
2. Select **File $\rightarrow$ Open...** (or click **Open** on the Welcome Screen).
3. Navigate to and select the root directory:
   ```
   C:\Users\Nisha\.gemini\antigravity\scratch\safespeak-ai
   ```
4. Click **OK** and choose **Trust Project**.

> [!NOTE]
> SafeSpeak AI includes pre-configured `.run/` configurations. Once the project is opened and interpreters are linked, `Backend (Flask)` and `Frontend (Vite)` will appear automatically in your top-right Run/Debug dropdown.

---

## 2. Backend Setup in IntelliJ IDEA (Python Flask)

### Step 2.1: Configure the Python Interpreter
1. Go to **File $\rightarrow$ Project Structure...** (or press `Ctrl + Alt + Shift + S`).
2. Under **Project Settings**, select **Project**.
3. In the **SDK** dropdown, ensure your Python 3.13 (or 3.10+) interpreter is selected.
4. If no Python SDK is listed:
   - Click **Add SDK $\rightarrow$ Add Python SDK...**
   - Select **System Interpreter** or create a **Virtualenv Environment**.
   - Path example: `C:\Program Files\Python313\python.exe`
   - Click **Apply** and **OK**.

### Step 2.2: Install Requirements
1. Open the IntelliJ Terminal (**Alt + F12**).
2. Ensure you are in the `backend` directory:
   ```powershell
   cd backend
   python -m pip install -r requirements.txt
   ```
   *(All core libraries: `Flask`, `flask-cors`, `pillow`, `requests`, `python-dotenv`, `pytest` will be installed).*

### Step 2.3: Configure or Select Python Run Configuration
If using the included run configuration:
* Simply select **`Backend (Flask)`** from the top Run dropdown and click the green **Run (Shift + F10)** button.

If configuring manually:
1. Go to **Run $\rightarrow$ Edit Configurations...**
2. Click **+ $\rightarrow$ Python**.
3. Set the following fields:
   * **Name:** `Backend (Flask)`
   * **Script path:** `<project-root>\backend\run.py`
   * **Working directory:** `<project-root>\backend`
   * **Environment variables:**
     ```
     PYTHONUNBUFFERED=1;PYTHONIOENCODING=utf-8;HOST=127.0.0.1;PORT=5000;FLASK_DEBUG=0
     ```
   * **Python Interpreter:** Select your configured Python 3.x interpreter.
4. Click **Apply** and **OK**.

### Step 2.4: Verify the Backend
1. Click **Run (Shift + F10)**.
2. In the IntelliJ Run console, you will see:
   ```
   [*] Starting SafeSpeak AI Backend on http://127.0.0.1:5000
    * Running on http://127.0.0.1:5000
   ```
3. Open your browser or browser preview:
   ```
   http://127.0.0.1:5000/api/health
   ```
   Expected response:
   ```json
   {
     "status": "healthy",
     "service": "SafeSpeak AI API",
     "ai_mode": "HEURISTIC_RULE_ENGINE_ACTIVE"
   }
   ```

---

## 3. Frontend Setup in IntelliJ IDEA (React + Vite)

### Step 3.1: Configure Node.js
1. Go to **File $\rightarrow$ Settings $\rightarrow$ Languages & Frameworks $\rightarrow$ Node.js**.
2. Verify that **Node interpreter** points to your installed Node.js binary (e.g. `C:\Program Files\nodejs\node.exe`).
3. Click **OK**.

### Step 3.2: Install Dependencies (if not already installed)
1. In the IntelliJ Terminal (**Alt + F12**):
   ```powershell
   cd frontend
   npm.cmd install
   ```

### Step 3.3: Configure or Select npm Run Configuration
If using the included run configuration:
* Select **`Frontend (Vite)`** from the top Run dropdown and click the green **Run (Shift + F10)** button.

If configuring manually:
1. Go to **Run $\rightarrow$ Edit Configurations...**
2. Click **+ $\rightarrow$ npm**.
3. Set the following fields:
   * **Name:** `Frontend (Vite)`
   * **Package.json:** `<project-root>\frontend\package.json`
   * **Command:** `run`
   * **Scripts:** `dev`
   * **Node interpreter:** Project Node
4. Click **Apply** and **OK**.

### Step 3.4: Verify the Frontend
1. Click **Run (Shift + F10)**.
2. The IntelliJ Run console will display:
   ```
     VITE v8.3.1  ready in 372 ms

     ➜  Local:   http://localhost:3000/
   ```
3. Open your browser at:
   ```
   http://localhost:3000
   ```
   The SafeSpeak AI cybersecurity dashboard will load with live proxying to the Flask backend.

---

## 4. Running Both Services Concurrently

SafeSpeak AI requires **both** services to run at the same time:
* **Backend:** `http://127.0.0.1:5000` (API & Evaluation Engine)
* **Frontend:** `http://localhost:3000` (Dashboard UI)

### Option A: Two Run Tabs (Standard)
1. Select **`Backend (Flask)`** $\rightarrow$ Click **Run**.
2. Select **`Frontend (Vite)`** $\rightarrow$ Click **Run**.
3. Both run in separate tabs in IntelliJ's bottom **Run / Services** tool window (`Alt + 4` / `Alt + 8`).

### Option B: Compound Run Configuration (One-Click — Included in `.run/`)
A pre-configured compound run configuration named **`SafeSpeak AI (Full Stack)`** is already provided in the `.run/` directory:
1. In the top-right Run/Debug dropdown, select **`SafeSpeak AI (Full Stack)`**.
2. Click **Run (Shift + F10)**.
3. IntelliJ will launch both the Flask backend and the Vite frontend simultaneously in unified Services/Run tabs with zero extra manual setup!

---

## 5. Running Automated Pytest Tests in IntelliJ

1. In the Project Explorer, expand:
   `safespeak-ai/backend/tests/`
2. Right-click on **`test_api.py`**.
3. Select **Run 'pytest in test_api.py'** (or press `Ctrl + Shift + F10`).
4. All **29 tests** will execute and display green checkmarks in IntelliJ's visual test runner:
   * Safe content tests (work invitation, meeting, ordinary message).
   * Suspicious content tests (payment request, OTP theft, fake internship, bank KYC alert, prize scam, account suspension threat).
   * Structural URL tests (phishing link, benign domain, malformed syntax).
   * Edge cases & Multilingual (duplicate-word cap, long inputs, Tamil Unicode, Tamil + English mixed).
   * Database persistence, confidence metadata, and deletion.
   * Cybercrime complaint tests (category retrieval, draft generation, financial loss 1930 guidance, scan telemetry inclusion, validation, privacy warnings, official portal link validity).

---

## 6. Troubleshooting & Windows Tips

| Issue | Cause | Solution |
|---|---|---|
| `UnicodeEncodeError: 'charmap' codec can't encode...` | Windows console CP1252 character mapping | Ensure `PYTHONIOENCODING=utf-8` is present in your Run Configuration environment variables. |
| `npm.ps1 cannot be loaded because running scripts is disabled` | Windows PowerShell ExecutionPolicy | Use `npm.cmd` in Windows terminal or run via IntelliJ's native npm run configuration which executes `cmd.exe /c npm`. |
| Port 5000 in use | Another process running on port 5000 | In `run.py` or Run Configuration env, set `PORT=5001` and update proxy in `frontend/vite.config.js`. |
| CORS or Network Error in UI | Backend server is not running | Ensure `Backend (Flask)` is running on `http://127.0.0.1:5000` before submitting scans in the frontend. |
