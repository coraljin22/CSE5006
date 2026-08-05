# ❤️ HealthCoverSim

**Private Health Insurance Quote Simulator**

HealthCoverSim is a full-stack web application developed for the CSE5006 Web Development assignment.

The system allows users to create, edit, view and delete private health insurance quotations while demonstrating premium calculation rules including Lifetime Health Cover (LHC), family loading and annual payment discounts.

---

# Features

- Create a new health insurance quotation
- View all saved quotations
- Search quotations
- View quotation details
- Edit existing quotations
- Delete quotations
- Premium calculation breakdown
- Explanation Sheet
- Lifetime Health Cover (LHC) calculation
- Annual payment discount
- Family upgrade calculation
- Frontend and backend validation
- Responsive user interface

---

# Technologies Used

Frontend

- React
- React Router
- Axios
- CSS3

Backend

- Node.js
- Express.js

Database

- SQLite3

Development Tools

- VS Code
- Git
- GitHub

---

# Project Structure

```
HealthCoverSim
│
├── client
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── services
│   │   └── styles
│
├── server
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── database
│   │   ├── init.sql
│   │   └── db.js
│
└── README.md
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/HealthCoverSim.git
```

Install dependencies

Client

```bash
cd client
npm install
```

Server

```bash
cd ../server
npm install
```

---

# Database

Create the SQLite database

```bash
sqlite3 healthcover.db < init.sql
```

---

# Run the Backend

```bash
cd server
npm start
```

Backend URL

```
http://localhost:3001
```

---

# Run the Frontend

```bash
cd client
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# Premium Calculation

The premium is calculated using the following process.

1. Calculate Hospital Cover premium.
2. Add Extras Cover premium.
3. Apply Lifetime Health Cover loading.
4. Add Family Upgrade fee when applicable.
5. Calculate Monthly Premium.
6. Calculate Yearly Premium.
7. Apply Annual Discount (5%) for yearly payment.
8. Display Final Premium.

---

# Validation

The system validates:

- Required fields
- Applicant age
- Discount percentage
- Family/Couple applicant requirements
- Invalid input values

Both frontend and backend validation are implemented.

---

# Explanation Sheet

The Explanation Sheet explains:

- Hospital premium
- Extras premium
- LHC loading
- Family fee
- Monthly premium
- Yearly premium
- Annual discount
- Final premium

---

# AI Usage Statement

Generative AI (ChatGPT) was used as a development assistant for:

- UI styling suggestions
- CSS improvements
- React debugging
- README writing assistance

All premium calculation logic, validation rules, application testing and final verification were completed and reviewed by the author.

---

# Known Limitations

- SQLite is intended for educational purposes only.
- Authentication and user accounts are not implemented.
- The application is designed for local execution.

---

# AI Usage Statement

Generative AI tools (ChatGPT) were used to assist with the following tasks:

- Troubleshooting code errors
- Optimizing CSS styles
- Providing UI design suggestions
- Drafting the README document

The application logic, premium calculations, validation rules, testing, and final submission were all completed, reviewed, and verified by the author.

# Author

Coral Jin

La Trobe University

CSE5006 Web Development

2026

