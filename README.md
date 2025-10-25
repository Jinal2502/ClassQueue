# Student Doubt Queue System 🎓

A modern web application that demonstrates the practical implementation of Queue and Priority Queue data structures in an educational setting. Students can ask doubts, and teachers can resolve them in an organized, queue-based manner with real-time updates.

## 🌟 Features

### 🔐 Authentication System
- **Student & Faculty Authentication** - Secure email/password login using Supabase Auth
- **Role-based Access Control** - Different interfaces for students and teachers
- **Session Management** - Persistent login sessions with automatic logout

### 📋 Doubt Management
- **Real-time Doubt Timeline** - Live updates of all doubts and answers
- **Categorized Doubts** - General doubts vs Priority doubts (exam/placement related)
- **Queue-based Resolution** - FIFO for general doubts, priority handling for urgent queries
- **Interactive Teacher Dashboard** - Separate queues with visual queue operations

### 📊 Data Structure Implementation
- **Normal Queue** - First-Come-First-Serve for general doubts
- **Priority Queue** - Handles exam and placement-related doubts with higher priority
- **Dynamic Operations** - Live enqueue/dequeue operations with database persistence
- **Queue Visualization** - Visual representation of queue operations

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Supabase (Authentication + Database + Real-time)
- **State Management:** React Context API + Hooks
- **Data Structures:** Custom Queue & Priority Queue implementations
- **Styling:** Tailwind CSS with dark theme
- **Real-time Updates:** Supabase Realtime subscriptions

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Navbar.jsx              # Navigation component
│   ├── DoubtCard.jsx           # Individual doubt display
│   ├── QueueDisplay.jsx        # Queue visualization
│   ├── QueueVisualizer.jsx     # Interactive queue display
│   ├── StatsCard.jsx           # Statistics display
│   └── ProtectedRoute.jsx      # Route protection
├── pages/
│   ├── Login.jsx               # Authentication page
│   ├── Timeline.jsx            # Main doubt timeline
│   ├── AskDoubt.jsx           # Doubt submission form
│   └── TeacherDashboard.jsx   # Teacher interface
├── context/
│   ├── AuthContext.jsx         # Authentication state
│   └── DoubtContext.jsx        # Doubt management state
├── ds-implementation/
│   ├── Queue.js                # Normal Queue implementation
│   └── PriorityQueue.js        # Priority Queue implementation
├── utils/
│   └── supabase.js             # Supabase configuration
├── App.jsx                     # Main application component
└── main.jsx                    # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/student-doubt-queue-system.git
cd student-doubt-queue-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your Project URL and API Key

2. **Database Setup**
   - Go to SQL Editor in your Supabase dashboard
   - Run the following SQL to create required tables:

```sql
-- Create users table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('student', 'teacher')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doubts table
CREATE TABLE doubts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT CHECK (category IN ('general', 'priority')) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'resolved')) DEFAULT 'pending',
    student_id UUID REFERENCES auth.users(id) NOT NULL,
    teacher_id UUID REFERENCES auth.users(id),
    answer TEXT,
    queue_position INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doubts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view doubts" ON doubts
    FOR SELECT USING (true);

CREATE POLICY "Students can insert their own doubts" ON doubts
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can update doubts" ON doubts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'teacher'
        )
    );
```

3. **Environment Setup**
   - Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📝 Usage Guide

### For Students:
1. **Sign Up/Login** - Create an account with student role
2. **Ask Doubts** - Submit doubts with title, description, and category
3. **View Timeline** - See all doubts and their answers in real-time
4. **Track Status** - Monitor your doubts from pending to resolved

### For Teachers:
1. **Sign Up/Login** - Create an account with teacher role
2. **Access Dashboard** - View separate queues for general and priority doubts
3. **Resolve Doubts** - Answer doubts in queue order (FIFO for general, priority first)
4. **Real-time Updates** - See new doubts appear instantly

## 🎯 Key Learning Outcomes

- **Data Structure Implementation** - Practical use of Queue and Priority Queue
- **Real-time Applications** - Supabase real-time subscriptions
- **State Management** - React Context API for complex state
- **Authentication** - Secure user authentication and authorization
- **Database Design** - Relational database with proper constraints
- **Modern React Patterns** - Hooks, Context, and functional components

## 🔧 Data Structure Details

### Normal Queue (FIFO)
```javascript
// Used for general doubts
enqueue(doubt) // Adds doubt to end of queue
dequeue()      // Removes doubt from front of queue
peek()         // Views next doubt without removing
isEmpty()      // Checks if queue is empty
```

### Priority Queue
```javascript
// Used for exam/placement doubts
enqueue(doubt, priority) // Adds doubt with priority level
dequeue()               // Removes highest priority doubt
peek()                  // Views highest priority doubt
isEmpty()               // Checks if queue is empty
```

## 🎨 UI/UX Features

- **Dark Theme** - Sleek, modern dark interface
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Real-time Updates** - Live doubt submissions and resolutions
- **Queue Visualization** - Visual representation of queue operations
- **Statistics Dashboard** - Track doubt resolution metrics
- **Intuitive Navigation** - Clear routing and user flows

## 🔒 Security Features

- **Row Level Security** - Database-level access control
- **Role-based Access** - Different permissions for students and teachers
- **Protected Routes** - Authentication required for sensitive pages
- **Input Validation** - Client and server-side validation
- **Session Management** - Secure session handling with Supabase

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify Deployment
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Supabase for providing excellent backend-as-a-service
- React team for the amazing framework
- Tailwind CSS for beautiful styling utilities
- Vite for lightning-fast development experience

## 📊 Project Stats

- **Lines of Code:** ~4000+
- **Components:** 10+
- **Pages:** 4
- **Data Structures:** 2 (Queue, Priority Queue)
- **Real-time Features:** ✅
- **Authentication:** ✅
- **Database:** PostgreSQL (via Supabase)

---

⭐ **Star this repository if you found it helpful!**

📚 **Perfect for learning:** Data Structures, React, Real-time Applications, Authentication, and Modern Web Development
