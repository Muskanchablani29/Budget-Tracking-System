# Budget Tracker Setup Instructions

## Backend Setup (Django)

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run database migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Create user account:**
   ```bash
   python create_user.py
   ```
   This creates a user with:
   - **Username:** admin
   - **Password:** budget123

4. **Create default categories:**
   ```bash
   python manage.py shell
   ```
   Then run:
   ```python
   from budget.models import Category
   categories = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other']
   for cat in categories:
       Category.objects.get_or_create(name=cat)
   exit()
   ```

5. **Start Django server:**
   ```bash
   python manage.py runserver
   ```

## Frontend Setup (React)

1. **Install React dependencies:**
   ```bash
   cd budget
   npm install
   ```

2. **Start React development server:**
   ```bash
   npm start
   ```

## Usage

1. **Login:** Use your created username/password at http://localhost:3000
2. **Set Monthly Budget:** Use Django admin at http://127.0.0.1:8000/admin/
3. **Enhanced Dashboard:** 
   - Budget vs Spent vs Remaining
   - Weekly spending summary
   - Transaction count
   - Top spending categories
4. **Add Expenses:** Quick mobile-friendly form
5. **Secure Access:** Only you can access your data

## API Endpoints

- `GET /api/dashboard/` - Dashboard summary
- `GET/POST /api/expenses/` - Manage expenses
- `GET/POST /api/categories/` - Manage categories
- `GET/POST /api/budgets/` - Manage monthly budgets

## Mobile Features

- Responsive design for phones
- Touch-friendly interface
- Quick expense entry
- Real-time budget tracking