
## 🧪 Technical Stack
*   **Frontend**: Next.js 14, Tailwind CSS, Shadcn UI.
*   **Backend**: Django & Django REST Framework# 🛡️ Nexus Task SaaS: Enterprise Management Suite

## 🌟 What is Nexus?
**Nexus** is a high-performance Project Management platform engineered for teams that require strict organizational structure and high-visibility tracking. 

Most task management tools become cluttered as projects scale. Nexus prevents this by enforcing a **Three-Tier Relational Architecture**. Every piece of data is logically nested to ensure that even with thousands of active tasks, your workflow remains clean and your team stays focused.

### The Power of Three-Tier Architecture:
1.  **Workspaces**: High-level isolated environments for different organizations or departments.
2.  **Projects**: Specialized initiatives nested within a specific Workspace.
3.  **Tasks**: Actionable units of work with rich metadata including Status, Priority, and Due Dates.

---

## 🚀 Key Features

### 🛠️ Hierarchical Data Engine
The "brain" of Nexus is a strict relational model. This architecture eliminates "orphan data"—every task is tied to a project, and every project is tied to a workspace, ensuring 100% data integrity.

### 🗓️ Smart Roadmap (Visual Calendar)
Built with a custom engine using `date-fns`, the Nexus Roadmap offers:
*   **Auto-Mapping**: Tasks automatically populate the grid based on their due dates.
*   **Zero-Lag Navigation**: Client-side date calculations provide an instant, snappy user experience.
*   **Priority Heatmaps**: Color-coded task indicators let you see urgent items at a glance.

### 🔐 Enterprise-Grade Security
*   **JWT Authentication**: Secure login/registration via Django Rest Framework.
*   **Middleware Guards**: Custom Next.js protection to prevent unauthorized dashboard access.
*   **CORS Protection**: Hardened backend security to prevent cross-site attacks.

---

## 📸 Project Showcase
> **Note:** Upload your screenshots to an `/assets` folder in your repository to display them here. Refer to file names verbatim as `dash.png`, `roadmap.png`, and `modal.png`.

<img width="1887" height="935" alt="Screenshot 2026-05-01 175927" src="https://github.com/user-attachments/assets/ae22b20a-f7b9-4261-822b-b4e416291d2a" />
<img width="1899" height="935" alt="Screenshot 2026-05-01 180001" src="https://github.com/user-attachments/assets/5cdc17a5-1fda-4cce-857f-e0a9384bfc73" />
<img width="1913" height="930" alt="Screenshot 2026-05-01 175859" src="https://github.com/user-attachments/assets/9e586ef6-02b6-475e-b4ca-e064ed8a6ca3" />
<img width="1899" height="938" alt="Screenshot 2026-05-01 175914" src="https://github.com/user-attachments/assets/59aa8b8d-63fe-4f7c-9c0f-3287a3cf46f4" />
<img width="1908" height="935" alt="Screenshot 2026-05-01 175826" src="https://github.com/user-attachments/assets/7ff2997e-caef-4a26-ab9b-f1d6b76807bf" />
<img width="1914" height="934" alt="Screenshot 2026-05-01 180013" src="https://github.com/user-attachments/assets/ef29c160-98e4-4c5d-ad1d-1edca0a7532b" />

---

## 📥 Installation & Setup Steps

### 1. Clone the Repository
```bash
git clone [https://github.com/zoraizbinzahid/nexus-task-saas.git](https://github.com/zoraizbinzahid/nexus-task-saas.git)
cd nexus-task-saas
