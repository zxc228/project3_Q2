-- Create enum types
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');
CREATE TYPE "GradeStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');
CREATE TYPE "CareerTypeEnum" AS ENUM ('INTERNSHIP', 'JOB');

-- Create User table
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  role "UserRole" DEFAULT 'STUDENT'
);

-- Create Degree table
CREATE TABLE "Degree" (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT
);

-- Create Subject table (without direct degree association)
CREATE TABLE "Subject" (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT
);

-- Create DegreeSubject junction table
CREATE TABLE "DegreeSubject" (
  id TEXT PRIMARY KEY,
  degreeId TEXT NOT NULL,
  subjectId TEXT NOT NULL,
  FOREIGN KEY (degreeId) REFERENCES "Degree"(id) ON DELETE CASCADE,
  FOREIGN KEY (subjectId) REFERENCES "Subject"(id) ON DELETE CASCADE,
  UNIQUE (degreeId, subjectId)
);

-- Create Profile table
CREATE TABLE "Profile" (
  id TEXT PRIMARY KEY,
  userId TEXT UNIQUE NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  degreeId TEXT,
  graduationYear INTEGER,
  bio TEXT,
  tutorId TEXT,
  FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE,
  FOREIGN KEY (degreeId) REFERENCES "Degree"(id),
  FOREIGN KEY (tutorId) REFERENCES "TutorProfile"(id)
);

-- Create TutorProfile table
CREATE TABLE "TutorProfile" (
  id TEXT PRIMARY KEY,
  userId TEXT UNIQUE NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  bio TEXT,
  FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE
);

-- Create StudentGrade table
CREATE TABLE "StudentGrade" (
  id TEXT PRIMARY KEY,
  subjectId TEXT NOT NULL,
  profileId TEXT NOT NULL,
  grade DECIMAL NOT NULL,
  status "GradeStatus" DEFAULT 'COMPLETED',
  FOREIGN KEY (subjectId) REFERENCES "Subject"(id),
  FOREIGN KEY (profileId) REFERENCES "Profile"(id),
  UNIQUE (profileId, subjectId)
);

-- Create Skill table
CREATE TABLE "Skill" (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT
);

-- Create ProfileSkill junction table to track student skill levels
CREATE TABLE "ProfileSkill" (
  id TEXT PRIMARY KEY,
  profileId TEXT NOT NULL,
  skillId TEXT NOT NULL,
  skillLevel DECIMAL DEFAULT 0,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profileId) REFERENCES "Profile"(id) ON DELETE CASCADE,
  FOREIGN KEY (skillId) REFERENCES "Skill"(id),
  UNIQUE (profileId, skillId)
);

-- Create SkillMap table
CREATE TABLE "SkillMap" (
  id TEXT PRIMARY KEY,
  skillId TEXT NOT NULL,
  subjectId TEXT NOT NULL,
  weight DECIMAL DEFAULT 1.0,
  FOREIGN KEY (skillId) REFERENCES "Skill"(id),
  FOREIGN KEY (subjectId) REFERENCES "Subject"(id),
  UNIQUE (skillId, subjectId)
);

-- Career data structure

-- Create CareerField table (high-level categories)
CREATE TABLE "CareerField" (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT
);

-- Create CareerType table for job and internship types
CREATE TABLE "CareerType" (
  id TEXT PRIMARY KEY,
  careerFieldId TEXT NOT NULL,
  type "CareerTypeEnum" NOT NULL,
  description TEXT,
  FOREIGN KEY (careerFieldId) REFERENCES "CareerField"(id) ON DELETE CASCADE,
  UNIQUE (careerFieldId, type)
);

-- Create CareerSkill table to link skills to career types
CREATE TABLE "CareerSkill" (
  id TEXT PRIMARY KEY,
  careerTypeId TEXT NOT NULL,
  skillId TEXT NOT NULL,
  importanceLevel DECIMAL NOT NULL CHECK (importanceLevel BETWEEN 0 AND 5),
  FOREIGN KEY (careerTypeId) REFERENCES "CareerType"(id) ON DELETE CASCADE,
  FOREIGN KEY (skillId) REFERENCES "Skill"(id),
  UNIQUE (careerTypeId, skillId)
);

-- Create CareerReport table for student career recommendations
CREATE TABLE "CareerReport" (
  id TEXT PRIMARY KEY,
  profileId TEXT NOT NULL,
  careerTypeId TEXT,
  additionalInfo TEXT,
  pdfUrl TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profileId) REFERENCES "Profile"(id),
  FOREIGN KEY (careerTypeId) REFERENCES "CareerType"(id)
);

-- Create SkillAssessment table
CREATE TABLE "SkillAssessment" (
  id TEXT PRIMARY KEY,
  careerReportId TEXT NOT NULL,
  skillId TEXT NOT NULL,
  hasSelfAssessed BOOLEAN DEFAULT FALSE,
  systemRating DECIMAL,
  justification TEXT,
  FOREIGN KEY (careerReportId) REFERENCES "CareerReport"(id) ON DELETE CASCADE,
  FOREIGN KEY (skillId) REFERENCES "Skill"(id),
  UNIQUE (careerReportId, skillId)
);

-- Populate Degrees
INSERT INTO "Degree" (id, name, description) VALUES 
('deg_data', 'Data Engineering', 'Comprehensive program focusing on big data technologies, analysis, and database management.'),
('deg_cyber', 'Cyber Security', 'Advanced program covering security assessment, threat prevention, and network protection.');

-- Populate Subjects (without degree association)
-- Common subjects for both degrees
INSERT INTO "Subject" (id, code, name, description) VALUES
('sub_pro3', 'PRO3', 'Projects 3', 'Real-world collaborative development projects simulating industry environment.'),
('sub_fuux', 'FUUX', 'UX Fundamentals', 'Core principles of user experience design and interface evaluation.'),
('sub_pw2s', 'PW2S', 'Web Development 2: Servers', 'Server-side technologies, API development, and backend architecture.'),
('sub_damo', 'DAMO', 'Mobile Apps Development', 'Design and implementation of cross-platform mobile applications.');

-- Cyber Security specific subjects
INSERT INTO "Subject" (id, code, name, description) VALUES
('sub_inse', 'INSE', 'Introduction to Security', 'Fundamental concepts of cybersecurity and threat modeling.'),
('sub_fora', 'FORA', 'Forensic Analysis', 'Techniques for digital evidence collection and cyber incident investigation.'),
('sub_ethi', 'ETHI', 'Ethical Hacking', 'Authorized penetration testing and vulnerability assessment methods.');

-- Data Engineering specific subjects
INSERT INTO "Subject" (id, code, name, description) VALUES
('sub_abds', 'ABDS', 'Advanced Databases', 'In-depth study of NoSQL, distributed databases, and optimization techniques.'),
('sub_prdt', 'PRDT', 'Data Processing', 'ETL pipelines, data cleaning, and transformation methodologies.'),
('sub_bain', 'BAIN', 'Information Retrieval and Analysis', 'Search algorithms, pattern recognition, and data visualization.');

-- Create DegreeSubject relationships
-- Common subjects for both degrees
INSERT INTO "DegreeSubject" (id, degreeId, subjectId) VALUES
('ds_data_pro3', 'deg_data', 'sub_pro3'),
('ds_cyber_pro3', 'deg_cyber', 'sub_pro3'),
('ds_data_fuux', 'deg_data', 'sub_fuux'),
('ds_cyber_fuux', 'deg_cyber', 'sub_fuux'),
('ds_data_pw2s', 'deg_data', 'sub_pw2s'),
('ds_cyber_pw2s', 'deg_cyber', 'sub_pw2s'),
('ds_data_damo', 'deg_data', 'sub_damo'),
('ds_cyber_damo', 'deg_cyber', 'sub_damo');

-- Cyber Security specific subjects
INSERT INTO "DegreeSubject" (id, degreeId, subjectId) VALUES
('ds_cyber_inse', 'deg_cyber', 'sub_inse'),
('ds_cyber_fora', 'deg_cyber', 'sub_fora'),
('ds_cyber_ethi', 'deg_cyber', 'sub_ethi');

-- Data Engineering specific subjects
INSERT INTO "DegreeSubject" (id, degreeId, subjectId) VALUES
('ds_data_abds', 'deg_data', 'sub_abds'),
('ds_data_prdt', 'deg_data', 'sub_prdt'),
('ds_data_bain', 'deg_data', 'sub_bain');

-- Create sample Users (Students)
INSERT INTO "User" (id, email, passwordHash, role) VALUES
('user_alice', 'alice.asher@live.u-tad.com', 'tempHash123', 'STUDENT'),
('user_bob', 'bob.bobchinsky@live.u-tad.com', 'tempHash456', 'STUDENT');

-- Create User Profiles
INSERT INTO "Profile" (id, userId, firstName, lastName, degreeId, graduationYear, bio) VALUES
('profile_alice', 'user_alice', 'Alice', 'Asher', 'deg_data', 2026, 'Data Engineering student with a passion for travel and dreams of opening a cozy coffee bar after graduation.'),
('profile_bob', 'user_bob', 'Bob', 'Bobchinsky', 'deg_cyber', 2026, 'Cybersecurity enthusiast focused on building a family-oriented future secured by a high-paying career in network protection.');

-- Add Student Grades
-- Alice's grades (Data Engineering student with excellent grades)
INSERT INTO "StudentGrade" (id, subjectId, profileId, grade, status) VALUES
('grade_alice_pro3', 'sub_pro3', 'profile_alice', 8.0, 'COMPLETED'),
('grade_alice_fuux', 'sub_fuux', 'profile_alice', 9.5, 'COMPLETED'),
('grade_alice_pw2s', 'sub_pw2s', 'profile_alice', 9.8, 'COMPLETED'),
('grade_alice_damo', 'sub_damo', 'profile_alice', 10.0, 'COMPLETED'),
('grade_alice_abds', 'sub_abds', 'profile_alice', 9.3, 'COMPLETED'),
('grade_alice_prdt', 'sub_prdt', 'profile_alice', 9.7, 'COMPLETED'),
('grade_alice_bain', 'sub_bain', 'profile_alice', 9.5, 'COMPLETED');

-- Bob's grades (Cybersecurity student with moderate grades)
INSERT INTO "StudentGrade" (id, subjectId, profileId, grade, status) VALUES
('grade_bob_pro3', 'sub_pro3', 'profile_bob', 7.0, 'COMPLETED'),
('grade_bob_fuux', 'sub_fuux', 'profile_bob', 4.0, 'COMPLETED'),
('grade_bob_pw2s', 'sub_pw2s', 'profile_bob', 6.5, 'COMPLETED'),
('grade_bob_damo', 'sub_damo', 'profile_bob', 6.8, 'COMPLETED'),
('grade_bob_inse', 'sub_inse', 'profile_bob', 7.2, 'COMPLETED'),
('grade_bob_fora', 'sub_fora', 'profile_bob', 6.5, 'COMPLETED'),
('grade_bob_ethi', 'sub_ethi', 'profile_bob', 7.0, 'COMPLETED');

-- Populate Skills with data from Aryan's Research.json
INSERT INTO "Skill" (id, name, description) VALUES
-- Data Product Manager Skills
('skill_pdl', 'Product Development Lifecycle', 'Knowledge of product development stages from conception to market.'),
('skill_mr', 'Market Research', 'Ability to gather and analyze market data to inform product decisions.'),
('skill_bda', 'Basic Data Analysis', 'Fundamentals of analyzing data to extract actionable insights.'),
('skill_pm', 'Project Management', 'Skills for planning, executing, and closing projects effectively.'),
('skill_cs', 'Communication Skills', 'Ability to convey ideas clearly to diverse stakeholders.'),
('skill_am', 'Agile Methodologies', 'Knowledge of iterative development approaches like Scrum or Kanban.'),
('skill_ps', 'Product Strategy', 'Skills for defining product vision, roadmap, and positioning.'),
('skill_da', 'Data Analytics', 'Advanced data analysis techniques for product optimization.'),
('skill_sm', 'Stakeholder Management', 'Ability to identify, prioritize, and engage with stakeholders.'),
('skill_tu', 'Technical Understanding', 'Comprehension of technical concepts relevant to product.'),
('skill_ls', 'Leadership Skills', 'Ability to guide teams and influence decisions.'),

-- Data Engineering Skills
('skill_sql', 'SQL', 'Structured Query Language for database management and queries.'),
('skill_pyj', 'Python/Java', 'Programming skills in Python or Java languages.'),
('skill_dwb', 'Data Warehousing Basics', 'Fundamentals of storing and structuring data for analysis.'),
('skill_cpl', 'Cloud Platforms', 'Knowledge of major cloud services (AWS, Azure, GCP).'),
('skill_etl', 'ETL Tools', 'Experience with Extract, Transform, Load data pipeline tools.'),
('skill_dpip', 'Data Pipelines', 'Skills for designing and maintaining data workflows.'),
('skill_dw', 'Data Warehousing', 'Advanced concepts in data storage architecture.'),
('skill_cc', 'Cloud Computing', 'In-depth knowledge of cloud infrastructure and services.'),
('skill_asql', 'Advanced SQL', 'Complex database queries, optimization, and management.'),
('skill_bdt', 'Big Data Tools', 'Experience with distributed computing systems like Spark, Hadoop.'),
('skill_wa', 'Workflow Automation', 'Skills for automating data processing tasks.'),
('skill_darc', 'Data Architecture', 'Design of complex data systems and structures.'),

-- AI & Deep Learning Skills
('skill_py', 'Python', 'Python programming language proficiency.'),
('skill_mlb', 'Machine Learning Basics', 'Fundamentals of machine learning algorithms and concepts.'),
('skill_nn', 'Neural Networks', 'Understanding of neural network architecture and function.'),
('skill_la', 'Linear Algebra', 'Mathematical foundation for machine learning algorithms.'),
('skill_dprep', 'Data Preprocessing', 'Techniques for cleaning and preparing data for models.'),
('skill_bme', 'Basic Model Evaluation', 'Skills for testing and validating machine learning models.'),
('skill_dlf', 'Deep Learning Frameworks', 'Experience with TensorFlow, PyTorch, or similar tools.'),
('skill_nno', 'Neural Network Optimization', 'Advanced techniques for improving neural network performance.'),
('skill_pyt', 'Python (TensorFlow, PyTorch)', 'Specialized Python skills with ML frameworks.'),
('skill_gcc', 'GPU/Cloud Computing', 'Leveraging specialized hardware for model training.'),
('skill_rd', 'Research & Development', 'Ability to explore and implement cutting-edge techniques.'),
('skill_md', 'Model Deployment', 'Skills for integrating models into production systems.'),

-- Big Data & Cloud Computing Skills
('skill_cpb', 'Cloud Platform Basics', 'Fundamentals of cloud service platforms.'),
('skill_hb', 'Hadoop Basics', 'Introduction to Hadoop ecosystem components.'),
('skill_dpr', 'Data Processing', 'General skills in handling and transforming data.'),
('skill_betl', 'Basic ETL', 'Fundamental data extraction, transformation, and loading.'),
('skill_acp', 'Advanced Cloud Platforms', 'Expert-level cloud architecture and implementation.'),
('skill_bdf', 'Big Data Frameworks', 'Advanced use of Hadoop, Spark, and similar technologies.'),
('skill_dlw', 'Data Lakes & Warehouses', 'Design and management of data storage systems.'),
('skill_de', 'Data Engineering', 'Comprehensive data pipeline and architecture skills.'),
('skill_ppj', 'Python/Java Programming', 'Advanced programming in Python or Java.'),
('skill_iac', 'Infrastructure as Code', 'Managing infrastructure through code and automation.'),

-- Data Analyst Skills
('skill_ex', 'Excel', 'Proficiency with spreadsheet software for data analysis.'),
('skill_dv', 'Data Visualization', 'Creating effective visual representations of data.'),
('skill_sta', 'Statistical Analysis', 'Applying statistical methods to interpret data.'),
('skill_prb', 'Python/R Basics', 'Fundamentals of Python or R for data analysis.'),
('skill_ct', 'Critical Thinking', 'Logical evaluation and problem-solving skills.'),
('skill_dvt', 'Data Visualization Tools', 'Experience with specialized visualization software.'),
('skill_stm', 'Statistical Modeling', 'Creating mathematical representations of data relationships.'),
('skill_prp', 'Python/R Programming', 'Advanced programming for data analysis.'),
('skill_ar', 'Analytical Reporting', 'Creating comprehensive analytical documents.'),
('skill_dst', 'Data Storytelling', 'Crafting narratives to communicate data insights.'),

-- Data Architect Skills
('skill_dmb', 'Data Modeling Basics', 'Fundamentals of representing data structures.'),
('skill_dd', 'Database Design', 'Designing efficient and effective database schemas.'),
('skill_dwc', 'Data Warehousing Concepts', 'Principles of data warehouse architecture.'),
('skill_doc', 'Documentation', 'Creating clear technical documentation.'),
('skill_bru', 'Business Requirements Understanding', 'Translating business needs into technical requirements.'),
('skill_adm', 'Advanced Data Modeling', 'Complex data structure design and optimization.'),
('skill_di', 'Data Integration', 'Combining data from multiple sources cohesively.'),
('skill_ca', 'Cloud Architecture', 'Designing cloud-based data solutions.'),
('skill_ddo', 'Database Design & Optimization', 'Expert-level database structure and performance tuning.'),
('skill_ss', 'System Scalability', 'Designing systems that can grow with increasing demands.'),
('skill_eds', 'Enterprise Data Strategy', 'Developing organization-wide data management plans.');

-- Populate Career Fields
INSERT INTO "CareerField" (id, name, description) VALUES
('cf_dpm', 'Data Product Manager', 'Professional responsible for data product development and strategy.'),
('cf_de', 'Data Engineering', 'Focuses on building systems to collect, store, and analyze data.'),
('cf_ai', 'AI & Deep Learning', 'Specializes in artificial intelligence and neural network development.'),
('cf_bdc', 'Big Data & Cloud Computing', 'Works with large-scale data processing on cloud platforms.'),
('cf_da', 'Data Analyst', 'Interprets data to provide actionable business insights.'),
('cf_dar', 'Data Architect', 'Designs and manages data systems architecture.');

-- Populate Career Types with data from Aryan's Research.json
INSERT INTO "CareerType" (id, careerFieldId, type, description) VALUES
-- Data Product Manager
('ct_dpm_int', 'cf_dpm', 'INTERNSHIP', 'Entry-level role focusing on data product management basics.'),
('ct_dpm_job', 'cf_dpm', 'JOB', 'Professional role leading data product strategy and development.'),

-- Data Engineering
('ct_de_int', 'cf_de', 'INTERNSHIP', 'Entry-level role learning data engineering fundamentals.'),
('ct_de_job', 'cf_de', 'JOB', 'Professional role building and optimizing data pipelines.'),

-- AI & Deep Learning
('ct_ai_int', 'cf_ai', 'INTERNSHIP', 'Entry-level role learning AI and machine learning basics.'),
('ct_ai_job', 'cf_ai', 'JOB', 'Professional role developing advanced AI solutions.'),

-- Big Data & Cloud Computing
('ct_bdc_int', 'cf_bdc', 'INTERNSHIP', 'Entry-level role focused on cloud and big data basics.'),
('ct_bdc_job', 'cf_bdc', 'JOB', 'Professional role implementing complex big data solutions.'),

-- Data Analyst
('ct_da_int', 'cf_da', 'INTERNSHIP', 'Entry-level role learning data analysis fundamentals.'),
('ct_da_job', 'cf_da', 'JOB', 'Professional role providing advanced data insights.'),

-- Data Architect
('ct_dar_int', 'cf_dar', 'INTERNSHIP', 'Entry-level role focused on data architecture basics.'),
('ct_dar_job', 'cf_dar', 'JOB', 'Professional role designing enterprise data solutions.');

-- Populate CareerSkill relationships with data from Aryan's Research.json
-- Data Product Manager - Internship
INSERT INTO "CareerSkill" (id, careerTypeId, skillId, importanceLevel) VALUES
('cs_dpm_int_pdl', 'ct_dpm_int', 'skill_pdl', 4.5),
('cs_dpm_int_mr', 'ct_dpm_int', 'skill_mr', 4.0),
('cs_dpm_int_bda', 'ct_dpm_int', 'skill_bda', 4.0),
('cs_dpm_int_pm', 'ct_dpm_int', 'skill_pm', 3.5),
('cs_dpm_int_cs', 'ct_dpm_int', 'skill_cs', 3.5),
('cs_dpm_int_am', 'ct_dpm_int', 'skill_am', 3.5);

-- Data Product Manager - Job
INSERT INTO "CareerSkill" (id, careerTypeId, skillId, importanceLevel) VALUES
('cs_dpm_job_ps', 'ct_dpm_job', 'skill_ps', 5.0),
('cs_dpm_job_da', 'ct_dpm_job', 'skill_da', 4.5),
('cs_dpm_job_sm', 'ct_dpm_job', 'skill_sm', 4.5),
('cs_dpm_job_tu', 'ct_dpm_job', 'skill_tu', 4.0),
('cs_dpm_job_ls', 'ct_dpm_job', 'skill_ls', 4.0),
('cs_dpm_job_am', 'ct_dpm_job', 'skill_am', 4.0);

-- Data Engineering - Internship
INSERT INTO "CareerSkill" (id, careerTypeId, skillId, importanceLevel) VALUES
('cs_de_int_sql', 'ct_de_int', 'skill_sql', 5.0),
('cs_de_int_pyj', 'ct_de_int', 'skill_pyj', 4.5),
('cs_de_int_dwb', 'ct_de_int', 'skill_dwb', 4.0),
('cs_de_int_cpl', 'ct_de_int', 'skill_cpl', 4.0),
('cs_de_int_etl', 'ct_de_int', 'skill_etl', 3.5),
('cs_de_int_dp', 'ct_de_int', 'skill_dpip', 3.5);

-- Data Engineering - Job
INSERT INTO "CareerSkill" (id, careerTypeId, skillId, importanceLevel) VALUES
('cs_de_job_dw', 'ct_de_job', 'skill_dw', 5.0),
('cs_de_job_cc', 'ct_de_job', 'skill_cc', 4.5),
('cs_de_job_asql', 'ct_de_job', 'skill_asql', 4.5),
('cs_de_job_bdt', 'ct_de_job', 'skill_bdt', 4.5),
('cs_de_job_wa', 'ct_de_job', 'skill_wa', 4.0),
('cs_de_job_darc', 'ct_de_job', 'skill_darc', 4.0);

-- AI & Deep Learning - Internship
INSERT INTO "CareerSkill" (id, careerTypeId, skillId, importanceLevel) VALUES
('cs_ai_int_py', 'ct_ai_int', 'skill_py', 5.0),
('cs_ai_int_mlb', 'ct_ai_int', 'skill_mlb', 4.5),
('cs_ai_int_nn', 'ct_ai_int', 'skill_nn', 4.0),
('cs_ai_int_la', 'ct_ai_int', 'skill_la', 4.0),
('cs_ai_int_dp', 'ct_ai_int', 'skill_dprep', 3.5),
('cs_ai_int_bme', 'ct_ai_int', 'skill_bme', 3.5);

-- AI & Deep Learning - Job
INSERT INTO "CareerSkill" (id, careerTypeId, skillId, importanceLevel) VALUES
('cs_ai_job_dlf', 'ct_ai_job', 'skill_dlf', 5.0),
('cs_ai_job_nno', 'ct_ai_job', 'skill_nno', 4.5),
('cs_ai_job_pyt', 'ct_ai_job', 'skill_pyt', 4.5),
('cs_ai_job_gcc', 'ct_ai_job', 'skill_gcc', 4.5),
('cs_ai_job_rd', 'ct_ai_job', 'skill_rd', 4.0),
('cs_ai_job_md', 'ct_ai_job', 'skill_md', 4.0);

-- Big Data & Cloud Computing - Internship
INSERT INTO "CareerSkill" (id, careerTypeId, skillId, importanceLevel) VALUES
('cs_bdc_int_sql', 'ct_bdc_int', 'skill_sql', 5.0),
('cs_bdc_int_cpb', 'ct_bdc_int', 'skill_cpb', 4.5),
('cs_bdc_int_py', 'ct_bdc_int', 'skill_py', 4.0),
('cs_bdc_int_hb', 'ct_bdc_int', 'skill_hb', 4.0),
('cs_bdc_int_dpr', 'ct_bdc_int', 'skill_dpr', 3.5),
('cs_bdc_int_betl', 'ct_bdc_int', 'skill_betl', 3.5);

-- Big Data & Cloud Computing - Job
INSERT INTO "CareerSkill" (id, careerTypeId, skillId, importanceLevel) VALUES
('cs_bdc_job_acp', 'ct_bdc_job', 'skill_acp', 5.0),
('cs_bdc_job_bdf', 'ct_bdc_job', 'skill_bdf', 4.5),
('cs_bdc_job_dlw', 'ct_bdc_job', 'skill_dlw', 4.5),
('cs_bdc_job_de', 'ct_bdc_job', 'skill_de', 4.5),
('cs_bdc_job_ppj', 'ct_bdc_job', 'skill_ppj', 4.0),
('cs_bdc_job_iac', 'ct_bdc_job', 'skill_iac', 4.0);

-- Data Analyst - Internship
INSERT INTO "CareerSkill" (id, careerTypeId, skillId, importanceLevel) VALUES
('cs_da_int_ex', 'ct_da_int', 'skill_ex', 5.0),
('cs_da_int_sql', 'ct_da_int', 'skill_sql', 4.5),
('cs_da_int_dv', 'ct_da_int', 'skill_dv', 4.0),
('cs_da_int_sta', 'ct_da_int', 'skill_sta', 4.0),
('cs_da_int_prb', 'ct_da_int', 'skill_prb', 3.5),
('cs_da_int_ct', 'ct_da_int', 'skill_ct', 3.5);

-- Data Analyst - Job
INSERT INTO "CareerSkill" (id, careerTypeId, skillId, importanceLevel) VALUES
('cs_da_job_asql', 'ct_da_job', 'skill_asql', 5.0),
('cs_da_job_dvt', 'ct_da_job', 'skill_dvt', 4.5),
('cs_da_job_sm', 'ct_da_job', 'skill_stm', 4.5),
('cs_da_job_prp', 'ct_da_job', 'skill_prp', 4.5),
('cs_da_job_ar', 'ct_da_job', 'skill_ar', 4.0),
('cs_da_job_dst', 'ct_da_job', 'skill_dst', 4.0);

-- Data Architect - Internship
INSERT INTO "CareerSkill" (id, careerTypeId, skillId, importanceLevel) VALUES
('cs_dar_int_sql', 'ct_dar_int', 'skill_sql', 5.0),
('cs_dar_int_dmb', 'ct_dar_int', 'skill_dmb', 4.5),
('cs_dar_int_dd', 'ct_dar_int', 'skill_dd', 4.0),
('cs_dar_int_dwc', 'ct_dar_int', 'skill_dwc', 4.0),
('cs_dar_int_doc', 'ct_dar_int', 'skill_doc', 3.5),
('cs_dar_int_bru', 'ct_dar_int', 'skill_bru', 3.5);

-- Data Architect - Job
INSERT INTO "CareerSkill" (id, careerTypeId, skillId, importanceLevel) VALUES
('cs_dar_job_adm', 'ct_dar_job', 'skill_adm', 5.0),
('cs_dar_job_di', 'ct_dar_job', 'skill_di', 4.5),
('cs_dar_job_ca', 'ct_dar_job', 'skill_ca', 4.5),
('cs_dar_job_ddo', 'ct_dar_job', 'skill_ddo', 4.5),
('cs_dar_job_ss', 'ct_dar_job', 'skill_ss', 4.0),
('cs_dar_job_eds', 'ct_dar_job', 'skill_eds', 4.0);

-- Create SkillMap entries to connect skills to subjects
-- Data-related skills for data engineering subjects
INSERT INTO "SkillMap" (id, skillId, subjectId, weight) VALUES
('sm_sql_abds', 'skill_sql', 'sub_abds', 1.0),
('sm_dw_abds', 'skill_dw', 'sub_abds', 0.8),
('sm_dd_abds', 'skill_dd', 'sub_abds', 0.9),
('sm_dpr_prdt', 'skill_dpr', 'sub_prdt', 1.0),
('sm_etl_prdt', 'skill_etl', 'sub_prdt', 0.9),
('sm_py_prdt', 'skill_py', 'sub_prdt', 0.7),
('sm_da_bain', 'skill_da', 'sub_bain', 1.0),
('sm_dv_bain', 'skill_dv', 'sub_bain', 0.8),
('sm_dst_bain', 'skill_dst', 'sub_bain', 0.7);

-- Programming skills for common subjects
INSERT INTO "SkillMap" (id, skillId, subjectId, weight) VALUES
('sm_py_pro3', 'skill_py', 'sub_pro3', 0.8),
('sm_pm_pro3', 'skill_pm', 'sub_pro3', 0.9),
('sm_cs_pro3', 'skill_cs', 'sub_pro3', 0.7),
('sm_dv_pw2s', 'skill_dv', 'sub_pw2s', 0.6),
('sm_sql_pw2s', 'skill_sql', 'sub_pw2s', 0.8),
('sm_pyj_pw2s', 'skill_pyj', 'sub_pw2s', 0.9),
('sm_cs_fuux', 'skill_cs', 'sub_fuux', 0.9),
('sm_dv_fuux', 'skill_dv', 'sub_fuux', 0.8),
('sm_ct_fuux', 'skill_ct', 'sub_fuux', 0.7),
('sm_py_damo', 'skill_py', 'sub_damo', 0.7),
('sm_cs_damo', 'skill_cs', 'sub_damo', 0.6),
('sm_pyj_damo', 'skill_pyj', 'sub_damo', 0.8);

-- Security skills for cybersecurity subjects
INSERT INTO "SkillMap" (id, skillId, subjectId, weight) VALUES
('sm_ct_inse', 'skill_ct', 'sub_inse', 0.9),
('sm_doc_inse', 'skill_doc', 'sub_inse', 0.7),
('sm_ct_fora', 'skill_ct', 'sub_fora', 0.8),
('sm_da_fora', 'skill_da', 'sub_fora', 0.7),
('sm_cs_ethi', 'skill_cs', 'sub_ethi', 0.8),
('sm_ct_ethi', 'skill_ct', 'sub_ethi', 0.9);

-- Add sample ProfileSkill entries for our test students (all initialized at 0, will be changed in Self-Assessment)
-- Alice's skills (Data Engineering student)
INSERT INTO "ProfileSkill" (id, profileId, skillId, skillLevel) VALUES
('ps_alice_sql', 'profile_alice', 'skill_sql', 0),
('ps_alice_py', 'profile_alice', 'skill_py', 0),
('ps_alice_da', 'profile_alice', 'skill_da', 0),
('ps_alice_dpr', 'profile_alice', 'skill_dpr', 0),
('ps_alice_dw', 'profile_alice', 'skill_dw', 0),
('ps_alice_bda', 'profile_alice', 'skill_bda', 0);
-- Bob's skills (Cybersecurity student)
INSERT INTO "ProfileSkill" (id, profileId, skillId, skillLevel) VALUES
('ps_bob_ct', 'profile_bob', 'skill_ct', 0),
('ps_bob_cs', 'profile_bob', 'skill_cs', 0),
('ps_bob_doc', 'profile_bob', 'skill_doc', 0),
('ps_bob_py', 'profile_bob', 'skill_py', 0),
('ps_bob_bda', 'profile_bob', 'skill_bda', 0);

-- Insert Alberto as a tutor
INSERT INTO "User" (id, email, passwordHash, role) 
VALUES ('user_alberto', 'alberto_example@u-tad.com', 'tempHash789', 'TEACHER');

INSERT INTO "TutorProfile" (id, userId, firstName, lastName, bio)
VALUES ('alberto', 'user_alberto', 'Alberto', 'Leon Martin', 'Professor, manager, business coach');

-- Assign Alberto as tutor to Alice and Bob
UPDATE "Profile" SET tutorId = 'alberto' WHERE id IN ('profile_alice', 'profile_bob');