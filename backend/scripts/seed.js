import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

dotenv.config();

const mongoUrl = process.env.MONGO_URL;
const recruiterPassword = process.env.SEED_RECRUITER_PASSWORD;

if (!mongoUrl) {
    throw new Error("MONGO_URL must be set in backend/.env.");
}

if (!recruiterPassword || recruiterPassword.length < 12) {
    throw new Error("Set SEED_RECRUITER_PASSWORD to at least 12 characters in backend/.env.");
}

const recruiters = [
    {
        fullname: "Alex Morgan",
        email: "alex.morgan@jobportal.example",
        phoneNumber: 9000000101,
        bio: "Hiring product engineers for an early-stage technology company.",
        skills: ["Recruiting", "Product Engineering"],
        company: {
            name: "Northstar Labs",
            description: "A product studio building tools for modern teams.",
            website: "https://northstar.example",
            location: "Bengaluru, India",
        },
        jobs: [
            {
                title: "Frontend Engineer",
                description: "Build accessible, responsive interfaces for our collaboration products.",
                requirements: ["React", "JavaScript", "CSS", "Accessibility"],
                salary: 18,
                experienceLevel: 3,
                location: "Bengaluru, India",
                jobType: "Full-time",
                position: 2,
            },
            {
                title: "Product Designer",
                description: "Shape product workflows from early research through polished delivery.",
                requirements: ["Figma", "Product design", "Prototyping"],
                salary: 16,
                experienceLevel: 4,
                location: "Remote",
                jobType: "Full-time",
                position: 1,
            },
        ],
    },
    {
        fullname: "Priya Sharma",
        email: "priya.sharma@jobportal.example",
        phoneNumber: 9000000102,
        bio: "Connecting data and platform specialists with meaningful work.",
        skills: ["Talent Acquisition", "Data Engineering"],
        company: {
            name: "Cedar Analytics",
            description: "An analytics company helping teams make better decisions with data.",
            website: "https://cedar-analytics.example",
            location: "Hyderabad, India",
        },
        jobs: [
            {
                title: "Data Engineer",
                description: "Develop dependable data pipelines and curated analytics datasets.",
                requirements: ["Python", "SQL", "ETL", "Data modeling"],
                salary: 20,
                experienceLevel: 4,
                location: "Hyderabad, India",
                jobType: "Full-time",
                position: 2,
            },
            {
                title: "Business Intelligence Analyst",
                description: "Turn business questions into clear metrics, dashboards, and insights.",
                requirements: ["SQL", "Power BI", "Data visualization"],
                salary: 14,
                experienceLevel: 2,
                location: "Hyderabad, India",
                jobType: "Full-time",
                position: 1,
            },
        ],
    },
    {
        fullname: "Jordan Lee",
        email: "jordan.lee@jobportal.example",
        phoneNumber: 9000000103,
        bio: "Building engineering teams focused on reliable cloud services.",
        skills: ["Technical Recruiting", "Cloud Infrastructure"],
        company: {
            name: "Harbor Cloud",
            description: "A cloud platform team focused on simple, dependable infrastructure.",
            website: "https://harbor-cloud.example",
            location: "Pune, India",
        },
        jobs: [
            {
                title: "Backend Engineer",
                description: "Design APIs and services that power customer-facing applications.",
                requirements: ["Node.js", "Express", "MongoDB", "REST APIs"],
                salary: 19,
                experienceLevel: 3,
                location: "Pune, India",
                jobType: "Full-time",
                position: 2,
            },
            {
                title: "DevOps Engineer",
                description: "Improve deployment pipelines, observability, and cloud operations.",
                requirements: ["AWS", "Docker", "CI/CD", "Linux"],
                salary: 22,
                experienceLevel: 5,
                location: "Remote",
                jobType: "Full-time",
                position: 1,
            },
        ],
    },
    {
        fullname: "Samira Khan",
        email: "samira.khan@jobportal.example",
        phoneNumber: 9000000104,
        bio: "Helping growing teams hire thoughtful software professionals.",
        skills: ["Recruiting", "Quality Engineering"],
        company: {
            name: "Juniper Works",
            description: "A software company creating useful tools for small businesses.",
            website: "https://juniper-works.example",
            location: "Mumbai, India",
        },
        jobs: [
            {
                title: "QA Automation Engineer",
                description: "Build test automation and help teams ship reliable releases.",
                requirements: ["Playwright", "JavaScript", "API testing"],
                salary: 15,
                experienceLevel: 3,
                location: "Mumbai, India",
                jobType: "Full-time",
                position: 1,
            },
            {
                title: "Full Stack Developer",
                description: "Deliver product features across our React frontend and Node APIs.",
                requirements: ["React", "Node.js", "MongoDB", "REST APIs"],
                salary: 18,
                experienceLevel: 4,
                location: "Remote",
                jobType: "Full-time",
                position: 2,
            },
        ],
    },
    {
        fullname: "Diego Patel",
        email: "diego.patel@jobportal.example",
        phoneNumber: 9000000105,
        bio: "Recruiting designers and engineers for a customer-focused team.",
        skills: ["Recruiting", "UX Research"],
        company: {
            name: "Openlane Digital",
            description: "A digital consultancy making everyday services easier to use.",
            website: "https://openlane-digital.example",
            location: "Chennai, India",
        },
        jobs: [
            {
                title: "UX Researcher",
                description: "Plan and conduct research that informs product strategy and design.",
                requirements: ["User research", "Interviewing", "Usability testing"],
                salary: 15,
                experienceLevel: 3,
                location: "Chennai, India",
                jobType: "Full-time",
                position: 1,
            },
            {
                title: "React Developer",
                description: "Create maintainable web experiences for customer-facing products.",
                requirements: ["React", "JavaScript", "HTML", "CSS"],
                salary: 17,
                experienceLevel: 3,
                location: "Chennai, India",
                jobType: "Full-time",
                position: 2,
            },
        ],
    },
];

const seed = async () => {
    await mongoose.connect(mongoUrl);
    const password = await bcrypt.hash(recruiterPassword, 10);

    for (const recruiterData of recruiters) {
        const recruiter = await User.findOneAndUpdate(
            { email: recruiterData.email },
            {
                $set: {
                    fullname: recruiterData.fullname,
                    phoneNumber: recruiterData.phoneNumber,
                    password,
                    role: "recruiter",
                    "profile.bio": recruiterData.bio,
                    "profile.skills": recruiterData.skills,
                },
            },
            { returnDocument: "after", upsert: true, runValidators: true, setDefaultsOnInsert: true },
        );

        const company = await Company.findOneAndUpdate(
            { name: recruiterData.company.name },
            {
                $set: {
                    ...recruiterData.company,
                    userId: recruiter._id,
                },
            },
            { returnDocument: "after", upsert: true, runValidators: true, setDefaultsOnInsert: true },
        );

        await User.updateOne(
            { _id: recruiter._id },
            { $set: { "profile.company": company._id } },
        );

        for (const jobData of recruiterData.jobs) {
            await Job.findOneAndUpdate(
                { created_by: recruiter._id, title: jobData.title },
                {
                    $set: {
                        ...jobData,
                        company: company._id,
                        created_by: recruiter._id,
                    },
                },
                { upsert: true, runValidators: true, setDefaultsOnInsert: true },
            );
        }
    }

    console.log(`Seeded ${recruiters.length} recruiters, ${recruiters.length} companies, and ${recruiters.length * 2} jobs.`);
    console.log(`Recruiter login password is the value configured in SEED_RECRUITER_PASSWORD.`);
    console.log("Recruiter accounts:");
    recruiters.forEach(({ email }) => console.log(`- ${email}`));
};

try {
    await seed();
} catch (error) {
    console.error("Demo seed failed:", error.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}