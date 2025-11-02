# Modern Budget Tracker Setup

## MySQL Database Setup

1. **Install MySQL Server**
   - Download from https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP for easy setup

2. **Create Database**
   ```sql
   CREATE DATABASE budget_tracker;
   ```

3. **Update MySQL credentials in settings.py if needed**

## Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Create user and categories:**
   ```bash
   python create_user.py
   python manage.py shell -c "
   from budget.models import Category
   categories = [
       ('Food', '🍔', '#e74c3c'),
       ('Transport', '🚗', '#3498db'), 
       ('Bills', '💡', '#f39c12'),
       ('Shopping', '🛍️', '#9b59b6'),
       ('Entertainment', '🎬', '#e67e22'),
       ('Health', '🏥', '#1abc9c'),
       ('Other', '📦', '#95a5a6')
   ]
   for name, icon, color in categories:
       Category.objects.get_or_create(name=name, defaults={'icon': icon, 'color': color})
   print('Categories created')
   "
   ```

4. **Start server:**
   ```bash
   python manage.py runserver
   ```

## Frontend Setup

1. **Install React dependencies:**
   ```bash
   cd budget
   npm install
   ```

2. **Start React app:**
   ```bash
   npm start
   ```

## New Features

### 💳 Wallet System
- Track your actual money balance
- Add money to wallet
- Automatic deduction on expenses

### 📊 Modern Dashboard
- Glassmorphism design
- Real-time balance tracking
- Category breakdown with icons
- Weekly spending stats

### 📱 Mobile-First Design
- Touch-friendly interface
- Responsive tabs navigation
- Floating action button
- Modern gradients and animations

### 🔄 Transaction History
- Complete transaction log
- Add money / Expense tracking
- Real-time updates

## Login Credentials
- **Username:** admin
- **Password:** budget123

## API Endpoints
- `POST /api/add-money/` - Add money to wallet
- `GET /api/transactions/` - Get transaction history
- `GET /api/dashboard/` - Enhanced dashboard data
- All existing endpoints with user-specific data