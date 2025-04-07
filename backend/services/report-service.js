// this is the service for managing career reports and assessments
class ReportService {
  
  // creating a new report service instance
  constructor(reportDAO, careerDAO, skillsDAO) {
    this.reportDAO = reportDAO;
    this.careerDAO = careerDAO;
    this.skillsDAO = skillsDAO;
  }

  // creating a career report from a recommendation
  async createCareerReport(profileId, recommendation, additionalInfo = '') {
    try {
      // validating recommendation has required fields
      if (!recommendation || !recommendation.careerTypeId || !recommendation.skillAssessments) {
        throw new Error('Invalid recommendation data');
      }

      // creating career report
      const reportData = {
        profileId,
        careerTypeId: recommendation.careerTypeId,
        additionalInfo,
        // pdfUrl will be generated later if needed
      };

      const report = await this.reportDAO.createCareerReport(reportData);

      // creating skill assessments for each skill in the recommendation
      const assessmentPromises = recommendation.skillAssessments.map(assessment => {
        return this.reportDAO.createSkillAssessment({
          careerReportId: report.id,
          skillId: assessment.skillId,
          systemRating: assessment.currentLevel,
          justification: `Initial assessment based on academic performance and self-assessment.
Current level: ${assessment.currentLevel}, Required level: ${assessment.importanceLevel}`,
          hasSelfAssessed: false
        });
      });

      await Promise.all(assessmentPromises);

      // getting the complete report with assessments
      return this.getCareerReportById(report.id);
    } catch (error) {
      console.error('Error creating career report:', error);
      throw new Error('Failed to create career report');
    }
  }

  // getting a career report by id (with assessments)
  async getCareerReportById(reportId) {
    try {
      // getting report
      const report = await this.reportDAO.getCareerReportById(reportId);
      if (!report) {
        throw new Error('Report not found');
      }

      // getting assessments
      const assessments = await this.reportDAO.getSkillAssessmentsByReportId(reportId);

      // getting career information
      let careerType = null;
      let careerField = null;

      if (report.careerTypeId) {
        careerType = await this.careerDAO.getCareerTypeById(report.careerTypeId);
        if (careerType) {
          careerField = await this.careerDAO.getCareerFieldById(careerType.careerFieldId);
        }
      }

      // compiling complete report
      return {
        report,
        assessments,
        career: {
          type: careerType,
          field: careerField
        }
      };
    } catch (error) {
      console.error('Error getting career report:', error);
      throw new Error('Failed to retrieve career report');
    }
  }

  // getting all career reports for a profile
  async getCareerReportsByProfileId(profileId) {
    try {
      return this.reportDAO.getCareerReportsByProfileId(profileId);
    } catch (error) {
      console.error('Error getting career reports:', error);
      throw new Error('Failed to retrieve career reports');
    }
  }

  // updating a skill assessment in a report
  async updateSkillAssessment(assessmentId, assessmentData) {
    try {
      return this.reportDAO.updateSkillAssessment(assessmentId, {
        ...assessmentData,
        hasSelfAssessed: true
      });
    } catch (error) {
      console.error('Error updating skill assessment:', error);
      throw new Error('Failed to update skill assessment');
    }
  }

  // generating a PDF for a career report (to be implemented later TODO)
  async generatePDFReport(reportId) {
    try {
      // getting the report
      const reportData = await this.getCareerReportById(reportId);
      if (!reportData) {
        throw new Error('Report not found');
      }

      // in a real implementation, this would generate a PDF and store it
      // for now, i just update the report with a placeholder URL
      const pdfUrl = `/reports/${reportId}.pdf`;
      
      // updating the report with the PDF URL
      await this.reportDAO.update('CareerReport', reportId, { pdfUrl });
      
      return pdfUrl;
    } catch (error) {
      console.error('Error generating PDF report:', error);
      throw new Error('Failed to generate PDF report');
    }
  }
}

module.exports = ReportService;
