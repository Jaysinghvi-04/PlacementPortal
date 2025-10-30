import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/projo_db')
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error(err));

app.use(cors());
app.use(express.json());

// Mongoose Schemas and Models
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'faculty', 'recruiter', 'student'] },
  name: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

const ApplicationSchema = new mongoose.Schema({
  postingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Posting', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, required: true, enum: ['pending', 'reviewed', 'accepted', 'rejected', 'offered', 'interview', 'under_review', 'withdrawn', 'APPLIED', 'UNDER_REVIEW', 'INTERVIEW', 'OFFERED'] },
  coverLetter: { type: String },
});

const Application = mongoose.model('Application', ApplicationSchema);

// Mock postings data
const mockPostings = [
  { id: 'post1', title: 'Software Engineer', description: 'Develop awesome software.', type: 'full-time', recruiterId: '3', deadline: '2025-12-31', status: 'Open', eligibility: { minGpa: 3.0, gradYear: [2025, 2026] }, requiresVerification: true, requiredSkills: ['JavaScript', 'React'], company: 'Tech Corp', location: 'Remote', salary: '100k' },
  { id: 'post2', title: 'Frontend Developer', description: 'Build beautiful UIs.', type: 'internship', recruiterId: '3', deadline: '2025-11-15', status: 'Open', eligibility: { minGpa: 3.5, gradYear: [2026] }, requiresVerification: false, requiredSkills: ['HTML', 'CSS', 'Vue'], company: 'Design Studio', location: 'New York', salary: '50k' },
];

// Mock departments data
const mockDepartments = [
  { id: 'dpt1', name: 'Computer Science' },
  { id: 'dpt2', name: 'Electrical Engineering' },
];

// Mock skills data
const mockSkills = [
  { id: 'sk1', name: 'JavaScript' },
  { id: 'sk2', name: 'React' },
  { id: 'sk3', name: 'Node.js' },
];

// Mock verification documents data
const mockVerificationDocs = [
  { id: 'doc1', userId: '1', type: 'transcript', url: 'http://example.com/transcript1.pdf', status: 'pending', documentName: 'transcript.pdf', updatedAt: new Date().toISOString() },
  { id: 'doc2', userId: '1', type: 'resume', url: 'http://example.com/resume1.pdf', status: 'verified', documentName: 'resume.pdf', updatedAt: new Date().toISOString() },
];

// Auth Endpoints
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password }); // Find user by username and password
    if (user) {
      res.status(200).json({ data: user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role, username } = req.body;
  try {
    const newUser = new User({ username: email, email, password, role, name });
    await newUser.save();
    res.status(201).json({ data: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// User Profile Endpoint (mock)
app.get('/api/users/:userId/profile', async (req, res) => {
  const { userId } = req.params;
  try {
    const userProfile = await User.findById(userId);
    if (userProfile) {
      res.status(200).json({ data: userProfile });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Admin Endpoints
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ data: users, pagination: { page: 1, limit: users.length, total: users.length } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.get('/api/admin/roles', (req, res) => {
  res.status(200).json({ data: ['admin', 'faculty', 'recruiter', 'student'] });
});

app.patch('/api/admin/users/:userId/role', async (req, res) => {
  const { userId } = req.params;
  const { roleId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { role: roleId }, { new: true });
    if (user) {
      res.status(200).json({ data: user, message: 'User role updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Application Endpoints
app.get('/api/applications', async (req, res) => {
  try {
    const applications = await Application.find({});
    res.status(200).json({ data: applications, pagination: { page: 1, limit: applications.length, total: applications.length } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.get('/api/applications/:applicationId', async (req, res) => {
  const { applicationId } = req.params;
  try {
    const application = await Application.findById(applicationId);
    if (application) {
      res.status(200).json({ data: application });
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const newApplication = new Application(req.body);
    await newApplication.save();
    res.status(201).json({ data: newApplication });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.patch('/api/applications/:applicationId/status', async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;
  try {
    const application = await Application.findByIdAndUpdate(applicationId, { status }, { new: true });
    if (application) {
      res.status(200).json({ data: application, message: 'Application status updated successfully' });
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Posting Endpoints
app.get('/api/postings', (req, res) => {
  res.status(200).json({ data: mockPostings, pagination: { page: 1, limit: mockPostings.length, total: mockPostings.length } });
});

app.get('/api/postings/:postingId', (req, res) => {
  const { postingId } = req.params;
  const posting = mockPostings.find(p => p.id === postingId);
  if (posting) {
    res.status(200).json({ data: posting });
  } else {
    res.status(404).json({ message: 'Posting not found' });
  }
});

app.post('/api/postings', (req, res) => {
  const newPosting = { id: `post${mockPostings.length + 1}`, ...req.body };
  mockPostings.push(newPosting);
  res.status(201).json({ data: newPosting });
});

app.put('/api/postings/:postingId', (req, res) => {
  const { postingId } = req.params;
  const updatedPosting = req.body;
  const index = mockPostings.findIndex(p => p.id === postingId);
  if (index !== -1) {
    mockPostings[index] = { ...mockPostings[index], ...updatedPosting };
    res.status(200).json({ data: mockPostings[index], message: 'Posting updated successfully' });
  } else {
    res.status(404).json({ message: 'Posting not found' });
  }
});

app.delete('/api/postings/:postingId', (req, res) => {
  const { postingId } = req.params;
  const index = mockPostings.findIndex(p => p.id === postingId);
  if (index !== -1) {
    const deletedPosting = mockPostings.splice(index, 1);
    res.status(200).json({ data: deletedPosting[0], message: 'Posting deleted successfully' });
  } else {
    res.status(404).json({ message: 'Posting not found' });
  }
});

// Faculty Endpoints
app.get('/api/faculty/:facultyId/dashboard', (req, res) => {
  const { facultyId } = req.params;
  // Mock data for faculty dashboard
  res.status(200).json({ data: { facultyId, courses: ['CS101', 'CS202'], students: mockUsers.filter(u => u.role === 'student').length } });
});

// Recruiter Endpoints
app.get('/api/recruiter/:recruiterId/dashboard', (req, res) => {
  const { recruiterId } = req.params;
  // Mock data for recruiter dashboard
  res.status(200).json({ data: { recruiterId, activePostings: mockPostings.filter(p => p.recruiterId === recruiterId).length, applicationsReceived: mockApplications.filter(app => mockPostings.some(p => p.id === app.postingId && p.recruiterId === recruiterId)).length } });
});

// Student Endpoints
app.get('/api/student/:studentId/dashboard', (req, res) => {
  const { studentId } = req.params;
  // Mock data for student dashboard
  res.status(200).json({ data: { studentId, applications: mockApplications.filter(app => app.studentId === studentId).length, acceptedOffers: mockApplications.filter(app => app.studentId === studentId && app.status === 'accepted').length } });
});

// General Data Endpoints
app.get('/api/departments', (req, res) => {
  res.status(200).json({ data: mockDepartments, pagination: { page: 1, limit: mockDepartments.length, total: mockDepartments.length } });
});

app.get('/api/skills', (req, res) => {
  res.status(200).json({ data: mockSkills, pagination: { page: 1, limit: mockSkills.length, total: mockSkills.length } });
});

app.get('/api/verification-docs', (req, res) => {
  res.status(200).json({ data: mockVerificationDocs, pagination: { page: 1, limit: mockVerificationDocs.length, total: mockVerificationDocs.length } });
});

app.patch('/api/verification-docs/:docId/status', (req, res) => {
  const { docId } = req.params;
  const { status, remarks } = req.body;
  const doc = mockVerificationDocs.find(d => d.id === docId);
  if (doc) {
    doc.status = status;
    doc.remarks = remarks;
    doc.updatedAt = new Date().toISOString();
    res.status(200).json({ data: doc, message: 'Verification document status updated successfully' });
  } else {
    res.status(404).json({ message: 'Verification document not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
