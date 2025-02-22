# Personal Finance Tracker

Deployed on https://fintrack-lyart.vercel.app/ ** (Check it out) **

A Next.js-based web application designed to help users track their personal finances. This app allows users to manage budgets, log transactions, and gain insights into their spending habits.

## Features

- **Budget Management**: Set monthly budgets for different categories (e.g., Food & Dining, Transportation).
- **Transaction Logging**: Add, update, and delete transactions with details like amount, date, description, and category.
- **Spending Insights**: Visualize spending trends using charts and summaries.
- **Real-Time Updates**: Budgets dynamically update based on transactions.
- **Responsive Design**: Built with Tailwind CSS for a clean and mobile-friendly UI.

---

## Local Setup Instructions

### 1. Clone the Repository

Run the following command to clone the project repository:

```bash
git clone (https://github.com/1ncreo/fintrack.git)
cd fintrack
```

### 2. Install Required Dependencies

Install the necessary libraries:

```bash
npm install
```

### 3. Ensure `shadcn/ui` Components Are Installed

This project uses `shadcn/ui` for pre-built components. If the components are already included in the cloned repository, you can skip this step. Otherwise, you may need to add specific components by running:

```bash
npx shadcn@latest add button card form input label select tabs progress dialog toast
```

### 4. Set Up MongoDB

1. Create a free MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster.
3. Click "Connect" and choose "Connect your application."
4. Copy the connection string (it will look something like `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`).

### 5. Set Up Environment Variables

Create a `.env.local` file in the root of your project and add the following variables:

```plaintext
MONGODB_URI=<your-mongodb-connection-string>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Replace `<your-mongodb-connection-string>` with the connection string you copied from MongoDB Atlas.

### 6. Run the Development Server

Start the development server to test the application locally:

```bash
npm run dev
```

The app should now be running at [http://localhost:3000](http://localhost:3000).

---

## What’s Been Implemented

### 1. **Budget Management**
- Add, edit, and delete budgets.
- Budgets dynamically update based on transactions within the current month.

### 2. **Transaction Logging**
- Log transactions with details such as amount, date, description, and category.
- Transactions are stored in a MongoDB database.

### 3. **Spending Insights**
- Displays a summary of total spending, average transaction amounts, and category-wise spending.
- Includes visualizations using charts powered by `recharts`.

### 4. **Responsive UI**
- Built with Tailwind CSS and `shadcn/ui` for a modern, responsive design.

---

## Deployment

To deploy the app, use platforms like **Vercel** or **Netlify**:

1. Push your code to a Git repository (e.g., GitHub).
2. Connect your repository to Vercel or Netlify.
3. Add the required environment variables (`MONGODB_URI`, etc.) in the deployment platform's settings.
4. Deploy the app.

---

## Technologies Used

- **Frontend**: Next.js, TypeScript, Tailwind CSS, `shadcn/ui`
- **Backend**: Next.js API Routes, MongoDB
- **Validation**: `zod`, `react-hook-form`
- **Charts**: `recharts`
- **Database**: MongoDB Atlas

---
