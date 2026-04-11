/**
 * projects.js — SINGLE SOURCE OF TRUTH for all project data.
 *
 * To add a project: copy one object, fill in the fields, save.
 * Featured = shown on home page (keep exactly 3 as true).
 * NDA     = shows amber NDA badge; descriptions must stay implementation-free.
 *
 * Fields:
 *   id           — URL-safe slug matching the HTML filename in /projects/
 *   title        — Project name
 *   hook         — One-liner shown on home + project card
 *   techDesc     — HTML string: full technical description
 *   nonTechDesc  — HTML string: plain-English version
 *   image        — Path to card/cover image (relative to root)
 *   tags         — Specific tech-stack strings shown on cards and detail pages
 *   categories   — Broad filter categories used in the Projects page filter bar.
 *                  Must be values from FILTER_CATEGORIES in assets/js/projects.js.
 *                  A project with no matching category still appears under "All".
 *   links        — { github, live } — null if not applicable
 *   featured     — true for exactly 3 (shown on home page)
 *   nda          — true if NDA-protected (shows badge, hides tech toggle)
 */

const PROJECTS = [

  /* ── 1. Iikshana ─────────────────────────────────────── */
  {
    id:    "iikshana",
    title: "Iikshana — Courtroom Accessibility System",
    hook:  "I built the guardrails around an ML system — a data pipeline that standardizes noisy courtroom audio, blocks bad data from propagating, and prevents model regressions before deployment.",

    techDesc: `
      <h2>Project Overview</h2>
      <p>
        Iikshana is an MLOps-driven pipeline for preparing and validating
        multi-source courtroom audio so it can be reliably used for downstream
        language translation and model evaluation. The system uses Apache Airflow
        to orchestrate stages and a CI/CD workflow to enforce quality gates before
        models are packaged and deployed.
      </p>

      <h2>My Contributions</h2>

      <h3>1 — Audio Preprocessing Pipeline (DSP + Format Standardization)</h3>
      <p>
        Implemented an inference-style preprocessing pipeline that converts
        heterogeneous audio and video inputs into a uniform format suitable for
        downstream evaluation:
      </p>
      <ul>
        <li>Multi-format ingestion (WAV / MP3 / FLAC / OGG / M4A + MP4 video via ffmpeg)</li>
        <li>Resampling to 16 kHz, mono conversion, PCM_16 WAV output</li>
        <li>RMS-based loudness normalization (target ~−20 dBFS) and silence trimming</li>
        <li>Courtroom-robust processing: Butterworth high-pass filtering to remove low-frequency
            HVAC rumble, stationary noise reduction via spectral subtraction, and peak limiting
            to prevent short loud events from dominating the signal</li>
        <li>Debugging hooks for production-scale batch runs: one-time warnings for repeated
            failures, progress logging, and optional memory/RSS logging for diagnosing OOM
            or pipeline slowdowns</li>
      </ul>

      <h3>2 — Rule-Based Anomaly Detection as a Pipeline Gate</h3>
      <p>
        Built a multi-check anomaly detection module that acts as a hard quality gate:
        if anomalies are detected, the pipeline halts and no downstream stages run.
      </p>
      <ul>
        <li>Missing or empty raw dataset directories (ignoring macOS metadata artifacts)</li>
        <li>Missing or underpopulated splits (dev / test / holdout)</li>
        <li>Schema and validation failures (consuming validation reports, failing closed)</li>
        <li>Duration drift — out-of-range audio based on configured min/max thresholds</li>
        <li>Label imbalance — max/min class ratio checks with minimum sample guardrails</li>
        <li>Manifest ↔ filesystem inconsistencies (missing files, unlisted files)</li>
        <li>Per-dataset balance constraints when combining multiple sources</li>
      </ul>
      <p>
        Emits an <code>anomaly_report.json</code> and returns a pass/fail signal
        that stops the pipeline when data integrity is not met.
      </p>

      <h3>3 — CI/CD for Model Quality and Deployment</h3>
      <p>
        Designed a GitHub Actions workflow that enforces model quality before
        merge and deployment:
      </p>
      <ul>
        <li>Path-based change detection to run model evaluation only when relevant
            components change — reduces unnecessary CI cost</li>
        <li>Automated quality gates: translation quality (BLEU / chrF / exact match),
            bias/fairness thresholds, rollback checks against baseline metrics</li>
        <li>Fail-closed behavior: any failing gate blocks the merge</li>
        <li>Automated model packaging and push to GCP Artifact Registry on main branch
            after all gates pass — no manual deployment steps</li>
      </ul>
    `,

    nonTechDesc: `
      <h2>What is Iikshana?</h2>
      <p>
        Iikshana is a system designed to make courtroom proceedings more accessible
        by automatically processing and transcribing court audio. My role was to
        build the "backstage" infrastructure that makes the AI system trustworthy
        and reliable before it ever reaches users.
      </p>

      <h2>What problem does it solve?</h2>
      <p>
        Court audio is messy — different microphones, background noise, varying
        volumes, and inconsistent file formats. If you feed a machine learning model
        bad audio, it produces bad results. My job was to make sure that never happens.
      </p>

      <h2>What did I build?</h2>
      <ul>
        <li><strong>An audio cleaner:</strong> Automatically standardizes court recordings —
            removing background hum, adjusting volume, and filtering out silence — so
            every audio file the AI sees is in a consistent, clean format.</li>
        <li><strong>A data watchdog:</strong> Before the AI processes any audio, automated
            checks verify that all files are present, properly labeled, and not
            corrupted. If anything looks wrong, the system stops and raises an alert
            rather than silently producing bad results.</li>
        <li><strong>Automatic quality control for AI updates:</strong> Whenever the
            AI model is updated, automated tests check that it performs at least as
            well as before — and that it's fair across different groups of speakers.
            Only approved updates get deployed.</li>
      </ul>

      <h2>Why does this matter?</h2>
      <p>
        In a legal setting, accuracy and fairness aren't optional — they're
        requirements. This infrastructure ensures the AI assistant is held to a
        high standard every single time it's updated.
      </p>
    `,

    image:    "assets/images/projects/iikshana.png",
    tags:       ["Python", "Airflow", "Docker", "MLOps", "Signal Processing", "CI/CD"],
    categories: ["Python", "ML & AI", "Image & Signal Processing"],
    links:    { github: "https://github.com/amitkaranth/Iikshana", live: null },
    featured: true,
    nda:      false,
  },

  /* ── 2. FinFluent ────────────────────────────────────── */
  {
    id:    "finfluent",
    title: "FinFluent — Personalized Finance Advisor",
    hook:  "An LLM-powered multi-agent financial advisor that combines machine learning models with real-time data to deliver personalized, explainable financial insights.",

    techDesc: `
      <h2>Project Overview</h2>
      <p>
        FinFluent is a multi-agent personalized financial advisor that integrates
        LLaMA 3.1 with machine learning models for budgeting, anomaly detection,
        and portfolio analysis. A central LLM-based controller orchestrates
        specialized agents (budget, anomaly, stock, portfolio), combining
        structured financial data with contextual reasoning to generate
        personalized financial recommendations.
      </p>

      <h2>My Contributions</h2>
      <ul>
        <li>
          Developed an <strong>Isolation Forest-based anomaly detection module</strong>
          to identify irregular financial transactions using normalized and time-aware
          features, achieving <strong>96.4% accuracy</strong> in detecting anomalies.
        </li>
        <li>
          Built a <strong>budget forecasting pipeline using SARIMA</strong>, preprocessing
          transaction data into time-series format to capture seasonal spending behavior
          and generate future financial predictions.
        </li>
        <li>
          Implemented a <strong>synthetic financial data generation system</strong> that
          simulates multi-year transaction histories with realistic patterns (salary,
          rent, seasonal expenses, and injected anomalies) for model training and evaluation.
        </li>
        <li>
          Contributed to <strong>portfolio analysis logic</strong>, integrating structured
          financial data with model outputs to support LLM-driven financial reasoning.
        </li>
        <li>
          Implemented <strong>data security using Fernet encryption</strong>, ensuring
          user-uploaded financial data is encrypted, processed securely, and deleted
          after use to maintain privacy.
        </li>
      </ul>

      <h2>Key Results</h2>
      <ul>
        <li>96.4% anomaly detection accuracy using Isolation Forest</li>
        <li>Seasonal spending forecasts via SARIMA with realistic synthetic training data</li>
        <li>End-to-end data privacy: encrypted at rest, deleted after processing</li>
      </ul>
    `,

    nonTechDesc: `
      <h2>What is FinFluent?</h2>
      <p>
        FinFluent is an AI-powered financial assistant that helps users understand
        their spending, spot unusual transactions, and plan their financial future —
        all in plain language.
      </p>

      <h2>What did I build?</h2>
      <ul>
        <li>
          <strong>An expense watchdog:</strong> A system that scans your transactions
          and flags anything that looks unusual — like a subscription you forgot about
          or a charge that doesn't fit your normal spending pattern. It catches
          anomalies with 96.4% accuracy.
        </li>
        <li>
          <strong>A spending forecaster:</strong> Uses your past spending data to
          predict future expenses, accounting for seasonal patterns (like higher spending
          around holidays).
        </li>
        <li>
          <strong>Realistic test data:</strong> Since real financial data is sensitive,
          I built a system that generates realistic fake transaction histories for
          testing — complete with salary deposits, rent, and seasonal expenses.
        </li>
        <li>
          <strong>Privacy protection:</strong> Your financial data is encrypted when
          it enters the system and permanently deleted after processing — nothing
          is stored.
        </li>
      </ul>

      <h2>Why does this matter?</h2>
      <p>
        Most financial tools show you charts. FinFluent explains what those charts
        mean and tells you what to do about them — in plain English, powered by AI.
      </p>
    `,

    image:    "assets/images/projects/finfluent.png",
    tags:       ["Python", "LLM", "Classical ML", "Time-Series", "Anomaly Detection"],
    categories: ["Python", "ML & AI"],
    links:    { github: null, live: null },
    featured: true,
    nda:      false,
  },

  /* ── 3. Pneumonia Classifier ─────────────────────────── */
  {
    id:    "pneumonia-classifier",
    title: "Pneumonia Diagnosis through Pixels",
    hook:  "Built a robust medical imaging pipeline that transforms noisy, inconsistent CT scan data into reliable inputs for deep learning models, significantly improving generalization in low-data conditions.",

    techDesc: `
      <h2>Project Overview</h2>
      <p>
        This project focuses on detecting pneumonia and COVID-19 from lung CT scans
        using an ensemble of deep learning and machine learning models. The system
        combines pre-trained CNN architectures (ResNet variants and MobileNetV2) with
        a gradient boosting classifier to improve diagnostic performance and robustness
        across heterogeneous medical imaging datasets.
      </p>

      <h2>My Contributions</h2>
      <ul>
        <li>
          Designed a <strong>multi-stage image preprocessing pipeline</strong> to
          standardize highly variable CT scan inputs from multiple sources, improving
          downstream model stability and feature quality.
        </li>
        <li>
          Engineered a <strong>region-of-interest (ROI)-driven filtering strategy</strong>
          to discard low-quality or non-informative slices, reducing noise in training data.
        </li>
        <li>
          Implemented <strong>edge enhancement (Laplacian filtering) and median-based
          denoising</strong>, preserving clinically relevant structures while removing artifacts.
        </li>
        <li>
          Developed an <strong>automated lung localization and cropping pipeline</strong>
          using morphological operations and connected-component analysis, ensuring
          consistent spatial focus across inputs.
        </li>
        <li>
          Applied <strong>transfer learning with selective layer freezing</strong> on
          ResNet architectures, preserving low-level visual features while adapting
          higher-level representations to medical imaging domains.
        </li>
        <li>
          Structured preprocessing and training as a <strong>repeatable pipeline</strong>,
          enabling consistent data flow from raw scans → processed inputs → model training.
        </li>
      </ul>

      <h2>Tech Highlights</h2>
      <ul>
        <li>MATLAB Deep Learning Toolbox</li>
        <li>ResNet-18, ResNet-50, MobileNetV2 (transfer learning)</li>
        <li>Morphological operations, Laplacian filtering, median denoising</li>
        <li>Gradient boosting ensemble classifier</li>
      </ul>
    `,

    nonTechDesc: `
      <h2>What is this project?</h2>
      <p>
        I built a system that analyzes lung CT scans to help detect pneumonia and
        COVID-19 — using AI instead of relying solely on a radiologist's manual review.
      </p>

      <h2>The challenge</h2>
      <p>
        Medical images are messy. CT scans from different hospitals look different,
        come in different formats, and contain a lot of "noise" — irrelevant slices,
        inconsistent brightness, and artifacts from the scanning equipment. Feeding
        this directly into an AI model produces unreliable results.
      </p>

      <h2>What I built</h2>
      <ul>
        <li>
          <strong>An image cleaner:</strong> A step-by-step process that standardizes
          every CT scan — adjusting brightness, removing noise, and focusing only on
          the lung region — so the AI always sees consistent, clean images.
        </li>
        <li>
          <strong>A smart filter:</strong> Automatically discards low-quality or
          unhelpful scan slices before they reach the model, so the AI only trains
          on useful data.
        </li>
        <li>
          <strong>A transfer-learned AI:</strong> Instead of training from scratch,
          I adapted a model that already understands general image patterns and
          fine-tuned it specifically for medical scans — which works much better
          with limited data.
        </li>
      </ul>

      <h2>Why does this matter?</h2>
      <p>
        In healthcare, a wrong diagnosis has serious consequences. By improving the
        quality of what the model sees, the system becomes more reliable — even when
        the input data is imperfect, which is almost always the case in the real world.
      </p>
    `,

    image:    "assets/images/projects/pneumonia-classifier.png",
    tags:       ["MATLAB", "CNN", "Transfer Learning", "Medical Imaging", "Image Processing"],
    categories: ["MATLAB", "ML & AI", "Image & Signal Processing"],
    links:    { github: null, live: null },
    featured: true,
    nda:      false,
  },

  /* ── 4. Android GPU Pipeline — NDA ───────────────────── */
  {
    id:    "android-gpu-pipeline",
    title: "Real-Time GPU-Accelerated Camera Imaging Pipeline",
    hook:  "Built a real-time mobile imaging pipeline achieving 1080p @ 30 FPS using GPU acceleration on Android — developed during an industry internship.",

    techDesc: `
      <div class="nda-notice">
        <span class="nda-notice__icon">🔒</span>
        <div>
          <strong>NDA-Protected Project</strong>
          <p>
            This project was completed as part of an industry internship and is subject
            to a Non-Disclosure Agreement. Implementation details, architectural decisions,
            and proprietary techniques cannot be disclosed. The description below covers
            only high-level outcomes and the technology domain.
          </p>
        </div>
      </div>

      <h2>Project Overview</h2>
      <p>
        During my internship, I contributed to the development of a real-time camera
        imaging pipeline on Android. The work involved GPU-accelerated processing
        of live camera frames to perform image enhancement operations while maintaining
        strict real-time performance requirements.
      </p>

      <h2>Scope of Contribution</h2>
      <ul>
        <li>Contributed to the design and implementation of a GPU-accelerated imaging pipeline
            combining compute and rendering stages on Android</li>
        <li>Worked within performance constraints targeting real-time video at 1080p resolution</li>
        <li>Collaborated with validation workflows to analyze performance variability
            across device configurations and operating conditions</li>
      </ul>

      <h2>Outcome</h2>
      <ul>
        <li>Sustained real-time video processing at <strong>1080p @ ~30 FPS</strong></li>
        <li>Contributed to performance benchmarking and cross-device validation</li>
      </ul>
    `,

    nonTechDesc: `
      <div class="nda-notice">
        <span class="nda-notice__icon">🔒</span>
        <div>
          <strong>NDA-Protected Project</strong>
          <p>
            This project was completed during an industry internship and is covered
            by a Non-Disclosure Agreement. Specific details about what was built
            cannot be shared publicly.
          </p>
        </div>
      </div>

      <h2>What can I share?</h2>
      <p>
        During my internship, I worked on a mobile application feature that processes
        live camera video in real time using the phone's GPU. The goal was to enhance
        video quality smoothly and without lag, even at high resolution.
      </p>
      <p>
        The result was a system that could handle high-resolution video at 30 frames
        per second — the standard for smooth, natural-looking video — without causing
        the phone to slow down or drop frames.
      </p>

      <h2>Why can't I share more?</h2>
      <p>
        The specific techniques and approaches used are proprietary to the company
        I interned with. Sharing them would violate the NDA I signed. I'm happy to
        discuss the domain and skills involved at a high level in a conversation.
      </p>
    `,

    image:    "assets/images/projects/android-gpu-pipeline.png",
    tags:       ["C++", "Java", "OpenCL", "OpenGL", "Android", "Real-Time Systems"],
    categories: ["C/C++", "Image & Signal Processing"],
    links:    { github: null, live: null },
    featured: false,
    nda:      true,
  },

  /* ── 5. Parkinson's Gait (CHAIR Internship) ──────────── */
  {
    id:    "parkinsons-gait",
    title: "Parkinson's Disease Detection via Gait Analysis",
    hook:  "Built an end-to-end signal processing and machine learning pipeline to detect Parkinson's disease from human gait patterns, achieving ~87% classification accuracy using an LSTM–SVM ensemble.",

    techDesc: `
      <h2>Project Overview</h2>
      <p>
        This project classifies Parkinson's disease using spatiotemporal gait signals
        such as stride intervals. The pipeline processes raw gait time-series data,
        extracts meaningful features using wavelet transformations, and feeds them into
        machine learning models for classification. The system leverages both classical
        signal processing and deep learning to capture temporal dependencies and
        statistical characteristics of gait abnormalities.
      </p>

      <h2>My Contributions</h2>

      <h3>Data Preprocessing Pipeline</h3>
      <ul>
        <li>Extracted stride interval signals (left and right) from raw gait datasets</li>
        <li>Removed initial transient segments (~first 20 seconds) to eliminate startup noise</li>
        <li>Implemented statistical outlier removal using median ± 3× standard deviation thresholding</li>
        <li>Applied normalization across subjects to ensure consistent feature scaling</li>
      </ul>

      <h3>Signal Processing and Feature Engineering</h3>
      <ul>
        <li>Applied Discrete Wavelet Transform (DWT) using Haar wavelets to decompose
            gait signals into multi-resolution components</li>
        <li>Extracted ~35 features per signal per decomposition level:
            mean, variance, energy, min, max</li>
        <li>Feature vectors capture both time-domain variability and frequency-domain characteristics</li>
      </ul>

      <h3>Model Development</h3>
      <ul>
        <li>Built a multi-layer stacked LSTM architecture with dropout regularization
            to model temporal dependencies in gait sequences</li>
        <li>Implemented an SVM classifier for complementary statistical learning</li>
        <li>Combined both into an ensemble framework to improve robustness</li>
      </ul>

      <h3>Training and Evaluation</h3>
      <ul>
        <li>Tuned hyperparameters (learning rate, sequence length, batch size) for stable convergence</li>
        <li>Evaluated using confusion matrix analysis and accuracy metrics</li>
        <li>Achieved <strong>~87% classification accuracy</strong> on Parkinson's vs healthy subjects</li>
      </ul>

      <h2>System Design Philosophy</h2>
      <p>
        The pipeline was designed to handle noisy biomedical signals, small dataset
        constraints, and inter-subject variability — balancing signal processing and ML
        modeling rather than relying purely on deep learning.
      </p>
    `,

    nonTechDesc: `
      <h2>What is this project?</h2>
      <p>
        I built a system that can detect Parkinson's disease by analyzing how a person
        walks — without requiring any invasive tests or specialist appointments.
      </p>

      <h2>How does it work?</h2>
      <ul>
        <li>
          <strong>Collect walking data:</strong> Sensors record how a person's stride
          timing changes as they walk — the tiny variations in step length and rhythm
          that are invisible to the naked eye.
        </li>
        <li>
          <strong>Clean the data:</strong> The raw recordings are noisy and inconsistent.
          I built a cleaning process that removes startup noise, outliers, and
          inconsistencies between subjects.
        </li>
        <li>
          <strong>Find the patterns:</strong> Using mathematical techniques, I broke
          down the walking patterns into components that capture both the short-term
          rhythm and the longer-term trends in a person's gait.
        </li>
        <li>
          <strong>Train the AI:</strong> Two different AI models were trained on these
          patterns and combined — one good at spotting short-term anomalies, the other
          at longer-term trends. Together they achieve ~87% accuracy.
        </li>
      </ul>

      <h2>Why does this matter?</h2>
      <p>
        Parkinson's diagnosis today relies heavily on clinical observation, which is
        subjective and often delayed. A system that detects subtle gait abnormalities
        early could support clinicians in identifying the disease sooner.
      </p>
    `,

    image:    "assets/images/projects/parkinsons-gait.png",
    tags:       ["MATLAB", "LSTM", "Classical ML", "Signal Processing", "Wavelet Analysis"],
    categories: ["MATLAB", "ML & AI", "Image & Signal Processing"],
    links:    { github: null, live: null },
    featured: false,
    nda:      false,
  },

  /* ── 6. GPS + IMU Sensor Fusion ──────────────────────── */
  {
    id:    "gps-imu-fusion",
    title: "GPS & IMU Sensor Fusion for Automotive Dead Reckoning",
    hook:  "Built a real-world vehicle localization pipeline that estimates position without GPS by intelligently combining noisy IMU and magnetometer data.",

    techDesc: `
      <h2>Project Overview</h2>
      <p>
        This project implements a dead-reckoning navigation system using GPS and IMU data
        to estimate vehicle position. The system fuses short-term accurate IMU measurements
        with long-term stable GPS signals, enabling robust localization even during
        temporary GPS outages.
      </p>

      <h2>My Contributions</h2>

      <h3>Sensor Calibration</h3>
      <ul>
        <li>Developed magnetometer calibration (hard-iron + soft-iron correction) to correct
            heading distortions caused by environmental interference</li>
        <li>Applied bias removal (mean subtraction) to IMU acceleration for cleaner velocity estimates</li>
      </ul>

      <h3>Heading and Orientation Estimation</h3>
      <ul>
        <li>Computed yaw using both magnetometer-based heading and gyroscope integration</li>
        <li>Designed a complementary filter combining:
          <ul>
            <li>Low-pass filter on magnetometer → long-term heading stability</li>
            <li>High-pass filter on gyroscope → short-term responsiveness</li>
          </ul>
        </li>
        <li>Tuned fusion parameter (α ≈ 0.98) to prioritize gyro responsiveness
            while correcting long-term drift</li>
      </ul>

      <h3>Velocity and Position Estimation</h3>
      <ul>
        <li>Estimated velocity by integrating IMU acceleration with filtering to reduce drift</li>
        <li>Compared IMU-derived velocity against GPS velocity to identify noise vs. drift discrepancies</li>
        <li>Built a full dead-reckoning pipeline: converted velocity to global frame using fused yaw,
            then integrated to compute Easting/Northing position</li>
      </ul>

      <h3>Error Analysis and Validation</h3>
      <ul>
        <li>Performed structured error analysis identifying:
          <ul>
            <li>Heading drift over time</li>
            <li>Velocity scaling mismatch between IMU and GPS</li>
            <li>IMU center-of-mass offset (~0.57 m)</li>
          </ul>
        </li>
        <li>Validated system by comparing IMU trajectory against GPS ground truth,
            analyzing divergence over time</li>
      </ul>
    `,

    nonTechDesc: `
      <h2>What is this project?</h2>
      <p>
        I built a system that tracks where a car is going using motion sensors —
        even when GPS is unavailable or unreliable.
      </p>

      <h2>The problem with GPS alone</h2>
      <p>
        GPS is accurate but can drop out in tunnels, urban canyons, or during
        signal interference. Motion sensors (IMU) work everywhere but drift over
        time — small errors accumulate into large position errors within minutes.
      </p>

      <h2>My solution</h2>
      <ul>
        <li>
          <strong>Combine GPS and motion sensors:</strong> Use GPS for long-term
          accuracy and the motion sensor for short-term precision, blending both
          based on their strengths.
        </li>
        <li>
          <strong>Calibrate the compass:</strong> The magnetometer used to measure
          heading is distorted by the car's metal body and electronics. I corrected
          these distortions to get a reliable direction estimate.
        </li>
        <li>
          <strong>Understand the errors:</strong> I systematically measured and
          documented where the system goes wrong — drift in direction, speed
          mismatches, and sensor placement offsets — so the errors are understood
          and quantified rather than hidden.
        </li>
      </ul>

      <h2>Outcome</h2>
      <p>
        A navigation system that remains accurate for short periods without GPS,
        with a full understanding of how and why errors accumulate over time.
      </p>
    `,

    image:    "assets/images/projects/gps-imu-fusion.png",
    tags:       ["MATLAB", "ROS2", "Sensor Fusion", "Signal Processing", "Navigation"],
    categories: ["MATLAB", "Image & Signal Processing"],
    links:    { github: null, live: null },
    featured: false,
    nda:      false,
  },

  /* ── 7. Hybrid Branch Predictor ──────────────────────── */
  {
    id:    "hybrid-branch-predictor",
    title: "Hybrid Branch Predictor Design and Evaluation",
    hook:  "Designed a budget-aware hybrid branch predictor that intelligently combines traditional hardware predictors with a neural model to reduce mispredictions under strict memory constraints.",

    techDesc: `
      <h2>Project Overview</h2>
      <p>
        This project designs and evaluates a hybrid branch predictor combining a gshare
        predictor and a perceptron-based predictor under strict hardware storage budgets
        (4 KB and 8 KB). The system dynamically selects between predictors using a
        confidence-based mechanism to balance short-pattern learning and long-range
        correlation modeling.
      </p>

      <h2>My Contributions</h2>

      <h3>Predictor Implementation</h3>
      <ul>
        <li>Implemented a fully parameterized <strong>gshare predictor</strong> with
            XOR-based indexing and 2-bit saturating counters</li>
        <li>Implemented a <strong>perceptron predictor</strong> with configurable history
            length, weight precision, and training threshold</li>
        <li>Perceptron learning: weight updates on misprediction and low-confidence predictions,
            saturating arithmetic for hardware feasibility, global history encoded as +1/−1</li>
      </ul>

      <h3>Confidence-Based Hybrid Selection</h3>
      <ul>
        <li>High confidence → perceptron prediction</li>
        <li>Low confidence → gshare prediction</li>
        <li>Medium confidence → meta predictor (2-bit chooser table)</li>
      </ul>

      <h3>Simulation Framework</h3>
      <ul>
        <li>Designed a runtime-configurable simulator using CLI arguments to adjust
            gshare table size, perceptron count, history length, training threshold,
            and storage allocation</li>
        <li>Built automation scripts to sweep configurations under strict memory budgets,
            enforcing bit-level storage constraints before each simulation run</li>
      </ul>

      <h3>Workload Generation and Evaluation</h3>
      <ul>
        <li>Created a custom <strong>Intel PIN tool</strong> to generate real execution branch
            traces (Program Counter + Taken/Not Taken) for realistic workload evaluation</li>
        <li>Designed and evaluated multiple workloads:
          <ul>
            <li>SPEC-style trace (real-world behavior)</li>
            <li>Mixed synthetic benchmark (random, periodic, XOR, chaotic patterns)</li>
            <li>Quicksort benchmark (recursive, data-dependent branches)</li>
          </ul>
        </li>
        <li>Demonstrated consistent misprediction reduction: gshare captures short-term
            patterns, perceptron handles long-range correlations</li>
      </ul>
    `,

    nonTechDesc: `
      <h2>What is branch prediction?</h2>
      <p>
        Modern processors are like assembly lines — they try to do multiple things
        at once to be fast. But when a program reaches a decision point (like an
        "if" statement), the processor needs to <em>guess</em> which way the program
        will go before it actually knows, so it can keep the assembly line moving.
        A wrong guess wastes time — the processor has to discard its work and start over.
        This is called a <strong>branch misprediction</strong>.
      </p>

      <h2>What did I build?</h2>
      <p>
        I built a smarter guessing system that combines two different prediction strategies:
      </p>
      <ul>
        <li>
          <strong>Strategy 1 (gshare):</strong> Good at recognizing short, repeating patterns —
          like a condition that alternates true/false/true/false.
        </li>
        <li>
          <strong>Strategy 2 (Perceptron):</strong> A simple neural model that's better
          at learning long-range patterns — where a condition depends on something
          that happened many steps earlier.
        </li>
      </ul>
      <p>
        The hybrid system decides which strategy to trust based on how confident each
        one is — similar to asking two experts and weighing their opinions based on
        how certain they are.
      </p>

      <h2>The constraint</h2>
      <p>
        Hardware memory is expensive. The entire predictor had to fit within 4–8 KB —
        about the size of a very short text document. I evaluated different design
        tradeoffs to get the best performance within that budget.
      </p>

      <h2>Results</h2>
      <p>
        The hybrid predictor consistently outperforms either strategy alone across
        real and synthetic workloads — proving that combining complementary approaches
        is better than doubling down on one.
      </p>
    `,

    image:    "assets/images/projects/hybrid-branch-predictor.png",
    tags:       ["C", "C++", "Computer Architecture", "Simulation", "Intel PIN"],
    categories: ["C/C++"],
    links:    { github: null, live: null },
    featured: false,
    nda:      false,
  },

];

if (typeof module !== "undefined") module.exports = PROJECTS;
