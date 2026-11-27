# Manufacturing Training & Development System

A professional, responsive portfolio demonstration for exploring how a manufacturing organization could improve visibility into employee training, qualifications, standardized work, development, and continuous improvement.

> **Portfolio disclaimer:** "This portfolio project uses entirely fictional employees, processes, training requirements, safety information, and manufacturing data. It was independently developed to demonstrate concepts related to manufacturing training, workforce development, continuous improvement, and software development. It does not contain proprietary employer information."

## Problem explored

Workforce development records are often split across spreadsheets, binders, training logs, and informal conversations. This project demonstrates a focused, understandable dashboard for connecting training status, qualification coverage, trainer capacity, renewal needs, and improvement ideas.

## Features

- Dashboard KPIs and action summaries
- Searchable, filterable fictional employee profiles
- Visual workforce skills matrix
- Standardized fictional training modules
- Qualification status and renewal management
- Continuous improvement submission workflow
- Dynamically generated training gap findings
- Simple CSS/HTML analytics visualizations
- Browser localStorage persistence
- Reset Demo Data action
- Responsive desktop and mobile navigation

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Browser localStorage
- No backend, external APIs, chart libraries, or paid services

## Demonstration data

All people, employee IDs, departments, shifts, processes, training records, qualifications, metrics, safety statements, and improvement records are fictional. The procedures are intentionally generic and portfolio-focused, not real operating instructions or proprietary manufacturing information.

## Project structure

```text
manufacturing-training-system/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── data.js
│   └── app.js
└── README.md
```

## Run locally

From the project directory, start any simple static server:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

You can also open `index.html` directly, but a local server is recommended for consistent browser behavior.

## GitHub Pages deployment

1. Create a GitHub repository and push this project.
2. Open the repository **Settings**.
3. Select **Pages** under **Code and automation**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder, then save.
6. Wait for GitHub Pages to publish the site.

## What I learned

This project reinforces the separation of demonstration data from application behavior, dynamic rendering from JavaScript, localStorage-based persistence, accessible navigation patterns, responsive dashboard design, and the importance of clearly identifying portfolio and fictional content.

## Future improvements

- Import/export for approved CSV data
- Role-based demonstration views
- Deeper qualification workflow history
- Printable skills matrix reports
- Expanded test coverage
- Data validation and backend integration as a separate future concept
