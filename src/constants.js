const mimes = {
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'pdf': 'application/pdf'
}

const roles = JSON.stringify({
    "Software Engineering": ["Frontend Developer", "Backend Developer", "Full-Stack Developer", "Embedded Systems Engineer", "DevOps Engineer", "Site Reliability Engineer (SRE)", "Cloud Engineer", "System Software Engineer", "QA Engineer"],
    "Data Engineering": ["Data Engineer","Big Data Engineer","ETL Developer","Data Architect","ML Ops Engineer","Database Administrator (DBA)","Data Scientist"],
    "Cybersecurity": ["Security Engineer","Penetration Tester","Incident Response Analyst","Threat Intelligence Analyst","Cryptography Engineer","Cloud Security Engineer","SOC Analyst"],
    "Graphics / Simulations / Game Development": ["Game Developer","Graphics Programmer","Simulation Engineer","Rendering Engineer","Technical Artist","VR/AR Developer","Physics Programmer"],
    "Management": ["Engineering Manager","Technical Lead","CTO (Chief Technology Officer)","VP of Engineering","Product Manager","Project Manager","Scrum Master","DevOps Manager"]
})

const removeInfoPrompt = (cv) => {
    return `Remove any contact or personal information like phone numbers, emails, addresses and home addresses from this CV: ${cv}. Generate only the edited CV`
}

const summaryPrompt = (cv) => {
    return `Generate a very concise and structured summary of this CV: ${cv}. 
    The summary must have the following markdown structure:
    ## <Applicant's name (if any)>'s CV Summary
    ### 🎓 Education (with the applicants education)
    - completed or ongoing study
    - completed or ongoin study 
    ### 👔 Professional Experience 
    - held position or internship
    - held position or internship
    ### 🔍 Additional (anything noteworthy like languages, skills, accomplishments or interests that does not belong to 'Education' or 'Professional Experience')
    - noteworhy thing
    - noteworthy thing
    Exclude any information that is not professional or IT / software engineering / computer sicence related.
    Exclude any personal information  or contact information like phone numbers, emails and addresses`
}

const advicePrompt = (cvSummary) => {
    return `Given these roles: ${roles} and this CV: ${cvSummary}.
    And based on the applicant's interests, 
    generate anywhere between 2 to 4 career paths that the applicant should pursue, and what course of action he should take to get there.
    The briefing generated must have the following markdown structure:
    ## Recommended Career Paths
    ### 1. <Career path name>
    #### 🤔 Why
    - <bullet point>
    - <bullet point>
    #### 🛠️ How-to (how to pursue sayd career path)
    - <bullet point>
    - <bullet point>

    ---
    
    ### 2. <Career path name>
    #### 🤔 Why
    - <bullet point>
    - <bullet point>
    #### 🛠️ How-to
    - <bullet point>
    - <bullet point>
    
    --- 
    
    `
}

/*
const summaryPrompt = (cv) => {
    return `Generate a very concise and structured summary of this CV: ${cv}. 
    The summary should consist of three sections: '🎓 Education', '👔 Professional Experience' (if any) and '🔍 Additional' which, if applicable, contains everything noteworthy (like languages, skills, accomplishments, interests) that does not belong to 'Education' or 'Professional Experience'.
    Each bullet point in the '🎓 Education' section must be a completed or ongoing study, and each bullet point in the professional experience section must be a position or internship.
    The title's plain markdown must be: "## <applicant>'s CV Summary", or, if there is no name, "## CV Summary".
    The other three sections must be '###' markdown sections.
    Exclude any information that is not professional or IT / software engineering / computer sicence related.
    Exclude any personal information  or contact information like phone numbers, emails and addresses`
}
*/

/*
const advicePrompt = (cvSummary) => {
    return `Given these roles: ${roles} and this CV: ${cvSummary}.
    And based on the applicant's interests. 
    What one or two career paths would you advice the applicant to take. 
    What course of action should the applicant take to get there?`
}
*/

/*
const advicePrompt = (cvSummary) => {
    return `Given these roles: ${roles} and this CV: ${cvSummary}.
    And based on the applicant's interests, 
    generate anywhere between 2 to 4 career paths that the applicant should pursue, and what course of action he should take to get there.
    The title must be 'Recommended Career Paths' and it must be a '##' markdown section.
    Each career path is a '###' markdown section with a number, and the career path name.
    Each career path section contains two subsections that look like this in plain markdown: 
    '#### 🤔 Why' and '#### 🛠️ How-to' (how to pursue that path), which contain a list of bullet points.`
}
*/



module.exports = { mimes, roles, removeInfoPrompt, summaryPrompt, advicePrompt }
