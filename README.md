# 📘 Learning Management System (LMS) - Backend

This project provides the backend for a simple Learning Management System (LMS) where users can sign up, enroll in courses, track progress, and attempt quizzes.

---

## 🔧 Setup Instructions

1. **Clone the Repository:**

   ```bash
   git clone <your-repo-url>
   cd <repo-folder>
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Environment Variables:**
   Create a `.env` file in the root directory and add:

   ```env
   MONGO_URI=<your-mongo-db-connection-string>
   JWT_SECRET=<your-jwt-secret>
   PORT=8000
   ```

4. **Run the Application:**

   ```bash
   npm start
   ```

---

## 🚀 Live API

🔗 https://learning-management-system-lms-fyud.onrender.com

---

## 📡 REST APIs (Total: 14)

All protected routes require a `Bearer token` in the `Authorization` header.

###  1. Register User

* **POST** `/api/auth/register`
* **Body:**

```json
{ "name": "John", "email": "john@example.com", "password": "123456", "role": "student" }
```

* **Response:** `{ token }`

---

###  2. Login User

* **POST** `/api/auth/login`
* **Body:**

```json
{ "email": "john@example.com", "password": "123456" }
```

* **Response:** `{ token }`

---

###  3. List Courses

* **GET** `/api/courses`
* **Headers:** Authorization
* **Query (optional):** `page`, `limit`
* **Response:** `{ page, limit, total, courses }`

---

###  4. Get Single Course

* **GET** `/api/courses/:id`
* **Headers:** Authorization
* **Response:** Full course with lessons & quizzes

---

###  5. Create Course *(Admin only)*

* **POST** `/api/courses`
* **Headers:** Authorization (Admin)
* **Body:**

```json
{ "title": "HLD", "description": "Design systems", "instructor": "Alex", "price": 500 }
```

---

###  6. Enroll in Course

* **POST** `/api/courses/:id/enroll`
* **Headers:** Authorization
* **Response:** Full course with enrollment

---

###  7. List Lessons by Course

* **GET** `/api/lessons/:courseId`
* **Headers:** Authorization

---

###  8. Create Lesson *(Admin only)*

* **POST** `/api/lessons/:courseId`
* **Headers:** Authorization (Admin)
* **Body:**

```json
{ "title": "Intro", "videoUrl": "https://...", "resources": ["https://link"] }
```

---

###  9. List Quizzes by Course

* **GET** `/api/quizzes/:courseId`
* **Headers:** Authorization

---

###  10. Create Quiz *(Admin only)*

* **POST** `/api/quizzes/:courseId`
* **Headers:** Authorization (Admin)
* **Body:**

```json
{
  "questions": [
    {
      "text": "What is JS?",
      "options": [
        { "text": "Language", "correct": true },
        { "text": "Fruit", "correct": false }
      ]
    }
  ]
}
```

---

###  11. Get Progress for a Course

* **GET** `/api/progress/:courseId`
* **Headers:** Authorization
* **Response:** Progress object + completion % + quiz scores

---

###  12. Mark Lesson Completed

* **POST** `/api/progress/lesson`
* **Headers:** Authorization
* **Body:**

```json
{ "lessonId": "id", "courseId": "id" }
```

---

###  13. Submit Quiz Attempt

* **POST** `/api/progress/quiz`
* **Headers:** Authorization
* **Body:**

```json
{ "quizId": "id", "courseId": "id", "score": 90 }
```

---

###  14. See Quiz Scores

* **GET** `/api/progress/:courseId/quiz`
* **Headers:** Authorization
* **Response:** Quiz attempts with score & date

---
