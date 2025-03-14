async function oldshit() {
    //const cv =  await getPdfText(process.argv[2], {encoding: 'utf-8'})
    const responseFormat = 'Give the answer in the following format: "[ "role1", "role2" ... ]"'
    const suffix = 'Give me only the list in the format requested as a response.'
    const prompt = `Given this JSON: ${json} and based on this CV:${cv}, generate a list of 7 jobs/roles that the applicant has the most potential to pursue. ${responseFormat}. ${suffix}`
    return prompt
}

const mimes = {
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'pdf': 'application/pdf'
}

const prefix = 'You are a career mentoring tutor.'

const roles_skills = JSON.stringify({
    "Software Engineering": {
        "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Angular", "Vue.js", "TypeScript", "SASS", "Webpack", "Responsive Design", "Git", "UI/UX Design", "Version Control"],
        "Backend Developer": ["Node.js", "Python", "Java", "Ruby", "C#", "Go", "REST APIs", "GraphQL", "SQL", "NoSQL", "Docker", "Microservices", "Git", "AWS", "OAuth"],
        "Full-Stack Developer": ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB", "SQL", "REST APIs", "GraphQL", "Version Control", "Docker", "AWS"],
        "Embedded Systems Engineer": ["C", "C++", "Embedded C", "RTOS", "Microcontrollers", "Sensors", "Signal Processing", "Linux", "Firmware", "Circuit Design", "Debugging", "JTAG", "Assembly Language"],
        "DevOps Engineer": ["CI/CD", "Docker", "Kubernetes", "AWS", "Linux", "Jenkins", "Terraform", "Ansible", "Monitoring", "Version Control", "Networking", "Cloud Security"],
        "Site Reliability Engineer (SRE)": ["Cloud Infrastructure", "CI/CD", "Linux", "Kubernetes", "Prometheus", "Docker", "Automation", "Networking", "Python", "Monitoring", "Incident Management"],
        "Cloud Engineer": ["AWS", "Azure", "Google Cloud Platform", "Terraform", "Docker", "Kubernetes", "CI/CD", "Networking", "Cloud Security", "Serverless", "Monitoring"],
        "System Software Engineer": ["C", "C++", "Linux", "Operating Systems", "Memory Management", "Multithreading", "Networking", "Kernel Development", "System Programming", "Debugging"],
        "QA Engineer": ["Automated Testing", "Selenium", "TestNG", "JUnit", "CI/CD", "Jenkins", "Performance Testing", "Bug Tracking", "Python", "Java", "Manual Testing"]
    },

    "Data Engineering": {
        "Data Engineer": ["SQL", "Python", "ETL", "Apache Spark", "Hadoop", "Data Warehousing", "Data Modeling", "Cloud Platforms (AWS, GCP, Azure)", "Data Pipelines", "Linux", "Big Data Technologies", "Kafka", "NoSQL", "Version Control"],
        "Big Data Engineer": ["Hadoop", "Apache Spark", "Kafka", "Big Data Analytics", "Data Warehousing", "MapReduce", "Data Lakes", "NoSQL", "SQL", "Python", "Cloud Platforms (AWS, GCP, Azure)", "Distributed Systems", "Linux"],
        "ETL Developer": ["ETL Processes", "SQL", "Python", "Informatica", "Apache NiFi", "Data Integration", "Data Transformation", "Data Mapping", "Data Warehousing", "Apache Kafka", "Talend", "Data Quality", "Version Control"],
        "Data Architect": ["Data Modeling", "SQL", "NoSQL", "Data Warehousing", "Cloud Platforms (AWS, GCP, Azure)", "ETL", "Big Data Technologies", "Data Governance", "Data Security", "Python", "Data Pipeline Architecture", "Hadoop", "Database Design"],
        "ML Ops Engineer": ["Machine Learning", "Docker", "Kubernetes", "CI/CD", "Python", "TensorFlow", "PyTorch", "AWS", "Azure", "Data Pipelines", "Automation", "Monitoring", "Cloud Infrastructure", "Git", "Linux"],
        "Database Administrator (DBA)": ["SQL", "Database Security", "Database Tuning", "Backup and Recovery", "MySQL", "PostgreSQL", "Oracle", "Database Replication", "Database Design", "NoSQL", "Scripting", "Cloud Databases", "Performance Monitoring", "Version Control"],
        "Data Scientist": ["Python", "R", "Machine Learning", "Data Analysis", "Data Visualization", "SQL", "Deep Learning", "Big Data", "Statistics", "Hadoop", "Spark", "TensorFlow", "Matplotlib", "Pandas", "Jupyter"]
    },

    "Cybersecurity": {
        "Security Engineer": ["Firewalls", "Intrusion Detection Systems (IDS)", "Intrusion Prevention Systems (IPS)", "Vulnerability Assessment", "Encryption", "Network Security", "Security Protocols", "Penetration Testing", "Security Audits", "Risk Management", "Security Information and Event Management (SIEM)", "Linux", "Python", "Cloud Security"],
        "Penetration Tester": ["Kali Linux", "Metasploit", "Nmap", "Burp Suite", "SQL Injection", "Network Penetration Testing", "Exploit Development", "Wireshark", "Social Engineering", "Vulnerability Scanning", "Web Application Security", "Wireless Network Security", "Linux", "Python", "OWASP"],
        "Incident Response Analyst": ["Incident Detection", "Incident Response Planning", "Forensics", "Data Recovery", "Malware Analysis", "SIEM", "Log Analysis", "Root Cause Analysis", "Threat Hunting", "Cybersecurity Threat Intelligence", "Python", "Linux", "Windows Security", "Documentation", "Communication Skills"],
        "Threat Intelligence Analyst": ["Threat Hunting", "OSINT (Open Source Intelligence)", "Malware Analysis", "Cyber Threat Intelligence Platforms (CTIP)", "IOC (Indicators of Compromise)", "TTPs (Tactics, Techniques, and Procedures)", "MITRE ATT&CK", "Advanced Persistent Threats (APTs)", "Threat Intelligence Feeds", "SIEM", "SOC", "Python", "Risk Assessment", "Reporting"],
        "Cryptography Engineer": ["Cryptographic Algorithms", "AES", "RSA", "TLS/SSL", "Public Key Infrastructure (PKI)", "Hashing Algorithms", "Encryption Standards", "Digital Signatures", "Key Management", "Cryptanalysis", "Secure Communication", "Mathematics of Cryptography", "Python", "C", "Linux"],
        "Cloud Security Engineer": ["AWS", "Azure", "Google Cloud", "Cloud Security", "Identity and Access Management (IAM)", "Encryption", "Compliance (HIPAA, GDPR, etc.)", "Cloud Security Posture Management (CSPM)", "Cloud Network Security", "Cloud Architecture", "CI/CD", "DevSecOps", "Vulnerability Scanning", "Firewalls", "Python"],
        "SOC Analyst": ["Security Operations Center (SOC)", "SIEM", "Incident Detection", "Threat Hunting", "Log Analysis", "Network Traffic Analysis", "Intrusion Detection Systems (IDS)", "Vulnerability Scanning", "Malware Analysis", "Firewalls", "Incident Response", "Cybersecurity Monitoring", "Python", "Communication Skills"]
    },

    "Graphics / Simulations / Game Development": {
        "Game Developer": ["C++", "C#", "Unity", "Unreal Engine", "Game Design", "Game Mechanics", "Game Physics", "AI for Games", "Multiplayer Systems", "Game Scripting", "Shaders", "Version Control (Git)", "3D Modeling", "Animation", "UI/UX Design"],
        "Graphics Programmer": ["C++", "OpenGL", "DirectX", "Vulkan", "Shaders (GLSL, HLSL)", "GPU Programming", "3D Graphics Rendering", "Mathematics for Graphics", "Graphics APIs", "Image Processing", "Computer Vision", "Parallel Computing", "Performance Optimization", "Version Control"],
        "Simulation Engineer": ["C++", "Python", "Mathematics", "Physics Simulation", "Real-Time Systems", "Numerical Methods", "3D Modeling", "Simulation Frameworks", "Machine Learning", "CUDA", "HPC (High-Performance Computing)", "Distributed Systems", "Algorithm Optimization"],
        "Rendering Engineer": ["C++", "OpenGL", "DirectX", "Vulkan", "Shader Programming", "Ray Tracing", "Graphics Pipelines", "3D Rendering Techniques", "Texture Mapping", "Lighting Models", "Frame Buffer", "GPU Optimization", "Mathematics for Rendering", "CUDA"],
        "Technical Artist": ["3D Modeling", "Animation", "Shaders", "Asset Optimization", "Rendering Techniques", "Game Engines (Unity, Unreal)", "Scripting", "Art Pipeline", "Performance Optimization", "Visual Effects (VFX)", "UI/UX Design", "Character Rigging", "Lighting", "Texture Creation"],
        "VR/AR Developer": ["Unity", "Unreal Engine", "C#", "C++", "ARCore", "ARKit", "VR Hardware (Oculus, HTC Vive)", "Haptic Feedback", "3D Modeling", "User Interaction in VR/AR", "Spatial Computing", "Immersive Experiences", "UI/UX for VR/AR", "Shader Programming", "Camera Tracking"],
        "Physics Programmer": ["C++", "Mathematics (Linear Algebra, Calculus)", "Physics Simulation", "Rigid Body Dynamics", "Collision Detection", "Soft Body Physics", "Fluid Dynamics", "Game Physics", "Game Engines (Unity, Unreal)", "Numerical Methods", "Havok Physics", "PhysX", "CUDA", "Optimization"]
    },

    "Management": {
        "Engineering Manager": ["Leadership", "Team Management", "Agile Methodologies", "Project Planning", "Software Architecture", "Budgeting", "Resource Allocation", "Cross-functional Collaboration", "Mentoring", "Risk Management", "Quality Assurance", "Technical Decision Making", "Stakeholder Communication", "Performance Reviews", "Version Control"],
        "Technical Lead": ["Software Development", "Technical Leadership", "System Design", "Code Reviews", "Mentorship", "Agile Methodologies", "Problem Solving", "Cross-functional Collaboration", "Architecture Design", "Project Planning", "Team Coordination", "Version Control", "CI/CD", "DevOps Practices", "Communication Skills"],
        "CTO (Chief Technology Officer)": ["Leadership", "Technology Strategy", "Innovation", "Technical Vision", "Team Building", "Budget Management", "Stakeholder Communication", "Business Development", "Risk Management", "Cybersecurity", "Architecture Design", "Product Development", "Scalability", "Cloud Technologies", "Software Engineering"],
        "VP of Engineering": ["Leadership", "Engineering Strategy", "Cross-team Collaboration", "Technical Debt Management", "Process Optimization", "Talent Acquisition", "Budgeting", "Product Lifecycle Management", "Stakeholder Engagement", "Quality Assurance", "Cloud Infrastructure", "DevOps Practices", "Team Growth", "Agile Practices", "Risk Management"],
        "Product Manager": ["Product Strategy", "Market Research", "Customer Feedback", "Product Roadmap", "Feature Prioritization", "Agile Methodologies", "Stakeholder Communication", "Business Analysis", "UX/UI Design", "Project Management", "User Stories", "MVP (Minimum Viable Product)", "Competitive Analysis", "Data Analytics", "Release Planning"],
        "Project Manager": ["Project Planning", "Risk Management", "Agile Methodologies", "Scheduling", "Budgeting", "Stakeholder Communication", "Team Coordination", "Resource Allocation", "Timeline Management", "Project Documentation", "Quality Assurance", "Conflict Resolution", "Leadership", "Budget Management", "Process Improvement"],
        "Scrum Master": ["Agile Methodologies", "Scrum Framework", "Sprint Planning", "Team Facilitation", "Backlog Grooming", "Stakeholder Communication", "Continuous Improvement", "Risk Management", "Coaching", "Team Collaboration", "Project Management", "Process Facilitation", "Conflict Resolution", "Metrics Tracking", "Scrum Artifacts"],
        "DevOps Manager": ["DevOps Practices", "CI/CD", "Automation", "Cloud Infrastructure", "Agile Methodologies", "Collaboration between Development and Operations", "Monitoring", "Performance Optimization", "Security", "Infrastructure as Code", "Containerization", "Version Control", "Cloud Platforms (AWS, GCP, Azure)", "Scripting", "Incident Management"]
    }
})

const roles_skills_tech = JSON.stringify({
    "Software Engineering": {
        "roles": [
            "Frontend Developer",
            "Backend Developer",
            "Full-Stack Developer",
            "Embedded Systems Engineer",
            "DevOps Engineer",
            "Site Reliability Engineer (SRE)",
            "Cloud Engineer",
            "System Software Engineer",
            "QA Engineer"
        ],
        "skills": [
            "Programming (C, C++, Java, Python, JavaScript, Rust, etc.)",
            "Data Structures & Algorithms",
            "Object-Oriented Design (OOD)",
            "Microservices Architecture",
            "API Development (REST, GraphQL)",
            "Multithreading & Concurrency",
            "Database Management (SQL, NoSQL)",
            "Software Testing & Debugging",
            "Version Control (Git, GitHub, GitLab)",
            "Containerization (Docker, Kubernetes)"
        ],
        "tech": {
            "Programming Languages": ["C", "C++", "Java", "Python", "JavaScript", "Rust", "Go", "Swift", "Kotlin"],
            "Web Frameworks": ["React", "Angular", "Vue", "Svelte", "Django", "Flask", "Spring Boot", "Express.js"],
            "Databases": ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Cassandra"],
            "Version Control": ["Git", "GitHub", "GitLab", "Bitbucket"],
            "CI/CD Tools": ["Jenkins", "GitHub Actions", "GitLab CI/CD", "CircleCI", "TravisCI"],
            "Containerization & Orchestration": ["Docker", "Kubernetes", "Podman", "Helm"],
            "Cloud Platforms": ["AWS", "GCP", "Azure", "DigitalOcean", "Linode"],
            "Infrastructure as Code": ["Terraform", "Ansible", "Pulumi", "CloudFormation"],
            "Testing Frameworks": ["JUnit", "PyTest", "Mocha", "Jest", "Cypress"],
            "Messaging & Event Streaming": ["Kafka", "RabbitMQ", "NATS", "Pulsar"]
        }
    },

    "Data Engineering": {
        "roles": [
            "Data Engineer",
            "Big Data Engineer",
            "ETL Developer",
            "Data Architect",
            "ML Ops Engineer",
            "Database Administrator (DBA)",
            "Data Scientist"
        ],
        "skills": [
            "SQL & NoSQL Databases",
            "ETL Pipelines",
            "Big Data Processing (Hadoop, Spark)",
            "Data Warehousing (Redshift, Snowflake)",
            "Cloud Data Services (AWS, GCP, Azure)",
            "Streaming Data (Kafka, Flink)",
            "Data Modeling & Normalization",
            "Data Governance & Security",
            "Scripting (Python, SQL, Bash)",
            "Data Pipeline Orchestration (Airflow, Prefect)"
        ],
        "tech": {
            "Databases": ["PostgreSQL", "MySQL", "OracleDB", "MongoDB", "DynamoDB", "ClickHouse"],
            "ETL Tools": ["Apache Nifi", "Talend", "SSIS", "Stitch", "dbt"],
            "Big Data Technologies": ["Apache Spark", "Hadoop", "Flink", "Presto", "Trino", "Apache Beam"],
            "Cloud Data Services": ["BigQuery", "Snowflake", "Redshift", "Azure Synapse", "Databricks"],
            "Workflow Orchestration": ["Apache Airflow", "Prefect", "Luigi", "Dagster"],
            "Streaming Platforms": ["Kafka", "Pulsar", "Kinesis", "Flink", "Spark Streaming"],
            "Scripting & Query Languages": ["SQL", "Python", "Bash", "Scala", "R"],
            "Data Governance & Quality": ["Great Expectations", "Apache Atlas", "DataHub", "OpenLineage"],
            "Graph Databases": ["Neo4j", "ArangoDB", "Amazon Neptune"],
            "Data Serialization": ["Avro", "Parquet", "ORC", "Protobuf", "JSON", "XML"]
        }
    },

    "Cybersecurity": {
        "roles": [
            "Security Engineer",
            "Penetration Tester",
            "Incident Response Analyst",
            "Threat Intelligence Analyst",
            "Cryptography Engineer",
            "Cloud Security Engineer",
            "SOC Analyst"
        ],
        "skills": [
            "Network Security",
            "Penetration Testing",
            "Cryptography",
            "Threat Hunting & Intelligence",
            "Incident Response & Forensics",
            "Secure Coding Practices",
            "Firewall & IDS/IPS Management",
            "Cloud Security",
            "Zero Trust Architecture",
            "Compliance & Risk Management (ISO 27001, NIST, GDPR)"
        ],
        "tech": {
            "Network Security Tools": ["Wireshark", "Nmap", "Snort", "Suricata", "Zeek"],
            "Penetration Testing Tools": ["Metasploit", "Burp Suite", "Kali Linux", "Nikto", "Hydra"],
            "SIEM & Log Management": ["Splunk", "ELK Stack", "Graylog", "Wazuh", "Chronicle"],
            "Identity & Access Management": ["OAuth2", "OpenID Connect", "SAML", "LDAP", "Okta", "Auth0"],
            "Cloud Security": ["AWS Security Hub", "Azure Security Center", "GCP Security Command Center"],
            "Container & Kubernetes Security": ["Trivy", "Falco", "Aqua Security", "OPA", "Kyverno"],
            "Cryptographic Libraries": ["OpenSSL", "Bouncy Castle", "Libsodium", "GnuPG"],
            "Zero Trust Security Models": ["BeyondCorp", "SDP", "ZTNA"],
            "Compliance & Standards": ["NIST", "ISO 27001", "GDPR", "HIPAA", "PCI-DSS", "SOC 2"],
            "Security Automation": ["OSQuery", "Cloud Custodian", "Ansible Security Automation"]
        }
    },

    "Graphics / Simulations / Game Development": {
        "roles": [
            "Game Developer",
            "Graphics Programmer",
            "Simulation Engineer",
            "Rendering Engineer",
            "Technical Artist",
            "VR/AR Developer",
            "Physics Programmer"
        ],
        "skills": [
            "3D Rendering (OpenGL, Vulkan, DirectX)",
            "Game Engines (Unity, Unreal Engine, Godot)",
            "Physics Simulation",
            "Shader Programming (GLSL, HLSL)",
            "Real-Time Rendering Techniques",
            "Procedural Generation",
            "AI for Games (Pathfinding, Behavior Trees)",
            "VR/AR Development",
            "Mathematics for Graphics (Linear Algebra, Quaternions)",
            "Optimization & Performance Tuning"
        ],
        "tech": {
            "Graphics APIs": ["OpenGL", "Vulkan", "DirectX", "Metal", "WebGL"],
            "Game Engines": ["Unity", "Unreal Engine", "Godot", "CryEngine", "Lumberyard"],
            "Physics Engines": ["Havok", "Bullet", "PhysX", "Box2D", "Jolt Physics"],
            "Shader Programming": ["GLSL", "HLSL", "SPIR-V", "Metal Shading Language"],
            "Procedural Content Generation": ["Houdini", "Perlin Noise", "Wave Function Collapse"],
            "Rendering Techniques": ["Ray Tracing", "Rasterization", "Deferred Rendering", "Path Tracing"],
            "AI in Games": ["Behavior Trees", "Utility AI", "Neural Networks", "Reinforcement Learning"],
            "VR/AR Development": ["OpenXR", "SteamVR", "Oculus SDK", "ARKit", "ARCore"],
            "3D Modeling & Animation Tools": ["Blender", "Maya", "3ds Max", "Substance Painter"],
            "Optimization & Profiling": ["RenderDoc", "NVIDIA Nsight", "PIX", "Perfetto", "Intel VTune"]
        }
    },

    "Management": { 
        "roles": [
            "Engineering Manager",
            "Technical Lead",
            "CTO (Chief Technology Officer)",
            "VP of Engineering",
            "Product Manager",
            "Project Manager",
            "Scrum Master",
            "DevOps Manager"
        ],
        "skills": [
            "Agile & Scrum Methodologies",
            "Project Management",
            "Software Development Lifecycle (SDLC)",
            "People & Team Management",
            "Stakeholder Communication",
            "Risk Assessment & Mitigation",
            "Technical Roadmap Planning",
            "Budgeting & Resource Allocation",
            "Product Strategy",
            "Mentorship & Coaching"
        ],
        "tech": {
            "Project Management Tools": ["JIRA", "Trello", "Asana", "Monday.com", "ClickUp"],
            "Agile & Scrum Frameworks": ["Scrum", "Kanban", "SAFe", "LeSS"],
            "Software Development Methodologies": ["Waterfall", "Agile", "DevOps", "Lean", "XP"],
            "Risk Management Frameworks": ["FAIR", "NIST RMF", "ISO 31000"],
            "Team Communication & Collaboration": ["Slack", "Microsoft Teams", "Zoom", "Google Meet"],
            "Budgeting & Cost Optimization": ["Cloud Cost Management", "FinOps", "CapEx vs OpEx"],
            "Product Roadmap Planning": ["OKRs", "KPIs", "Feature Prioritization", "Customer Feedback Loops"],
            "Leadership & People Management": ["Coaching", "Conflict Resolution", "Performance Reviews"],
            "Stakeholder Engagement": ["User Interviews", "Requirement Gathering", "Business Analysis"],
            "Metrics & Analytics": ["DORA Metrics", "Engineering Productivity", "Cycle Time", "Lead Time"]
        }
    }
})


module.exports = { mimes, roles_skills, roles_skills_tech, prefix }
