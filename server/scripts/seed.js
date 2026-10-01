import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Application } from '../src/models/Application.js';
import { Interview } from '../src/models/Interview.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting EasyTrack database seed process...');
    await connectDB();

    // Clear existing data
    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Application.deleteMany({}),
      Interview.deleteMany({}),
    ]);

    // Create primary demo user
    console.log('👤 Creating demo user...');
    const demoUser = await User.create({
      name: 'Alex Morgan',
      email: 'demo@easytrack.dev',
      password: 'Password123!',
      title: 'Senior Full Stack Engineer',
      bio: 'Passionate software engineer with 6+ years specializing in TypeScript, React, Node.js, and cloud systems.',
      location: 'San Francisco, CA',
      phone: '+1 (555) 234-5678',
      linkedIn: 'https://linkedin.com/in/alexmorgan-dev',
      gitHub: 'https://github.com/alexmorgan-dev',
      portfolio: 'https://alexmorgan.dev',
    });

    // Create secondary test user for multi-tenancy testing
    const secondUser = await User.create({
      name: 'Sarah Connor',
      email: 'user2@easytrack.dev',
      password: 'Password123!',
      title: 'DevOps Engineer',
      bio: 'Infrastructure automation and Kubernetes specialist.',
      location: 'New York, NY',
    });

    console.log(`✅ Demo user created: ${demoUser.email} (Password: Password123!)`);
    console.log(`✅ Second user created: ${secondUser.email} (Password: Password123!)`);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const daysAgo = (days) => {
      const d = new Date(today);
      d.setDate(d.getDate() - days);
      return d;
    };

    const daysAhead = (days) => {
      const d = new Date(today);
      d.setDate(d.getDate() + days);
      return d;
    };

    // 20 rich, realistic job applications for demoUser
    const demoApplicationsData = [
      {
        company: 'Stripe',
        position: 'Senior Frontend Engineer',
        location: 'San Francisco, CA',
        jobUrl: 'https://stripe.com/jobs/senior-frontend',
        status: 'Offer',
        priority: 'High',
        employmentType: 'Full-time',
        workMode: 'Remote',
        salaryMin: 180000,
        salaryMax: 220000,
        currency: 'USD',
        dateApplied: daysAgo(28),
        source: 'LinkedIn',
        contactName: 'Elena Rostova',
        contactEmail: 'elena@stripe.com',
        notes: 'Final offer received! Base: $195,000 + equity. Need to review stock grant vesting schedule.',
        tags: ['React', 'TypeScript', 'Fintech', 'High Priority'],
        followUpDate: daysAhead(2),
      },
      {
        company: 'Linear',
        position: 'Product Engineer',
        location: 'Remote, US',
        jobUrl: 'https://linear.app/careers/product-engineer',
        status: 'Technical Round',
        priority: 'High',
        employmentType: 'Full-time',
        workMode: 'Remote',
        salaryMin: 170000,
        salaryMax: 210000,
        currency: 'USD',
        dateApplied: daysAgo(14),
        source: 'Referral',
        contactName: 'Marcus Vance',
        contactEmail: 'marcus@linear.app',
        notes: 'Passed initial design and architecture review. Next is system building session with Tuomas.',
        tags: ['TypeScript', 'GraphQL', 'Product Design', 'Startup'],
        followUpDate: today, // Due today!
      },
      {
        company: 'Vercel',
        position: 'Full Stack Engineer, Next.js',
        location: 'San Francisco, CA',
        jobUrl: 'https://vercel.com/careers',
        status: 'Interview',
        priority: 'High',
        employmentType: 'Full-time',
        workMode: 'Remote',
        salaryMin: 175000,
        salaryMax: 205000,
        currency: 'USD',
        dateApplied: daysAgo(18),
        source: 'Company Website',
        contactName: 'David Lee',
        contactEmail: 'david.lee@vercel.com',
        notes: 'Had screening interview with hiring manager. Discussed SSR performance and edge rendering.',
        tags: ['Next.js', 'React', 'Edge Computing', 'Developer Tools'],
        followUpDate: daysAhead(1),
      },
      {
        company: 'Datadog',
        position: 'Senior Backend Engineer',
        location: 'New York, NY',
        jobUrl: 'https://datadoghq.com/careers',
        status: 'Screening',
        priority: 'Medium',
        employmentType: 'Full-time',
        workMode: 'Hybrid',
        salaryMin: 165000,
        salaryMax: 195000,
        currency: 'USD',
        dateApplied: daysAgo(7),
        source: 'Indeed',
        contactName: 'Chloe Bennett',
        contactEmail: 'cbennett@datadog.com',
        notes: 'Recruiter reached out on LinkedIn. Recruiter screen call set for Thursday.',
        tags: ['Go', 'Distributed Systems', 'Monitoring'],
        followUpDate: daysAhead(3),
      },
      {
        company: 'Notion',
        position: 'Staff Software Engineer',
        location: 'San Francisco, CA',
        jobUrl: 'https://notion.so/careers',
        status: 'Applied',
        priority: 'High',
        employmentType: 'Full-time',
        workMode: 'Hybrid',
        salaryMin: 200000,
        salaryMax: 250000,
        currency: 'USD',
        dateApplied: daysAgo(3),
        source: 'Wellfound',
        contactName: 'James Chen',
        contactEmail: 'jchen@makenotion.com',
        notes: 'Submitted customized resume highlighting rich text and collaborative editors work.',
        tags: ['TypeScript', 'Rich Text', 'Real-time', 'Productivity'],
        followUpDate: daysAhead(7),
      },
      {
        company: 'Figma',
        position: 'Software Engineer, Canvas Core',
        location: 'San Francisco, CA',
        jobUrl: 'https://figma.com/careers',
        status: 'Applied',
        priority: 'High',
        employmentType: 'Full-time',
        workMode: 'Hybrid',
        salaryMin: 180000,
        salaryMax: 220000,
        currency: 'USD',
        dateApplied: daysAgo(5),
        source: 'Referral',
        contactName: 'Priya Patel',
        contactEmail: 'ppatel@figma.com',
        notes: 'Referred by teammate from former company.',
        tags: ['C++', 'WebAssembly', 'Canvas', 'Design'],
        followUpDate: daysAhead(5),
      },
      {
        company: 'GitHub',
        position: 'Senior Software Engineer, Actions',
        location: 'Remote',
        jobUrl: 'https://github.com/about/careers',
        status: 'Wishlist',
        priority: 'Medium',
        employmentType: 'Full-time',
        workMode: 'Remote',
        salaryMin: 160000,
        salaryMax: 200000,
        currency: 'USD',
        dateApplied: daysAgo(2),
        source: 'Company Website',
        notes: 'Targeting role on the CI/CD Actions infrastructure team. Tailoring portfolio.',
        tags: ['DevOps', 'TypeScript', 'GitHub Actions', 'Cloud'],
        followUpDate: daysAhead(4),
      },
      {
        company: 'Cloudflare',
        position: 'Systems Engineer',
        location: 'Austin, TX',
        jobUrl: 'https://cloudflare.com/careers',
        status: 'Wishlist',
        priority: 'Low',
        employmentType: 'Full-time',
        workMode: 'Hybrid',
        salaryMin: 150000,
        salaryMax: 185000,
        currency: 'USD',
        dateApplied: daysAgo(1),
        source: 'Glassdoor',
        notes: 'Networking with current engineers before submitting application.',
        tags: ['Rust', 'Networking', 'Cloud'],
        followUpDate: null,
      },
      {
        company: 'Airbnb',
        position: 'Senior Frontend Engineer',
        location: 'San Francisco, CA',
        jobUrl: 'https://airbnb.com/careers',
        status: 'Rejected',
        priority: 'Medium',
        employmentType: 'Full-time',
        workMode: 'Remote',
        salaryMin: 175000,
        salaryMax: 215000,
        currency: 'USD',
        dateApplied: daysAgo(35),
        source: 'LinkedIn',
        contactName: 'Robert Vance',
        notes: 'Received automated rejection after resume screen. Role was put on hold.',
        tags: ['React', 'Design Systems', 'Travel'],
        followUpDate: null,
      },
      {
        company: 'Netflix',
        position: 'Senior Platform Engineer',
        location: 'Los Gatos, CA',
        jobUrl: 'https://jobs.netflix.com',
        status: 'Withdrawn',
        priority: 'Low',
        employmentType: 'Full-time',
        workMode: 'On-site',
        salaryMin: 220000,
        salaryMax: 300000,
        currency: 'USD',
        dateApplied: daysAgo(25),
        source: 'Recruiter',
        contactName: 'Amanda Brooks',
        notes: 'Withdrew due to strict on-site requirement in Los Gatos.',
        tags: ['Streaming', 'Microservices', 'Platform'],
        followUpDate: null,
      },
      {
        company: 'Shopify',
        position: 'Staff Developer, Merchant Experience',
        location: 'Remote',
        jobUrl: 'https://shopify.com/careers',
        status: 'Technical Round',
        priority: 'High',
        employmentType: 'Full-time',
        workMode: 'Remote',
        salaryMin: 175000,
        salaryMax: 210000,
        currency: 'USD',
        dateApplied: daysAgo(20),
        source: 'LinkedIn',
        contactName: 'Lucas Dubois',
        contactEmail: 'lucas.d@shopify.com',
        notes: 'Pair programming interview scheduled for building a Shopify storefront extension.',
        tags: ['Ruby', 'React', 'E-commerce', 'High Priority'],
        followUpDate: daysAgo(1), // Overdue follow-up!
      },
      {
        company: 'Supabase',
        position: 'Developer Advocate',
        location: 'Remote',
        jobUrl: 'https://supabase.com/careers',
        status: 'Interview',
        priority: 'Medium',
        employmentType: 'Full-time',
        workMode: 'Remote',
        salaryMin: 140000,
        salaryMax: 170000,
        currency: 'USD',
        dateApplied: daysAgo(12),
        source: 'Company Website',
        contactName: 'Thorsten Schaeff',
        contactEmail: 'thorsten@supabase.com',
        notes: 'Interviewed with founders. Gave demo presentation on building full-stack apps with Postgres.',
        tags: ['PostgreSQL', 'Developer Relations', 'Open Source'],
        followUpDate: daysAhead(3),
      },
      {
        company: 'Retool',
        position: 'Software Engineer, Core App',
        location: 'San Francisco, CA',
        jobUrl: 'https://retool.com/careers',
        status: 'Screening',
        priority: 'High',
        employmentType: 'Full-time',
        workMode: 'Hybrid',
        salaryMin: 170000,
        salaryMax: 200000,
        currency: 'USD',
        dateApplied: daysAgo(6),
        source: 'AngelList',
        contactName: 'Jessica Tran',
        contactEmail: 'jessica@retool.com',
        notes: 'Spoke with hiring manager. Discussed performance optimizations for canvas drag-and-drop.',
        tags: ['React', 'Internal Tools', 'Enterprise'],
        followUpDate: daysAhead(4),
      },
      {
        company: 'Postman',
        position: 'Senior API Architect',
        location: 'San Jose, CA',
        jobUrl: 'https://postman.com/careers',
        status: 'Applied',
        priority: 'Medium',
        employmentType: 'Full-time',
        workMode: 'Remote',
        salaryMin: 160000,
        salaryMax: 190000,
        currency: 'USD',
        dateApplied: daysAgo(4),
        source: 'LinkedIn',
        notes: 'Application submitted via referral link from former colleague.',
        tags: ['APIs', 'Node.js', 'Developer Tools'],
        followUpDate: daysAhead(6),
      },
      {
        company: 'Vercel Labs',
        position: 'Contract AI Engineer',
        location: 'Remote',
        jobUrl: 'https://vercel.com/ai',
        status: 'Wishlist',
        priority: 'Medium',
        employmentType: 'Contract',
        workMode: 'Remote',
        salaryMin: 90,
        salaryMax: 120,
        currency: 'USD',
        dateApplied: daysAgo(1),
        source: 'Wellfound',
        notes: '6-month contract with potential full-time conversion.',
        tags: ['AI', 'LLM', 'Contract', 'Next.js'],
        followUpDate: daysAhead(7),
      },
      {
        company: 'OpenAI',
        position: 'Member of Technical Staff',
        location: 'San Francisco, CA',
        jobUrl: 'https://openai.com/careers',
        status: 'Rejected',
        priority: 'High',
        employmentType: 'Full-time',
        workMode: 'On-site',
        salaryMin: 250000,
        salaryMax: 350000,
        currency: 'USD',
        dateApplied: daysAgo(40),
        source: 'Referral',
        contactName: 'Samira Gomez',
        notes: 'Went through 3 interview rounds. Excellent feedback but prioritized research background.',
        tags: ['AI', 'Python', 'High Priority'],
        followUpDate: null,
      },
    ];

    console.log(`📝 Inserting ${demoApplicationsData.length} applications for demo user...`);
    const createdApplications = await Application.insertMany(
      demoApplicationsData.map((app) => ({
        ...app,
        userId: demoUser._id,
      }))
    );

    // Map applications by company for easy interview linking
    const appMap = new Map();
    createdApplications.forEach((app) => appMap.set(app.company, app));

    // Create 6 realistic interviews
    const interviewsData = [
      {
        userId: demoUser._id,
        applicationId: appMap.get('Linear')._id,
        date: daysAhead(1),
        type: 'Technical',
        round: 2,
        interviewer: 'Tuomas Artman (CTO)',
        meetingUrl: 'https://meet.google.com/abc-linear-tech',
        location: 'Google Meet',
        notes: 'Deep dive into state sync, optimistic UI updates, and web workers architecture.',
        result: 'Scheduled',
      },
      {
        userId: demoUser._id,
        applicationId: appMap.get('Vercel')._id,
        date: daysAhead(3),
        type: 'System Design',
        round: 2,
        interviewer: 'David Lee & Platform Lead',
        meetingUrl: 'https://zoom.us/j/987654321',
        location: 'Zoom',
        notes: 'System architecture interview: Designing a globally distributed edge caching layer.',
        result: 'Scheduled',
      },
      {
        userId: demoUser._id,
        applicationId: appMap.get('Shopify')._id,
        date: daysAhead(4),
        type: 'Technical',
        round: 3,
        interviewer: 'Lucas Dubois',
        meetingUrl: 'https://meet.google.com/xyz-shopify-pair',
        location: 'Google Meet',
        notes: 'Live coding and architecture pairing session.',
        result: 'Scheduled',
      },
      {
        userId: demoUser._id,
        applicationId: appMap.get('Datadog')._id,
        date: daysAhead(2),
        type: 'Phone Screen',
        round: 1,
        interviewer: 'Chloe Bennett',
        meetingUrl: '',
        location: 'Phone Call (+1 555-0192)',
        notes: '30-minute introductory phone screen regarding career background and expectations.',
        result: 'Scheduled',
      },
      {
        userId: demoUser._id,
        applicationId: appMap.get('Stripe')._id,
        date: daysAgo(5),
        type: 'Behavioral',
        round: 4,
        interviewer: 'Engineering Director & HR',
        meetingUrl: 'https://stripe.zoom.us/j/123456',
        location: 'Zoom',
        notes: 'Executive behavioral interview on leadership, handling ambiguity, and team mentorship.',
        result: 'Passed',
      },
      {
        userId: demoUser._id,
        applicationId: appMap.get('Stripe')._id,
        date: daysAgo(10),
        type: 'Technical',
        round: 3,
        interviewer: 'Lead Architect',
        meetingUrl: 'https://stripe.zoom.us/j/123455',
        location: 'Zoom',
        notes: 'Full day virtual on-site: UI component architecture, system design, and coding.',
        result: 'Passed',
      },
    ];

    console.log(`📅 Inserting ${interviewsData.length} interviews...`);
    await Interview.insertMany(interviewsData);

    // Create 2 applications for second user to ensure isolation
    await Application.create([
      {
        userId: secondUser._id,
        company: 'AWS',
        position: 'Cloud Architect',
        status: 'Applied',
        priority: 'High',
        location: 'New York, NY',
        salaryMin: 190000,
        salaryMax: 230000,
        notes: 'User 2 private application - must never be visible to demoUser.',
      },
      {
        userId: secondUser._id,
        company: 'Google Cloud',
        position: 'Site Reliability Engineer',
        status: 'Interview',
        priority: 'High',
        location: 'Sunnyvale, CA',
        salaryMin: 200000,
        salaryMax: 240000,
        notes: 'User 2 private application - must never be visible to demoUser.',
      },
    ]);

    console.log('🎉 Seed completed successfully!');
    console.log('----------------------------------------------------');
    console.log('🔑 Demo User Credentials:');
    console.log('   Email:    demo@easytrack.dev');
    console.log('   Password: Password123!');
    console.log('🔑 User 2 (Isolation Test) Credentials:');
    console.log('   Email:    user2@easytrack.dev');
    console.log('   Password: Password123!');
    console.log('----------------------------------------------------');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await disconnectDB();
    process.exit(1);
  }
};

seedDatabase();
